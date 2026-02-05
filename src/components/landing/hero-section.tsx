"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Sparkles, Zap, Shield, ArrowRight, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  const t = useTranslations("landing.hero");

  return (
    <section className="relative overflow-hidden">
      {/* Background decorations - Ferrari red glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-red-600/15 blur-[100px] dark:bg-red-600/10" />
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-amber-500/10 blur-[100px] dark:bg-amber-500/5" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-red-500/10 blur-[100px] dark:bg-red-500/5" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 hidden opacity-[0.015] dark:opacity-[0.03] md:block"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-24 md:py-40">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <div className="animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
              <Sparkles className="h-4 w-4" />
              <span>{t("badge")}</span>
            </div>

            {/* Heading */}
            <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {t("title")}{" "}
              <span className="animate-gradient bg-linear-to-r from-red-600 via-red-500 to-amber-500 bg-clip-text text-transparent dark:from-red-500 dark:via-red-400 dark:to-amber-400">
                {t("titleHighlight")}
              </span>{" "}
              {t("titleEnd")}
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              {t("description")}
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="xl" className="group shine-effect bg-red-600 shadow-md hover:bg-red-700 hover:shadow-ferrari dark:bg-red-600 dark:hover:bg-red-700">
                <Link href="/sign-up">
                  {t("cta")}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button asChild size="xl" variant="outline" className="border-border hover:border-red-500/30 hover:bg-red-500/5">
                <Link href="/pricing">
                  <Play className="mr-2 h-4 w-4" />
                  {t("ctaSecondary")}
                </Link>
              </Button>
            </div>

            {/* Feature highlights */}
            <div className="mt-10 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{t("features.secureAuth")}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                  <Zap className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{t("features.stripeBilling")}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{t("features.readyToDeploy")}</span>
              </div>
            </div>
          </div>

          {/* Right - Dashboard Preview */}
          <div className="relative animate-slide-up lg:animate-fade-in">
            {/* Glow effect behind card */}
            <div className="absolute -inset-4 rounded-3xl bg-linear-to-r from-red-600/20 via-red-500/10 to-amber-500/15 opacity-50 blur-2xl dark:opacity-30" />

            {/* Main card */}
            <div className="relative rounded-2xl border border-border/50 bg-card/80 shadow-dramatic backdrop-blur-sm dark:bg-card/50">
              {/* Header bar */}
              <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="text-sm font-medium text-muted-foreground">{t("preview.title")}</div>
                <div className="flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  {t("preview.live")}
                </div>
              </div>

              <div className="p-6">
                {/* Stats row */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-border/50 bg-linear-to-br from-red-500/5 to-red-500/10 p-4 dark:from-red-500/10 dark:to-red-500/5">
                    <div className="text-xs font-medium text-muted-foreground">{t("preview.monthlyRevenue")}</div>
                    <div className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">$12,480</div>
                    <div className="mt-1 text-xs text-green-600 dark:text-green-400">{t("preview.vsLastMonth")}</div>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-linear-to-br from-amber-500/5 to-amber-500/10 p-4 dark:from-amber-500/10 dark:to-amber-500/5">
                    <div className="text-xs font-medium text-muted-foreground">{t("preview.activeUsers")}</div>
                    <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">2,341</div>
                    <div className="mt-1 text-xs text-green-600 dark:text-green-400">{t("preview.thisWeek")}</div>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-linear-to-br from-red-500/5 to-amber-500/10 p-4 dark:from-red-500/10 dark:to-amber-500/5">
                    <div className="text-xs font-medium text-muted-foreground">{t("preview.conversion")}</div>
                    <div className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">3.8%</div>
                    <div className="mt-1 text-xs text-muted-foreground">{t("preview.industryAvg")}</div>
                  </div>
                </div>

                {/* Chart */}
                <div className="mt-4 rounded-xl border border-border/50 bg-muted/30 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium">{t("preview.revenueOverview")}</span>
                    <span className="rounded-full bg-red-500/10 px-2 py-1 text-xs text-red-600 dark:text-red-400">{t("preview.last7Days")}</span>
                  </div>
                  <div className="flex h-24 items-end justify-between gap-2">
                    {[40, 65, 45, 80, 55, 90, 75].map((height, i) => (
                      <div
                        key={i}
                        className="w-full rounded-t-md bg-linear-to-t from-red-600/40 to-red-500 transition-all hover:from-red-600/60 hover:to-red-500"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>{t("days.mon")}</span>
                    <span>{t("days.tue")}</span>
                    <span>{t("days.wed")}</span>
                    <span>{t("days.thu")}</span>
                    <span>{t("days.fri")}</span>
                    <span>{t("days.sat")}</span>
                    <span>{t("days.sun")}</span>
                  </div>
                </div>

                {/* Integrations */}
                <div className="mt-4 rounded-xl border border-border/50 bg-muted/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{t("preview.integrations")}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{t("preview.connectTools")}</div>
                    </div>
                    <Button size="sm" variant="outline" className="h-8 border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5">
                      {t("preview.connect")}
                    </Button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Slack", "GitHub", "Notion", "Figma"].map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-red-500/30 hover:text-foreground"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -right-4 top-20 hidden animate-float rounded-xl border border-red-200/50 bg-card p-3 shadow-elevated lg:block dark:border-red-500/20 dark:bg-card/80">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                  <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-medium">{t("preview.paymentReceived")}</div>
                  <div className="text-xs text-muted-foreground">$99.00</div>
                </div>
              </div>
            </div>

            <div className="absolute -left-4 bottom-20 hidden animate-float rounded-xl border border-border/50 bg-card p-3 shadow-elevated lg:block dark:bg-card/80" style={{ animationDelay: "1.5s" }}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20">
                  <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-medium">{t("preview.newSignup")}</div>
                  <div className="text-xs text-muted-foreground">john@example.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
