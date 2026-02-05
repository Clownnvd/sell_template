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
} from "@/lib/api/response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  const csrfResult = verifyCsrf(req);
  if (csrfResult) return csrfResult;

  const rateLimitResult = await rateLimit(req, rateLimitPresets.strict, "github-username");
  if (rateLimitResult) return rateLimitResult;

  const session = await auth.api.getSession({ headers: req.headers });
  const userId = session?.user?.id;
  if (!userId) {
    return unauthorizedError();
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  const parseResult = updateGithubUsernameSchema.safeParse(body);
  if (!parseResult.success) {
    return errorResponse(
      "Validation failed",
      400,
      parseResult.error.flatten().fieldErrors as Record<string, string[]>
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

    return successResponse({ githubUsername, invite: inviteResult });
  } catch {
    return serverError("Failed to update GitHub username");
  }
}
