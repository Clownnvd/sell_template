import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Readiness probe — checks that the app can serve traffic.
 * Unlike /api/health (liveness), this verifies:
 * 1. Database is reachable
 * 2. Required environment variables are present
 */
export async function GET() {
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

  const missingEnv = requiredEnv.filter((key) => !process.env[key]);
  checks.env = missingEnv.length === 0 ? "ok" : "fail";

  const ready = Object.values(checks).every((v) => v === "ok");

  return NextResponse.json(
    {
      ready,
      checks,
      ...(missingEnv.length > 0 && { missingEnv }),
      timestamp: new Date().toISOString(),
    },
    {
      status: ready ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
