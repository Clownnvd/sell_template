import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

/**
 * Server-side Stripe client
 * Use this in API routes and Server Actions
 * Note: apiVersion is omitted to use SDK default (recommended)
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
  timeout: 15_000,
  maxNetworkRetries: 2,
});
