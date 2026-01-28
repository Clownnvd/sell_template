import type { Metadata } from "next";
import "./globals.css";
import { LandingHeader } from "@/components/landing/header/landing-header";

export const metadata: Metadata = {
  title: "App",
  description: "SaaS template built with Next.js 16, Prisma, BetterAuth, and Stripe.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <LandingHeader />
        {children}
      </body>
    </html>
  );
}
