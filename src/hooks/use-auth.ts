"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

type AuthError = {
  formError?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
    name?: string;
    confirmPassword?: string;
  };
};

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [uiError, setUiError] = useState<AuthError | null>(null);

  const signIn = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setUiError(null);

    try {
      const result = await authClient.signIn.email(data);

      if (result.error) {
        setUiError({
          formError: result.error.message || "Failed to sign in",
        });
        return { ok: false, error: result.error };
      }

      return { ok: true, data: result.data };
    } catch (error) {
      setUiError({
        formError: "An unexpected error occurred",
      });
      return { ok: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: { email: string; password: string; name: string }) => {
    setIsLoading(true);
    setUiError(null);

    try {
      const result = await authClient.signUp.email(data);

      if (result.error) {
        setUiError({
          formError: result.error.message || "Failed to sign up",
        });
        return { ok: false, error: result.error };
      }

      return { ok: true, data: result.data };
    } catch (error) {
      setUiError({
        formError: "An unexpected error occurred",
      });
      return { ok: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Password reset methods will be implemented in usePassword hook

  const signOut = async () => {
    setIsLoading(true);
    setUiError(null);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        setUiError({
          formError: result.error.message || "Failed to sign out",
        });
        return { ok: false, error: result.error };
      }

      return { ok: true, data: result.data };
    } catch (error) {
      setUiError({
        formError: "An unexpected error occurred",
      });
      return { ok: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setUiError(null);

  return {
    isLoading,
    uiError,
    signIn,
    signUp,
    signOut,
    clearError,
  };
}
