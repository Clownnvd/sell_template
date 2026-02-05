import { stripe } from "./stripe";
import prisma from "@/lib/db";
import { plans, type PlanKey } from "@/config/plans";

/**
 * Get all valid Stripe price IDs from environment
 */
function getValidPriceIds(): Set<string> {
  const priceIds = new Set<string>();

  const envKeys = [
    "NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY",
    "NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY",
    "NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY",
    "NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY",
  ];

  for (const key of envKeys) {
    const value = process.env[key];
    if (value && value.startsWith("price_")) {
      priceIds.add(value);
    }
  }

  return priceIds;
}

/**
 * Validate that a price ID is configured and valid
 */
export function isValidPriceId(priceId: string): boolean {
  return getValidPriceIds().has(priceId);
}

/**
 * Get or create Stripe customer for a user
 * Uses transaction to prevent race condition creating duplicate customers
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  // Use transaction to prevent race condition
  return await prisma.$transaction(async (tx) => {
    // Check if user already has a subscription with customer ID
    const subscription = await tx.subscription.findUnique({
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
    await tx.subscription.upsert({
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
  });
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
  // Validate priceId is configured
  if (!isValidPriceId(priceId)) {
    throw new Error(`Invalid or unconfigured price ID: ${priceId}`);
  }

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
 * @param userId - User ID for authorization
 * @param subscriptionId - Stripe subscription ID
 */
export async function cancelSubscription(
  userId: string,
  subscriptionId: string
): Promise<void> {
  // Verify user owns this subscription (authorization check)
  const subscription = await prisma.subscription.findFirst({
    where: {
      stripeSubscriptionId: subscriptionId,
      userId: userId, // Must belong to this user
    },
  });

  if (!subscription) {
    throw new Error("Subscription not found or unauthorized");
  }

  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { cancelAtPeriodEnd: true },
  });
}

/**
 * Resume a canceled subscription
 * @param userId - User ID for authorization
 * @param subscriptionId - Stripe subscription ID
 */
export async function resumeSubscription(
  userId: string,
  subscriptionId: string
): Promise<void> {
  // Verify user owns this subscription (authorization check)
  const subscription = await prisma.subscription.findFirst({
    where: {
      stripeSubscriptionId: subscriptionId,
      userId: userId, // Must belong to this user
    },
  });

  if (!subscription) {
    throw new Error("Subscription not found or unauthorized");
  }

  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { cancelAtPeriodEnd: false },
  });
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
