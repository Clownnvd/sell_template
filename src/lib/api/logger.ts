import type { NextRequest } from "next/server";

interface LogEntry {
  level: "info" | "warn" | "error";
  event: "api_request";
  method: string;
  path: string;
  status: number;
  durationMs: number;
  userId?: string;
  ip: string | undefined;
  userAgent: string | undefined;
  requestId: string | undefined;
  timestamp: string;
}

/**
 * Log a completed API request with structured data.
 * Production: JSON for log aggregation. Dev: human-readable.
 *
 * @param userId - Optional authenticated user ID for request correlation
 */
export function logRequest(
  req: NextRequest,
  status: number,
  startMs: number,
  userId?: string
): void {
  const duration = Date.now() - startMs;
  const entry: LogEntry = {
    level: status >= 500 ? "error" : status >= 400 ? "warn" : "info",
    event: "api_request",
    method: req.method,
    path: req.nextUrl.pathname,
    status,
    durationMs: duration,
    ...(userId && { userId }),
    ip: req.headers.get("x-forwarded-for")?.split(",").pop()?.trim(),
    userAgent: req.headers.get("user-agent")?.slice(0, 100),
    requestId: req.headers.get("x-request-id") ?? undefined,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "production") {
    // Structured JSON for log aggregation (Datadog, Loki, CloudWatch, etc.)
    if (entry.level === "error") {
      console.error(JSON.stringify(entry));
    } else if (entry.level === "warn") {
      console.warn(JSON.stringify(entry));
    } else {
      console.info(JSON.stringify(entry));
    }
  } else {
    const userSuffix = userId ? ` user=${userId}` : "";
    console.info(`[${entry.method}] ${entry.path} ${entry.status} ${entry.durationMs}ms${userSuffix}`);
  }
}
