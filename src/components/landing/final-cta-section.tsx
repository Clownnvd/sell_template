import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Check } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="relative overflow-hidden">
      {/* Dark gradient background - Ferrari style */}
      <div className="absolute inset-0 animate-gradient bg-linear-to-br from-red-700 via-red-600 to-amber-600" />

      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-400/15 blur-3xl" />

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container relative mx-auto max-w-7xl px-4 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Start building today
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Ready to ship your{" "}
            <span className="text-amber-300">SaaS</span>?
          </h2>

          <p className="mt-6 text-lg text-white/80 md:text-xl">
            Start free, connect Stripe when you&apos;re ready, and scale with
            subscriptions and billing built in. No complex setup required.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {["No credit card required", "Free tier available", "Cancel anytime"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-white/90">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-3 w-3" />
                </div>
                {item}
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="2xl"
              className="group w-full bg-white font-semibold text-red-700 shadow-lg hover:bg-white/90 hover:shadow-xl sm:w-auto"
            >
              <Link href="/sign-up">
                Get started free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="2xl"
              variant="outline"
              className="w-full border-white/30 bg-white/10 font-semibold text-white backdrop-blur-sm hover:bg-white/20 hover:text-white sm:w-auto"
            >
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-sm text-white/60">Trusted by developers worldwide</p>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-2">
                {["MT", "LN", "HP", "AL", "DK"].map((initials, i) => (
                  <div
                    key={initials}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-red-600 bg-white text-xs font-bold text-red-700 ring-2 ring-amber-400/30"
                    style={{ zIndex: 5 - i }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="font-semibold">500+ developers</div>
                <div className="text-sm text-white/60">already building</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
