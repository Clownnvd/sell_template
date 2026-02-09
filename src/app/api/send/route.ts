import { NextRequest } from "next/server";
import { WelcomeEmail } from "@/lib/email/templates/email-template";
import { Resend } from "resend";
import { rateLimit, rateLimitPresets } from "@/lib/rate-limit";
import { auth } from "@/lib/auth";
import { verifyCsrf } from "@/lib/csrf";
import {
  successResponse,
  unauthorizedError,
  serverError,
} from "@/lib/api/response";
import { logRequest } from "@/lib/api/logger";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/send
 * Sends a welcome email to the authenticated user via Resend.
 * @auth Required
 * @rateLimit 5/min (per user)
 */
export async function POST(req: NextRequest) {
  const start = Date.now();

  const csrfResult = verifyCsrf(req);
  if (csrfResult) return csrfResult;

  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    logRequest(req, 401, start);
    return unauthorizedError("Authentication required");
  }

  const rateLimitResult = await rateLimit(req, rateLimitPresets.strict, "send-email", session.user.id);
  if (rateLimitResult) return rateLimitResult;

  const userEmail = session.user.email;
  const userName = session.user.name?.split(" ")[0] || "there";

  try {
    const { data, error } = await resend.emails.send({
      from: `King Template <${process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"}>`,
      to: [userEmail],
      subject: "Welcome to King Template",
      react: WelcomeEmail({ firstName: userName }),
    });

    if (error) {
      logRequest(req, 500, start, session.user.id);
      return serverError("Failed to send email");
    }

    logRequest(req, 200, start, session.user.id);
    return successResponse(data);
  } catch {
    logRequest(req, 500, start, session.user.id);
    return serverError("Failed to send email");
  }
}
