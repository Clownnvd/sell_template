import { CreditCard, Github, Rocket } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Purchase",
    description: "Buy King Template for a one-time payment of $99. Instant checkout via Stripe.",
    icon: CreditCard,
  },
  {
    step: "02",
    title: "Get access",
    description: "Enter your GitHub username and receive a collaborator invite to the private repo.",
    icon: Github,
  },
  {
    step: "03",
    title: "Build & ship",
    description: "Clone the repo, configure your environment, and deploy your SaaS in minutes.",
    icon: Rocket,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-zinc-50 px-4 py-24 sm:px-6 lg:px-8 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            How it works
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            From purchase to production in three simple steps.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.step} className="text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-zinc-900 dark:bg-white">
                <step.icon className="size-5 text-white dark:text-zinc-900" />
              </div>
              <div className="mt-2 text-xs font-medium uppercase tracking-wider text-zinc-400">
                Step {step.step}
              </div>
              <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
