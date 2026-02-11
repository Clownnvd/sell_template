import { NextRequest } from "next/server";
import { revalidatePathWithLog } from "@/lib/cache-utils";
import { requireAuth } from "@/lib/auth/server";
import prisma from "@/lib/db";
import { rateLimit, rateLimitPresets, addRateLimitHeaders } from "@/lib/rate-limit";
import { verifyCsrf } from "@/lib/csrf";
import { updateGithubUsernameSchema } from "@/lib/validations/github";
import { inviteCollaborator } from "@/lib/github/invite";
import {
  successResponse,
  unauthorizedError,
  errorResponse,
  serverError,
  requireJsonBody,
  ErrorCodes,
  NO_CACHE_HEADERS,
} from "@/lib/api/response";
import { logRequest } from "@/lib/api/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * PATCH /api/user/github-username
 * Updates the user's GitHub username and triggers a collaborator invite if purchased.
 * @auth Required
 * @rateLimit 5/min (per user)
 */
export async function PATCH(req: NextRequest) {
  const start = Date.now();

  const csrfResult = verifyCsrf(req);
  if (csrfResult) return csrfResult;

  const ctCheck = requireJsonBody(req);
  if (ctCheck) return ctCheck;

  try {
    const session = await requireAuth();
    const userId = session.user.id;

    const rateLimitResult = await rateLimit(req, rateLimitPresets.strict, "github-username", userId);
    if (rateLimitResult) return rateLimitResult;

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse("Invalid JSON body", 400, undefined, ErrorCodes.VALIDATION_ERROR);
    }

    const parseResult = updateGithubUsernameSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse(
        "Validation failed",
        400,
        parseResult.error.flatten().fieldErrors as Record<string, string[]>,
        ErrorCodes.VALIDATION_ERROR
      );
    }

    const { githubUsername } = parseResult.data;

    await prisma.user.update({
      where: { id: userId },
      data: { githubUsername },
    });

    const purchase = await prisma.purchase.findUnique({
      where: {
        one_purchase_per_product: { userId, productType: "KING_TEMPLATE" },
      },
      select: { id: true, status: true, githubInviteSent: true },
    });

    let inviteResult = null;
    if (purchase && purchase.status === "COMPLETED" && !purchase.githubInviteSent) {
      try {
        const result = await inviteCollaborator(githubUsername);
        if (result.success) {
          await prisma.purchase.update({
            where: { id: purchase.id },
            data: { githubInviteSent: true, githubUsername },
          });
          inviteResult = { sent: true, alreadyCollaborator: result.alreadyCollaborator };
        } else {
          inviteResult = { sent: false, error: result.error };
        }
      } catch {
        inviteResult = { sent: false, error: "Failed to send invite" };
      }
    }

    revalidatePathWithLog("/dashboard", "github-username:update");

    logRequest(req, 200, start, userId);
    return addRateLimitHeaders(req, successResponse({ githubUsername, invite: inviteResult }, 200, NO_CACHE_HEADERS));
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      logRequest(req, 401, start);
      return unauthorizedError();
    }
    logRequest(req, 500, start);
    return serverError("Failed to update GitHub username");
  }
}
