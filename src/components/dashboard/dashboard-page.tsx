"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { usePurchase } from "@/hooks/use-purchase";

import { Check, Copy, ExternalLink, Loader2, X, ArrowRight } from "lucide-react";
import { DashboardHeader } from "./header";

type SessionUser = {
  email?: string | null;
  name?: string | null;
};

type SessionData = {
  user?: SessionUser | null;
} | null;

export function DashboardPage() {
  const { data } = useSession();
  const session = data as SessionData;
  const { purchase, hasPurchased, isLoadingPurchase, createCheckout } = usePurchase();
  const searchParams = useSearchParams();

  const [billingBanner, setBillingBanner] = useState<"success" | "canceled" | null>(null);
  const [githubUsername, setGithubUsername] = useState("");
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameSaved, setUsernameSaved] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [copied, setCopied] = useState(false);

  const billingParam = searchParams.get("billing");

  useEffect(() => {
    if (billingParam === "success" || billingParam === "canceled") {
      setBillingBanner(billingParam);
      window.history.replaceState({}, "", "/dashboard");
    }
  }, [billingParam]);

  useEffect(() => {
    if (purchase?.githubUsername) {
      setGithubUsername(purchase.githubUsername);
    }
  }, [purchase?.githubUsername]);

  const userName = useMemo(() => {
    const name = session?.user?.name;
    if (!name) return "there";
    return name.split(" ")[0];
  }, [session]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const handleBuyNow = useCallback(async () => {
    setIsCheckingOut(true);
    try {
      await createCheckout("/dashboard?billing=success", "/dashboard?billing=canceled");
    } catch {
      setIsCheckingOut(false);
    }
  }, [createCheckout]);

  const handleSaveGithubUsername = useCallback(async () => {
    const trimmed = githubUsername.trim();
    if (!trimmed) {
      setUsernameError("Please enter your GitHub username");
      return;
    }
    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(trimmed)) {
      setUsernameError("Invalid GitHub username format");
      return;
    }

    setIsSavingUsername(true);
    setUsernameError(null);

    try {
      const res = await fetch("/api/user/github-username", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
    navigator.clipboard.writeText("git clone https://github.com/your-org/king-template.git");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  if (isLoadingPurchase) {
    return (
      <div className="min-h-screen">
        <DashboardHeader title="Dashboard" />
        <div className="flex items-center justify-center p-20">
          <Loader2 className="size-6 animate-spin text-zinc-400" />
        </div>
      </div>
    );
  }

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

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {greeting}, {userName}!
          </h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            {hasPurchased
              ? "Manage your King Template access below."
              : "Get started by purchasing King Template."}
          </p>
        </div>

        {hasPurchased ? (
          /* --- PURCHASED STATE --- */
          <div className="space-y-6">
            {/* Purchase status card */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <Check className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-zinc-900 dark:text-white">Purchase Complete</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    King Template — ${purchase?.amount ? (purchase.amount / 100).toFixed(0) : "99"} one-time payment
                  </p>
                </div>
              </div>
            </div>

            {/* GitHub username form */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="font-semibold text-zinc-900 dark:text-white">GitHub Access</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
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
                  className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition-colors focus:border-zinc-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:focus:border-zinc-600 dark:focus:bg-zinc-800"
                />
                <button
                  onClick={handleSaveGithubUsername}
                  disabled={isSavingUsername}
                  className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
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
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{usernameError}</p>
              )}

              {purchase?.githubInviteSent && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                  <Check className="size-4" />
                  Invite sent — check your GitHub notifications
                </div>
              )}
            </div>

            {/* Clone instructions */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="font-semibold text-zinc-900 dark:text-white">Get Started</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                After accepting the GitHub invite, clone the repository to start building.
              </p>

              <div className="mt-4 flex items-center gap-2">
                <code className="flex-1 rounded-lg bg-zinc-100 px-3 py-2.5 font-mono text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  git clone https://github.com/your-org/king-template.git
                </code>
                <button
                  onClick={handleCopyRepo}
                  className="inline-flex size-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-white"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </button>
              </div>

              <a
                href="https://github.com/your-org/king-template"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-900 hover:underline dark:text-white"
              >
                Open repository on GitHub
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          </div>
        ) : (
          /* --- NOT PURCHASED STATE --- */
          <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Get King Template
            </h2>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              One-time payment of $99. Get lifetime access to the full source code, future updates, and GitHub repository access.
            </p>

            <button
              onClick={handleBuyNow}
              disabled={isCheckingOut}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Redirecting to checkout...
                </>
              ) : (
                <>
                  Buy Now — $99
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>

            <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
              30-day money-back guarantee. Instant GitHub access after purchase.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
