"use client";

import { useRef } from "react";
import { CreditCard, GithubIcon, Rocket } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { AnimatedBeam } from "@/components/ui/animated-beam";

const steps = [
  {
    step: "01",
    title: "Purchase",
    description:
      "Buy King Template for a one-time payment of $99. Instant checkout via Stripe.",
    icon: CreditCard,
  },
  {
    step: "02",
    title: "Get access",
    description:
      "Enter your GitHub username and receive a collaborator invite to the private repo.",
    icon: GithubIcon,
  },
  {
    step: "03",
    title: "Build & ship",
    description:
      "Clone the repo, configure your environment, and deploy your SaaS in minutes.",
    icon: Rocket,
  },
];

export function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const stepRefs = [step1Ref, step2Ref, step3Ref];

  return (
    <section
      id="how-it-works"
      className="bg-accent/30 px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From purchase to production in three simple steps.
            </p>
          </div>
        </ScrollReveal>

        <div ref={containerRef} className="relative mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <ScrollReveal key={step.step} delay={i * 150}>
              <div className="text-center">
                <div
                  ref={stepRefs[i]}
                  className="mx-auto flex size-12 items-center justify-center rounded-full bg-gradient-primary"
                >
                  <step.icon className="size-5 text-white" />
                </div>
                <div className="mt-2 text-xs font-medium uppercase tracking-wider text-gold">
                  Step {step.step}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}

          <AnimatedBeam
            containerRef={containerRef}
            fromRef={step1Ref}
            toRef={step2Ref}
            curvature={-50}
            gradientStartColor="oklch(0.58 0.24 27)"
            gradientStopColor="oklch(0.65 0.2 50)"
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={step2Ref}
            toRef={step3Ref}
            curvature={-50}
            gradientStartColor="oklch(0.65 0.2 50)"
            gradientStopColor="oklch(0.58 0.24 27)"
          />
        </div>
      </div>
    </section>
  );
}
