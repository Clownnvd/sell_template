import { Star } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/utils/cn";

const testimonials = [
  {
    name: "Minh Tran",
    role: "Indie Maker",
    quote:
      "Shipped my SaaS in a weekend — billing, auth, dashboard, all done. Saved me 3+ weeks of boilerplate. Best $99 I've spent.",
    rating: 5,
    avatar: "MT",
    color: "bg-red-600",
  },
  {
    name: "Sarah Chen",
    role: "Full-Stack Developer",
    quote:
      "The Stripe integration alone saved me a week. Already launched 2 projects with King Template — paid for itself 10x over.",
    rating: 5,
    avatar: "SC",
    color: "bg-amber-600",
  },
  {
    name: "Alex Kim",
    role: "Startup Founder",
    quote:
      "Production-ready security from day one. Rate limiting, CSRF, webhooks — shipped with confidence in under 48 hours.",
    rating: 5,
    avatar: "AK",
    color: "bg-emerald-600",
  },
  {
    name: "David Park",
    role: "Solo Developer",
    quote:
      "The auth system is rock solid. Better Auth with GitHub and Google OAuth just works out of the box. No more auth headaches.",
    rating: 5,
    avatar: "DP",
    color: "bg-blue-600",
  },
  {
    name: "Lisa Wang",
    role: "Tech Lead",
    quote:
      "Clean codebase, great patterns. The i18n setup and email templates alone saved my team days of work. Highly recommended.",
    rating: 5,
    avatar: "LW",
    color: "bg-purple-600",
  },
  {
    name: "James Lee",
    role: "Freelance Developer",
    quote:
      "I use King Template for every new client project now. The dashboard and payment flow are production-ready from minute one.",
    rating: 5,
    avatar: "JL",
    color: "bg-cyan-600",
  },
];

function TestimonialCard({
  name,
  role,
  quote,
  rating,
  avatar,
  color,
}: (typeof testimonials)[number]) {
  return (
    <div className={cn(
      "w-72 shrink-0 rounded-xl border border-border bg-card p-6 shadow-sm",
      "transition-[shadow,border-color] hover:shadow-lg hover:border-primary/20",
    )}>
      <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: rating }).map((_, j) => (
          <Star key={j} className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-3">
        <div
          className={cn(
            "flex size-8 items-center justify-center rounded-full text-xs font-medium text-white",
            color,
          )}
          aria-hidden="true"
        >
          {avatar}
        </div>
        <div>
          <div className="text-sm font-medium text-foreground">{name}</div>
          <div className="text-xs text-muted-foreground">{role}</div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const firstRow = testimonials.slice(0, 3);
  const secondRow = testimonials.slice(3, 6);

  return (
    <section className="bg-accent/30 px-4 py-20 sm:py-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Loved by{" "}
              <span className="text-gradient">developers</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See what builders are saying about King Template.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative mt-12 flex flex-col gap-4 overflow-hidden">
          <Marquee pauseOnHover className="[--duration:30s] [--gap:1rem]">
            {firstRow.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </Marquee>
          <Marquee pauseOnHover reverse className="[--duration:30s] [--gap:1rem]">
            {secondRow.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-linear-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-linear-to-l from-background to-transparent" />
        </div>
      </div>
    </section>
  );
}
