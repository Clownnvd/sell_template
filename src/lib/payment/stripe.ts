import Stripe from "stripe";
import { serverEnv } from "@/lib/env";

/**
 * Server-side Stripe client
 * Use this in API routes and Server Actions
 * Note: apiVersion is omitted to use SDK default (recommended)
 */
export const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY, {
  typescript: true,
  timeout: 15_000,
  maxNetworkRetries: 2,
});
