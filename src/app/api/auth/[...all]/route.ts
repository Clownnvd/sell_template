import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { rateLimit, rateLimitPresets, addRateLimitHeaders } from "@/lib/rate-limit";
import { logAuthEvent } from "@/lib/auth/audit-log";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const { POST: authPost, GET: authGet } = toNextJsHandler(auth);

/**
 * Account lockout: Track consecutive failed login attempts per IP.
 * After MAX_FAILURES within WINDOW_MS, block for LOCKOUT_MS.
 * Uses Redis (Upstash) in production, falls back to in-memory for development.
 */
const MAX_FAILURES = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 30 * 60 * 1000; // 30 minutes
const LOCKOUT_PREFIX = "auth:lockout:";

interface LockoutEntry {
  failures: number;
  firstFailureAt: number;
  lockedUntil: number | null;
}

// Redis client for distributed lockout (shared across instances)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// In-memory fallback for development
const lockoutStore = new Map<string, LockoutEntry>();

// Clean up expired in-memory entries every 5 minutes (only when no Redis)
if (typeof setInterval !== "undefined" && !redis) {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of lockoutStore.entries()) {
      const expired = entry.lockedUntil
        ? entry.lockedUntil < now
        : entry.firstFailureAt + WINDOW_MS < now;
      if (expired) lockoutStore.delete(key);
    }
  }, 5 * 60 * 1000);
}

async function getLockoutEntry(ip: string): Promise<LockoutEntry | null> {
  if (redis) {
    try {
      return await redis.get<LockoutEntry>(`${LOCKOUT_PREFIX}${ip}`);
    } catch { /* fall through to in-memory */ }
  }
  return lockoutStore.get(ip) ?? null;
}

async function setLockoutEntry(ip: string, entry: LockoutEntry): Promise<void> {
  if (redis) {
    try {
      const ttlMs = entry.lockedUntil
        ? Math.max(entry.lockedUntil - Date.now(), 1000)
        : WINDOW_MS;
      await redis.set(`${LOCKOUT_PREFIX}${ip}`, entry, { px: ttlMs });
      return;
    } catch { /* fall through to in-memory */ }
  }
  lockoutStore.set(ip, entry);
}

async function deleteLockoutEntry(ip: string): Promise<void> {
  if (redis) {
    try {
      await redis.del(`${LOCKOUT_PREFIX}${ip}`);
      return;
    } catch { /* fall through to in-memory */ }
  }
  lockoutStore.delete(ip);
}

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim());
    return ips[ips.length - 1];
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

async function isLockedOut(ip: string): Promise<boolean> {
  const entry = await getLockoutEntry(ip);
  if (!entry?.lockedUntil) return false;
  if (entry.lockedUntil > Date.now()) return true;
  await deleteLockoutEntry(ip);
  return false;
}

async function recordFailure(ip: string): Promise<void> {
  const now = Date.now();
  const entry = await getLockoutEntry(ip);

  if (!entry || entry.firstFailureAt + WINDOW_MS < now) {
    await setLockoutEntry(ip, { failures: 1, firstFailureAt: now, lockedUntil: null });
    return;
  }

  const updated = { ...entry, failures: entry.failures + 1, lockedUntil: entry.lockedUntil };
  if (updated.failures >= MAX_FAILURES) {
    updated.lockedUntil = now + LOCKOUT_MS;
  }
  await setLockoutEntry(ip, updated);
}

async function clearFailures(ip: string): Promise<void> {
  await deleteLockoutEntry(ip);
}

function isSignInPath(pathname: string): boolean {
  return pathname.includes("/sign-in");
}

export async function POST(req: NextRequest) {
  const rateLimitResult = await rateLimit(req, rateLimitPresets.strict, "auth");
  if (rateLimitResult) return rateLimitResult;

  const ip = getClientIP(req);
  const pathname = req.nextUrl.pathname;

  // Account lockout check for sign-in attempts
  if (isSignInPath(pathname) && await isLockedOut(ip)) {
    logAuthEvent("login_failed", "unknown", { ip });
    return new Response(
      JSON.stringify({ success: false, error: "Account temporarily locked. Try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const response = await authPost(req);

  // Track login failures for sign-in requests
  if (isSignInPath(pathname)) {
    if (response.status !== 200) {
      await recordFailure(ip);
      logAuthEvent("login_failed", "unknown", { ip });
    } else {
      await clearFailures(ip);
    }
  }

  return addRateLimitHeaders(req, response);
}

export async function GET(req: NextRequest) {
  const rateLimitResult = await rateLimit(req, rateLimitPresets.standard, "auth-get");
  if (rateLimitResult) return rateLimitResult;
  return addRateLimitHeaders(req, await authGet(req));
}
