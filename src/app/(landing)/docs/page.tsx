import type { Metadata } from "next";
import Link from "next/link";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata: Metadata = {
  title: "Documentation — King Template",
  description: "Get started with King Template. Installation, configuration, and deployment guides.",
};

interface DocSection {
  title: string;
  steps: { heading: string; content: string; code?: string }[];
}

const sections: DocSection[] = [
  {
    title: "Getting Started",
    steps: [
      {
        heading: "1. Clone the Repository",
        content: "After receiving the GitHub invitation, clone the private repository:",
        code: "git clone https://github.com/your-org/king-template.git\ncd king-template",
      },
      {
        heading: "2. Install Dependencies",
        content: "Install all required packages using pnpm (recommended):",
        code: "pnpm install",
      },
      {
        heading: "3. Set Up Environment Variables",
        content:
          "Copy the example environment file and fill in your values. See the .env.example file for all required variables.",
        code: "cp .env.example .env",
      },
      {
        heading: "4. Set Up the Database",
        content:
          "Create a Neon PostgreSQL database (or any PostgreSQL provider) and run the Prisma migrations:",
        code: "pnpm prisma migrate dev",
      },
      {
        heading: "5. Start Development Server",
        content: "Run the development server and open http://localhost:3000:",
        code: "pnpm dev",
      },
    ],
  },
  {
    title: "Configuration",
    steps: [
      {
        heading: "Authentication",
        content:
          "Better Auth is pre-configured with email/password, GitHub OAuth, and Google OAuth. Set the GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GOOGLE_CLIENT_ID, and GOOGLE_CLIENT_SECRET environment variables to enable OAuth providers.",
      },
      {
        heading: "Payments",
        content:
          "Stripe is configured for one-time payments. Set STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET, and NEXT_PUBLIC_STRIPE_PRICE_KING_TEMPLATE in your environment.",
      },
      {
        heading: "Email",
        content:
          "Transactional emails (verification, password reset) use Resend. Set RESEND_API_KEY and EMAIL_FROM in your environment. Email verification is auto-enabled when the API key is present.",
      },
      {
        heading: "Internationalization",
        content:
          "next-intl is configured for English (en) and Vietnamese (vi). Add new locales by creating message files in the messages/ directory and updating the i18n config.",
      },
    ],
  },
  {
    title: "Deployment",
    steps: [
      {
        heading: "Vercel (Recommended)",
        content:
          "Push to GitHub and connect the repository in Vercel. Add all environment variables in the Vercel dashboard. The build and deployment happen automatically.",
      },
      {
        heading: "Docker",
        content:
          "A Dockerfile is included for containerized deployments. Build and run:",
        code: "docker build -t king-template .\ndocker run -p 3000:3000 --env-file .env king-template",
      },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Documentation</h1>
        <p className="mt-2 text-muted-foreground">
          Everything you need to set up and customize King Template for your project.
        </p>

        <div className="mt-10 space-y-12">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-bold text-foreground">{section.title}</h2>

              <div className="mt-6 space-y-8">
                {section.steps.map((step) => (
                  <div key={step.heading}>
                    <h3 className="text-sm font-semibold text-foreground">{step.heading}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{step.content}</p>
                    {step.code && (
                      <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-zinc-950 p-4 text-sm text-zinc-100 dark:bg-zinc-900">
                        <code>{step.code}</code>
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-border bg-accent/30 p-6">
          <h2 className="text-sm font-semibold text-foreground">Need help?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            If you run into any issues or have questions,{" "}
            <Link
              href="/contact"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              contact us
            </Link>{" "}
            and we&apos;ll help you get set up.
          </p>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
