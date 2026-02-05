import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Minh Tran",
    role: "Indie Maker",
    quote: "I shipped billing + auth in a weekend. The structure is clean and easy to extend. Best template I've used.",
    rating: 5,
    avatar: "MT",
  },
  {
    name: "Sarah Chen",
    role: "Full-Stack Developer",
    quote: "Saved me weeks of boilerplate. The Stripe integration and auth system were exactly what I needed.",
    rating: 5,
    avatar: "SC",
  },
  {
    name: "Alex Kim",
    role: "Startup Founder",
    quote: "Production-ready from day one. The security headers, rate limiting, and CSRF protection gave me confidence to ship fast.",
    rating: 5,
    avatar: "AK",
  },
];

export function TestimonialsSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            Loved by developers
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            See what builders are saying about King Template.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-white">{t.name}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
