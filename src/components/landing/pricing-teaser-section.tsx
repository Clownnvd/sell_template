"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type PlanKey = "free" | "basic" | "pro";

interface PlanConfig {
  key: PlanKey;
  featureCount: number;
  highlight?: boolean;
}

const plansConfig: PlanConfig[] = [
  { key: "free", featureCount: 3 },
  { key: "basic", featureCount: 3, highlight: true },
  { key: "pro", featureCount: 3 },
];

export function PricingTeaserSection() {
  const t = useTranslations("landing.pricingTeaser");

  return (
    <section id="pricing" className="relative scroll-mt-24 overflow-hidden bg-muted/10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-red-500/5 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-amber-500/5 blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-20 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
            {t("badge")}
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{t("title")}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("description")}</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plansConfig.map((plan) => (
            <div
              key={plan.key}
              className={cn(
                "relative rounded-2xl border bg-card p-6 shadow-card transition-shadow duration-300 hover:shadow-elevated sm:p-8",
                plan.highlight
                  ? "border-red-500/40 ring-1 ring-red-500/20"
                  : "border-border/50"
              )}
            >
              {plan.highlight ? (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-red-600 to-red-500 px-4 py-1.5 text-xs font-semibold text-white shadow-md">
                    <Sparkles className="h-3.5 w-3.5" />
                    {t(`plans.${plan.key}.badge`)}
                  </span>
                </div>
              ) : null}

              <div className={cn(plan.highlight && "pt-2")}>
                <div className="text-base font-semibold">{t(`plans.${plan.key}.name`)}</div>
                <div className="mt-1 text-sm text-muted-foreground">{t(`plans.${plan.key}.note`)}</div>
              </div>

              <div className="mt-6 flex items-end gap-1.5">
                <div className="text-4xl font-bold">{t(`plans.${plan.key}.price`)}</div>
                <div className="pb-1 text-sm text-muted-foreground">USD</div>
              </div>

              <ul className="mt-6 space-y-3">
                {Array.from({ length: plan.featureCount }, (_, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                      plan.highlight
                        ? "bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                        : "bg-primary/10 text-primary"
                    )}>
                      <Check className="h-3 w-3" />
                    </div>
                    {t(`plans.${plan.key}.features.${i}`)}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  asChild
                  className={cn(
                    "w-full",
                    plan.highlight && "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                  )}
                  variant={plan.highlight ? "default" : "outline"}
                >
                  <Link href="/pricing">{t("viewDetails")}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-muted-foreground">
          {t("enterprise")}{" "}
          <a href="/contact" className="font-medium text-red-600 hover:underline dark:text-red-400">{t("talkToSales")}</a>
        </div>
      </div>
    </section>
  );
}
