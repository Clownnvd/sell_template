import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Successful — King Template",
  description: "Your payment was successful. Welcome to King Template!",
};

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <CheckCircle2 className="size-8 text-emerald-600 dark:text-emerald-400" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-foreground">Payment Successful!</h1>
        <p className="mt-3 text-muted-foreground">
          Thank you for purchasing King Template. Your payment has been processed successfully.
        </p>

        <div className="mt-8 rounded-lg border border-border bg-accent/30 p-6 text-left">
          <h2 className="text-sm font-semibold text-foreground">Next steps:</h2>
          <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-muted-foreground">
            <li>Go to your <strong className="text-foreground">Dashboard</strong> to see your purchase.</li>
            <li>Enter your <strong className="text-foreground">GitHub username</strong> to receive repository access.</li>
            <li>Check your email for the GitHub invitation.</li>
            <li>Clone the repo and start building!</li>
          </ol>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-primary px-6 py-3 text-sm font-medium text-white transition-shadow hover:shadow-lg"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
