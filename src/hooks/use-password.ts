"use client";

import { useState, useCallback } from "react";

type PasswordError = {
  formError?: string;
  fieldErrors?: {
    email?: string;
    newPassword?: string;
    password?: string;
    confirmPassword?: string;
  };
};

export function usePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [uiError, setUiError] = useState<PasswordError | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * Request a password reset email
   * Calls BetterAuth's /api/auth/forget-password endpoint
   */
  const requestReset = useCallback(async (email: string) => {
    setIsLoading(true);
    setUiError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          redirectTo: "/reset-password",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // BetterAuth returns error messages
        const errorMessage = data.message || data.error || "Failed to send reset email";

        // Check for specific error types
        if (errorMessage.toLowerCase().includes("email")) {
          setUiError({ fieldErrors: { email: errorMessage } });
        } else {
          setUiError({ formError: errorMessage });
        }
        return { ok: false, error: errorMessage };
      }

      // BetterAuth returns 200 OK even for non-existent emails (security by design)
      setSuccess("If an account exists with this email, you'll receive a reset link shortly.");
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error. Please try again.";
      setUiError({ formError: message });
      return { ok: false, error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Reset password using token from email link
   * Calls BetterAuth's /api/auth/reset-password endpoint
   */
  const resetWithToken = useCallback(async (data: { token: string; newPassword: string }) => {
    setIsLoading(true);
    setUiError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: data.token,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.message || result.error || "Failed to reset password";

        // Check for specific error types
        if (errorMessage.toLowerCase().includes("token") || errorMessage.toLowerCase().includes("expired")) {
          setUiError({ formError: "This reset link has expired. Please request a new one." });
        } else if (errorMessage.toLowerCase().includes("password")) {
          setUiError({ fieldErrors: { newPassword: errorMessage } });
        } else {
          setUiError({ formError: errorMessage });
        }
        return { ok: false, error: errorMessage };
      }

      setSuccess("Password updated successfully! You can now sign in with your new password.");
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error. Please try again.";
      setUiError({ formError: message });
      return { ok: false, error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Resend email verification
   * Calls BetterAuth's /api/auth/send-verification-email endpoint
   */
  const resendVerify = useCallback(async (email: string) => {
    setIsLoading(true);
    setUiError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/auth/send-verification-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || data.error || "Failed to send verification email";
        setUiError({ formError: errorMessage });
        return { ok: false, error: errorMessage };
      }

      setSuccess("Verification email sent! Check your inbox.");
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error. Please try again.";
      setUiError({ formError: message });
      return { ok: false, error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setUiError(null);
    setSuccess(null);
  }, []);

  return {
    isLoading,
    uiError,
    success,
    requestReset,
    resetWithToken,
    resendVerify,
    clear,
  };
}
