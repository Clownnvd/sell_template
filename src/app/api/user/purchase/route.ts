import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/server";
import prisma from "@/lib/db";
import { rateLimit, rateLimitPresets } from "@/lib/rate-limit";
import { successResponse, unauthorizedError, serverError, NO_CACHE_HEADERS } from "@/lib/api/response";
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

  try {
    const session = await requireAuth();
    const userId = session.user.id;

    const rateLimitResult = await rateLimit(req, rateLimitPresets.standard, "purchase-get", userId);
    if (rateLimitResult) return rateLimitResult;

    const purchase = await prisma.purchase.findUnique({
      where: {
        one_purchase_per_product: { userId, productType: "KING_TEMPLATE" },
      },
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

    const completedPurchase = purchase?.status === "COMPLETED" ? purchase : null;

    logRequest(req, 200, start, userId);
    return successResponse({
      purchased: !!completedPurchase,
      purchase: completedPurchase
        ? {
            ...completedPurchase,
            purchasedAt: completedPurchase.purchasedAt?.toISOString() ?? null,
          }
        : null,
    }, 200, NO_CACHE_HEADERS);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      logRequest(req, 401, start);
      return unauthorizedError();
    }
    logRequest(req, 500, start);
    return serverError();
  }
}
