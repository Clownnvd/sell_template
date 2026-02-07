import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/server";
import { verifyCsrf } from "@/lib/csrf";
import { rateLimit, rateLimitPresets } from "@/lib/rate-limit";
import {
  createSepayPurchase,
  getSepayPurchaseStatus,
} from "@/lib/payment/sepay-service";
import {
  successResponse,
  errorResponse,
  serverError,
} from "@/lib/api/response";

/**
 * POST /api/checkout/sepay
 * Create a new SePay payment (returns QR code data)
 */
export async function POST(req: NextRequest) {
  const csrfResult = verifyCsrf(req);
  if (csrfResult) return csrfResult;

  const rateLimitResult = await rateLimit(req, rateLimitPresets.strict, "sepay-checkout");
  if (rateLimitResult) return rateLimitResult;

  try {
    const session = await requireAuth();
    const result = await createSepayPurchase(session.user.id);

    return successResponse({
      purchaseId: result.purchaseId,
      paymentCode: result.paymentCode,
      amount: result.amount,
      qrUrl: result.qrUrl,
      bankAccount: result.bankAccount,
      bankCode: result.bankCode,
      expiresAt: result.expiresAt.toISOString(),
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Unauthorized")) {
        return errorResponse("Unauthorized", 401);
      }
      if (error.message.includes("already purchased")) {
        return errorResponse(error.message, 409);
      }
      if (error.message.includes("not configured")) {
        return errorResponse("Vietnamese payment is not available", 503);
      }
    }
    return serverError();
  }
}

/**
 * GET /api/checkout/sepay?id={purchaseId}
 * Poll for payment status
 */
export async function GET(req: NextRequest) {
  const rateLimitResult = await rateLimit(req, rateLimitPresets.relaxed, "sepay-status");
  if (rateLimitResult) return rateLimitResult;

  try {
    await requireAuth();

    const purchaseId = req.nextUrl.searchParams.get("id");
    if (!purchaseId) {
      return errorResponse("Missing purchase ID", 400);
    }

    const status = await getSepayPurchaseStatus(purchaseId);
    if (!status) {
      return errorResponse("Purchase not found", 404);
    }

    return successResponse(status);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return errorResponse("Unauthorized", 401);
    }
    return serverError();
  }
}
