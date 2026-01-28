const testimonials = [
  {
    name: "Minh Tran",
    role: "Indie maker",
    quote:
      "I shipped billing + auth in a weekend. The structure is clean and easy to extend.",
  },
  {
    name: "Linh Nguyen",
    role: "Product engineer",
    quote:
      "The team model saved us days of architecture decisions. Great defaults.",
  },
  {
    name: "Huy Pham",
    role: "Founder",
    quote:
      "Stripe integration was straightforward. Webhooks + portal were already wired.",
  },
];

export function TestimonialsSection() {
  return (
    <section>
      <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Loved by builders
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Short feedback from people who just want to ship.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                “{t.quote}”
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold">
                  {t.name
                    .split(" ")
                    .slice(0, 2)
                    .map((p) => p[0])
                    .join("")}
                </div>

                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

