import type { Metadata } from "next";
import { LandingFooter } from "@/components/landing/landing-footer";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us — King Template",
  description: "Get in touch with the King Template team. We're here to help.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Contact Us</h1>
        <p className="mt-2 text-muted-foreground">
          Have a question about King Template? We&apos;d love to hear from you.
        </p>

        <div className="mt-10 grid gap-10 md:grid-cols-5">
          <div className="md:col-span-3">
            <ContactForm />
          </div>

          <div className="space-y-6 md:col-span-2">
            <div className="rounded-lg border border-border bg-accent/30 p-6">
              <h2 className="text-sm font-semibold text-foreground">Quick Links</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="/#faq"
                    className="text-primary underline underline-offset-2 hover:text-primary/80"
                  >
                    FAQ
                  </a>{" "}
                  — Common questions answered
                </li>
                <li>
                  <a
                    href="/refund"
                    className="text-primary underline underline-offset-2 hover:text-primary/80"
                  >
                    Refund Policy
                  </a>{" "}
                  — 14-day refund window
                </li>
                <li>
                  <a
                    href="/docs"
                    className="text-primary underline underline-offset-2 hover:text-primary/80"
                  >
                    Documentation
                  </a>{" "}
                  — Setup guides
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-accent/30 p-6">
              <h2 className="text-sm font-semibold text-foreground">Response Time</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We typically respond within 24 hours on business days. For urgent issues,
                mention &quot;urgent&quot; in your subject line.
              </p>
            </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
