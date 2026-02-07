"use client";

import { useState, useEffect, useCallback } from "react";
import type { ApiResponse } from "@/types";

interface CheckoutSessionResponse {
  url: string;
}

export interface PurchaseData {
  id: string;
  status: "COMPLETED" | "REFUNDED";
  productType: string;
  amount: number;
  githubInviteSent: boolean;
  githubUsername: string | null;
  purchasedAt: string;
}

interface PurchaseResponse {
  purchased: boolean;
  purchase: PurchaseData | null;
}

export function usePurchase() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [purchase, setPurchase] = useState<PurchaseData | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isLoadingPurchase, setIsLoadingPurchase] = useState(true);

  const fetchPurchase = useCallback(async () => {
    setIsLoadingPurchase(true);
    setFetchError(null);
    try {
      const response = await fetch("/api/user/purchase");
      if (response.status === 401) {
        // Not logged in — expected, not an error
        return;
      }
      const data: ApiResponse<PurchaseResponse> = await response.json();
      if (data.success && data.data) {
        setPurchase(data.data.purchase);
        setHasPurchased(data.data.purchased);
      }
    } catch {
      setFetchError("Failed to load purchase status");
    } finally {
      setIsLoadingPurchase(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchase();
  }, [fetchPurchase]);

  const createCheckout = async (
    successUrl?: string,
    cancelUrl?: string,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const origin = window.location.origin;
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "fetch",
        },
        body: JSON.stringify({
          successUrl: successUrl ? `${origin}${successUrl}` : `${origin}/dashboard?billing=success`,
          cancelUrl: cancelUrl ? `${origin}${cancelUrl}` : `${origin}/dashboard?billing=canceled`,
        }),
      });

      const data: ApiResponse<CheckoutSessionResponse> = await response.json();

      if (!data.success) {
        setError(data.error || "An error occurred");
        return null;
      }

      if (data.data?.url) {
        window.location.href = data.data.url;
      }

      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    purchase,
    hasPurchased,
    isLoadingPurchase,
    fetchError,
    refetchPurchase: fetchPurchase,
    isLoading,
    error,
    clearError,
    createCheckout,
  };
}
