import { z } from "zod";

export const createCheckoutSchema = z.object({
  priceId: z.string().min(1, "Price ID is required"),
  successUrl: z.string().url("Invalid success URL").optional(),
  cancelUrl: z.string().url("Invalid cancel URL").optional(),
});

export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>;

export const cancelSubscriptionSchema = z.object({
  subscriptionId: z.string().min(1, "Subscription ID is required"),
});

export type CancelSubscriptionInput = z.infer<typeof cancelSubscriptionSchema>;
