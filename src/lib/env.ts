import { z } from "zod";

/**
 * Env validation for Next.js App Router
 * - serverEnv: server-only vars (process.env.*)
 * - clientEnv: NEXT_PUBLIC_* vars (safe for browser)
 *
 * Behavior:
 * - throws on missing/invalid values
 * - error message is explicit and actionable
 */

function formatZodError(prefix: string, err: z.ZodError) {
  const details = err.issues
    .map((i) => {
      const path = i.path.join(".") || "(root)";
      return `- ${path}: ${i.message}`;
    })
    .join("\n");
  return `${prefix}\n${details}`;
}

const ServerEnvSchema = z.object({
  // Database
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required (e.g. postgres://...)"),

  // Authentication
  BETTER_AUTH_SECRET: z
    .string()
    .min(16, "BETTER_AUTH_SECRET must be at least 16 characters"),

  // OAuth - Google (optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // OAuth - GitHub (optional)
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // Stripe
  STRIPE_SECRET_KEY: z
    .string()
    .regex(/^sk_/, "STRIPE_SECRET_KEY must start with 'sk_'"),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .regex(/^whsec_/, "STRIPE_WEBHOOK_SECRET must start with 'whsec_'"),

  // Email (optional - only validate if provided)
  RESEND_API_KEY: z
    .string()
    .optional(),
});

const ClientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .regex(/^pk_/, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with 'pk_'"),
});

/**
 * NOTE:
 * - serverEnv must NEVER be imported into Client Components.
 * - clientEnv is safe to import anywhere, but still validated.
 */

export const serverEnv = (() => {
  // If this gets imported in the browser by mistake, crash with a clear message.
  if (typeof window !== "undefined") {
    throw new Error(
      "[ERROR] serverEnv was imported in a browser bundle. " +
        "Move this import to a Server Component / server-only module."
    );
  }

  const parsed = ServerEnvSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  });

  if (!parsed.success) {
    throw new Error(
      formatZodError(
        "[ERROR] Invalid server environment variables. Fix your .env.local:",
        parsed.error
      )
    );
  }

  return parsed.data;
})();

export const clientEnv = (() => {
  const parsed = ClientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  });

  if (!parsed.success) {
    throw new Error(
      formatZodError(
        "[ERROR] Invalid client environment variables. Fix your NEXT_PUBLIC_* vars:",
        parsed.error
      )
    );
  }

  return parsed.data;
})();
