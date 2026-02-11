import { NextRequest } from "next/server";
import { rateLimit, rateLimitPresets, addRateLimitHeaders } from "@/lib/rate-limit";
import { verifyCsrf } from "@/lib/csrf";
import { contactFormSchema } from "@/lib/validations/contact";
import {
  successResponse,
  errorResponse,
  serverError,
  requireJsonBody,
  ErrorCodes,
} from "@/lib/api/response";
import { logRequest, logger } from "@/lib/api/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/contact
 * Accepts a contact form submission.
 * @rateLimit 3/min (strict — prevents spam)
 */
export async function POST(req: NextRequest) {
  const start = Date.now();

  const csrfResult = verifyCsrf(req);
  if (csrfResult) return csrfResult;

  const ctCheck = requireJsonBody(req);
  if (ctCheck) return ctCheck;

  try {
    const rateLimitResult = await rateLimit(req, rateLimitPresets.strict, "contact");
    if (rateLimitResult) return rateLimitResult;

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse("Invalid JSON body", 400, undefined, ErrorCodes.VALIDATION_ERROR);
    }

    const parseResult = contactFormSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse(
        "Validation failed",
        400,
        parseResult.error.flatten().fieldErrors as Record<string, string[]>,
        ErrorCodes.VALIDATION_ERROR,
      );
    }

    // In production, send email via Resend or store in database.
    // For now, log the contact submission via structured logger.
    const { name, email, subject } = parseResult.data;

    logger.info("contact_form_submitted", {
      contactName: name,
      contactEmail: email,
      contactSubject: subject ?? "(no subject)",
    });

    logRequest(req, 200, start);

    return addRateLimitHeaders(
      req,
      successResponse({ message: "Message received. We'll get back to you soon." }),
    );
  } catch {
    logRequest(req, 500, start);
    return serverError("Failed to process contact form");
  }
}
