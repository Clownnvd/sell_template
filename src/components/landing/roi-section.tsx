"use client";

import { Check, X, Clock, DollarSign } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const COMPARISON_ROWS = [
  { feature: "Authentication (email, OAuth, sessions)", diyHours: "40-60h", diyLabel: "$3,000-5,000" },
  { feature: "Stripe Payments + Webhooks", diyHours: "30-50h", diyLabel: "$2,500-4,000" },
  { feature: "Dashboard + Sidebar Layout", diyHours: "20-30h", diyLabel: "$1,500-2,500" },
  { feature: "Email System (Resend + React Email)", diyHours: "15-25h", diyLabel: "$1,200-2,000" },
  { feature: "i18n (EN/VI) with next-intl", diyHours: "15-20h", diyLabel: "$1,000-1,500" },
  { feature: "Security (CSP, CSRF, Rate Limiting)", diyHours: "20-30h", diyLabel: "$1,500-2,500" },
  { feature: "Dark Mode + Design System", diyHours: "15-25h", diyLabel: "$1,200-2,000" },
  { feature: "Database + Prisma ORM Setup", diyHours: "10-15h", diyLabel: "$800-1,200" },
];

const TOTAL_DIY = { hours: "165-255h", cost: "$12,700-20,700" };

export function ROISection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Build from scratch or{" "}
              <span className="text-gradient">save months</span>?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The math is simple. King Template pays for itself in the first hour.
            </p>
          </div>
        </ScrollReveal>

        {/* Comparison table */}
        <ScrollReveal delay={200}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
            {/* Header */}
            <div className="grid grid-cols-3 border-b border-border">
              <div className="p-4 sm:p-5">
                <span className="text-sm font-medium text-muted-foreground">
                  Feature
                </span>
              </div>
              <div className="border-l border-border p-4 text-center sm:p-5">
                <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <Clock className="size-3.5" />
                  Build Yourself
                </div>
              </div>
              <div className="border-l border-border bg-gradient-primary p-4 text-center sm:p-5">
                <span className="text-sm font-bold text-white">
                  King Template
                </span>
              </div>
            </div>

            {/* Rows */}
            {COMPARISON_ROWS.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 ${
                  i < COMPARISON_ROWS.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center p-4 sm:p-5">
                  <span className="text-sm text-foreground">{row.feature}</span>
                </div>
                <div className="flex flex-col items-center justify-center border-l border-border p-4 sm:p-5">
                  <span className="text-sm font-medium text-muted-foreground">
                    {row.diyHours}
                  </span>
                  <span className="mt-0.5 text-xs text-muted-foreground/60">
                    {row.diyLabel}
                  </span>
                </div>
                <div className="flex items-center justify-center border-l border-border bg-primary/5 p-4 sm:p-5">
                  <Check className="size-5 text-primary" />
                </div>
              </div>
            ))}

            {/* Total row */}
            <div className="grid grid-cols-3 border-t-2 border-border bg-muted/30">
              <div className="flex items-center p-4 sm:p-5">
                <span className="text-sm font-bold text-foreground">Total</span>
              </div>
              <div className="flex flex-col items-center justify-center border-l border-border p-4 sm:p-5">
                <div className="flex items-center gap-1 text-sm font-bold text-destructive">
                  <X className="size-3.5" />
                  {TOTAL_DIY.hours}
                </div>
                <span className="mt-0.5 text-xs font-medium text-destructive/70">
                  {TOTAL_DIY.cost}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center border-l border-border bg-primary/5 p-4 sm:p-5">
                <div className="flex items-center gap-1">
                  <DollarSign className="size-4 text-primary" />
                  <span className="text-2xl font-bold text-gradient">99</span>
                </div>
                <span className="mt-0.5 text-xs font-medium text-primary">
                  One-time payment
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Bottom stat */}
        <ScrollReveal delay={400}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-gradient">99%</div>
              <p className="mt-1 text-xs text-muted-foreground">Cost savings</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="text-2xl font-bold text-gradient">200+</div>
              <p className="mt-1 text-xs text-muted-foreground">Hours saved</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="text-2xl font-bold text-gradient">Day 1</div>
              <p className="mt-1 text-xs text-muted-foreground">Ship-ready</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
