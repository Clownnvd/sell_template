import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { rateLimit, rateLimitPresets } from "@/lib/rate-limit";
import { successResponse, unauthorizedError } from "@/lib/api/response";

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
    return unauthorizedError();
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

  // If no subscription row exists, return FREE default
  if (!sub) {
    return successResponse({
      id: "free",
      plan: "FREE",
      status: "ACTIVE",
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date().toISOString(),
      cancelAtPeriodEnd: false,
    });
  }

  return successResponse({
    ...sub,
    currentPeriodStart: sub.currentPeriodStart?.toISOString(),
    currentPeriodEnd: sub.currentPeriodEnd?.toISOString(),
  });
}
