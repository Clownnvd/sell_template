import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { rateLimit, rateLimitPresets } from "@/lib/rate-limit";
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

  const session = await auth.api.getSession({ headers: req.headers });
  const userId = session?.user?.id;
  if (!userId) {
    return unauthorizedError();
  }

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

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { githubUsername },
    });

    const purchase = await prisma.purchase.findFirst({
      where: { userId, status: "COMPLETED", githubInviteSent: false },
    });

    let inviteResult = null;
    if (purchase) {
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

    logRequest(req, 200, start, userId);
    return successResponse({ githubUsername, invite: inviteResult }, 200, NO_CACHE_HEADERS);
  } catch {
    logRequest(req, 500, start, userId);
    return serverError("Failed to update GitHub username");
  }
}
