import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { rateLimit, rateLimitPresets } from "@/lib/rate-limit";
import { updateProfileSchema } from "@/lib/validations/profile";
import { verifyCsrf } from "@/lib/csrf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/user/profile
 * Returns the current user's profile
 */
export async function GET(req: NextRequest) {
  // Rate limiting: 20 requests per minute
  const rateLimitResult = await rateLimit(req, rateLimitPresets.standard, "profile-get");
  if (rateLimitResult) return rateLimitResult;

  const session = await auth.api.getSession({
    headers: req.headers,
  });

  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
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
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.image,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user/profile
 * Updates the current user's profile (name, avatarUrl)
 */
export async function PATCH(req: NextRequest) {
  // CSRF protection for state-changing operations
  const csrfResult = verifyCsrf(req);
  if (csrfResult) return csrfResult;

  // Rate limiting: 10 requests per minute (stricter for writes)
  const rateLimitResult = await rateLimit(req, { maxRequests: 10, interval: 60_000 }, "profile-update");
  if (rateLimitResult) return rateLimitResult;

  const session = await auth.api.getSession({
    headers: req.headers,
  });

  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Parse and validate request body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parseResult = updateProfileSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: parseResult.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { name, avatarUrl } = parseResult.data;

  try {
    // Update user in database
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

    return NextResponse.json({
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatarUrl: updatedUser.image,
        emailVerified: updatedUser.emailVerified,
        createdAt: updatedUser.createdAt.toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
