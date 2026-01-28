import { useState } from "react";
import type { ApiResponse } from "@/types";

interface CheckoutSessionResponse {
  url: string;
}

interface PortalSessionResponse {
  url: string;
}

/**
 * Hook for subscription and billing operations
 * Provides functions for creating checkout sessions, managing billing portal, and subscription operations
 */
export function useSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async <T,>(
    requestFn: () => Promise<Response>
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await requestFn();
      const data: ApiResponse<T> = await response.json();

      if (!data.success) {
        setError(data.error || "An error occurred");
        return null;
      }

      return data.data as T;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a Stripe checkout session for subscribing to a plan
   * Redirects user to Stripe checkout page
   *
   * @param priceId - Stripe price ID for the subscription plan
   * @param successUrl - Optional success redirect URL
   * @param cancelUrl - Optional cancel redirect URL
   */
  const createCheckout = async (
    priceId: string,
    successUrl?: string,
    cancelUrl?: string
  ) => {
    const result = await handleRequest<CheckoutSessionResponse>(() =>
      fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          successUrl: successUrl || `${window.location.origin}/billing?success=true`,
          cancelUrl: cancelUrl || `${window.location.origin}/billing?canceled=true`,
        }),
      })
    );

    // Redirect to Stripe checkout
    if (result?.url) {
      window.location.href = result.url;
    }

    return result;
  };

  /**
   * Create a Stripe customer portal session
   * Redirects user to Stripe portal to manage their subscription
   *
   * @param returnUrl - Optional return URL after managing subscription
   */
  const createPortal = async (returnUrl?: string) => {
    const result = await handleRequest<PortalSessionResponse>(() =>
      fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          returnUrl: returnUrl || `${window.location.origin}/billing`,
        }),
      })
    );

    // Redirect to Stripe portal
    if (result?.url) {
      window.location.href = result.url;
    }

    return result;
  };

  const clearError = () => setError(null);

  return {
    isLoading,
    error,
    clearError,
    createCheckout,
    createPortal,
  };
}
