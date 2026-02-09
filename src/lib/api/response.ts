import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ZodError } from "zod";
import type { ApiResponse } from "@/types";

/** Machine-readable error codes for programmatic error handling */
export const ErrorCodes = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  RATE_LIMITED: "RATE_LIMITED",
  UNSUPPORTED_MEDIA_TYPE: "UNSUPPORTED_MEDIA_TYPE",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  SERVER_ERROR: "SERVER_ERROR",
} as const;

export function successResponse<T>(
  data: T,
  status = 200,
  headers?: Record<string, string>
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status, headers }
  );
}

export function errorResponse(
  error: string,
  status = 400,
  errors?: Record<string, string[]>,
  code?: string
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      code,
      errors,
    },
    { status }
  );
}

export function validationError(zodError: ZodError<unknown>): NextResponse<ApiResponse> {
  const errors: Record<string, string[]> = {};

  zodError.issues.forEach((err) => {
    const path = err.path.join(".");
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(err.message);
  });

  return errorResponse("Validation failed", 400, errors, ErrorCodes.VALIDATION_ERROR);
}

export function unauthorizedError(message = "Unauthorized"): NextResponse<ApiResponse> {
  return errorResponse(message, 401, undefined, ErrorCodes.UNAUTHORIZED);
}

export function forbiddenError(message = "Forbidden"): NextResponse<ApiResponse> {
  return errorResponse(message, 403, undefined, ErrorCodes.FORBIDDEN);
}

export function notFoundError(message = "Not found"): NextResponse<ApiResponse> {
  return errorResponse(message, 404, undefined, ErrorCodes.NOT_FOUND);
}

export function serverError(message = "Internal server error"): NextResponse<ApiResponse> {
  return errorResponse(message, 500, undefined, ErrorCodes.SERVER_ERROR);
}

/** Cache headers for authenticated API responses — prevents proxy/browser caching of user data */
export const NO_CACHE_HEADERS = { "Cache-Control": "private, no-store" } as const;

/** Reject requests that don't send application/json Content-Type */
export function requireJsonBody(req: NextRequest): NextResponse | null {
  const contentType = req.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return errorResponse(
      "Content-Type must be application/json",
      415,
      undefined,
      ErrorCodes.UNSUPPORTED_MEDIA_TYPE
    );
  }
  return null;
}
