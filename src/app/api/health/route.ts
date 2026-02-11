import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { rateLimit, rateLimitPresets } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/health
 * Liveness probe — checks database connectivity.
 * @auth None
 * @rateLimit 60/min
 */
export async function GET(req: NextRequest) {
  const rateLimitResult = await rateLimit(req, rateLimitPresets.relaxed, "health");
  if (rateLimitResult) return rateLimitResult;

  const start = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - start;

    return NextResponse.json(
      {
        status: "healthy",
        database: "connected",
        latencyMs,
        timestamp: new Date().toISOString(),
      },
      {
        headers: { "Cache-Control": "public, max-age=5, s-maxage=5" },
      }
    );
  } catch {
    const latencyMs = Date.now() - start;

    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        latencyMs,
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: { "Cache-Control": "public, max-age=5, s-maxage=5" },
      }
    );
  }
}
