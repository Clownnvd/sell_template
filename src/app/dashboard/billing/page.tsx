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
import { cn } from "@/utils/cn";

interface Subscription {
  id: string;
  plan: "FREE" | "BASIC" | "PRO";
  status: "ACTIVE" | "CANCELED" | "PAST_DUE" | "UNPAID" | "TRIALING";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

type BadgeVariant = "default" | "success" | "error" | "warning" | "info" | "purple" | "pink";

const planDetails: Record<
  Subscription["plan"],
  { name: string; description: string; color: BadgeVariant }
> = {
  FREE: { name: "Free", description: "Perfect for getting started", color: "default" },
  BASIC: { name: "Basic", description: "Essential features for small teams", color: "info" },
  PRO: { name: "Pro", description: "Advanced features for growing businesses", color: "purple" },
};

type BillingInterval = "monthly" | "yearly";

/**
 * ✅ IMPORTANT:
 * Must reference env vars DIRECTLY in client components.
 * Do NOT use process.env[dynamicKey].
 */
const STRIPE_PRICE = {
  BASIC: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY,
    yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY,
  },
  PRO: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY,
    yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY,
  },
} as const;

function mustGetPriceId(value: string | undefined, envName: string): string {
  if (!value) throw new Error(`Missing env: ${envName}`);
  if (!value.startsWith("price_")) {
    throw new Error(`Env ${envName} must be Stripe Price ID (price_...), got: ${value}`);
  }
  return value;
}

function getEnvName(plan: "BASIC" | "PRO", interval: BillingInterval) {
  if (plan === "BASIC") {
    return interval === "monthly"
      ? "NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY"
      : "NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY";
  }
  return interval === "monthly"
    ? "NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY"
    : "NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY";
}

