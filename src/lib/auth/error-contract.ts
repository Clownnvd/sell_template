export type AuthField = "name" | "email" | "password" | "confirmPassword";

export type AuthFormError = {
  formError?: string;
  fieldErrors?: Partial<Record<AuthField, string>>;
};

function safeMessage(code: string) {
  // message “sạch”, không leak raw error
  switch (code) {
    case "INVALID_CREDENTIALS":
      return "Email or password is incorrect.";
    case "USER_ALREADY_EXISTS":
      return "This email is already registered.";
    case "WEAK_PASSWORD":
      return "Password is too weak.";
    case "RATE_LIMITED":
      return "Too many attempts. Please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
}

// Heuristic mapper: BetterAuth versions may differ in error shape.
// We accept `unknown`, return clean contract.
export function mapAuthError(err: unknown): AuthFormError {
  // BetterAuth client usually returns { error: { message, code } }
  if (typeof err === "object" && err !== null) {
    const e = err as {
      error?: { code?: unknown; message?: unknown; field?: unknown };
      code?: unknown;
      message?: unknown;
    };

    const code =
      (typeof e.error?.code === "string" ? e.error.code : null) ??
      (typeof e.code === "string" ? e.code : null);

    const message =
      (typeof e.error?.message === "string" ? e.error.message : null) ??
      (typeof e.message === "string" ? e.message : null);

    // map by code first
    if (code) {
      if (code === "USER_ALREADY_EXISTS") {
        return { fieldErrors: { email: safeMessage(code) } };
      }
      if (code === "INVALID_CREDENTIALS") {
        return { formError: safeMessage(code) };
      }
      return { formError: safeMessage(code) };
    }

    // fallback: sanitize generic message, do not leak raw
    if (message) return { formError: "Unable to complete the request. Please try again." };
  }

  return { formError: "Something went wrong. Please try again." };
}
