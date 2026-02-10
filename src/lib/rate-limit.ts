import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { logger } from "@/lib/api/logger";

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

// Time constants for readability
const MS_PER_SECOND = 1_000;
const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 3_600_000;

// Initialize Redis client only if credentials are available
// Falls back to in-memory for development
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Create rate limiters with different configurations
const rateLimiters = new Map<string, Ratelimit>();

function getRateLimiter(config: RateLimitConfig, identifier: string): Ratelimit | null {
  if (!redis) return null;

  const key = `${identifier}-${config.maxRequests}-${config.interval}`;

  if (!rateLimiters.has(key)) {
    // Convert milliseconds to appropriate window
    const windowMs = config.interval;
    let window: `${number} s` | `${number} m` | `${number} h`;

    if (windowMs >= MS_PER_HOUR) {
      window = `${Math.floor(windowMs / MS_PER_HOUR)} h`;
    } else if (windowMs >= MS_PER_MINUTE) {
      window = `${Math.floor(windowMs / MS_PER_MINUTE)} m`;
    } else {
      window = `${Math.floor(windowMs / MS_PER_SECOND)} s`;
    }

    rateLimiters.set(
      key,
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(config.maxRequests, window),
        analytics: true,
        prefix: `ratelimit:${identifier}`,
      })
    );
  }

  return rateLimiters.get(key)!;
}

// In-memory fallback for development
interface InMemoryEntry {
  count: number;
  resetAt: number;
}

const inMemoryStore = new Map<string, InMemoryEntry>();

// Clean up expired entries periodically (only in development)
if (typeof setInterval !== "undefined" && !redis) {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of inMemoryStore.entries()) {
      if (entry.resetAt < now) {
        inMemoryStore.delete(key);
      }
    }
  }, 60000);
}

function getClientIP(req: NextRequest): string {
  // Use rightmost IP (set by proxy/load balancer, not spoofable by client)
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim());
    return ips[ips.length - 1];
  }

  const realIP = req.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  return "unknown";
}

/**
 * Rate limiter for API routes
 * Uses Upstash Redis in production, falls back to in-memory for development
 *
 * @param userId - Optional user ID for per-user rate limiting on authenticated endpoints.
 *                 When provided, rate limiting keys on userId instead of IP.
 *
 * @example
 * const rateLimitResult = await rateLimit(req, rateLimitPresets.strict, "checkout", userId);
 * if (rateLimitResult) return rateLimitResult; // Returns 429 response
 */
export async function rateLimit(
  req: NextRequest,
  config: RateLimitConfig,
  identifier: string = "default",
  userId?: string
): Promise<NextResponse | null> {
  const ip = getClientIP(req);
  const key = userId ? `${identifier}:user:${userId}` : `${identifier}:${ip}`;

  // Try Redis first
  const limiter = getRateLimiter(config, identifier);

  if (limiter) {
    try {
      const { success, limit, remaining, reset } = await limiter.limit(key);

      if (!success) {
        logger.warn("rate_limit_exceeded", {
          ip,
          path: req.nextUrl.pathname,
          identifier,
          userId,
          limit,
          remaining,
        });
        const retryAfter = Math.ceil((reset - Date.now()) / 1000);
        return NextResponse.json(
          {
            success: false,
            error: "Too many requests. Please try again later.",
            retryAfter,
          },
          {
            status: 429,
            headers: {
              "Retry-After": String(retryAfter),
              "X-RateLimit-Limit": String(limit),
              "X-RateLimit-Remaining": String(remaining),
              "X-RateLimit-Reset": String(Math.ceil(reset / 1000)),
            },
          }
        );
      }

      return null; // Allow request
    } catch {
      // If Redis fails, fall back to in-memory
    }
  }

  // In-memory fallback
  const now = Date.now();
  const entry = inMemoryStore.get(key);

  if (!entry || entry.resetAt < now) {
    inMemoryStore.set(key, {
      count: 1,
      resetAt: now + config.interval,
    });
    return null;
  }

  if (entry.count >= config.maxRequests) {
    logger.warn("rate_limit_exceeded", {
      ip,
      path: req.nextUrl.pathname,
      identifier,
      userId,
      limit: config.maxRequests,
    });
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      {
        success: false,
        error: "Too many requests. Please try again later.",
        retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(config.maxRequests),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(entry.resetAt / 1000)),
        },
      }
    );
  }

  // Immutable update - create new object instead of mutating
  inMemoryStore.set(key, {
    ...entry,
    count: entry.count + 1,
  });
  return null;
}

// Preset configurations for common use cases
export const rateLimitPresets = {
  // Strict: 5 requests per minute (for sensitive endpoints like login)
  strict: { interval: 60000, maxRequests: 5 },

  // Standard: 20 requests per minute (for general API endpoints)
  standard: { interval: 60000, maxRequests: 20 },

  // Relaxed: 60 requests per minute (for less sensitive endpoints)
  relaxed: { interval: 60000, maxRequests: 60 },

  // Webhook: 100 requests per minute (for webhook endpoints)
  webhook: { interval: 60000, maxRequests: 100 },
} as const;

/**
 * Higher-order function to wrap API route handlers with rate limiting
 */
export function withRateLimit<T extends (req: NextRequest, ...args: unknown[]) => Promise<Response>>(
  handler: T,
  config: RateLimitConfig = rateLimitPresets.standard,
  identifier: string = "default"
): T {
  return (async (req: NextRequest, ...args: unknown[]) => {
    const rateLimitResult = await rateLimit(req, config, identifier);
    if (rateLimitResult) return rateLimitResult;
    return handler(req, ...args);
  }) as T;
}
