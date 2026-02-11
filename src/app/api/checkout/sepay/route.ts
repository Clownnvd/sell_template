import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/server";
import { verifyCsrf } from "@/lib/csrf";
import { rateLimit, rateLimitPresets, addRateLimitHeaders } from "@/lib/rate-limit";
import {
  createSepayPurchase,
  getSepayPurchaseStatus,
} from "@/lib/payment/sepay-service";
import {
  successResponse,
  errorResponse,
  unauthorizedError,
  notFoundError,
  serverError,
  ErrorCodes,
  NO_CACHE_HEADERS,
} from "@/lib/api/response";
import { logRequest } from "@/lib/api/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/checkout/sepay
 * Create a new SePay payment (returns QR code data)
 */
export async function POST(req: NextRequest) {
  const start = Date.now();

  const csrfResult = verifyCsrf(req);
  if (csrfResult) return csrfResult;

  const rateLimitResult = await rateLimit(req, rateLimitPresets.strict, "sepay-checkout");
  if (rateLimitResult) return rateLimitResult;

  try {
    const session = await requireAuth();
    const result = await createSepayPurchase(session.user.id);

    logRequest(req, 200, start);
    return addRateLimitHeaders(req, successResponse({
      paymentCode: result.paymentCode,
      amount: result.amount,
      qrUrl: result.qrUrl,
      bankAccount: result.bankAccount,
      bankCode: result.bankCode,
      expiresAt: result.expiresAt.toISOString(),
    }, 200, NO_CACHE_HEADERS));
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Unauthorized")) {
        logRequest(req, 401, start);
        return unauthorizedError();
      }
      if (error.message.includes("already purchased")) {
        logRequest(req, 409, start);
        return errorResponse(error.message, 409, undefined, ErrorCodes.CONFLICT);
      }
      if (error.message.includes("not configured")) {
        logRequest(req, 503, start);
        return errorResponse("Vietnamese payment is not available", 503, undefined, ErrorCodes.SERVICE_UNAVAILABLE);
      }
    }
    logRequest(req, 500, start);
    return serverError();
  }
}

/**
 * GET /api/checkout/sepay?id={purchaseId}
 * Poll for payment status
 */
export async function GET(req: NextRequest) {
  const getStart = Date.now();

  const rateLimitResult = await rateLimit(req, rateLimitPresets.relaxed, "sepay-status");
  if (rateLimitResult) return rateLimitResult;

  try {
    const session = await requireAuth();

    const purchaseId = req.nextUrl.searchParams.get("id");
    if (!purchaseId || !/^[a-zA-Z0-9_-]{1,100}$/.test(purchaseId)) {
      logRequest(req, 400, getStart);
      return errorResponse("Invalid purchase ID", 400, undefined, ErrorCodes.VALIDATION_ERROR);
    }

    const status = await getSepayPurchaseStatus(purchaseId, session.user.id);
    if (!status) {
      logRequest(req, 404, getStart);
      return notFoundError("Purchase not found");
    }

    logRequest(req, 200, getStart);
    return addRateLimitHeaders(req, successResponse(status, 200, NO_CACHE_HEADERS));
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      logRequest(req, 401, getStart);
      return unauthorizedError();
    }
    logRequest(req, 500, getStart);
    return serverError();
  }
}
