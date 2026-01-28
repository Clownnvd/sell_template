import { stripe } from "./stripe";
import prisma from "@/lib/db";
import { plans, type PlanKey } from "@/config/plans";

/**
 * Get or create Stripe customer for a user
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  // Check if user already has a subscription with customer ID
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (subscription?.stripeCustomerId) {
    return subscription.stripeCustomerId;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name: name ?? undefined,
    metadata: {
      userId,
    },
  });

  // Update or create subscription record
  await prisma.subscription.upsert({
    where: { userId },
    update: { stripeCustomerId: customer.id },
    create: {
      userId,
      stripeCustomerId: customer.id,
      plan: "FREE",
      status: "ACTIVE",
    },
  });

  return customer.id;
}

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession({
  userId,
  email,
  priceId,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  email: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string | null }> {
  const customerId = await getOrCreateStripeCustomer(userId, email);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
  });

  return { url: session.url };
}

/**
 * Create Stripe customer portal session
 */
export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<{ url: string }> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return { url: session.url };
}

/**
 * Get user's subscription
 */
export async function getSubscription(userId: string) {
  return prisma.subscription.findUnique({
    where: { userId },
  });
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscription(subscriptionId: string): Promise<void> {
  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (subscription) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { cancelAtPeriodEnd: true },
    });
  }
}

/**
 * Resume a canceled subscription
 */
export async function resumeSubscription(subscriptionId: string): Promise<void> {
  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });

  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (subscription) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { cancelAtPeriodEnd: false },
    });
  }
}

/**
 * Check if user has access to a feature based on their plan
 */
export function hasFeatureAccess(plan: PlanKey, feature: string): boolean {
  const planConfig = plans[plan];
  return planConfig.features.includes(feature);
}

/**
 * Check if user has reached usage limit
 */
export async function checkUsageLimit(
  userId: string,
  feature: keyof (typeof plans)["FREE"]["limits"],
  currentUsage: number
): Promise<{ allowed: boolean; limit: number }> {
  const subscription = await getSubscription(userId);
  const plan = subscription?.plan || "FREE";
  const planConfig = plans[plan as PlanKey];
  const limit = planConfig.limits[feature];

  // -1 means unlimited
  if (limit === -1) {
    return { allowed: true, limit: -1 };
  }

  return {
    allowed: currentUsage < limit,
    limit,
  };
}
