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
  // REQUIRED: used for DB access (Prisma/Neon/etc.)
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required (e.g. postgres://...)"),

  // Add more server-only variables here when needed:
  // SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  // STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
});

const ClientEnvSchema = z.object({
  // Example NEXT_PUBLIC vars (optional if you don't need yet):
  // NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL"),
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
      "❌ serverEnv was imported in a browser bundle. " +
        "Move this import to a Server Component / server-only module."
    );
  }

  const parsed = ServerEnvSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    // Map more vars here when you add them:
    // SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    // STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  });

  if (!parsed.success) {
    throw new Error(
      formatZodError(
        "❌ Invalid server environment variables. Fix your .env.local:",
        parsed.error
      )
    );
  }

  return parsed.data;
})();

export const clientEnv = (() => {
  const parsed = ClientEnvSchema.safeParse({
    // Only map NEXT_PUBLIC_* here
    // NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!parsed.success) {
    throw new Error(
      formatZodError(
        "❌ Invalid client environment variables. Fix your NEXT_PUBLIC_* vars:",
        parsed.error
      )
    );
  }

  return parsed.data;
})();
