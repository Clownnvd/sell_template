"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { DotPattern } from "@/components/ui/dot-pattern";

const highlights = [
  "Authentication & OAuth",
  "Stripe Payments",
  "Dashboard & Admin",
  "i18n Ready",
];

const avatars = [
  { initials: "MT", color: "bg-red-600" },
  { initials: "SC", color: "bg-amber-600" },
  { initials: "AK", color: "bg-emerald-600" },
  { initials: "JD", color: "bg-blue-600" },
  { initials: "LP", color: "bg-purple-600" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <DotPattern
        className="text-primary/15 dark:text-primary/10 mask-[radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"
        width={20}
        height={20}
        cr={1.2}
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary animate-slide-down"
        >
          <span className="size-1.5 rounded-full bg-primary animate-pulse-soft" />
          Next.js 16 SaaS Starter Kit
        </div>

        <h1
          className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl animate-slide-up"
          style={{ animationDelay: "0.1s", animationFillMode: "both" }}
        >
          Ship your SaaS
          <br />
          <span className="text-gradient">
            in days, not months
          </span>
        </h1>

        <p
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground animate-slide-up"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          King Template gives you everything you need to launch your next product.
          Authentication, payments, dashboard, emails — all production-ready and beautifully designed.
        </p>

        <div
          className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up"
          style={{ animationDelay: "0.3s", animationFillMode: "both" }}
        >
          <Link
            href="/sign-up"
            className="shine-effect inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:shadow-lg"
          >
            Buy Now — $99
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/#features"
            className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-primary/5"
          >
            See what&apos;s included
          </Link>
        </div>

        {/* Social proof */}
        <div
          className="mt-8 flex flex-col items-center gap-3 animate-fade-in"
          style={{ animationDelay: "0.5s", animationFillMode: "both" }}
        >
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {avatars.map((a) => (
                <div
                  key={a.initials}
                  className={`flex size-8 items-center justify-center rounded-full border-2 border-background text-xs font-medium text-white ${a.color}`}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <span className="ml-3 text-sm text-muted-foreground">
              Trusted by <span className="font-semibold text-foreground">100+</span> developers
            </span>
          </div>
        </div>

        <div
          className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 animate-fade-in"
          style={{ animationDelay: "0.6s", animationFillMode: "both" }}
        >
          {highlights.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="size-4 text-primary" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
