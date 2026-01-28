import { NextResponse } from "next/server";
import { ZodError } from "zod";
import type { ApiResponse } from "@/types";

export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function errorResponse(
  error: string,
  status = 400,
  errors?: Record<string, string[]>
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
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

  return errorResponse("Validation failed", 400, errors);
}

export function unauthorizedError(message = "Unauthorized"): NextResponse<ApiResponse> {
  return errorResponse(message, 401);
}

export function forbiddenError(message = "Forbidden"): NextResponse<ApiResponse> {
  return errorResponse(message, 403);
}

export function notFoundError(message = "Not found"): NextResponse<ApiResponse> {
  return errorResponse(message, 404);
}

export function serverError(message = "Internal server error"): NextResponse<ApiResponse> {
  return errorResponse(message, 500);
}
