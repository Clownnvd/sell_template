const features = [
  {
    title: "Authentication that just works",
    description:
      "Email/password, magic links, sessions, and secure defaults via BetterAuth.",
  },
  {
    title: "Stripe subscriptions built-in",
    description:
      "Checkout, customer portal, webhooks, and plan gating for SaaS pricing tiers.",
  },
  {
    title: "Usage limits",
    description:
      "Enforce plan limits and feature access with simple helpers.",
  },
  {
    title: "Production-grade DX",
    description:
      "Typed routes, strict TypeScript, clean folder structure, and reusable UI primitives.",
  },
  {
    title: "Secure by default",
    description:
      "Server-first patterns, protected routes, and sensible middleware configuration.",
  },
  {
    title: "Ready for growth",
    description:
      "Add features fast with composable components and scalable data modeling.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24">
      <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need for a real SaaS
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Start with a strong foundation: auth, billing, teams, and a clean UI
            system — already wired together.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
