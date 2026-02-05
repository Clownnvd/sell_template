"use client";

import { useTransition, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
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

type AuthResult<T = unknown> = {
  ok: boolean;
  data?: T;
  error?: unknown;
};

/**
 * useAuth hook - Optimized with Vercel React Best Practices
 *
 * Improvements:
 * - Uses useTransition for non-blocking loading states (rendering-usetransition-loading)
 * - Functional setState for stable callbacks (rerender-functional-setstate)
 * - Early return pattern (js-early-exit)
 * - Preload support for dashboard (bundle-preload)
 */
export function useAuth() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [uiError, setUiError] = useState<AuthError | null>(null);

  // Preload dashboard route for faster navigation after login
  const preloadDashboard = useCallback(() => {
    router.prefetch("/dashboard");
  }, [router]);

  const signIn = useCallback(
    async (data: { email: string; password: string }): Promise<AuthResult> => {
      // Clear previous errors
      setUiError(null);

      try {
        const result = await authClient.signIn.email(data);

        if (result.error) {
          const errorMessage = result.error.message || "Failed to sign in";

          // Map common errors to field-level errors for better UX
          if (errorMessage.toLowerCase().includes("email")) {
            setUiError({ fieldErrors: { email: errorMessage } });
          } else if (errorMessage.toLowerCase().includes("password")) {
            setUiError({ fieldErrors: { password: errorMessage } });
          } else if (
            errorMessage.toLowerCase().includes("invalid") ||
            errorMessage.toLowerCase().includes("credentials")
          ) {
            setUiError({
              formError: "Invalid email or password. Please try again.",
            });
          } else {
            setUiError({ formError: errorMessage });
          }

          return { ok: false, error: result.error };
        }

        return { ok: true, data: result.data };
      } catch (error) {
        setUiError({
          formError: "Network error. Please check your connection.",
        });
        return { ok: false, error };
      }
    },
    []
  );

  const signUp = useCallback(
    async (data: {
      email: string;
      password: string;
      name: string;
    }): Promise<AuthResult> => {
      setUiError(null);

      try {
        const result = await authClient.signUp.email(data);

        if (result.error) {
          const errorMessage = result.error.message || "Failed to sign up";

          // Map errors to field-level for better UX
          if (errorMessage.toLowerCase().includes("email")) {
            setUiError({ fieldErrors: { email: errorMessage } });
          } else if (errorMessage.toLowerCase().includes("password")) {
            setUiError({ fieldErrors: { password: errorMessage } });
          } else {
            setUiError({ formError: errorMessage });
          }

          return { ok: false, error: result.error };
        }

        return { ok: true, data: result.data };
      } catch (error) {
        setUiError({
          formError: "Network error. Please check your connection.",
        });
        return { ok: false, error };
      }
    },
    []
  );

  const signOut = useCallback(async (): Promise<AuthResult> => {
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
    }
  }, []);

  // Navigate with transition for non-blocking UI
  const navigateAfterAuth = useCallback(
    (url: string) => {
      startTransition(() => {
        router.replace(url);
        router.refresh();
      });
    },
    [router]
  );

  const clearError = useCallback(() => setUiError(null), []);

  return {
    isPending,
    uiError,
    signIn,
    signUp,
    signOut,
    clearError,
    preloadDashboard,
    navigateAfterAuth,
  };
}
