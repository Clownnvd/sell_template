import { z } from "zod";

/**
 * Validate that URL is safe (relative or same origin)
 * Prevents open redirect attacks
 */
const safeUrlSchema = z.string().refine(
  (url) => {
    // Allow relative URLs
    if (url.startsWith("/")) return true;

    // Allow same origin URLs
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) return false;

    try {
      const parsed = new URL(url);
      const appParsed = new URL(appUrl);
      return parsed.origin === appParsed.origin;
    } catch {
      return false;
    }
  },
  { message: "URL must be relative or same origin" }
);

/**
 * Validate Stripe price ID format
 */
const priceIdSchema = z
  .string()
  .min(1, "Price ID is required")
  .refine((id) => id.startsWith("price_"), {
    message: "Invalid Stripe price ID format",
  });

export const createCheckoutSchema = z.object({
  priceId: priceIdSchema,
  successUrl: safeUrlSchema.optional(),
  cancelUrl: safeUrlSchema.optional(),
});

export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>;

export const cancelSubscriptionSchema = z.object({
  subscriptionId: z.string().min(1, "Subscription ID is required"),
});

export type CancelSubscriptionInput = z.infer<typeof cancelSubscriptionSchema>;
