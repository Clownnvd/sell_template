"use client";

import { useTranslations } from "next-intl";
import {
  Shield,
  CreditCard,
  Gauge,
  Code2,
  Lock,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/utils/cn";

type FeatureKey = "auth" | "billing" | "limits" | "dx" | "security" | "growth";

interface FeatureConfig {
  key: FeatureKey;
  icon: LucideIcon;
  color: string;
  iconColor: string;
}

const featuresConfig: FeatureConfig[] = [
  {
    key: "auth",
    icon: Shield,
    color: "from-red-500/20 to-red-600/20",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    key: "billing",
    icon: CreditCard,
    color: "from-amber-500/20 to-yellow-500/20",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    key: "limits",
    icon: Gauge,
    color: "from-red-500/20 to-amber-500/20",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    key: "dx",
    icon: Code2,
    color: "from-zinc-500/20 to-zinc-600/20",
    iconColor: "text-zinc-600 dark:text-zinc-400",
  },
  {
    key: "security",
    icon: Lock,
    color: "from-red-600/20 to-rose-500/20",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    key: "growth",
    icon: Rocket,
    color: "from-amber-500/20 to-red-500/20",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
];

export function FeaturesSection() {
  const t = useTranslations("landing.features");

  return (
    <section id="features" className="relative scroll-mt-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-red-500/5 blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-20 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
            {t("badge")}
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {t("title")}{" "}
            <span className="bg-linear-to-r from-red-600 via-red-500 to-amber-500 bg-clip-text text-transparent dark:from-red-500 dark:to-amber-400">
              {t("titleHighlight")}
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("description")}</p>
        </div>

        <div className="mt-16 grid gap-6 min-[480px]:grid-cols-2 lg:grid-cols-3">
          {featuresConfig.map((f, index) => (
            <div
              key={f.key}
              className={cn(
                "group relative animate-slide-up rounded-2xl border border-border/50 bg-card/50 p-5 shadow-card backdrop-blur-sm transition-all duration-300 hover:border-red-500/20 hover:shadow-elevated sm:p-6",
                index === 0 && "lg:col-span-2"
              )}
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
            >
              <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${f.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
              <div className="relative">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${f.color} ${f.iconColor}`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{t(`items.${f.key}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`items.${f.key}.description`)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            {t("bottomCta")}{" "}
            <a href="/docs" className="font-medium text-red-600 hover:underline dark:text-red-400">{t("documentation")}</a>{" "}
            {t("bottomCtaEnd")}
          </p>
        </div>
      </div>
    </section>
  );
}
