import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { rateLimit, rateLimitPresets } from "@/lib/rate-limit";
import { logAuthEvent } from "@/lib/auth/audit-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const { POST: authPost, GET: authGet } = toNextJsHandler(auth);

/**
 * Account lockout: Track consecutive failed login attempts per IP.
 * After MAX_FAILURES within WINDOW_MS, block for LOCKOUT_MS.
 */
const MAX_FAILURES = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 30 * 60 * 1000; // 30 minutes

interface LockoutEntry {
  failures: number;
  firstFailureAt: number;
  lockedUntil: number | null;
}

const lockoutStore = new Map<string, LockoutEntry>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
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

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim());
    return ips[ips.length - 1];
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

function isLockedOut(ip: string): boolean {
  const entry = lockoutStore.get(ip);
  if (!entry?.lockedUntil) return false;
  if (entry.lockedUntil > Date.now()) return true;
  // Lockout expired — clean up
  lockoutStore.delete(ip);
  return false;
}

function recordFailure(ip: string): void {
  const now = Date.now();
  const entry = lockoutStore.get(ip);

  if (!entry || entry.firstFailureAt + WINDOW_MS < now) {
    lockoutStore.set(ip, { failures: 1, firstFailureAt: now, lockedUntil: null });
    return;
  }

  const updated = { ...entry, failures: entry.failures + 1 };
  if (updated.failures >= MAX_FAILURES) {
    updated.lockedUntil = now + LOCKOUT_MS;
  }
  lockoutStore.set(ip, updated);
}

function clearFailures(ip: string): void {
  lockoutStore.delete(ip);
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
  if (isSignInPath(pathname) && isLockedOut(ip)) {
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
      recordFailure(ip);
      logAuthEvent("login_failed", "unknown", { ip });
    } else {
      clearFailures(ip);
    }
  }

  return response;
}

export async function GET(req: NextRequest) {
  const rateLimitResult = await rateLimit(req, rateLimitPresets.standard, "auth-get");
  if (rateLimitResult) return rateLimitResult;
  return authGet(req);
}
