"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { product } from "@/config/product";

export function PricingSection() {
  return (
    <section id="pricing" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            Simple, one-time pricing
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Pay once, own forever. Lifetime access to the full source code and future updates.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                {product.name}
              </h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {product.description}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  ${product.price}
                </span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">one-time</span>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-800">
            <h4 className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              What&apos;s included
            </h4>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 sm:w-auto dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              Get King Template
              <ArrowRight className="size-4" />
            </Link>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              30-day money-back guarantee. Instant GitHub access after purchase.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