const featureSets: Record<Subscription["plan"], { included: boolean; text: string }[]> = {
  FREE: [
    { included: true, text: "1 Project" },
    { included: true, text: "Up to 3 team members" },
    { included: true, text: "Basic features" },
    { included: true, text: "Community support" },
    { included: false, text: "Advanced analytics" },
    { included: false, text: "Priority support" },
  ],
  BASIC: [
    { included: true, text: "3 Projects" },
    { included: true, text: "Up to 10 team members" },
    { included: true, text: "All basic features" },
    { included: true, text: "Email support" },
    { included: true, text: "Basic analytics" },
    { included: false, text: "Advanced integrations" },
  ],
  PRO: [
    { included: true, text: "Unlimited projects" },
    { included: true, text: "Up to 50 team members" },
    { included: true, text: "Advanced analytics" },
    { included: true, text: "Priority support" },
    { included: true, text: "Custom integrations" },
    { included: true, text: "Team roles & permissions" },
  ],
};

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

  const currentPlan = subscription?.plan || "FREE";
  const planInfo = planDetails[currentPlan];
  const isPaid = !!subscription && subscription.plan !== "FREE";

  const upgradeTargetPlan = useMemo<"BASIC" | "PRO">(() => {
    // ✅ Bạn có thể đổi logic:
    // FREE -> PRO
    // BASIC -> PRO
    if (currentPlan === "FREE") return "PRO";
    if (currentPlan === "BASIC") return "PRO";
    return "PRO";
  }, [currentPlan]);

  const handleManageBilling = async () => {
    clearError();
    await createPortal(`${window.location.origin}/dashboard/billing`);
  };

  const handleUpgrade = async () => {
    clearError();

    try {
      const targetPlan: "BASIC" | "PRO" = upgradeTargetPlan;

      const raw =
        targetPlan === "BASIC"
          ? STRIPE_PRICE.BASIC[interval]
          : STRIPE_PRICE.PRO[interval];

      const envName = getEnvName(targetPlan, interval);
      const priceId = mustGetPriceId(raw, envName);

      await createCheckout(
        priceId,
        `${window.location.origin}/dashboard/billing?success=true`,
        `${window.location.origin}/dashboard/billing?canceled=true`
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : "Invalid Stripe config");
    }
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
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
          <p className="mt-2 text-muted-foreground">
            Upgrade your plan and manage invoices in one place.
          </p>
        </div>

        {/* Interval Toggle */}
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-1 shadow-sm">
          <ToggleChip
            active={interval === "monthly"}
            onClick={() => setInterval("monthly")}
            disabled={isStripeBusy}
          >
            Monthly
          </ToggleChip>
          <ToggleChip
            active={interval === "yearly"}
            onClick={() => setInterval("yearly")}
            disabled={isStripeBusy}
          >
            Yearly
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              save
            </span>
          </ToggleChip>
        </div>
      </div>

      {/* Error */}
      {stripeError ? (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          <icons.alert className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-medium">Something went wrong</p>
            <p className="mt-1 opacity-90">{stripeError}</p>
          </div>
        </div>
      ) : null}

      {/* Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Current plan */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Current plan</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {planInfo.description}
                </p>
              </div>
              <StatusBadge variant={planInfo.color}>{planInfo.name}</StatusBadge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {isPaid ? (
              <>
                <div className="grid gap-3 md:grid-cols-2">
                  <InfoRow
                    title="Status"
                    subtitle="Your subscription status"
                    right={<SubscriptionStatusBadge status={subscription!.status} />}
                  />
                  <InfoRow
                    title="Billing period"
                    subtitle={`${format(new Date(subscription!.currentPeriodStart), "MMM d, yyyy")} – ${format(
                      new Date(subscription!.currentPeriodEnd),
                      "MMM d, yyyy"
                    )}`}
                    right={<icons.calendar className="size-5 text-muted-foreground" />}
                  />
                </div>

                {subscription!.cancelAtPeriodEnd ? (
                  <div className="flex items-start gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/20">
                    <icons.alert className="mt-0.5 size-5 shrink-0 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <p className="font-medium text-yellow-900 dark:text-yellow-200">
                        Subscription ending
                      </p>
                      <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                        Your plan will end on{" "}
                        {format(new Date(subscription!.currentPeriodEnd), "MMMM d, yyyy")}. You
                        can reactivate anytime before then.
                      </p>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 md:flex-row">
                  <Button
                    onClick={handleManageBilling}
                    disabled={isStripeBusy}
                    className="md:flex-1"
                  >
                    <icons.creditCard className="mr-2 size-4" />
                    {isStripeBusy ? "Loading..." : "Manage billing"}
                  </Button>

                  {currentPlan === "BASIC" ? (
                    <Button
                      variant="outline"
                      onClick={handleUpgrade}
                      disabled={isStripeBusy}
                      className="md:flex-1"
                    >
                      <icons.arrowUp className="mr-2 size-4" />
                      {isStripeBusy ? "Redirecting..." : `Upgrade to Pro (${interval})`}
                    </Button>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                <div className="rounded-2xl border border-border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">
                    You&apos;re on the <span className="font-medium text-foreground">Free</span>{" "}
                    plan. Upgrade to unlock analytics, integrations, and priority support.
                  </p>
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                  <Button
                    onClick={handleUpgrade}
                    disabled={isStripeBusy}
                    className="md:flex-1"
                  >
                    <icons.arrowUp className="mr-2 size-4" />
                    {isStripeBusy
                      ? "Redirecting..."
                      : `Upgrade to ${upgradeTargetPlan} (${interval})`}
                  </Button>

                  <Button
                    variant="outline"
                    asChild
                    className="md:flex-1"
                    disabled={isStripeBusy}
                  >
                    <a href="/pricing">
                      <icons.externalLink className="mr-2 size-4" />
                      Compare plans
                    </a>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  You&apos;ll be redirected to Stripe Checkout to complete payment.
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Right column: Pro highlight + features */}
        <div className="space-y-6">
          <Card className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-60">
              <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />
            </div>

            <CardHeader className="relative">
              <CardTitle className="text-xl">Recommended</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Pro is best for teams that want to scale.
              </p>
            </CardHeader>

            <CardContent className="relative space-y-4">
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Pro plan</p>
                  <StatusBadge variant="purple">Pro</StatusBadge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Analytics, integrations, and priority support.
                </p>
              </div>

              <div className="space-y-3">
                {featureSets.PRO.slice(0, 4).map((f) => (
                  <FeatureItem key={f.text} included={f.included} text={f.text} />
                ))}
              </div>

              {!isPaid || currentPlan === "BASIC" ? (
                <Button
                  onClick={handleUpgrade}
                  disabled={isStripeBusy}
                  className="w-full"
                >
                  <icons.star className="mr-2 size-4" />
                  {isStripeBusy ? "Redirecting..." : `Get Pro (${interval})`}
                </Button>
              ) : (
                <Button variant="outline" onClick={handleManageBilling} disabled={isStripeBusy} className="w-full">
                  <icons.settings className="mr-2 size-4" />
                  Manage in portal
                </Button>
              )}

              <p className="text-xs text-muted-foreground">
                Secure payments powered by Stripe.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">What you get</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Features included in your current plan.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {featureSets[currentPlan].map((f) => (
                <FeatureItem key={f.text} included={f.included} text={f.text} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ToggleChip({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center rounded-2xl px-4 py-2 text-sm font-medium transition",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
        disabled && "opacity-60"
      )}
    >
      {children}
    </button>
  );
}

function InfoRow({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border p-4">
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="ml-4 shrink-0">{right}</div>
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
        className={included ? "text-foreground" : "text-muted-foreground line-through"}
      >
        {text}
      </span>
    </div>
  );
}
