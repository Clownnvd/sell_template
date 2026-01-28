import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCTASection() {
  return (
    <section className="bg-muted/20">
      <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="rounded-3xl border border-border bg-background p-8 shadow-sm md:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Ready to ship your SaaS?
            </h2>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              Start free, connect Stripe when you&apos;re ready, and scale with
              subscriptions and billing built in.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/sign-up">Get started</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required to start.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

