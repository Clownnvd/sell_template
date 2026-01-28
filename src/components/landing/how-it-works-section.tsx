const steps = [
  {
    step: "Step 1",
    title: "Clone & configure",
    description:
      "Set your env variables for database, auth, and Stripe. Run migrations and you're ready.",
  },
  {
    step: "Step 2",
    title: "Ship your core feature",
    description:
      "Build your product on top of a clean dashboard, reusable UI, and typed APIs.",
  },
  {
    step: "Step 3",
    title: "Monetize & scale",
    description:
      "Enable subscriptions, manage teams, and iterate fast with a solid foundation.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-muted/20">
      <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            From zero to launch, fast
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            A simple flow that keeps you focused on what matters: shipping value.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-border bg-background p-6 shadow-sm"
            >
              <p className="text-xs font-semibold text-muted-foreground">
                {s.step}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-background p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="text-xl font-semibold">Great defaults</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Opinionated structure and sensible patterns so you don&apos;t waste
                time wiring basics together.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <pre className="overflow-x-auto text-xs leading-relaxed text-muted-foreground">
                <code>{`# run locally
pnpm i
pnpm prisma migrate dev
pnpm dev`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

