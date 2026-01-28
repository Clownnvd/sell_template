import Link from "next/link";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    note: "For getting started",
    features: ["1 project", "Up to 3 members", "Community support"],
  },
  {
    name: "Basic",
    price: "$29",
    note: "Per month",
    highlight: true,
    features: ["3 projects", "Up to 10 members", "Email support"],
  },
  {
    name: "Pro",
    price: "$99",
    note: "Per month",
    features: ["Unlimited projects", "Up to 50 members", "Priority support"],
  },
];

export function PricingTeaserSection() {
  return (
    <section id="pricing" className="scroll-mt-24 bg-muted/20">
      <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Simple pricing
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Start free. Upgrade when you’re ready. Cancel anytime.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={[
                "rounded-2xl border bg-background p-6 shadow-sm",
                p.highlight ? "border-primary" : "border-border",
              ].join(" ")}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-base font-semibold">{p.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {p.note}
                  </div>
                </div>
                {p.highlight ? (
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Most popular
                  </span>
                ) : null}
              </div>

              <div className="mt-6 flex items-end gap-2">
                <div className="text-3xl font-bold">{p.price}</div>
                <div className="pb-1 text-sm text-muted-foreground">USD</div>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                {p.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  asChild
                  className="w-full"
                  variant={p.highlight ? "default" : "outline"}
                >
                  <Link href="/pricing">View details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Need an Enterprise plan?{" "}
          <a href="/contact" className="text-foreground underline underline-offset-4">
            Talk to sales
          </a>
          .
        </div>
      </div>
    </section>
  );
}
