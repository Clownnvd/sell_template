import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/server";
import { getSubscription, createPortalSession } from "@/lib/payment/service";
import {
  successResponse,
  errorResponse,
  serverError,
} from "@/lib/api/response";

export async function POST(req: NextRequest) {
  try {
    // Require authentication
    const session = await requireAuth();
    const user = session.user;

    // Get user's subscription
    const subscription = await getSubscription(user.id);

    if (!subscription?.stripeCustomerId) {
      return errorResponse("No active subscription found", 404);
    }

    // Parse return URL from body (optional)
    const body = await req.json().catch(() => ({}));
    const returnUrl =
      body.returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`;

    // Create portal session
    const portalSession = await createPortalSession(
      subscription.stripeCustomerId,
      returnUrl
    );

    return successResponse({ url: portalSession.url });
  } catch (error) {
    console.error("Portal error:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return errorResponse("Unauthorized", 401);
    }

    return serverError();
  }
}
