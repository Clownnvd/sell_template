import type { NextRequest } from "next/server";
import { randomUUID } from "crypto";

type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
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

interface SecurityLogEntry {
  level: LogLevel;
  event: string;
  timestamp: string;
  [key: string]: unknown;
}

function writeLog(level: LogLevel, entry: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") {
    const output = JSON.stringify(entry);
    if (level === "error") {
      console.error(output);
    } else if (level === "warn") {
      console.warn(output);
    } else {
      console.info(output);
    }
  } else {
    const { event, level: _level, timestamp: _ts, ...rest } = entry;
    console.info(`[${event}]`, rest);
  }
}

/** Structured logger for security events, webhook processing, and general app logging */
export const logger = {
  info(event: string, meta?: Record<string, unknown>): void {
    const entry: SecurityLogEntry = { level: "info", event, timestamp: new Date().toISOString(), ...meta };
    writeLog("info", entry);
  },
  warn(event: string, meta?: Record<string, unknown>): void {
    const entry: SecurityLogEntry = { level: "warn", event, timestamp: new Date().toISOString(), ...meta };
    writeLog("warn", entry);
  },
  error(event: string, meta?: Record<string, unknown>): void {
    const entry: SecurityLogEntry = { level: "error", event, timestamp: new Date().toISOString(), ...meta };
    writeLog("error", entry);
  },
};

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
    requestId: req.headers.get("x-request-id") ?? randomUUID(),
    timestamp: new Date().toISOString(),
  };

  // Slow request detection — warn if > 500ms
  if (duration > 500 && entry.level === "info") {
    entry.level = "warn";
  }

  writeLog(entry.level, entry as unknown as Record<string, unknown>);
}
