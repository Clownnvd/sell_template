"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useAuth, usePassword } from "@/hooks";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ArrowUpRight,
  BadgeCheck,
  Calendar,
  ChevronRight,
  CreditCard,
  LogOut,
  Mail,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  PencilLine,
} from "lucide-react";

type SessionUser = {
  email?: string | null;
  name?: string | null;
};

type SessionData = {
  user?: SessionUser | null;
} | null;

function StatCard({
  title,
  value,
  icon: Icon,
  href,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
}) {
  const inner = (
    <Card className={href ? "transition hover:shadow-sm" : ""}>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="truncate text-lg font-semibold">{value}</p>
        </div>
        {href ? <ChevronRight className="ml-auto size-5 text-muted-foreground" /> : null}
      </CardContent>
    </Card>
  );

  return href ? (
    <Link href={href} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
}

export function DashboardPage() {
  const { data, isPending } = useSession();
  const session = data as SessionData;

  const { signOut, isLoading: authLoading } = useAuth();
  const { resendVerify, isLoading: pwLoading, uiError, success, clear } = usePassword();

  const [email, setEmail] = useState("");

  const userName = useMemo(() => session?.user?.name ?? "there", [session]);
  const defaultEmail = useMemo(() => session?.user?.email ?? "", [session]);

  const initials = useMemo(() => {
    const name = (session?.user?.name || "").trim();
    const email = (session?.user?.email || "").trim();
    const base = name || email || "U";
    return base.charAt(0).toUpperCase();
  }, [session]);

  async function handleResend() {
    clear();
    const target = (email || defaultEmail).trim();
    if (!target) return;
    await resendVerify(target);
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, <span className="font-medium text-foreground">{userName}</span>.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" asChild>
            <Link href="/dashboard/profile">
              <User className="mr-2 size-4" />
              Profile
            </Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/dashboard/billing">
              <CreditCard className="mr-2 size-4" />
              Billing
            </Link>
          </Button>

          <Button
            disabled={authLoading}
            onClick={async () => {
              await signOut();
              window.location.href = "/sign-in";
            }}
          >
            <LogOut className="mr-2 size-4" />
            {authLoading ? "Signing out..." : "Logout"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Plan" value="Free" icon={Sparkles} href="/dashboard/billing" />
        <StatCard
          title="Security"
          value={isPending ? "Loading..." : session ? "Authenticated" : "Signed out"}
          icon={ShieldCheck}
        />
        <StatCard
          title="Profile"
          value={session?.user?.name ? "Complete" : "Incomplete"}
          icon={BadgeCheck}
          href="/dashboard/profile"
        />
        <StatCard title="Settings" value="Manage" icon={Settings} href="/dashboard/settings" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Account */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Account</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your session and basic account information.
                </p>
              </div>

              <Button variant="outline" asChild>
                <Link href="/dashboard/profile">
                  <PencilLine className="mr-2 size-4" />
                  Edit profile
                </Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            {isPending ? (
              <div className="space-y-2">
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted" />
              </div>
            ) : session?.user ? (
              <>
                <div className="flex items-center gap-4 rounded-xl border border-border p-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{session.user.name || "Unnamed user"}</p>
                    <p className="truncate text-sm text-muted-foreground">{session.user.email}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                    <BadgeCheck className="size-4 text-green-600 dark:text-green-400" />
                    Session active
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-sm font-medium">Quick links</p>
                    <div className="mt-3 flex flex-col gap-2 text-sm">
                      <Link
                        href="/dashboard/billing"
                        className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-muted"
                      >
                        <span className="flex items-center gap-2">
                          <CreditCard className="size-4 text-muted-foreground" />
                          Billing & invoices
                        </span>
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </Link>

                      <Link
                        href="/dashboard/settings"
                        className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-muted"
                      >
                        <span className="flex items-center gap-2">
                          <Settings className="size-4 text-muted-foreground" />
                          Settings
                        </span>
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </Link>

                      <Link
                        href="/dashboard/profile"
                        className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-muted"
                      >
                        <span className="flex items-center gap-2">
                          <User className="size-4 text-muted-foreground" />
                          Profile
                        </span>
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border p-4">
                    <p className="text-sm font-medium">Next steps</p>
                    <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <BadgeCheck className="mt-0.5 size-4 text-green-600 dark:text-green-400" />
                        <span>Complete your profile details</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <ArrowUpRight className="mt-0.5 size-4 text-primary" />
                        <span>Upgrade plan to unlock more features</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Mail className="mt-0.5 size-4 text-muted-foreground" />
                        <span>Verify your email for better security</span>
                      </div>
                    </div>

                    <Button asChild className="mt-4 w-full">
                      <Link href="/pricing">
                        <Sparkles className="mr-2 size-4" />
                        View pricing
                      </Link>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
                No session found. Please{" "}
                <Link className="underline underline-offset-4" href="/sign-in">
                  sign in
                </Link>{" "}
                again.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification */}
        <Card>
          <CardHeader>
            <CardTitle>Email verification</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Resend a verification email if you didn&apos;t receive it.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verifyEmail">Email</Label>
              <Input
                id="verifyEmail"
                placeholder={defaultEmail || "you@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={pwLoading}
              />

              {uiError?.fieldErrors?.email ? (
                <p className="text-sm text-red-500">{uiError.fieldErrors.email}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  We&apos;ll send a verification link to this address.
                </p>
              )}
            </div>

            {uiError?.formError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
                {uiError.formError}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-200">
                {success}
              </div>
            ) : null}

            <Button className="w-full" disabled={pwLoading} onClick={handleResend}>
              <Mail className="mr-2 size-4" />
              {pwLoading ? "Sending..." : "Resend verification"}
            </Button>

            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              <Calendar className="size-4" />
              Tip: Nếu bạn đã verify, BetterAuth có thể báo lỗi hoặc vẫn gửi tuỳ config.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
