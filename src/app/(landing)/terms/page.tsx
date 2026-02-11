import type { Metadata } from "next";
import Link from "next/link";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata: Metadata = {
  title: "Terms of Service — King Template",
  description: "Terms of Service for King Template. Read our terms before purchasing.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: February 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Agreement to Terms</h2>
            <p className="mt-2">
              By accessing or purchasing King Template, you agree to be bound by these Terms of Service.
              If you do not agree with any part of these terms, you may not use or purchase our product.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Product License</h2>
            <p className="mt-2">
              Upon successful payment, you receive a <strong className="text-foreground">personal license</strong> to
              use King Template for unlimited personal and commercial projects. This license is non-transferable
              and grants access to the private GitHub repository.
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1">
              <li>You may use the template in unlimited projects you build for yourself or clients.</li>
              <li>You may not redistribute, resell, or share the source code as a template or starter kit.</li>
              <li>You may not grant repository access to anyone who has not purchased a license.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Payment</h2>
            <p className="mt-2">
              King Template is a one-time purchase of $99 USD. Payment is processed securely via Stripe.
              You will not be charged any recurring fees. Prices are subject to change, but any price
              change will not affect existing purchases.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Delivery</h2>
            <p className="mt-2">
              After payment, you will be invited as a collaborator to the private GitHub repository.
              You must provide a valid GitHub username to receive access. Delivery is digital and immediate
              upon providing your GitHub username.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Updates</h2>
            <p className="mt-2">
              Your purchase includes lifetime access to all future updates pushed to the repository.
              We reserve the right to discontinue updates at any time, but your access to the
              existing codebase will remain.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Refunds</h2>
            <p className="mt-2">
              Please see our{" "}
              <Link href="/refund" className="text-primary underline underline-offset-2 hover:text-primary/80">
                Refund Policy
              </Link>{" "}
              for details on refund eligibility and process.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Disclaimer</h2>
            <p className="mt-2">
              King Template is provided &quot;as is&quot; without warranty of any kind. We do not guarantee
              that the template will meet your specific requirements or that it will be error-free.
              You are responsible for testing and validating the code for your use case.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Limitation of Liability</h2>
            <p className="mt-2">
              In no event shall King Template or its creators be liable for any indirect, incidental,
              special, or consequential damages arising from the use or inability to use the product.
              Our total liability is limited to the amount you paid for the product.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">9. Changes to Terms</h2>
            <p className="mt-2">
              We reserve the right to update these terms at any time. Changes will be posted on this page
              with an updated date. Continued use of the product after changes constitutes acceptance
              of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">10. Contact</h2>
            <p className="mt-2">
              If you have questions about these terms, please{" "}
              <Link href="/contact" className="text-primary underline underline-offset-2 hover:text-primary/80">
                contact us
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
