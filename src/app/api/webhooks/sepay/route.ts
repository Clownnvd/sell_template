import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePathWithLog, revalidateTagWithLog } from "@/lib/cache-utils";
import { rateLimit, rateLimitPresets, addRateLimitHeaders } from "@/lib/rate-limit";
import { verifySepayWebhook, processSepayTransaction } from "@/lib/payment/sepay-service";
import prisma from "@/lib/db";
import { logger } from "@/lib/api/logger";
import { logAuthEvent } from "@/lib/auth/audit-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** SePay webhook transaction schema — Zod validation with strict mode */
const sepayTransactionSchema = z.object({
  id: z.number(),
  gateway: z.string(),
  transactionDate: z.string(),
  accountNumber: z.string(),
  code: z.string().nullable(),
  content: z.string(),
  transferType: z.string(),
  transferAmount: z.number(),
  accumulated: z.number(),
  subAccount: z.string().nullable(),
  referenceCode: z.string(),
}).strict();

type SepayTransaction = z.infer<typeof sepayTransactionSchema>;

/** Max age for SePay transactions (30 minutes) */
const MAX_TRANSACTION_AGE_MS = 30 * 60 * 1000;

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
    const parsed = sepayTransactionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false }, { status: 400 });
    }
    transaction = parsed.data;
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  // Replay protection: reject transactions older than 30 minutes
  const txDate = new Date(transaction.transactionDate);
  if (!isNaN(txDate.getTime()) && Date.now() - txDate.getTime() > MAX_TRANSACTION_AGE_MS) {
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
    if (result.matched && result.userId) {
      logAuthEvent("purchase_completed", result.userId);
      revalidateTagWithLog(`purchase-${result.userId}`, "sepay-webhook:transaction-completed");
    }
    revalidatePathWithLog("/dashboard", "sepay-webhook:transaction-completed");
    return addRateLimitHeaders(req, NextResponse.json({ success: true }));
  } catch (error) {
    logger.error("sepay_webhook_processing_failed", {
      eventId,
      transactionId: transaction.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
