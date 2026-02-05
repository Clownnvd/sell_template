import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { rateLimit, rateLimitPresets } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Rate limiting: 20 requests per minute
  const rateLimitResult = await rateLimit(req, rateLimitPresets.standard, "subscription");
  if (rateLimitResult) return rateLimitResult;
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const sub = await prisma.subscription.findUnique({
    where: { userId },
    select: {
      id: true,
      plan: true,
      status: true,
      currentPeriodStart: true,
      currentPeriodEnd: true,
      cancelAtPeriodEnd: true,
    },
  });

  // Nếu chưa có subscription row, trả FREE default
  if (!sub) {
    return NextResponse.json({
      data: {
        id: "free",
        plan: "FREE",
        status: "ACTIVE",
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date().toISOString(),
        cancelAtPeriodEnd: false,
      },
    });
  }

  return NextResponse.json({
    data: {
      ...sub,
      currentPeriodStart: sub.currentPeriodStart?.toISOString(),
      currentPeriodEnd: sub.currentPeriodEnd?.toISOString(),
    },
  });
}
