import { NextRequest } from "next/server";
import { WelcomeEmail } from "@/lib/email/templates/email-template";
import { Resend } from "resend";
import { rateLimit, rateLimitPresets, addRateLimitHeaders } from "@/lib/rate-limit";
import { requireAuth } from "@/lib/auth/server";
import { verifyCsrf } from "@/lib/csrf";
import {
  successResponse,
  unauthorizedError,
  serverError,
  NO_CACHE_HEADERS,
} from "@/lib/api/response";
import { logRequest } from "@/lib/api/logger";
import { serverEnv } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const resend = new Resend(serverEnv.RESEND_API_KEY);
const SEND_TIMEOUT_MS = 10_000;

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    ),
  ]);
}

/**
 * POST /api/send
 * Sends a welcome email to the authenticated user via Resend.
 * @auth Required (requireAuth)
 * @rateLimit 5/min (per user)
 */
export async function POST(req: NextRequest) {
  const start = Date.now();

  const csrfResult = verifyCsrf(req);
  if (csrfResult) return csrfResult;

  try {
    const session = await requireAuth();

    const rateLimitResult = await rateLimit(req, rateLimitPresets.strict, "send-email", session.user.id);
    if (rateLimitResult) return rateLimitResult;

    const userEmail = session.user.email;
    const userName = session.user.name?.split(" ")[0] || "there";

    const { data, error } = await withTimeout(
      resend.emails.send({
        from: `King Template <${serverEnv.RESEND_FROM || "onboarding@resend.dev"}>`,
        to: [userEmail],
        subject: "Welcome to King Template",
        react: WelcomeEmail({ firstName: userName }),
      }),
      SEND_TIMEOUT_MS
    );

    if (error) {
      logRequest(req, 500, start, session.user.id);
      return serverError("Failed to send email");
    }

    logRequest(req, 200, start, session.user.id);
    return addRateLimitHeaders(req, successResponse({ sent: true, id: data?.id }, 200, NO_CACHE_HEADERS));
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      logRequest(req, 401, start);
      return unauthorizedError();
    }
    logRequest(req, 500, start);
    return serverError("Failed to send email");
  }
}
