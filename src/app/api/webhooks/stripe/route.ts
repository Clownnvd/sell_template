import { NextRequest, NextResponse } from "next/server";
import { revalidatePathWithLog, revalidateTagWithLog } from "@/lib/cache-utils";
import Stripe from "stripe";
import { stripe } from "@/lib/payment/stripe";
import prisma from "@/lib/db";
import { inviteCollaborator } from "@/lib/github/invite";
import { rateLimit, rateLimitPresets } from "@/lib/rate-limit";
import { serverEnv } from "@/lib/env";
import { logger } from "@/lib/api/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null | undefined
): string | null {
  if (!customer) return null;
  if (typeof customer === "string") return customer;
  return customer.id ?? null;
}

async function isEventProcessed(eventId: string): Promise<boolean> {
  const existing = await prisma.webhookEvent.findUnique({
    where: { id: eventId },
  });
  return !!existing;
}

async function markEventProcessed(eventId: string, eventType: string): Promise<void> {
  await prisma.webhookEvent.create({
    data: { id: eventId, type: eventType },
  });
}

/**
 * POST /api/webhooks/stripe
 * Handles Stripe webhook events (checkout.session.completed).
 * Verifies signature, creates purchase record, triggers GitHub invite.
 * @auth Stripe signature verification
 * @rateLimit 100/min
 */
export async function POST(req: NextRequest) {
  const rateLimitResult = await rateLimit(req, rateLimitPresets.webhook, "stripe-webhook");
  if (rateLimitResult) return rateLimitResult;

  const webhookSecret = serverEnv.STRIPE_WEBHOOK_SECRET;

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ received: false }, { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ received: false }, { status: 400 });
  }

  // Replay protection: reject events older than 5 minutes
  const eventAge = Math.floor(Date.now() / 1000) - event.created;
  if (eventAge > 300) {
    return NextResponse.json({ received: false, error: "Event too old" }, { status: 400 });
  }

  if (await isEventProcessed(event.id)) {
    return NextResponse.json({ received: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
    }

    await markEventProcessed(event.id, event.type);
    return NextResponse.json({ received: true });
  } catch {
    // Return 500 so Stripe retries the webhook
    return NextResponse.json({ received: false }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.mode !== "payment") return;

  const userId = session.metadata?.userId;
  if (!userId) {
    throw new Error("Missing userId in checkout session metadata");
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  if (!paymentIntentId) {
    throw new Error("Missing payment_intent in checkout session");
  }

  // Parallel: validate user + check idempotency simultaneously
  const [user, existingPurchase] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, githubUsername: true },
    }),
    prisma.purchase.findUnique({
      where: { stripePaymentId: paymentIntentId },
      select: { id: true, githubInviteSent: true },
    }),
  ]);

  if (!user) {
    throw new Error(`User not found: ${userId}`);
  }

  if (existingPurchase) {
    // Retry GitHub invite if it failed previously
    if (!existingPurchase.githubInviteSent && user.githubUsername) {
      await tryInviteCollaborator(existingPurchase.id, user.githubUsername);
    }
    return;
  }

  const amount = session.amount_total;
  if (!amount || amount < 9900) {
    throw new Error(`Invalid payment amount: ${amount}. Expected at least 9900 cents.`);
  }

  const customerId = getCustomerId(session.customer);

  const purchase = await prisma.purchase.create({
    data: {
      userId,
      stripePaymentId: paymentIntentId,
      stripeCustomerId: customerId,
      productType: "KING_TEMPLATE",
      amount,
      status: "COMPLETED",
      purchasedAt: new Date(),
    },
  });

  if (user.githubUsername) {
    await tryInviteCollaborator(purchase.id, user.githubUsername);
  }

  revalidateTagWithLog(`purchase-${userId}`, "stripe-webhook:checkout-completed");
  revalidatePathWithLog("/dashboard", "stripe-webhook:checkout-completed");
}

async function tryInviteCollaborator(
  purchaseId: string,
  githubUsername: string,
): Promise<void> {
  try {
    const result = await inviteCollaborator(githubUsername);
    if (result.success) {
      await prisma.purchase.update({
        where: { id: purchaseId },
        data: { githubInviteSent: true, githubUsername },
      });
    }
  } catch (error) {
    // GitHub invite failure is non-fatal — user can retry via dashboard
    logger.warn("GitHub invite failed", {
      purchaseId,
      githubUsername,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
