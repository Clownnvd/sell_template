import { NextIntlClientProvider } from "next-intl";
import { LandingHeader } from "@/components/landing/header/landing-header";
import messages from "@/messages/en.json";

/**
 * Landing layout — uses statically imported messages to keep pages static.
 * No cookie/header reads here, so the landing page can be built at build time.
 */
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextIntlClientProvider messages={messages} locale="en">
      <LandingHeader />
      {children}
    </NextIntlClientProvider>
  );
}
