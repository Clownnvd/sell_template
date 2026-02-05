import { z } from "zod";

const safeUrlSchema = z.string().refine(
  (url) => {
    if (url.startsWith("/")) return true;
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

export const createCheckoutSchema = z.object({
  successUrl: safeUrlSchema.optional(),
  cancelUrl: safeUrlSchema.optional(),
});

export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>;
