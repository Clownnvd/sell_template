"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCheckout } from "@/hooks/use-checkout";
import type { PurchaseData } from "@/hooks/use-purchase";

import { Check, Copy, ExternalLink, Loader2, X, ArrowRight, QrCode } from "lucide-react";
import { githubUsernameSchema } from "@/lib/validations/github";
import { DashboardHeader } from "./header";

const REPO_OWNER = process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER || "your-org";
const REPO_NAME = process.env.NEXT_PUBLIC_GITHUB_REPO_NAME || "king-template";
const REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;
const CLONE_CMD = `git clone ${REPO_URL}.git`;

interface DashboardPageProps {
  userName: string | null;
  initialPurchase: PurchaseData | null;
}

export function DashboardPage({ userName, initialPurchase }: DashboardPageProps) {
  const { createCheckout, isLoading: isCheckingOut, error: checkoutError } = useCheckout();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [purchase, setPurchase] = useState<PurchaseData | null>(initialPurchase);
  const [billingBanner, setBillingBanner] = useState<"success" | "canceled" | null>(null);
  const [githubUsername, setGithubUsername] = useState(initialPurchase?.githubUsername ?? "");
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameSaved, setUsernameSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasPurchased = purchase?.status === "COMPLETED";
  const billingParam = searchParams.get("billing");

  // After successful payment redirect, refetch purchase data
  useEffect(() => {
    if (billingParam === "success" || billingParam === "canceled") {
      setBillingBanner(billingParam);
      window.history.replaceState({}, "", "/dashboard");
    }

    if (billingParam === "success" && !hasPurchased) {
      // Purchase was just completed — refetch from API to get latest data
      fetch("/api/user/purchase")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data?.purchase) {
            setPurchase(data.data.purchase);
          }
        })
        .catch(() => {
          // Non-critical — page will show stale data until refresh
        });
    }
  }, [billingParam, hasPurchased]);

  const displayName = useMemo(() => {
    if (!userName) return "there";
    return userName.split(" ")[0];
  }, [userName]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const handleBuyNow = useCallback(async () => {
    await createCheckout("/dashboard?billing=success", "/dashboard?billing=canceled");
  }, [createCheckout]);

  const handleSaveGithubUsername = useCallback(async () => {
    const trimmed = githubUsername.trim();
    if (!trimmed) {
      setUsernameError("Please enter your GitHub username");
      return;
    }
    const parseResult = githubUsernameSchema.safeParse(trimmed);
    if (!parseResult.success) {
      setUsernameError(parseResult.error.issues[0]?.message || "Invalid GitHub username format");
      return;
    }

    setIsSavingUsername(true);
    setUsernameError(null);

    try {
      const res = await fetch("/api/user/github-username", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" },
        body: JSON.stringify({ githubUsername: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save username");
      }

      setUsernameSaved(true);
      setTimeout(() => setUsernameSaved(false), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save username";
      setUsernameError(message);
    } finally {
      setIsSavingUsername(false);
    }
  }, [githubUsername]);

  const handleCopyRepo = useCallback(() => {
    navigator.clipboard.writeText(CLONE_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="min-h-screen">
      <DashboardHeader title="Dashboard" />

      <div className="mx-auto max-w-3xl p-6 lg:p-8">
        {/* Billing banners */}
        {billingBanner === "success" && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200">
            <p className="font-medium">Payment successful! You now have access to King Template.</p>
            <button onClick={() => setBillingBanner(null)} className="shrink-0 rounded-lg p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/40">
              <X className="size-4" />
            </button>
          </div>
        )}
        {billingBanner === "canceled" && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
            <p className="font-medium">Checkout canceled. No charges were made.</p>
            <button onClick={() => setBillingBanner(null)} className="shrink-0 rounded-lg p-1 hover:bg-amber-100 dark:hover:bg-amber-900/40">
              <X className="size-4" />
            </button>
          </div>
        )}

        {/* Checkout error */}
        {checkoutError && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <p className="font-medium">{checkoutError}</p>
          </div>
        )}

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            {greeting}, {displayName}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            {hasPurchased
              ? "Manage your King Template access below."
              : "Get started by purchasing King Template."}
          </p>
        </div>

        {hasPurchased ? (
          /* --- PURCHASED STATE --- */
          <div className="space-y-6">
            {/* Purchase status card */}
            <div className="border-gradient rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <Check className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Purchase Complete</h2>
                  <p className="text-sm text-muted-foreground">
                    King Template — one-time payment
                  </p>
                </div>
              </div>
            </div>

            {/* GitHub username form */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold text-foreground">GitHub Access</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {purchase?.githubInviteSent
                  ? "A collaborator invite has been sent to your GitHub account."
                  : "Enter your GitHub username to receive a collaborator invite to the private repository."}
              </p>

              <div className="mt-4 flex gap-3">
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => {
                    setGithubUsername(e.target.value);
                    setUsernameError(null);
                  }}
                  placeholder="your-github-username"
                  className="flex-1 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:bg-background"
                />
                <button
                  onClick={handleSaveGithubUsername}
                  disabled={isSavingUsername}
                  className="shine-effect inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
                >
                  {isSavingUsername ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : usernameSaved ? (
                    <Check className="size-4" />
                  ) : null}
                  {usernameSaved ? "Saved" : "Save & Invite"}
                </button>
              </div>

              {usernameError && (
                <p className="mt-2 text-sm text-destructive">{usernameError}</p>
              )}

              {purchase?.githubInviteSent && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                  <Check className="size-4" />
                  Invite sent — check your GitHub notifications
                </div>
              )}
            </div>

            {/* Clone instructions */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold text-foreground">Get Started</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                After accepting the GitHub invite, clone the repository to start building.
              </p>

              <div className="mt-4 flex items-center gap-2">
                <code className="flex-1 rounded-lg bg-accent/30 px-3 py-2.5 font-mono text-sm text-foreground">
                  {CLONE_CMD}
                </code>
                <button
                  onClick={handleCopyRepo}
                  className="inline-flex size-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-primary"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </button>
              </div>

              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Open repository on GitHub
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          </div>
        ) : (
          /* --- NOT PURCHASED STATE --- */
          <div className="border-gradient rounded-xl border border-border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground">
              Get King Template
            </h2>
            <p className="mt-2 text-muted-foreground">
              One-time payment. Get lifetime access to the full source code, future updates, and GitHub repository access.
            </p>

            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={handleBuyNow}
                disabled={isCheckingOut}
                className="shine-effect inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-8 py-3 text-sm font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    Pay with Card — $99
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>

              <button
                onClick={() => router.push("/payment/sepay")}
                className="inline-flex items-center gap-2 rounded-lg border border-primary/20 px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-primary/5 hover:border-primary/40"
              >
                <QrCode className="size-4 text-primary" />
                VietQR — 2.490.000 VND
              </button>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              30-day money-back guarantee. Instant GitHub access after purchase.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
