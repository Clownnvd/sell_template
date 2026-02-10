type AuditEvent =
  | "sign_in"
  | "sign_up"
  | "sign_out"
  | "login_failed"
  | "password_changed"
  | "password_reset_request"
  | "password_reset_complete"
  | "email_verified"
  | "email_changed"
  | "oauth_link"
  | "oauth_unlink"
  | "session_revoked"
  | "2fa_enabled"
  | "2fa_disabled"
  | "purchase_completed"
  | "github_invited";

interface AuditEntry {
  level: "info" | "warn";
  event: AuditEvent;
  userId: string;
  provider?: string;
  ip?: string;
  timestamp: string;
}

/**
 * Log authentication events for security auditing.
 * Only logs userId + event type — never PII (email, name, etc.)
 */
export function logAuthEvent(
  event: AuditEvent,
  userId: string,
  extra?: { provider?: string; ip?: string }
): void {
  const entry: AuditEntry = {
    level: ["password_reset_request", "login_failed", "session_revoked"].includes(event) ? "warn" : "info",
    event,
    userId,
    provider: extra?.provider,
    ip: extra?.ip,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "production") {
    console.info(JSON.stringify(entry));
  } else {
    console.info(`[AUTH] ${entry.event} user=${entry.userId}${entry.provider ? ` provider=${entry.provider}` : ""}`);
  }
}
