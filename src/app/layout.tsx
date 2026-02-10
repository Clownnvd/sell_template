import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { WebVitals } from "@/components/ui/web-vitals";

import "./globals.css";

export const metadata: Metadata = {
  title: "App",
  description: "SaaS template built with Next.js 16, Prisma, BetterAuth, and Stripe.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <WebVitals />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
