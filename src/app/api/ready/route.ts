import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { rateLimit, rateLimitPresets, addRateLimitHeaders } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/ready
 * Readiness probe — checks that the app can serve traffic.
 * Unlike /api/health (liveness), this verifies:
 * 1. Database is reachable
 * 2. Required environment variables are present
 * @auth None
 * @rateLimit 60/min
 */
export async function GET(req: NextRequest) {
  const rateLimitResult = await rateLimit(req, rateLimitPresets.relaxed, "ready");
  if (rateLimitResult) return rateLimitResult;

  const checks: Record<string, "ok" | "fail"> = {};

  // 1. Database connectivity
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch {
    checks.database = "fail";
  }

  // 2. Required env vars
  const requiredEnv = [
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  ];

  const missingCount = requiredEnv.filter((key) => !process.env[key]).length;
  checks.env = missingCount === 0 ? "ok" : "fail";

  const ready = Object.values(checks).every((v) => v === "ok");

  return addRateLimitHeaders(req, NextResponse.json(
    {
      ready,
      checks,
      ...(missingCount > 0 && { missingEnvCount: missingCount }),
      timestamp: new Date().toISOString(),
    },
    {
      status: ready ? 200 : 503,
      headers: { "Cache-Control": "public, max-age=5, s-maxage=5" },
    }
  ));
}
