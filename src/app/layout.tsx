import type { Metadata } from "next";
import { WebVitals } from "@/components/ui/web-vitals";

import "./globals.css";

export const metadata: Metadata = {
  title: "App",
  description: "SaaS template built with Next.js 16, Prisma, BetterAuth, and Stripe.",
};

/**
 * Root layout — intentionally minimal (no cookie/header reads).
 * i18n providers are in route-group layouts so the landing page stays static.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased" suppressHydrationWarning>
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
