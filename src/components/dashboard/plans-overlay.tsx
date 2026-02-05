"use client";

import { useState, useCallback } from "react";
import { ArrowLeft, Check, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import { plans, type PlanKey } from "@/config/plans";
import { cn } from "@/utils/cn";

interface PlansOverlayProps {
  open: boolean;
  onClose: () => void;
}

const PLAN_ORDER: PlanKey[] = ["FREE", "BASIC", "PRO"];

export function PlansOverlay({ open, onClose }: PlansOverlayProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [configError, setConfigError] = useState<string | null>(null);
  const { subscription, createCheckout, createPortal, isLoading: isCheckoutLoading, clearError } = useSubscription();

  const currentPlan: PlanKey = (subscription?.plan as PlanKey) || "FREE";
  const getPlanIndex = (planKey: PlanKey) => PLAN_ORDER.indexOf(planKey);

  const handleUpgrade = useCallback(
    async (planKey: PlanKey) => {
      clearError();
      setConfigError(null);
      const plan = plans[planKey];
      const priceId = billingCycle === "monthly"
        ? plan.stripePriceId.monthly
        : plan.stripePriceId.yearly;

      if (!priceId) {
        setConfigError(`Missing Stripe price ID for ${plan.name} (${billingCycle})`);
        return;
      }

      try {
        await createCheckout(
          priceId,
          "/dashboard?billing=success",
          "/dashboard?billing=canceled"
        );
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Invalid Stripe config";
        setConfigError(msg);
      }
    },
    [billingCycle, createCheckout, clearError]
  );

  const handleManage = useCallback(async () => {
    clearError();
    await createPortal("/dashboard");
  }, [createPortal, clearError]);

  const getCtaConfig = (planKey: PlanKey) => {
    const currentIndex = getPlanIndex(currentPlan);
    const targetIndex = getPlanIndex(planKey);

    // Current plan
    if (planKey === currentPlan) {
      return { text: "Current plan", disabled: true, variant: "outline" as const };
    }

    // Downgrade
    if (targetIndex < currentIndex) {
      return { text: "Manage", onClick: handleManage, variant: "outline" as const };
    }

    // Upgrade
    return {
      text: `Upgrade to ${plans[planKey].name}`,
      onClick: () => handleUpgrade(planKey),
      variant: "default" as const,
    };
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">See what&apos;s included</h1>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                billingCycle === "monthly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                billingCycle === "yearly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Yearly
              <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                &middot; Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Error */}
        {configError && (
          <div className="mx-auto mt-6 max-w-xl rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
            <p className="font-medium">Configuration error</p>
            <p className="mt-1 opacity-90">{configError}</p>
          </div>
        )}

        {/* Plan cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PLAN_ORDER.map((planKey) => {
            const plan = plans[planKey];
            const isCurrentPlan = planKey === currentPlan;
            const isPro = planKey === "PRO";
            const cta = getCtaConfig(planKey);
            const price = billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly;
            const period = billingCycle === "monthly" ? "/ month" : "/ year";
            const monthlyEquiv = billingCycle === "yearly" && plan.price.yearly > 0
              ? Math.round(plan.price.yearly / 12)
              : null;

            return (
              <div
                key={planKey}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-card p-8 transition-all",
                  isPro && !isCurrentPlan && "border-primary shadow-lg shadow-primary/10",
                  isCurrentPlan && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}
              >
                {/* Badge */}
                {isPro && !isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                      Most popular
                    </span>
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-4 py-1 text-xs font-medium text-white">
                      <Crown className="h-3 w-3" />
                      Current plan
                    </span>
                  </div>
                )}

                {/* Plan name + description */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-4xl font-bold">
                    {price === 0 ? "Free" : `USD ${monthlyEquiv ?? price}`}
                  </span>
                  {price > 0 && (
                    <span className="text-muted-foreground">
                      {monthlyEquiv ? " / month billed annually" : ` ${period}`}
                    </span>
                  )}
                </div>

                {monthlyEquiv && (
                  <p className="mb-6 text-xs text-muted-foreground">
                    USD {plan.price.yearly} billed annually
                  </p>
                )}
                {!monthlyEquiv && <div className="mb-6" />}

                {/* CTA */}
                <Button
                  variant={cta.variant}
                  className={cn(
                    "mb-8 w-full",
                    !cta.disabled && cta.variant === "default" && "bg-foreground text-background hover:bg-foreground/90"
                  )}
                  onClick={cta.onClick}
                  disabled={cta.disabled || isCheckoutLoading}
                >
                  {isCheckoutLoading && cta.onClick ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    cta.text
                  )}
                </Button>

                {/* Features heading */}
                <p className="mb-4 text-sm font-medium">
                  {planKey === "FREE"
                    ? "Includes:"
                    : planKey === "BASIC"
                      ? "Everything in Free and:"
                      : "Everything in Basic, plus:"}
                </p>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
