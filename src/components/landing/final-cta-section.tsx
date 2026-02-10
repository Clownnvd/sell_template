import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { DotPattern } from "@/components/ui/dot-pattern";

export function FinalCTASection() {
  return (
    <section className="px-4 py-20 sm:py-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-primary px-8 py-16 text-center sm:px-16">
          <DotPattern
            className="fill-white/10 mask-[radial-gradient(300px_circle_at_center,white,transparent)]"
            width={20}
            height={20}
          />
          <div className="relative z-10">
            <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="size-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to ship your SaaS?
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Stop building boilerplate. Get King Template and focus on what
              makes your product unique.
            </p>
            <div className="mt-8">
              <Link
                href="/sign-up"
                className="shine-effect inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3.5 text-sm font-medium text-primary shadow-sm transition-shadow hover:shadow-lg"
              >
                Buy King Template — $99
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <p className="mt-4 text-xs text-white/60">
              One-time payment. Lifetime access. 30-day money-back guarantee.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
