import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { rateLimit, rateLimitPresets } from "@/lib/rate-limit";
import { successResponse, unauthorizedError } from "@/lib/api/response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const rateLimitResult = await rateLimit(req, rateLimitPresets.standard, "purchase-get");
  if (rateLimitResult) return rateLimitResult;

  const session = await auth.api.getSession({ headers: req.headers });
  const userId = session?.user?.id;
  if (!userId) {
    return unauthorizedError();
  }

  const purchase = await prisma.purchase.findFirst({
    where: { userId, status: "COMPLETED" },
    select: {
      id: true,
      status: true,
      productType: true,
      amount: true,
      githubInviteSent: true,
      githubUsername: true,
      purchasedAt: true,
    },
  });

  return successResponse({
    purchased: !!purchase,
    purchase: purchase
      ? {
          ...purchase,
          purchasedAt: purchase.purchasedAt.toISOString(),
        }
      : null,
  });
}
