import { useState, useEffect, useCallback } from "react";
import type { ApiResponse } from "@/types";

interface CheckoutSessionResponse {
  url: string;
}

interface PortalSessionResponse {
  url: string;
}

export interface SubscriptionData {
  id: string;
  plan: "FREE" | "BASIC" | "PRO";
  status: "ACTIVE" | "CANCELED" | "PAST_DUE" | "UNPAID" | "TRIALING";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

/**
 * Hook for subscription and billing operations
 * Provides functions for creating checkout sessions, managing billing portal, and subscription operations
 */
export function useSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);

  // Fetch subscription data
  const fetchSubscription = useCallback(async () => {
    setIsLoadingSubscription(true);
    try {
      const response = await fetch("/api/user/subscription");
      const data: ApiResponse<SubscriptionData> = await response.json();
      if (data.success && data.data) {
        setSubscription(data.data);
      }
    } catch {
      // User not logged in or error fetching subscription
    } finally {
      setIsLoadingSubscription(false);
    }
  }, []);

  // Fetch subscription on mount
  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

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
   * @param priceId - Stripe price ID
   * @param successPath - Path to redirect on success (e.g., "/dashboard/billing?success=true")
   * @param cancelPath - Path to redirect on cancel (e.g., "/pricing?canceled=true")
   */
  const createCheckout = async (
    priceId: string,
    successPath?: string,
    cancelPath?: string
  ) => {
    const origin = window.location.origin;
    const result = await handleRequest<CheckoutSessionResponse>(() =>
      fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "fetch",
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${origin}${successPath || "/dashboard/billing?success=true"}`,
          cancelUrl: `${origin}${cancelPath || "/dashboard/billing?canceled=true"}`,
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
   * @param returnPath - Path to redirect after portal (e.g., "/dashboard/billing")
   */
  const createPortal = async (returnPath?: string) => {
    const origin = window.location.origin;
    const result = await handleRequest<PortalSessionResponse>(() =>
      fetch("/api/stripe/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "fetch",
        },
        body: JSON.stringify({
          returnUrl: `${origin}${returnPath || "/dashboard/billing"}`,
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
    // Subscription data
    subscription,
    isLoadingSubscription,
    refetchSubscription: fetchSubscription,
    // Actions
    isLoading,
    error,
    clearError,
    createCheckout,
    createPortal,
  };
}
