import { NextRequest } from "next/server";
import { revalidatePathWithLog } from "@/lib/cache-utils";
import { requireAuth } from "@/lib/auth/server";
import prisma from "@/lib/db";
import { rateLimit, rateLimitPresets } from "@/lib/rate-limit";
import { updateProfileSchema } from "@/lib/validations/profile";
import { verifyCsrf } from "@/lib/csrf";
import { successResponse, unauthorizedError, notFoundError, errorResponse, serverError, requireJsonBody, ErrorCodes, NO_CACHE_HEADERS } from "@/lib/api/response";
import { logRequest } from "@/lib/api/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/user/profile
 * Returns the current user's profile
 * @auth Required
 * @rateLimit 20/min (per user)
 */
export async function GET(req: NextRequest) {
  const start = Date.now();

  try {
    const session = await requireAuth();
    const userId = session.user.id;

    const rateLimitResult = await rateLimit(req, rateLimitPresets.standard, "profile-get", userId);
    if (rateLimitResult) return rateLimitResult;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      logRequest(req, 404, start, userId);
      return notFoundError("User not found");
    }

    logRequest(req, 200, start, userId);
    return successResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.image,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
    }, 200, NO_CACHE_HEADERS);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      logRequest(req, 401, start);
      return unauthorizedError();
    }
    logRequest(req, 500, start);
    return serverError("Failed to fetch profile");
  }
}

/**
 * PATCH /api/user/profile
 * Updates the current user's profile (name, avatarUrl)
 * @auth Required
 * @rateLimit 10/min (per user)
 */
export async function PATCH(req: NextRequest) {
  const patchStart = Date.now();

  const csrfResult = verifyCsrf(req);
  if (csrfResult) return csrfResult;

  const ctCheck = requireJsonBody(req);
  if (ctCheck) return ctCheck;

  try {
    const session = await requireAuth();
    const userId = session.user.id;

    const rateLimitResult = await rateLimit(req, { maxRequests: 10, interval: 60_000 }, "profile-update", userId);
    if (rateLimitResult) return rateLimitResult;

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse("Invalid JSON body", 400, undefined, ErrorCodes.VALIDATION_ERROR);
    }

    const parseResult = updateProfileSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse("Validation failed", 400, parseResult.error.flatten().fieldErrors as Record<string, string[]>, ErrorCodes.VALIDATION_ERROR);
    }

    const { name, avatarUrl } = parseResult.data;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        image: avatarUrl || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    revalidatePathWithLog("/dashboard/settings/profile", "profile-api:update");

    logRequest(req, 200, patchStart, userId);
    return successResponse({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatarUrl: updatedUser.image,
      emailVerified: updatedUser.emailVerified,
      createdAt: updatedUser.createdAt.toISOString(),
    }, 200, NO_CACHE_HEADERS);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      logRequest(req, 401, patchStart);
      return unauthorizedError();
    }
    logRequest(req, 500, patchStart);
    return serverError("Failed to update profile");
  }
}
