"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Sparkles, Shield, Zap, BarChart3 } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function AuthCard({ title, description, children }: Props) {
  return (
    <main className="flex min-h-screen">
      {/* Left side - Branding/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between animate-gradient bg-linear-to-br from-red-700 via-red-600 to-amber-600 p-12 text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="absolute right-1/4 top-1/2 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <span className="text-lg font-bold">K</span>
            </div>
            <span className="text-xl font-semibold">King Template</span>
          </Link>
        </div>

        {/* Main content */}
        <div className="relative space-y-8">
          <div>
            <h2 className="text-3xl font-bold leading-tight xl:text-4xl">
              Build your SaaS faster with everything you need
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Authentication, payments, and dashboard — all ready to go.
            </p>
          </div>

          {/* Features */}
          <div className="grid gap-4">
            <div className="animate-slide-in-left" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
              <FeatureItem
                icon={<Shield className="h-5 w-5" />}
                title="Secure Authentication"
                description="Email, password & magic links with BetterAuth"
              />
            </div>
            <div className="animate-slide-in-left" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
              <FeatureItem
                icon={<Zap className="h-5 w-5" />}
                title="Stripe Integration"
                description="Subscriptions, webhooks & customer portal"
              />
            </div>
            <div className="animate-slide-in-left" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
              <FeatureItem
                icon={<BarChart3 className="h-5 w-5" />}
                title="Analytics Ready"
                description="Beautiful dashboard with real-time stats"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative">
          <div className="flex animate-float items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">Ready to launch?</p>
              <p className="text-sm text-white/70">Ship your product in days, not weeks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full flex-col lg:w-1/2">
        {/* Mobile brand banner */}
        <div className="relative overflow-hidden bg-linear-to-br from-red-700 via-red-600 to-amber-600 px-6 pb-8 pt-12 text-white lg:hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />
          </div>
          <div className="relative">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <span className="text-lg font-bold">K</span>
              </div>
              <span className="text-xl font-semibold">King Template</span>
            </Link>
            <p className="mt-3 text-sm text-white/70">Ship your SaaS faster with everything you need</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-12 xl:px-24">
          <div className="mx-auto w-full max-w-md">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>

            <div className="mt-8 space-y-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
        {icon}
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-white/70">{description}</p>
      </div>
    </div>
  );
}
