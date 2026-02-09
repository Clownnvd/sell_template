import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { rateLimit, rateLimitPresets } from "@/lib/rate-limit";
import { successResponse, unauthorizedError, NO_CACHE_HEADERS } from "@/lib/api/response";
import { logRequest } from "@/lib/api/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/user/purchase
 * Returns the authenticated user's purchase status and details.
 * @auth Required
 * @rateLimit 20/min (per user)
 */
export async function GET(req: NextRequest) {
  const start = Date.now();

  const session = await auth.api.getSession({ headers: req.headers });
  const userId = session?.user?.id;
  if (!userId) {
    logRequest(req, 401, start);
    return unauthorizedError();
  }

  const rateLimitResult = await rateLimit(req, rateLimitPresets.standard, "purchase-get", userId);
  if (rateLimitResult) return rateLimitResult;

  const purchase = await prisma.purchase.findFirst({
    where: { userId, status: "COMPLETED" },
    select: {
      id: true,
      status: true,
      productType: true,
      amount: true,
      githubInviteSent: true,
      githubUsername: true,
      purchasedAt: true,
    },
  });

  logRequest(req, 200, start, userId);
  return successResponse({
    purchased: !!purchase,
    purchase: purchase
      ? {
          ...purchase,
          purchasedAt: purchase.purchasedAt?.toISOString() ?? null,
        }
      : null,
  }, 200, NO_CACHE_HEADERS);
}
