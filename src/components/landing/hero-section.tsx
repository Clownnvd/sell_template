import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
              Next.js 16 • Prisma • BetterAuth • Stripe
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Build your SaaS faster — without the boring setup
            </h1>

            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              A production-ready starter with authentication and billing,
              with a clean dashboard. Ship in days, not weeks.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg">
                <Link href="/sign-up">Start free</Link>
              </Button>

              <Button asChild size="lg" variant="outline">
                <Link href="/pricing">See pricing</Link>
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span>✓ Email login & magic links</span>
              <span>✓ Stripe subscriptions</span>
              <span>✓ Usage limits</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-border bg-card shadow-sm">
              <div className="border-b border-border px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Dashboard preview</div>
                  <div className="text-xs text-muted-foreground">
                    Real components • Tailwind
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="grid gap-4">
                  <div className="rounded-xl border border-border bg-muted/40 p-4">
                    <div className="text-xs text-muted-foreground">
                      Monthly revenue
                    </div>
                    <div className="mt-2 text-2xl font-semibold">$12,480</div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      +18% vs last month
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-border bg-muted/40 p-4">
                      <div className="text-xs text-muted-foreground">
                        Active users
                      </div>
                      <div className="mt-2 text-xl font-semibold">2,341</div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        7d retention: 42%
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-muted/40 p-4">
                      <div className="text-xs text-muted-foreground">
                        Conversion
                      </div>
                      <div className="mt-2 text-xl font-semibold">3.8%</div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Checkout optimized
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/40 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Integrations</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Connect tools and automate workflows
                        </div>
                      </div>
                      <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs">
                        Connect
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {["Slack", "GitHub", "Notion"].map((label) => (
                        <div
                          key={label}
                          className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
                        >
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* subtle background blob */}
            <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-muted/40 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
