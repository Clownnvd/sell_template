import type { Metadata } from "next";
import Link from "next/link";
import { LandingFooter } from "@/components/landing/landing-footer";

export const metadata: Metadata = {
  title: "Privacy Policy — King Template",
  description: "Privacy Policy for King Template. Learn how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: February 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
            <p className="mt-2">We collect the following information when you use King Template:</p>
            <ul className="mt-3 list-inside list-disc space-y-1">
              <li><strong className="text-foreground">Account information:</strong> name, email address, and password (hashed).</li>
              <li><strong className="text-foreground">OAuth data:</strong> if you sign in with GitHub or Google, we receive your public profile information.</li>
              <li><strong className="text-foreground">Payment information:</strong> processed by Stripe. We store your Stripe customer ID and payment status, but never your card details.</li>
              <li><strong className="text-foreground">GitHub username:</strong> provided by you after purchase for repository access.</li>
              <li><strong className="text-foreground">Usage data:</strong> IP address (for rate limiting), browser user agent, and page visits.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>To create and manage your account.</li>
              <li>To process your payment and deliver the product.</li>
              <li>To send you a GitHub repository invitation.</li>
              <li>To send transactional emails (verification, password reset).</li>
              <li>To prevent fraud and enforce rate limits.</li>
              <li>To improve our product and fix bugs.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Third-Party Services</h2>
            <p className="mt-2">We use the following third-party services:</p>
            <ul className="mt-3 list-inside list-disc space-y-1">
              <li><strong className="text-foreground">Stripe</strong> — payment processing. See{" "}
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Stripe&apos;s Privacy Policy</a>.</li>
              <li><strong className="text-foreground">GitHub</strong> — OAuth login and repository access.</li>
              <li><strong className="text-foreground">Google</strong> — OAuth login.</li>
              <li><strong className="text-foreground">Resend</strong> — transactional email delivery.</li>
              <li><strong className="text-foreground">Neon</strong> — database hosting (PostgreSQL).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Data Retention</h2>
            <p className="mt-2">
              We retain your account data for as long as your account is active. If you request account
              deletion, we will remove your personal data within 30 days. Payment records may be retained
              longer as required by financial regulations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Cookies</h2>
            <p className="mt-2">
              We use essential cookies only — a session cookie for authentication. We do not use
              tracking cookies, analytics cookies, or advertising cookies. No third-party trackers
              are loaded on our pages.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Security</h2>
            <p className="mt-2">
              We take security seriously. Passwords are hashed with bcrypt. All connections use HTTPS.
              We implement CSRF protection, rate limiting, Content Security Policy headers, and
              other security measures. See our security headers for details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Your Rights</h2>
            <p className="mt-2">You have the right to:</p>
            <ul className="mt-3 list-inside list-disc space-y-1">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and data.</li>
              <li>Export your data in a portable format.</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, please{" "}
              <Link href="/contact" className="text-primary underline underline-offset-2 hover:text-primary/80">
                contact us
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Changes to This Policy</h2>
            <p className="mt-2">
              We may update this policy from time to time. Changes will be posted on this page with
              an updated date. We encourage you to review this page periodically.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">9. Contact</h2>
            <p className="mt-2">
              For privacy-related questions, please{" "}
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
