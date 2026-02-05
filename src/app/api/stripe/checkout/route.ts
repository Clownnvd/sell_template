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
  const csrfResult = verifyCsrf(req);
  if (csrfResult) return csrfResult;

  const rateLimitResult = await rateLimit(req, rateLimitPresets.strict, "checkout");
  if (rateLimitResult) return rateLimitResult;

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
      return errorResponse("Failed to create checkout session", 500);
    }

    return successResponse({ url: checkoutSession.url });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Unauthorized")) {
        return errorResponse("Unauthorized", 401);
      }
      if (error.message.includes("already purchased")) {
        return errorResponse(error.message, 409);
      }
    }
    return serverError();
  }
}
