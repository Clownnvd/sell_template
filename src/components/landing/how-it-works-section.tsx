import { Download, Code, Rocket, Terminal, Check } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Clone & configure",
    description: "Set your env variables for database, auth, and Stripe. Run migrations and you're ready.",
    icon: Download,
    color: "from-red-600 to-red-500",
  },
  {
    step: "02",
    title: "Ship your core feature",
    description: "Build your product on top of a clean dashboard, reusable UI, and typed APIs.",
    icon: Code,
    color: "from-red-500 to-amber-500",
  },
  {
    step: "03",
    title: "Monetize & scale",
    description: "Enable subscriptions, manage teams, and iterate fast with a solid foundation.",
    icon: Rocket,
    color: "from-amber-500 to-amber-400",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative scroll-mt-24 overflow-hidden bg-muted/20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-red-500/5 blur-[100px]" />
        <div className="absolute -right-20 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-20 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
            How it works
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            From zero to launch,{" "}
            <span className="bg-linear-to-r from-red-600 via-red-500 to-amber-500 bg-clip-text text-transparent dark:from-red-500 dark:to-amber-400">
              fast
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">A simple flow that keeps you focused on what matters: shipping value.</p>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 animate-gradient bg-linear-to-b from-red-500/50 via-red-400/50 to-amber-500/50 md:block" />

          <div className="space-y-8 md:space-y-0">
            {steps.map((s, index) => (
              <div key={s.title} className="relative md:grid md:grid-cols-2 md:gap-8">
                <div className="absolute left-1/2 top-0 z-10 hidden -translate-x-1/2 md:block">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br ${s.color} shadow-lg`}>
                    <s.icon className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div
                  className={`card-hover rounded-2xl border border-border/50 bg-card p-6 shadow-card ${
                    index % 2 === 0 ? "md:col-start-1 md:text-right md:pr-16" : "md:col-start-2 md:text-left md:pl-16"
                  }`}
                  style={{ direction: "ltr" }}
                >
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${s.color} md:hidden`}>
                    <s.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`inline-flex items-center gap-2 rounded-full bg-linear-to-r ${s.color} px-3 py-1 text-xs font-bold text-white`}>
                    Step {s.step}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-muted-foreground">{s.description}</p>
                </div>

                <div className={`hidden md:block ${index % 2 === 0 ? "md:col-start-2" : "md:col-start-1"}`} />
                {index < steps.length - 1 && <div className="md:h-24" />}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 overflow-hidden rounded-2xl border border-border/50 bg-card shadow-dramatic">
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-600 dark:text-red-400">
                <Check className="h-4 w-4" />
                Great defaults
              </div>
              <h3 className="mt-4 text-2xl font-bold">Ready in minutes</h3>
              <p className="mt-2 text-muted-foreground">
                Opinionated structure and sensible patterns so you don&apos;t waste time wiring basics together.
              </p>
              <ul className="mt-6 space-y-3">
                {["TypeScript configured", "ESLint & Prettier ready", "Database migrations", "Auth & Stripe connected"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-red-600 dark:text-red-400">
                      <Check className="h-3 w-3" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border/50 bg-zinc-950 p-6 lg:border-l lg:border-t-0 lg:p-8">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Terminal className="h-4 w-4" />
                Terminal
              </div>
              <div className="mt-4 font-mono text-sm">
                <div className="text-zinc-500"># Clone the repo</div>
                <div className="text-red-400">$ git clone https://github.com/you/king-template</div>
                <div className="mt-3 text-zinc-500"># Install dependencies</div>
                <div className="text-red-400">$ pnpm install</div>
                <div className="mt-3 text-zinc-500"># Set up database</div>
                <div className="text-red-400">$ pnpm prisma migrate dev</div>
                <div className="mt-3 text-zinc-500"># Start development server</div>
                <div className="text-red-400">$ pnpm dev</div>
                <div className="mt-4 flex items-center gap-2 text-amber-400">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-400" />
                  Ready on http://localhost:3000
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
