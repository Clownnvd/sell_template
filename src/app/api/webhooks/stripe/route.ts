import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/payment/stripe";
import prisma from "@/lib/db";
import { inviteCollaborator } from "@/lib/github/invite";
import { rateLimit, rateLimitPresets } from "@/lib/rate-limit";

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

export async function POST(req: NextRequest) {
  const rateLimitResult = await rateLimit(req, rateLimitPresets.webhook, "stripe-webhook");
  if (rateLimitResult) return rateLimitResult;

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Webhook configuration error");
    return NextResponse.json({ error: "Webhook configuration error" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (await isEventProcessed(event.id)) {
    return NextResponse.json({ received: true, duplicate: true });
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
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.mode !== "payment") return;

  const userId = session.metadata?.userId;
  if (!userId) {
    console.error("Missing userId in checkout session metadata");
    return;
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  if (!paymentIntentId) {
    console.error("Missing payment_intent in checkout session");
    return;
  }

  const customerId = getCustomerId(session.customer);

  const purchase = await prisma.purchase.create({
    data: {
      userId,
      stripePaymentId: paymentIntentId,
      stripeCustomerId: customerId,
      productType: "KING_TEMPLATE",
      amount: session.amount_total ?? 9900,
      status: "COMPLETED",
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { githubUsername: true, email: true },
  });

  if (user?.githubUsername) {
    try {
      const result = await inviteCollaborator(user.githubUsername);
      if (result.success) {
        await prisma.purchase.update({
          where: { id: purchase.id },
          data: { githubInviteSent: true, githubUsername: user.githubUsername },
        });
      }
    } catch (error) {
      console.error("Failed to invite GitHub collaborator:", error);
    }
  }
}
