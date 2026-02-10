import { randomBytes } from "crypto";
import prisma from "@/lib/db";
import { product } from "@/config/product";
import { inviteCollaborator } from "@/lib/github/invite";

const PAYMENT_CODE_PREFIX = "KT";
const PAYMENT_EXPIRY_MINUTES = 30;

/**
 * Generate a unique payment code for SePay transfers
 * Format: KT-XXXXXXXX (8 random alphanumeric chars)
 */
export function generatePaymentCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1 to avoid confusion
  const bytes = randomBytes(8);
  const code = Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join("");
  return `${PAYMENT_CODE_PREFIX}${code}`;
}

/**
 * Generate SePay VietQR URL for payment
 */
export function generateQRUrl({
  amount,
  paymentCode,
}: {
  amount: number;
  paymentCode: string;
}): string {
  const bankAccount = process.env.SEPAY_BANK_ACCOUNT;
  const bankCode = process.env.SEPAY_BANK_CODE;

  if (!bankAccount || !bankCode) {
    throw new Error("SePay bank account not configured");
  }

  const params = new URLSearchParams({
    acc: bankAccount,
    bank: bankCode,
    amount: String(amount),
    des: paymentCode,
    template: "compact",
  });

  return `https://qr.sepay.vn/img?${params.toString()}`;
}

/**
 * Verify SePay webhook API key
 */
export function verifySepayWebhook(authHeader: string | null): boolean {
  const webhookKey = process.env.SEPAY_WEBHOOK_KEY;
  if (!webhookKey) return false;
  if (!authHeader) return false;

  // SePay sends: "Apikey YOUR_KEY"
  const expectedHeader = `Apikey ${webhookKey}`;
  return authHeader === expectedHeader;
}

/**
 * Create a pending purchase for SePay payment
 */
export async function createSepayPurchase(userId: string): Promise<{
  purchaseId: string;
  paymentCode: string;
  amount: number;
  qrUrl: string;
  bankAccount: string;
  bankCode: string;
  expiresAt: Date;
}> {
  // Check for existing completed purchase
  const existingPurchase = await prisma.purchase.findFirst({
    where: { userId, status: "COMPLETED" },
  });

  if (existingPurchase) {
    throw new Error("You have already purchased this product");
  }

  // Cancel any existing pending SePay purchases for this user
  await prisma.purchase.updateMany({
    where: {
      userId,
      paymentMethod: "SEPAY",
      status: "PENDING",
    },
    data: { status: "REFUNDED" },
  });

  const paymentCode = generatePaymentCode();
  const amount = product.priceVND;
  const expiresAt = new Date(Date.now() + PAYMENT_EXPIRY_MINUTES * 60 * 1000);

  const purchase = await prisma.purchase.create({
    data: {
      userId,
      paymentMethod: "SEPAY",
      paymentCode,
      productType: "KING_TEMPLATE",
      amount,
      currency: "VND",
      status: "PENDING",
      expiresAt,
    },
  });

  const bankAccount = process.env.SEPAY_BANK_ACCOUNT!;
  const bankCode = process.env.SEPAY_BANK_CODE!;

  return {
    purchaseId: purchase.id,
    paymentCode,
    amount,
    qrUrl: generateQRUrl({ amount, paymentCode }),
    bankAccount,
    bankCode,
    expiresAt,
  };
}

/**
 * Process SePay webhook transaction
 * Match by payment code in transfer content
 */
export async function processSepayTransaction(transaction: {
  id: number;
  transferType: string;
  transferAmount: number;
  content: string;
  referenceCode: string;
}): Promise<{ matched: boolean; purchaseId?: string; userId?: string }> {
  // Only process incoming transfers
  if (transaction.transferType !== "in") {
    return { matched: false };
  }

  // Extract payment code from content (case-insensitive search)
  const content = transaction.content.toUpperCase();
  const codeMatch = content.match(/KT[A-Z2-9]{8}/);

  if (!codeMatch) {
    return { matched: false };
  }

  const paymentCode = codeMatch[0];

  // Find the pending purchase
  const purchase = await prisma.purchase.findUnique({
    where: { paymentCode },
    include: { user: { select: { id: true, githubUsername: true } } },
  });

  if (!purchase) {
    return { matched: false };
  }

  // Already completed — idempotent
  if (purchase.status === "COMPLETED") {
    return { matched: true, purchaseId: purchase.id, userId: purchase.user.id };
  }

  // Must be PENDING
  if (purchase.status !== "PENDING") {
    return { matched: false };
  }

  // Verify amount (allow exact match or overpayment)
  if (transaction.transferAmount < purchase.amount) {
    return { matched: false };
  }

  // Mark as completed
  const updatedPurchase = await prisma.purchase.update({
    where: { id: purchase.id },
    data: {
      status: "COMPLETED",
      sepayTransactionId: String(transaction.id),
      purchasedAt: new Date(),
    },
  });

  // Try GitHub invite (non-fatal)
  if (purchase.user.githubUsername) {
    try {
      const result = await inviteCollaborator(purchase.user.githubUsername);
      if (result.success) {
        await prisma.purchase.update({
          where: { id: updatedPurchase.id },
          data: {
            githubInviteSent: true,
            githubUsername: purchase.user.githubUsername,
          },
        });
      }
    } catch {
      // GitHub invite failure is non-fatal
    }
  }

  return { matched: true, purchaseId: updatedPurchase.id, userId: purchase.user.id };
}

/**
 * Get SePay purchase status for polling
 */
export async function getSepayPurchaseStatus(purchaseId: string) {
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    select: {
      id: true,
      status: true,
      paymentCode: true,
      amount: true,
      currency: true,
      expiresAt: true,
      paymentMethod: true,
    },
  });

  if (!purchase || purchase.paymentMethod !== "SEPAY") {
    return null;
  }

  // Check if expired
  if (purchase.status === "PENDING" && purchase.expiresAt && purchase.expiresAt < new Date()) {
    await prisma.purchase.update({
      where: { id: purchaseId },
      data: { status: "REFUNDED" },
    });
    return { ...purchase, status: "EXPIRED" as const };
  }

  return purchase;
}
