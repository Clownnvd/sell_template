"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";

import { icons } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  StatusBadge,
  SubscriptionStatusBadge,
} from "@/components/shared/status-badge";
import { useSubscription } from "@/hooks/use-subscription";
import { CardSkeleton } from "@/components/shared/loading-skeleton";

interface Subscription {
  id: string;
  plan: "FREE" | "BASIC" | "PRO";
  status: "ACTIVE" | "CANCELED" | "PAST_DUE" | "UNPAID" | "TRIALING";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

type BadgeVariant =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "purple"
  | "pink";

const planDetails: Record<
  Subscription["plan"],
  { name: string; description: string; color: BadgeVariant }
> = {
  FREE: {
    name: "Free",
    description: "Perfect for getting started",
    color: "default",
  },
  BASIC: {
    name: "Basic",
    description: "Essential features for small teams",
    color: "info",
  },
  PRO: {
    name: "Pro",
    description: "Advanced features for growing businesses",
    color: "purple",
  },
};

type BillingInterval = "monthly" | "yearly";

function getPriceId(plan: "BASIC" | "PRO", interval: BillingInterval) {
  // ✅ MUST be price_... and MUST be NEXT_PUBLIC_... because BillingPage is client.
  const envKey =
    plan === "BASIC"
      ? interval === "monthly"
        ? "NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY"
        : "NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY"
      : interval === "monthly"
        ? "NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY"
        : "NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY";

  const value = process.env[envKey];

  if (!value) return null;

  // guard: must start with price_
  if (!value.startsWith("price_")) return null;

  return value;
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [interval, setInterval] = useState<BillingInterval>("monthly");

  const {
    createCheckout,
    createPortal,
    isLoading: isStripeBusy,
    error: stripeError,
    clearError,
  } = useSubscription();

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const response = await fetch("/api/user/subscription");
        if (response.ok) {
          const data = await response.json();
          setSubscription(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscription();
  }, []);

  const currentPlan: Subscription["plan"] = subscription?.plan || "FREE";
  const planInfo = planDetails[currentPlan];

  const canShowPaidBlock = !!subscription && subscription.plan !== "FREE";

  const upgradeTargetPlan = useMemo<"BASIC" | "PRO">(() => {
    // FREE -> PRO (default)
    // BASIC -> PRO
    if (currentPlan === "BASIC") return "PRO";
    return "PRO";
  }, [currentPlan]);

  const handleManageBilling = async () => {
    clearError();
    await createPortal();
  };

  const handleUpgrade = async () => {
    clearError();

    const priceId = getPriceId(upgradeTargetPlan, interval);

    if (!priceId) {
      const missingKey =
        upgradeTargetPlan === "BASIC"
          ? interval === "monthly"
            ? "NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY"
            : "NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY"
          : interval === "monthly"
            ? "NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY"
            : "NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY";

      alert(
        `Missing env for Stripe price id. Please set:
${missingKey}

Also ensure the value is a Stripe Price ID starting with "price_", not "prod_".`
      );
      return;
    }

    await createCheckout(priceId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Billing</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your subscription and billing information.
          </p>
        </div>
        <CardSkeleton count={2} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your subscription and billing information.
        </p>
      </div>

      {stripeError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          {stripeError}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {planInfo.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge variant={planInfo.color}>{planInfo.name}</StatusBadge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* interval toggle (useful for upgrades) */}
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="font-medium">Billing interval</p>
              <p className="text-sm text-muted-foreground">
                Choose monthly or yearly pricing
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={interval === "monthly" ? "default" : "outline"}
                onClick={() => setInterval("monthly")}
                disabled={isStripeBusy}
              >
                Monthly
              </Button>
              <Button
                type="button"
                variant={interval === "yearly" ? "default" : "outline"}
                onClick={() => setInterval("yearly")}
                disabled={isStripeBusy}
              >
                Yearly
              </Button>
            </div>
          </div>

          {canShowPaidBlock ? (
            <>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium">Status</p>
                  <p className="text-sm text-muted-foreground">
                    Your subscription status
                  </p>
                </div>
                <SubscriptionStatusBadge status={subscription.status} />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium">Billing Period</p>
                  <p className="text-sm text-muted-foreground">
                    {format(
                      new Date(subscription.currentPeriodStart),
                      "MMM d, yyyy"
                    )}{" "}
                    -{" "}
                    {format(
                      new Date(subscription.currentPeriodEnd),
                      "MMM d, yyyy"
                    )}
                  </p>
                </div>
                <icons.calendar className="size-5 text-muted-foreground" />
              </div>

              {subscription.cancelAtPeriodEnd ? (
                <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/20">
                  <icons.alert className="size-5 shrink-0 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <p className="font-medium text-yellow-900 dark:text-yellow-200">
                      Subscription Ending
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Your subscription will end on{" "}
                      {format(
                        new Date(subscription.currentPeriodEnd),
                        "MMMM d, yyyy"
                      )}
                      . You can reactivate it anytime before then.
                    </p>
                  </div>
                </div>
              ) : null}

              <Button
                onClick={handleManageBilling}
                disabled={isStripeBusy}
                className="w-full"
              >
                <icons.creditCard className="mr-2 size-4" />
                {isStripeBusy ? "Loading..." : "Manage Billing"}
              </Button>

              {/* allow upgrade BASIC -> PRO */}
              {currentPlan === "BASIC" ? (
                <Button
                  variant="outline"
                  onClick={handleUpgrade}
                  disabled={isStripeBusy}
                  className="w-full"
                >
                  <icons.arrowUp className="mr-2 size-4" />
                  {isStripeBusy
                    ? "Redirecting..."
                    : `Upgrade to Pro (${interval})`}
                </Button>
              ) : null}
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                You&apos;re currently on the free plan. Upgrade to unlock more
                features and capabilities.
              </p>

              <Button
                onClick={handleUpgrade}
                disabled={isStripeBusy}
                className="w-full"
              >
                <icons.arrowUp className="mr-2 size-4" />
                {isStripeBusy
                  ? "Redirecting..."
                  : `Upgrade to ${upgradeTargetPlan} (${interval})`}
              </Button>

              <p className="text-xs text-muted-foreground">
                You will be redirected to Stripe Checkout to complete payment.
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plan Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentPlan === "FREE" ? (
              <>
                <FeatureItem included text="1 Project" />
                <FeatureItem included text="Up to 3 team members" />
                <FeatureItem included text="Basic features" />
                <FeatureItem included text="Community support" />
                <FeatureItem included={false} text="Advanced analytics" />
                <FeatureItem included={false} text="Priority support" />
              </>
            ) : null}

            {currentPlan === "BASIC" ? (
              <>
                <FeatureItem included text="3 Projects" />
                <FeatureItem included text="Up to 10 team members" />
                <FeatureItem included text="All basic features" />
                <FeatureItem included text="Email support" />
                <FeatureItem included text="Basic analytics" />
                <FeatureItem included={false} text="Advanced integrations" />
              </>
            ) : null}

            {currentPlan === "PRO" ? (
              <>
                <FeatureItem included text="Unlimited projects" />
                <FeatureItem included text="Up to 50 team members" />
                <FeatureItem included text="All advanced features" />
                <FeatureItem included text="Priority support" />
                <FeatureItem included text="Advanced analytics" />
                <FeatureItem included text="Custom integrations" />
              </>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FeatureItem({ included, text }: { included: boolean; text: string }) {
  return (
    <div className="flex items-start gap-3">
      {included ? (
        <icons.check className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />
      ) : (
        <icons.close className="mt-0.5 size-5 shrink-0 text-muted-foreground opacity-50" />
      )}
      <span
        className={
          included ? "text-foreground" : "text-muted-foreground line-through"
        }
      >
        {text}
      </span>
    </div>
  );
}
