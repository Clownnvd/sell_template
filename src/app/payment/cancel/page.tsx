import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Cancelled — King Template",
  description: "Your payment was cancelled. You can try again anytime.",
};

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <XCircle className="size-8 text-muted-foreground" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-foreground">Payment Cancelled</h1>
        <p className="mt-3 text-muted-foreground">
          Your payment was not completed. No charges have been made to your account.
        </p>

        <div className="mt-8 rounded-lg border border-border bg-accent/30 p-6 text-left">
          <h2 className="text-sm font-semibold text-foreground">Common reasons:</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>You cancelled during checkout.</li>
            <li>Your card was declined — try a different payment method.</li>
            <li>The session expired — simply try again.</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/#pricing"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-primary px-6 py-3 text-sm font-medium text-white transition-shadow hover:shadow-lg"
          >
            Try Again
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Need Help?
          </Link>
        </div>
      </div>
    </div>
  );
}
