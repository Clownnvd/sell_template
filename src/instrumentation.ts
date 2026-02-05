/**
 * Next.js Instrumentation
 *
 * This file is loaded once when the server starts.
 * We use it to validate environment variables early,
 * so misconfigurations fail fast with clear error messages.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only validate on server startup (not in Edge runtime)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Dynamic import to avoid issues with edge runtime
    const { serverEnv, clientEnv } = await import("@/lib/env");

    // Log successful validation in development
    if (process.env.NODE_ENV === "development") {
      console.log("[ENV] Server environment variables validated successfully");
      console.log("[ENV] Client environment variables validated successfully");
      console.log(`[ENV] App URL: ${clientEnv.NEXT_PUBLIC_APP_URL}`);
      console.log(`[ENV] Database: ${serverEnv.DATABASE_URL.split("@")[1]?.split("/")[0] || "configured"}`);
    }
  }
}
