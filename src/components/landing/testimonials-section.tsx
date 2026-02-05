import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Minh Tran",
    role: "Indie Maker",
    company: "@minhtran_dev",
    quote: "I shipped billing + auth in a weekend. The structure is clean and easy to extend. Best template I've used.",
    rating: 5,
    avatar: "MT",
    gradient: "from-red-500 to-red-600",
  },
  {
    name: "Linh Nguyen",
    role: "Product Engineer",
    company: "TechStartup Inc.",
    quote: "The team model saved us days of architecture decisions. Great defaults and production-ready code.",
    rating: 5,
    avatar: "LN",
    gradient: "from-red-600 to-amber-500",
  },
  {
    name: "Huy Pham",
    role: "Founder & CEO",
    company: "SaaS Labs",
    quote: "Stripe integration was straightforward. Webhooks + portal were already wired. Saved us weeks of work.",
    rating: 5,
    avatar: "HP",
    gradient: "from-amber-500 to-amber-400",
  },
  {
    name: "Anna Lee",
    role: "Full Stack Developer",
    company: "DevAgency",
    quote: "Clean code, TypeScript everywhere, great DX. This is how templates should be built.",
    rating: 5,
    avatar: "AL",
    gradient: "from-red-500 to-rose-500",
  },
  {
    name: "David Kim",
    role: "Solo Founder",
    company: "@davidkim",
    quote: "From clone to production in 3 days. The dashboard components are beautiful and responsive.",
    rating: 5,
    avatar: "DK",
    gradient: "from-zinc-600 to-zinc-800",
  },
  {
    name: "Sarah Chen",
    role: "Tech Lead",
    company: "Enterprise Co.",
    quote: "We evaluated many templates. This one had the best architecture and was easiest to customize.",
    rating: 5,
    avatar: "SC",
    gradient: "from-red-600 to-red-700",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-red-500/5 blur-[100px]" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-amber-500/5 blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-20 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
            Testimonials
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Loved by{" "}
            <span className="bg-linear-to-r from-red-600 via-red-500 to-amber-500 bg-clip-text text-transparent dark:from-red-500 dark:to-amber-400">
              builders
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join hundreds of developers who ship faster with King Template.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group relative rounded-2xl border border-border/50 bg-card/50 p-6 shadow-card backdrop-blur-sm transition-all duration-300 hover:border-red-500/20 hover:shadow-elevated"
            >
              <div className="absolute -top-3 right-6">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${t.gradient} shadow-lg`}>
                  <Quote className="h-5 w-5 text-white" />
                </div>
              </div>

              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-6 flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br ${t.gradient} text-sm font-bold text-white`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role} · {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-2xl border border-border/50 bg-card/50 p-8 shadow-card backdrop-blur-sm">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            <div>
              <div className="text-4xl font-bold text-red-600 dark:text-red-400">500+</div>
              <div className="mt-2 text-muted-foreground">Happy developers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 dark:text-red-400">4.9/5</div>
              <div className="mt-2 text-muted-foreground">Average rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 dark:text-red-400">50+</div>
              <div className="mt-2 text-muted-foreground">Countries worldwide</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
