"use client";

import { useState } from "react";
import type { ApiResponse } from "@/types";

interface CheckoutSessionResponse {
  url: string;
}

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    isLoading,
    error,
    clearError,
    createCheckout,
  };
}
