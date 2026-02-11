import type { Metadata } from "next";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata: Metadata = {
  title: "Changelog — King Template",
  description: "See what's new in King Template. Latest updates and improvements.",
};

interface ChangelogEntry {
  version: string;
  date: string;
  changes: { type: "added" | "improved" | "fixed"; text: string }[];
}

const changelog: ChangelogEntry[] = [
  {
    version: "1.0.0",
    date: "February 2026",
    changes: [
      { type: "added", text: "Next.js 16 + React 19 + TypeScript foundation" },
      { type: "added", text: "Better Auth with email/password, GitHub, and Google OAuth" },
      { type: "added", text: "Stripe one-time payment integration ($99)" },
      { type: "added", text: "GitHub collaborator invite after purchase" },
      { type: "added", text: "Dashboard with purchase status and GitHub access" },
      { type: "added", text: "Prisma 7 + Neon PostgreSQL database" },
      { type: "added", text: "i18n with next-intl (English + Vietnamese)" },
      { type: "added", text: "Rate limiting + CSRF protection" },
      { type: "added", text: "Email system with Resend + React Email" },
      { type: "added", text: "Tailwind CSS 4 with dark mode support" },
      { type: "added", text: "Production security headers (CSP, XSS, HSTS)" },
      { type: "added", text: "Comprehensive test suite with Vitest" },
    ],
  },
];

const typeBadge: Record<string, string> = {
  added: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  improved: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  fixed: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Changelog</h1>
        <p className="mt-2 text-muted-foreground">
          All notable updates to King Template. Your purchase includes lifetime access to all
          future updates.
        </p>

        <div className="mt-10 space-y-12">
          {changelog.map((entry) => (
            <section key={entry.version} className="relative">
              <div className="flex items-baseline gap-3">
                <h2 className="text-xl font-bold text-foreground">v{entry.version}</h2>
                <span className="text-sm text-muted-foreground">{entry.date}</span>
              </div>

              <ul className="mt-4 space-y-3">
                {entry.changes.map((change) => (
                  <li key={change.text} className="flex items-start gap-3 text-sm">
                    <span
                      className={`mt-0.5 shrink-0 rounded px-2 py-0.5 text-xs font-medium ${typeBadge[change.type]}`}
                    >
                      {change.type}
                    </span>
                    <span className="text-muted-foreground">{change.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
