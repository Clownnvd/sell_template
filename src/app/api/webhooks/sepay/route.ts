import { NextRequest, NextResponse } from "next/server";
import { revalidatePathWithLog, revalidateTagWithLog } from "@/lib/cache-utils";
import { rateLimit, rateLimitPresets } from "@/lib/rate-limit";
import { verifySepayWebhook, processSepayTransaction } from "@/lib/payment/sepay-service";
import prisma from "@/lib/db";
import { logger } from "@/lib/api/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sepayTransactionSchema = {
  isValid(data: unknown): data is SepayTransaction {
    if (!data || typeof data !== "object") return false;
    const obj = data as Record<string, unknown>;
    return (
      typeof obj.id === "number" &&
      typeof obj.transferType === "string" &&
      typeof obj.transferAmount === "number" &&
      typeof obj.content === "string"
    );
  },
};

interface SepayTransaction {
  id: number;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  code: string | null;
  content: string;
  transferType: string;
  transferAmount: number;
  accumulated: number;
  subAccount: string | null;
  referenceCode: string;
}

async function isEventProcessed(transactionId: string): Promise<boolean> {
  const existing = await prisma.webhookEvent.findUnique({
    where: { id: transactionId },
  });
  return !!existing;
}

async function markEventProcessed(transactionId: string): Promise<void> {
  await prisma.webhookEvent.create({
    data: { id: transactionId, type: "sepay.transaction" },
  });
}

/**
 * POST /api/webhooks/sepay
 * Handles SePay bank transfer webhook notifications.
 * Matches payment code, completes purchase, triggers GitHub invite.
 * @auth SePay API key verification
 * @rateLimit 100/min
 */
export async function POST(req: NextRequest) {
  const rateLimitResult = await rateLimit(req, rateLimitPresets.webhook, "sepay-webhook");
  if (rateLimitResult) return rateLimitResult;

  // Verify API key authentication
  const authHeader = req.headers.get("authorization");
  if (!verifySepayWebhook(authHeader)) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  let transaction: SepayTransaction;
  try {
    const body = await req.json();
    if (!sepayTransactionSchema.isValid(body)) {
      return NextResponse.json({ success: false }, { status: 400 });
    }
    transaction = body;
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  // Idempotency check
  const eventId = `sepay-${transaction.id}`;
  if (await isEventProcessed(eventId)) {
    return NextResponse.json({ success: true });
  }

  try {
    const result = await processSepayTransaction({
      id: transaction.id,
      transferType: transaction.transferType,
      transferAmount: transaction.transferAmount,
      content: transaction.content,
      referenceCode: transaction.referenceCode,
    });

    await markEventProcessed(eventId);
    if (result.userId) {
      revalidateTagWithLog(`purchase-${result.userId}`, "sepay-webhook:transaction-completed");
    }
    revalidatePathWithLog("/dashboard", "sepay-webhook:transaction-completed");
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("sepay_webhook_processing_failed", {
      eventId,
      transactionId: transaction.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
