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
  serverError,
} from "@/lib/api/response";

export async function POST(req: NextRequest) {
  // CSRF protection
  const csrfResult = verifyCsrf(req);
  if (csrfResult) return csrfResult;

  // Rate limiting: 5 requests per minute for checkout
  const rateLimitResult = await rateLimit(req, rateLimitPresets.strict, "checkout");
  if (rateLimitResult) return rateLimitResult;

  try {
    // Require authentication
    const session = await requireAuth();
    const user = session.user;

    // Parse and validate request body
    const body = await req.json();
    const validation = createCheckoutSchema.safeParse(body);

    if (!validation.success) {
      return validationError(validation.error);
    }

    const { priceId, successUrl, cancelUrl } = validation.data;

    // Default URLs if not provided
    const defaultSuccessUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`;
    const defaultCancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=canceled`;

    // Create checkout session
    const checkoutSession = await createCheckoutSession({
      userId: user.id,
      email: user.email,
      priceId,
      successUrl: successUrl || defaultSuccessUrl,
      cancelUrl: cancelUrl || defaultCancelUrl,
    });

    if (!checkoutSession.url) {
      return errorResponse("Failed to create checkout session", 500);
    }

    return successResponse({ url: checkoutSession.url });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return errorResponse("Unauthorized", 401);
    }

    return serverError();
  }
}
