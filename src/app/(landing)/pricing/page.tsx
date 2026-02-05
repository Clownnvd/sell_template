"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Check, Loader2, Crown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import { cn } from "@/utils/cn";
import { plans, type PlanKey } from "@/config/plans";

interface UserSubscription {
  plan: PlanKey;
  status: string;
}

const PLAN_ORDER: PlanKey[] = ["FREE", "BASIC", "PRO"];

export default function PricingPage() {
  const t = useTranslations("landing.pricing");
  const tFaq = useTranslations("landing.faq.items");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const { createCheckout, isLoading: isCheckoutLoading } = useSubscription();

  // Fetch user subscription on mount
  useEffect(() => {
    async function fetchUserSubscription() {
      try {
        const response = await fetch("/api/user/subscription");
        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            setUserSubscription(data.data);
          }
        }
      } catch {
        // User not logged in or error - that's fine
      }
    }
    fetchUserSubscription();
  }, []);

  const isLoggedIn = userSubscription !== null;
  const currentPlan = userSubscription?.plan || "FREE";

  const handleUpgrade = async (planKey: PlanKey) => {
    const plan = plans[planKey];
    const priceId = billingCycle === "monthly"
      ? plan.stripePriceId.monthly
      : plan.stripePriceId.yearly;

    if (!priceId) {
      return;
    }

    try {
      await createCheckout(
        priceId,
        "/dashboard/billing?success=true",
        "/pricing?canceled=true"
      );
    } catch {
      // Error handled by useSubscription hook
    }
  };

  const getPlanIndex = (planKey: PlanKey) => PLAN_ORDER.indexOf(planKey);

  const getCtaConfig = (planKey: PlanKey) => {
    const plan = plans[planKey];
    const currentIndex = getPlanIndex(currentPlan);
    const targetIndex = getPlanIndex(planKey);

    // Not logged in
    if (!isLoggedIn) {
      if (planKey === "FREE") {
        return { text: t("getStarted"), href: "/sign-up", variant: "outline" as const };
      }
      return { text: t("getStarted"), href: "/sign-up", variant: "default" as const };
    }

    // Current plan
    if (planKey === currentPlan) {
      return { text: t("currentPlan"), disabled: true, variant: "outline" as const };
    }

    // Downgrade (lower plan)
    if (targetIndex < currentIndex) {
      return { text: t("manage"), href: "/dashboard/billing", variant: "outline" as const };
    }

    // Upgrade
    return {
      text: t("upgradeTo", { plan: plan.name }),
      onClick: () => handleUpgrade(planKey),
      variant: "default" as const,
    };
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            {t("title")}{" "}
            <span className="bg-linear-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>{" "}
            {t("titleEnd")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("description")}
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-border bg-muted/50 p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "rounded-full px-6 py-2 text-sm font-medium transition-colors",
                billingCycle === "monthly"
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t("monthly")}
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={cn(
                "rounded-full px-6 py-2 text-sm font-medium transition-colors",
                billingCycle === "yearly"
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t("yearly")}
              <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {t("yearlyDiscount")}
              </span>
            </button>
          </div>

        </div>

        {/* Pricing Cards - 3 columns */}
        <div className="grid gap-6 md:grid-cols-3">
          {PLAN_ORDER.map((planKey) => {
            const plan = plans[planKey];
            const isCurrentPlan = isLoggedIn && planKey === currentPlan;
            const isPro = planKey === "PRO";
            const cta = getCtaConfig(planKey);
            const price = billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly;
            const period = billingCycle === "monthly" ? t("perMonth") : t("perYear");

            return (
              <div
                key={planKey}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-card p-6 transition-all",
                  isPro && "border-primary shadow-lg shadow-primary/10",
                  isCurrentPlan && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}
              >
                {/* Popular badge */}
                {isPro && !isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                      {t("mostPopular")}
                    </span>
                  </div>
                )}

                {/* Current plan badge */}
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-4 py-1 text-xs font-medium text-white">
                      <Crown className="h-3 w-3" />
                      {t("currentPlan")}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold">${price}</span>
                  <span className="text-muted-foreground">{period}</span>
                </div>

                {/* CTA Button */}
                <div className="mb-6">
                  {cta.href ? (
                    <Button
                      variant={cta.variant}
                      className="w-full"
                      asChild
                      disabled={cta.disabled}
                    >
                      <Link href={cta.href}>{cta.text}</Link>
                    </Button>
                  ) : (
                    <Button
                      variant={cta.variant}
                      className="w-full"
                      onClick={cta.onClick}
                      disabled={cta.disabled || isCheckoutLoading}
                    >
                      {isCheckoutLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("redirecting")}
                        </>
                      ) : (
                        cta.text
                      )}
                    </Button>
                  )}
                </div>

                {/* Features */}
                <div className="flex-1 space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <h2 className="mb-8 text-center text-3xl font-bold">
            {t("faqTitle")}
          </h2>
          <div className="mx-auto max-w-3xl space-y-6">
            <FAQItem
              question={tFaq("changePlan.q")}
              answer={tFaq("changePlan.a")}
            />
            <FAQItem
              question={tFaq("paymentMethods.q")}
              answer={tFaq("paymentMethods.a")}
            />
            <FAQItem
              question={tFaq("refunds.q")}
              answer={tFaq("refunds.a")}
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="rounded-2xl border border-border bg-linear-to-br from-primary/5 to-purple-500/5 p-12">
            <h2 className="text-3xl font-bold">{t("stillHaveQuestions")}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("helpFindPlan")}
            </p>
            <Button size="lg" className="mt-6" asChild>
              <Link href="/contact">{t("contactUs")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="font-semibold">{question}</h3>
      <p className="mt-2 text-muted-foreground">{answer}</p>
    </div>
  );
}
