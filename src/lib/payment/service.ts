import { stripe } from "./stripe";
import prisma from "@/lib/db";
import { product } from "@/config/product";

/**
 * Get or create Stripe customer for a user
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  const existingPurchase = await prisma.purchase.findFirst({
    where: { userId, stripeCustomerId: { not: null } },
    select: { stripeCustomerId: true },
  });

  if (existingPurchase?.stripeCustomerId) {
    return existingPurchase.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email,
    name: name ?? undefined,
    metadata: { userId },
  });

  return customer.id;
}

/**
 * Create Stripe checkout session for one-time payment
 */
export async function createCheckoutSession({
  userId,
  email,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string | null }> {
  const existingPurchase = await prisma.purchase.findFirst({
    where: { userId, status: "COMPLETED" },
    select: { id: true },
  });

  if (existingPurchase) {
    throw new Error("You have already purchased this product");
  }

  if (!product.stripePriceId) {
    throw new Error("Stripe price not configured");
  }

  const customerId = await getOrCreateStripeCustomer(userId, email);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price: product.stripePriceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId },
  });

  return { url: session.url };
}

/**
 * Get user's purchase record
 */
export async function getPurchase(userId: string) {
  return prisma.purchase.findFirst({
    where: { userId, status: "COMPLETED" },
    select: {
      id: true,
      status: true,
      productType: true,
      amount: true,
      currency: true,
      githubInviteSent: true,
      githubUsername: true,
      purchasedAt: true,
      createdAt: true,
    },
  });
}

/**
 * Check if user has purchased the template
 */
export async function hasPurchased(userId: string): Promise<boolean> {
  const purchase = await prisma.purchase.findFirst({
    where: { userId, status: "COMPLETED" },
    select: { id: true },
  });
  return !!purchase;
}
