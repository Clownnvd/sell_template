import {
  Shield,
  CreditCard,
  Layout,
  Code2,
  Globe,
  Mail,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

const features = [
  {
    title: "Authentication",
    description:
      "Email/password, GitHub & Google OAuth with Better Auth. Email verification, password reset, session management.",
    icon: Shield,
  },
  {
    title: "Stripe Payments",
    description:
      "Checkout sessions, customer portal, webhook handling with signature verification and idempotency.",
    icon: CreditCard,
  },
  {
    title: "Dashboard",
    description:
      "Sidebar navigation, user settings, billing management, and a clean admin layout ready to extend.",
    icon: Layout,
  },
  {
    title: "Full Stack TypeScript",
    description:
      "Next.js 16, React 19, Prisma ORM, Zod validation, and type-safe environment variables throughout.",
    icon: Code2,
  },
  {
    title: "Internationalization",
    description:
      "Multi-language support with next-intl. English and Vietnamese included, easily extendable.",
    icon: Globe,
  },
  {
    title: "Transactional Email",
    description:
      "Resend + React Email templates for verification, password reset, and purchase confirmation emails.",
    icon: Mail,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-accent/30 px-4 py-20 sm:py-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Everything you need to{" "}
              <span className="text-gradient">ship</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Production-ready features so you can focus on what makes your
              product unique.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <BentoGrid className="mt-16">
            {features.map((feature, i) => (
              <BentoGridItem
                key={feature.title}
                title={feature.title}
                description={feature.description}
                className={i === 3 || i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}
                icon={
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="size-4 text-primary" />
                  </div>
                }
                header={
                  <div className="flex h-full items-center justify-center rounded-lg bg-linear-to-br from-primary/5 to-primary/10">
                    <feature.icon className="size-10 text-primary/30" />
                  </div>
                }
              />
            ))}
          </BentoGrid>
        </ScrollReveal>
      </div>
    </section>
  );
}
