"use client";

import { useState } from "react";
import { PricingCard, PricingGrid, type PricingPlan } from "@/components/shared/pricing-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { useSubscription } from "@/hooks/use-subscription";

const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      { text: "1 Project", included: true },
      { text: "Up to 3 team members", included: true },
      { text: "Basic features", included: true },
      { text: "Community support", included: true },
      { text: "Advanced analytics", included: false },
      { text: "Priority support", included: false },
      { text: "Custom integrations", included: false },
    ],
    cta: {
      text: "Get Started",
      href: "/sign-up",
    },
  },
  {
    name: "Basic",
    description: "Essential features for small teams",
    price: {
      monthly: 29,
      yearly: 290,
    },
    features: [
      { text: "3 Projects", included: true },
      { text: "Up to 10 team members", included: true },
      { text: "All basic features", included: true },
      { text: "Email support", included: true },
      { text: "Basic analytics", included: true },
      { text: "Advanced integrations", included: false },
      { text: "Custom development", included: false },
    ],
    cta: {
      text: "Upgrade to Basic",
      onClick: () => {},
    },
    priceIds: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC_MONTHLY || "",
      yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC_YEARLY || "",
    },
  },
  {
    name: "Pro",
    description: "Advanced features for growing businesses",
    price: {
      monthly: 99,
      yearly: 990,
    },
    features: [
      { text: "Unlimited projects", included: true },
      { text: "Up to 50 team members", included: true },
      { text: "All advanced features", included: true },
      { text: "Priority support", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Custom integrations", included: true },
      { text: "SLA guarantees", included: false },
    ],
    popular: true,
    cta: {
      text: "Upgrade to Pro",
      onClick: () => {},
    },
    priceIds: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY || "",
      yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY || "",
    },
  },
  {
    name: "Enterprise",
    description: "Custom solutions for large teams",
    price: {
      monthly: 299,
      yearly: 2990,
    },
    features: [
      { text: "Unlimited everything", included: true },
      { text: "Dedicated support", included: true },
      { text: "Custom development", included: true },
      { text: "SLA guarantees", included: true },
      { text: "Advanced security", included: true },
      { text: "On-premise deployment", included: true },
      { text: "Custom contracts", included: true },
    ],
    cta: {
      text: "Contact Sales",
      href: "/contact",
    },
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { createCheckout } = useSubscription();

  const handleUpgrade = (plan: PricingPlan) => {
    if (!plan.priceIds) return;

    const priceId =
      billingCycle === "monthly"
        ? plan.priceIds.monthly
        : plan.priceIds.yearly;

    if (priceId) {
      createCheckout(priceId);
    }
  };

  // Update CTA onClick handlers with checkout logic
  const plansWithCheckout = pricingPlans.map((plan) => ({
    ...plan,
    cta: {
      ...plan.cta,
      onClick: plan.priceIds ? () => handleUpgrade(plan) : plan.cta.onClick,
    },
  }));

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold">Simple, transparent pricing</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Choose the plan that&apos;s right for you
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
              Monthly
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
              Yearly
              <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <PricingGrid>
          {plansWithCheckout.map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              billingCycle={billingCycle}
            />
          ))}
        </PricingGrid>

        {/* FAQ Section */}
        <div className="mt-24">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto max-w-3xl space-y-6">
            <FAQItem
              question="Can I change my plan later?"
              answer="Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards (Visa, MasterCard, American Express) and support billing through Stripe."
            />
            <FAQItem
              question="Is there a free trial?"
              answer="The Free plan is available indefinitely. For paid plans, we offer a 14-day money-back guarantee."
            />
            <FAQItem
              question="Can I cancel anytime?"
              answer="Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
            />
            <FAQItem
              question="Do you offer discounts for non-profits?"
              answer="Yes! We offer special pricing for non-profits and educational institutions. Contact our sales team for details."
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="rounded-2xl border border-border bg-linear-to-br from-primary/5 to-purple-500/5 p-12">
            <h2 className="text-3xl font-bold">Still have questions?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our team is here to help you find the perfect plan
            </p>
            <Button size="lg" className="mt-6" asChild>
              <a href="/contact">Contact Sales</a>
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
