// src/lib/auth/error-contract.ts

export type AuthField =
  | "name"
  | "email"
  | "password"
  | "confirmPassword"
  | "newPassword";

export type AuthFormError = {
  formError?: string;
  fieldErrors?: Partial<Record<AuthField, string>>;
};

type AuthCode =
  | "INVALID_CREDENTIALS"
  | "USER_ALREADY_EXISTS"
  | "WEAK_PASSWORD"
  | "RATE_LIMITED"
  | "INVALID_TOKEN"
  | "EMAIL_NOT_VERIFIED"
  | "UNKNOWN";

function safeMessage(code: AuthCode) {
  switch (code) {
    case "INVALID_CREDENTIALS":
      return "Email or password is incorrect.";
    case "USER_ALREADY_EXISTS":
      return "This email is already registered.";
    case "WEAK_PASSWORD":
      return "Password is too weak.";
    case "RATE_LIMITED":
      return "Too many attempts. Please try again later.";
    case "INVALID_TOKEN":
      return "This link is invalid or expired. Please request a new one.";
    case "EMAIL_NOT_VERIFIED":
      return "Please verify your email address.";
    default:
      return "Something went wrong. Please try again.";
  }
}

function normalizeCode(code: string): AuthCode {
  const c = code.toUpperCase();

  if (c === "INVALID_CREDENTIALS") return "INVALID_CREDENTIALS";
  if (c === "USER_ALREADY_EXISTS") return "USER_ALREADY_EXISTS";
  if (c === "WEAK_PASSWORD") return "WEAK_PASSWORD";
  if (c === "RATE_LIMITED") return "RATE_LIMITED";
  if (c === "INVALID_TOKEN" || c === "TOKEN_INVALID" || c === "TOKEN_EXPIRED") return "INVALID_TOKEN";
  if (c === "EMAIL_NOT_VERIFIED" || c === "UNVERIFIED_EMAIL") return "EMAIL_NOT_VERIFIED";

  return "UNKNOWN";
}

function normalizeField(field: unknown): AuthField | null {
  if (typeof field !== "string") return null;

  const f = field.trim();
  if (f === "name") return "name";
  if (f === "email") return "email";
  if (f === "password") return "password";
  if (f === "confirmPassword") return "confirmPassword";
  if (f === "newPassword") return "newPassword";

  return null;
}

function pickString(v: unknown): string | null {
  return typeof v === "string" && v.trim().length > 0 ? v : null;
}

export function mapAuthError(err: unknown): AuthFormError {
  // Common BetterAuth-ish shapes:
  // 1) { error: { code, message, field?, status? } }
  // 2) { code, message, field?, status? }
  // 3) thrown Error
  if (err instanceof Error) {
    // do not leak err.message
    return { formError: safeMessage("UNKNOWN") };
  }

  if (typeof err === "object" && err !== null) {
    const e = err as {
      error?: { code?: unknown; message?: unknown; field?: unknown; status?: unknown };
      code?: unknown;
      message?: unknown;
      field?: unknown;
      status?: unknown;
    };

    const rawCode =
      (typeof e.error?.code === "string" ? e.error.code : null) ??
      (typeof e.code === "string" ? e.code : null);

    const rawField = e.error?.field ?? e.field;

    const status =
      (typeof e.error?.status === "number" ? e.error.status : null) ??
      (typeof e.status === "number" ? e.status : null);

    const code = rawCode ? normalizeCode(rawCode) : null;

    // If provider uses 403 for unverified email
    if (!code && status === 403) {
      return { formError: safeMessage("EMAIL_NOT_VERIFIED") };
    }

    if (code) {
      // Field-targeted mapping when we know the target
      const field = normalizeField(rawField);

      if (code === "USER_ALREADY_EXISTS") {
        return { fieldErrors: { email: safeMessage(code) } };
      }

      if (code === "WEAK_PASSWORD") {
        // prefer password/newPassword if present
        if (field) return { fieldErrors: { [field]: safeMessage(code) } };
        return { fieldErrors: { password: safeMessage(code) } };
      }

      if (code === "INVALID_TOKEN") {
        return { formError: safeMessage(code) };
      }

      if (code === "INVALID_CREDENTIALS") {
        return { formError: safeMessage(code) };
      }

      if (code === "RATE_LIMITED") {
        return { formError: safeMessage(code) };
      }

      if (code === "EMAIL_NOT_VERIFIED") {
        return { formError: safeMessage(code) };
      }

      return { formError: safeMessage("UNKNOWN") };
    }

    // Never surface raw message
    const rawMessage =
      pickString(e.error?.message) ??
      pickString(e.message);

    if (rawMessage) {
      return { formError: safeMessage("UNKNOWN") };
    }
  }

  return { formError: safeMessage("UNKNOWN") };
}
