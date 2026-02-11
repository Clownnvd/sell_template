import type { Metadata } from "next";
import Link from "next/link";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata: Metadata = {
  title: "Refund Policy — King Template",
  description: "Refund Policy for King Template. Learn about our refund process.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Refund Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: February 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">Eligibility</h2>
            <p className="mt-2">
              Because King Template is a digital product with immediate access to source code,
              we offer refunds on a case-by-case basis. You are eligible for a full refund if:
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1">
              <li>You request a refund within <strong className="text-foreground">14 days</strong> of purchase.</li>
              <li>You have not used the template code in any project (public or private).</li>
              <li>You can provide a reason for the refund request.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Non-Refundable Cases</h2>
            <p className="mt-2">Refunds will not be issued if:</p>
            <ul className="mt-3 list-inside list-disc space-y-1">
              <li>More than 14 days have passed since purchase.</li>
              <li>The template code has been used in a deployed project.</li>
              <li>You have shared or redistributed the source code.</li>
              <li>The request is based on a misunderstanding of the product features clearly described on the sales page.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">How to Request a Refund</h2>
            <p className="mt-2">To request a refund:</p>
            <ol className="mt-3 list-inside list-decimal space-y-1">
              <li>
                <Link href="/contact" className="text-primary underline underline-offset-2 hover:text-primary/80">
                  Contact us
                </Link>{" "}
                with your purchase email and reason for the refund.
              </li>
              <li>We will review your request within 3 business days.</li>
              <li>If approved, the refund will be processed to your original payment method via Stripe.</li>
              <li>Your GitHub repository access will be revoked upon refund.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Processing Time</h2>
            <p className="mt-2">
              Approved refunds are processed within 5-10 business days. The exact timing depends on
              your bank or payment provider.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">Questions?</h2>
            <p className="mt-2">
              If you have any questions about our refund policy, please{" "}
              <Link href="/contact" className="text-primary underline underline-offset-2 hover:text-primary/80">
                contact us
              </Link>{" "}
              before making your purchase.
            </p>
          </section>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
