import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
          Ready to ship your SaaS?
        </h2>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Stop building boilerplate. Get King Template and focus on what makes your product unique.
        </p>
        <div className="mt-8">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-8 py-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            Buy King Template — $99
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          One-time payment. Lifetime access. 30-day money-back guarantee.
        </p>
      </div>
    </section>
  );
}
