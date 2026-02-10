import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/health
 * Liveness probe — checks database connectivity.
 * @auth None
 */
export async function GET() {
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
        headers: { "Cache-Control": "no-store" },
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
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
