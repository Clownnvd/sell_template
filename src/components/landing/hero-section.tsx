"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const highlights = [
  "Authentication & OAuth",
  "Stripe Payments",
  "Dashboard & Admin",
  "i18n Ready",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Next.js 16 SaaS Starter Kit
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl dark:text-white">
          Ship your SaaS
          <br />
          <span className="bg-linear-to-r from-zinc-900 via-zinc-700 to-zinc-500 bg-clip-text text-transparent dark:from-white dark:via-zinc-300 dark:to-zinc-500">
            in days, not months
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          King Template gives you everything you need to launch your next product.
          Authentication, payments, dashboard, emails — all production-ready and beautifully designed.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            Buy Now — $99
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/#features"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            See what&apos;s included
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {highlights.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <Check className="size-4 text-emerald-500" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
