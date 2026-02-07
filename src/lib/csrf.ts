import { NextRequest, NextResponse } from "next/server";

/**
 * CSRF Protection for API Routes
 *
 * This module provides protection against Cross-Site Request Forgery attacks
 * by verifying that requests originate from the expected domain.
 *
 * For state-changing operations (POST, PUT, DELETE, PATCH), we verify:
 * 1. Origin header matches the expected origin
 * 2. If Origin is missing, Referer header matches the expected origin
 */

function getAppOrigin(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL environment variable is required");
  }
  try {
    return new URL(appUrl).origin;
  } catch {
    throw new Error("NEXT_PUBLIC_APP_URL must be a valid URL");
  }
}

/**
 * Verify that a request comes from the same origin
 * Returns an error response if CSRF check fails, null if valid
 */
export function verifyCsrf(req: NextRequest): NextResponse | null {
  // Only check state-changing methods
  const method = req.method.toUpperCase();
  if (!["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    return null; // GET, HEAD, OPTIONS are safe
  }

  const expectedOrigin = getAppOrigin();

  // Check Origin header first (most reliable)
  const origin = req.headers.get("origin");
  if (origin) {
    if (origin !== expectedOrigin) {
      return NextResponse.json(
        { success: false, error: "Invalid request origin" },
        { status: 403 }
      );
    }
    return null; // Valid origin
  }

  // Fallback to Referer header if Origin is missing
  const referer = req.headers.get("referer");
  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      if (refererOrigin !== expectedOrigin) {
        return NextResponse.json(
          { success: false, error: "Invalid request origin" },
          { status: 403 }
        );
      }
      return null; // Valid referer
    } catch {
      // Invalid referer URL
    }
  }

  // Reject requests without Origin or Referer
  // Browsers always send Origin on same-origin fetch() and form POST
  return NextResponse.json(
    { success: false, error: "Missing request origin" },
    { status: 403 }
  );
}

/**
 * Higher-order function to wrap API route handlers with CSRF protection
 */
export function withCsrfProtection<T extends (...args: unknown[]) => Promise<Response>>(
  handler: T
): T {
  return (async (req: NextRequest, ...args: unknown[]) => {
    const csrfResult = verifyCsrf(req);
    if (csrfResult) return csrfResult;
    return handler(req, ...args);
  }) as T;
}
