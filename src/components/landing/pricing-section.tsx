"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { product } from "@/config/product";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

type Currency = "usd" | "vnd";

function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount);
}

export function PricingSection() {
  const [currency, setCurrency] = useState<Currency>("usd");

  return (
    <section id="pricing" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Simple, one-time pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Pay once, own forever. Lifetime access to the full source code and future updates.
            </p>

            {/* Currency toggle */}
            <div className="mt-6 inline-flex items-center rounded-full border border-border bg-muted/50 p-1">
              <button
                onClick={() => setCurrency("usd")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  currency === "usd"
                    ? "bg-gradient-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency("vnd")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  currency === "vnd"
                    ? "bg-gradient-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                VND (VietQR)
              </button>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="border-gradient mt-12 rounded-2xl bg-card p-8 shadow-elevated sm:p-10 animate-pulse-glow">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
              <div className="flex-1">
                <div className="mb-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Lifetime Access
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {product.description}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                {currency === "usd" ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold tracking-tight text-gradient">
                      ${product.price}
                    </span>
                    <span className="text-sm text-muted-foreground">one-time</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-gradient">
                      {formatVND(product.priceVND)}
                    </span>
                    <span className="text-sm text-muted-foreground">VND</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 border-t border-border pt-8">
              <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                What&apos;s included
              </h4>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-sm text-card-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              {currency === "usd" ? (
                <Link
                  href="/sign-up"
                  className="shine-effect inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-primary px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:shadow-lg sm:w-auto"
                >
                  Get King Template — ${product.price}
                  <ArrowRight className="size-4" />
                </Link>
              ) : (
                <Link
                  href="/sign-up"
                  className="shine-effect inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-primary px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:shadow-lg sm:w-auto"
                >
                  Mua ngay — {formatVND(product.priceVND)} VND
                  <ArrowRight className="size-4" />
                </Link>
              )}
              <p className="text-xs text-muted-foreground">
                {currency === "usd"
                  ? "30-day money-back guarantee. Instant GitHub access after purchase."
                  : "Chuyển khoản qua VietQR. Nhận quyền truy cập GitHub ngay sau khi thanh toán."}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
