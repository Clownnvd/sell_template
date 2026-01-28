import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/payment/stripe";
import prisma from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getWebhookSecret(): string | null {
  return process.env.STRIPE_WEBHOOK_SECRET ?? null;
}

function getCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null | undefined
): string | null {
  if (!customer) return null;
  if (typeof customer === "string") return customer;
  return customer.id ?? null;
}

function getPeriodDates(subscription: Stripe.Subscription): {
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
} {
  // In Stripe v20+, period fields are on SubscriptionItem, not Subscription
  const item = subscription.items.data[0];
  if (!item) {
    return { currentPeriodStart: null, currentPeriodEnd: null };
  }

  const start =
    typeof item.current_period_start === "number"
      ? new Date(item.current_period_start * 1000)
      : null;

  const end =
    typeof item.current_period_end === "number"
      ? new Date(item.current_period_end * 1000)
      : null;

  return { currentPeriodStart: start, currentPeriodEnd: end };
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  // In Stripe v20+, subscription info is in parent.subscription_details
  const parent = invoice.parent as {
    type?: string;
    subscription_details?: {
      subscription?: string | Stripe.Subscription | null;
    } | null;
  } | null;

  const subscriptionRef = parent?.subscription_details?.subscription;
  if (typeof subscriptionRef === "string") return subscriptionRef;
  if (subscriptionRef && typeof subscriptionRef === "object") {
    return subscriptionRef.id ?? null;
  }

  return null;
}

export async function POST(req: NextRequest) {
  console.log("🔔 Webhook received!");

  const webhookSecret = getWebhookSecret();
  if (!webhookSecret) {
    console.error("❌ STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not set" },
      { status: 500 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    console.error("❌ Missing stripe-signature header");
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log("✅ Webhook verified, event type:", event.type);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default: {
        console.log(`Unhandled event type: ${event.type}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("🛒 handleCheckoutCompleted called");
  const userId = session.metadata?.userId ?? null;
  console.log("🛒 userId from metadata:", userId);

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  console.log("🛒 subscriptionId:", subscriptionId);
  if (!subscriptionId) {
    console.log("❌ No subscriptionId, returning early");
    return;
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
  console.log("🛒 Retrieved subscription from Stripe");

  if (userId) {
    console.log("🛒 Updating with userId from metadata");
    await updateSubscriptionFromStripe(userId, stripeSubscription);
    return;
  }

  const customerId = getCustomerId(stripeSubscription.customer);
  console.log("🛒 customerId:", customerId);
  if (!customerId) {
    console.log("❌ No customerId, returning early");
    return;
  }

  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId },
  });
  console.log("🛒 dbSubscription found:", dbSubscription);

  if (!dbSubscription) {
    console.log("❌ No dbSubscription found, returning early");
    return;
  }

  await updateSubscriptionFromStripe(dbSubscription.userId, stripeSubscription);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = getCustomerId(subscription.customer);
  if (!customerId) return;

  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!dbSubscription) return;

  await updateSubscriptionFromStripe(dbSubscription.userId, subscription);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = getCustomerId(subscription.customer);
  if (!customerId) return;

  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!dbSubscription) return;

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: "CANCELED",
      plan: "FREE",
      cancelAtPeriodEnd: false,
    },
  });
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = getCustomerId(invoice.customer);
  if (!customerId) return;

  const subscriptionId = getInvoiceSubscriptionId(invoice);
  if (!subscriptionId) return;

  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!dbSubscription) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await updateSubscriptionFromStripe(dbSubscription.userId, subscription);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = getCustomerId(invoice.customer);
  if (!customerId) return;

  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!dbSubscription) return;

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: { status: "PAST_DUE" },
  });
}

async function updateSubscriptionFromStripe(
  userId: string,
  subscription: Stripe.Subscription
) {
  console.log("📝 Updating subscription for userId:", userId);
  const priceId = subscription.items.data[0]?.price?.id ?? null;
  console.log("📝 PriceId from Stripe:", priceId);
  console.log("📝 ENV BASIC_MONTHLY:", process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY);
  console.log("📝 ENV PRO_MONTHLY:", process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY);

  let plan: "FREE" | "BASIC" | "PRO" = "FREE";
  if (priceId) {
    if (
      priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY ||
      priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY
    ) {
      plan = "BASIC";
    } else if (
      priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY ||
      priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY
    ) {
      plan = "PRO";
    }
  }
  console.log("📝 Determined plan:", plan);

  let status: "ACTIVE" | "CANCELED" | "PAST_DUE" | "UNPAID" | "TRIALING" =
    "ACTIVE";
  switch (subscription.status) {
    case "active":
      status = "ACTIVE";
      break;
    case "canceled":
      status = "CANCELED";
      break;
    case "past_due":
      status = "PAST_DUE";
      break;
    case "unpaid":
      status = "UNPAID";
      break;
    case "trialing":
      status = "TRIALING";
      break;
  }

  const customerId = getCustomerId(subscription.customer);
  if (!customerId) {
    // Don't create/update a row without a customer id (it breaks later lookups)
    return;
  }

  const { currentPeriodStart, currentPeriodEnd } = getPeriodDates(subscription);

  const result = await prisma.subscription.upsert({
    where: { userId },
    update: {
      plan,
      status,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      currentPeriodStart: currentPeriodStart ?? undefined,
      currentPeriodEnd: currentPeriodEnd ?? undefined,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      stripeCustomerId: customerId,
    },
    create: {
      userId,
      plan,
      status,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      currentPeriodStart: currentPeriodStart ?? new Date(),
      currentPeriodEnd: currentPeriodEnd ?? new Date(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
  console.log("✅ Subscription updated in DB:", result);
}


