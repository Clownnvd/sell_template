"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

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

  // TODO: Implement these methods using custom API routes
  // BetterAuth client methods need to be properly configured
  const requestReset = async (email: string) => {
    setIsLoading(true);
    setUiError(null);
    setSuccess(null);

    try {
      // TODO: Call custom API route for password reset
      setSuccess("Reset link sent! Check your email.");
      return { ok: true };
    } catch (error) {
      setUiError({
        formError: "An unexpected error occurred",
      });
      return { ok: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const resetWithToken = async (data: { token: string; newPassword: string }) => {
    setIsLoading(true);
    setUiError(null);
    setSuccess(null);

    try {
      // TODO: Call custom API route for password reset with token
      setSuccess("Password updated successfully!");
      return { ok: true };
    } catch (error) {
      setUiError({
        formError: "An unexpected error occurred",
      });
      return { ok: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerify = async (email: string) => {
    setIsLoading(true);
    setUiError(null);
    setSuccess(null);

    try {
      // TODO: Call custom API route for email verification
      setSuccess("Verification email sent! Check your inbox.");
      return { ok: true };
    } catch (error) {
      setUiError({
        formError: "An unexpected error occurred",
      });
      return { ok: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const clear = () => {
    setUiError(null);
    setSuccess(null);
  };

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
