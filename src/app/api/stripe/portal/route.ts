import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/server";
import { getSubscription, createPortalSession } from "@/lib/payment/service";
import { rateLimit, rateLimitPresets } from "@/lib/rate-limit";
import { verifyCsrf } from "@/lib/csrf";
import {
  successResponse,
  errorResponse,
  serverError,
} from "@/lib/api/response";

/**
 * Validate URL is safe (relative or same origin)
 */
function isSafeUrl(url: string): boolean {
  if (url.startsWith("/")) return true;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) return false;

  try {
    const parsed = new URL(url);
    const appParsed = new URL(appUrl);
    return parsed.origin === appParsed.origin;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  // CSRF protection
  const csrfResult = verifyCsrf(req);
  if (csrfResult) return csrfResult;

  // Rate limiting: 5 requests per minute for portal
  const rateLimitResult = await rateLimit(req, rateLimitPresets.strict, "portal");
  if (rateLimitResult) return rateLimitResult;

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
    const defaultReturnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`;

    // Validate returnUrl to prevent open redirect
    let returnUrl = defaultReturnUrl;
    if (body.returnUrl && typeof body.returnUrl === "string") {
      returnUrl = isSafeUrl(body.returnUrl) ? body.returnUrl : defaultReturnUrl;
    }

    // Create portal session
    const portalSession = await createPortalSession(
      subscription.stripeCustomerId,
      returnUrl
    );

    return successResponse({ url: portalSession.url });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return errorResponse("Unauthorized", 401);
    }

    return serverError();
  }
}
