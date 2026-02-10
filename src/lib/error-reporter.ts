/**
 * Client-side error reporting utility.
 * Replace the body with Sentry, Datadog RUM, or your preferred service.
 *
 * @example
 * ```ts
 * import { reportError } from "@/lib/error-reporter";
 * reportError(error, { boundary: "dashboard" });
 * ```
 */
export function reportError(
  error: Error & { digest?: string },
  context?: Record<string, string>,
): void {
  const entry = {
    message: error.message,
    digest: error.digest,
    stack: error.stack?.slice(0, 500),
    ...context,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "production") {
    // TODO: Replace with Sentry.captureException(error) or similar
    // eslint-disable-next-line no-console
    console.error(JSON.stringify(entry));
  } else {
    // eslint-disable-next-line no-console
    console.error(`[${context?.boundary ?? "app"}]`, error);
  }
}
