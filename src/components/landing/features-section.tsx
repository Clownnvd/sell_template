"use client";

import {
  Shield,
  CreditCard,
  Layout,
  Code2,
  Globe,
  Mail,
} from "lucide-react";

const features = [
  {
    title: "Authentication",
    description: "Email/password, GitHub & Google OAuth with Better Auth. Email verification, password reset, session management.",
    icon: Shield,
  },
  {
    title: "Stripe Payments",
    description: "Checkout sessions, customer portal, webhook handling with signature verification and idempotency.",
    icon: CreditCard,
  },
  {
    title: "Dashboard",
    description: "Sidebar navigation, user settings, billing management, and a clean admin layout ready to extend.",
    icon: Layout,
  },
  {
    title: "Full Stack TypeScript",
    description: "Next.js 16, React 19, Prisma ORM, Zod validation, and type-safe environment variables throughout.",
    icon: Code2,
  },
  {
    title: "Internationalization",
    description: "Multi-language support with next-intl. English and Vietnamese included, easily extendable.",
    icon: Globe,
  },
  {
    title: "Transactional Email",
    description: "Resend + React Email templates for verification, password reset, and purchase confirmation emails.",
    icon: Mail,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            Everything you need to ship
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Production-ready features so you can focus on what makes your product unique.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-zinc-100 bg-white p-6 transition-colors hover:border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <feature.icon className="size-5 text-zinc-700 dark:text-zinc-300" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
