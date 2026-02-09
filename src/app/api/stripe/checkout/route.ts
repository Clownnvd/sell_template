import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/server";
import { createCheckoutSession } from "@/lib/payment/service";
import { createCheckoutSchema } from "@/lib/validations/billing";
import { rateLimit, rateLimitPresets } from "@/lib/rate-limit";
import { verifyCsrf } from "@/lib/csrf";
import {
  successResponse,
  errorResponse,
  validationError,
  unauthorizedError,
  serverError,
  requireJsonBody,
  ErrorCodes,
} from "@/lib/api/response";
import { logRequest } from "@/lib/api/logger";

/**
 * POST /api/stripe/checkout
 * Creates a Stripe checkout session for the $99 one-time payment.
 * @auth Required
 * @rateLimit 5/min (per IP)
 */
export async function POST(req: NextRequest) {
  const start = Date.now();

  const csrfResult = verifyCsrf(req);
  if (csrfResult) return csrfResult;

  const rateLimitResult = await rateLimit(req, rateLimitPresets.strict, "checkout");
  if (rateLimitResult) return rateLimitResult;

  const ctCheck = requireJsonBody(req);
  if (ctCheck) return ctCheck;

  try {
    const session = await requireAuth();
    const user = session.user;

    const body = await req.json();
    const validation = createCheckoutSchema.safeParse(body);

    if (!validation.success) {
      return validationError(validation.error);
    }

    const { successUrl, cancelUrl } = validation.data;

    const defaultSuccessUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/purchase?success=true`;
    const defaultCancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/purchase?canceled=true`;

    const checkoutSession = await createCheckoutSession({
      userId: user.id,
      email: user.email,
      successUrl: successUrl || defaultSuccessUrl,
      cancelUrl: cancelUrl || defaultCancelUrl,
    });

    if (!checkoutSession.url) {
      return serverError("Failed to create checkout session");
    }

    const response = successResponse({ url: checkoutSession.url });
    logRequest(req, 200, start);
    return response;
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
    }
    logRequest(req, 500, start);
    return serverError();
  }
}
