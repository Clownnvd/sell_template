import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/server";
import { getPurchase } from "@/lib/payment/service";
import { rateLimit, rateLimitPresets, addRateLimitHeaders } from "@/lib/rate-limit";
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

    const purchase = await getPurchase(userId);

    logRequest(req, 200, start, userId);
    return addRateLimitHeaders(req, successResponse({
      purchased: !!purchase,
      purchase: purchase
        ? {
            ...purchase,
            purchasedAt: purchase.purchasedAt?.toISOString() ?? null,
          }
        : null,
    }, 200, NO_CACHE_HEADERS));
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      logRequest(req, 401, start);
      return unauthorizedError();
    }
    logRequest(req, 500, start);
    return serverError();
  }
}
