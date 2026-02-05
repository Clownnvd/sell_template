"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useSubscription } from "@/hooks/use-subscription";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "./header";
import { useSidebar } from "./sidebar-provider";

import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  CreditCard,
  Activity,
  Sparkles,
  Zap,
  BarChart3,
  Clock,
  CheckCircle2,
  Circle,
  X,
} from "lucide-react";

type SessionUser = {
  email?: string | null;
  name?: string | null;
};

type SessionData = {
  user?: SessionUser | null;
} | null;

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  description?: string;
}

function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  description,
}: StatCardProps) {
  return (
    <Card className="card-hover overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {change && (
              <div className="flex items-center gap-1">
                {changeType === "positive" && (
                  <ArrowUpRight className="h-4 w-4 text-success" />
                )}
                {changeType === "negative" && (
                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                )}
                <span
                  className={`text-sm font-medium ${
                    changeType === "positive"
                      ? "text-success"
                      : changeType === "negative"
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }`}
                >
                  {change}
                </span>
                {description && (
                  <span className="text-sm text-muted-foreground">
                    {description}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  status: "completed" | "pending" | "in-progress";
}

const recentActivity: ActivityItem[] = [
  {
    id: "1",
    title: "Project created",
    description: "New project 'Marketing Campaign' was created",
    time: "2 hours ago",
    status: "completed",
  },
  {
    id: "2",
    title: "Team member added",
    description: "John Doe joined the workspace",
    time: "4 hours ago",
    status: "completed",
  },
  {
    id: "3",
    title: "Task in progress",
    description: "Design review for Q1 report",
    time: "5 hours ago",
    status: "in-progress",
  },
  {
    id: "4",
    title: "Pending approval",
    description: "Budget proposal awaiting review",
    time: "1 day ago",
    status: "pending",
  },
];

export function DashboardPage() {
  const { data } = useSession();
  const session = data as SessionData;
  const { subscription } = useSubscription();
  const searchParams = useSearchParams();
  const { openPlans } = useSidebar();

  const billingParam = searchParams.get("billing");
  const [billingBanner, setBillingBanner] = useState<"success" | "canceled" | null>(
    billingParam === "success" || billingParam === "canceled" ? billingParam : null
  );

  // Clean URL after reading billing param
  useEffect(() => {
    if (billingParam) {
      window.history.replaceState({}, "", "/dashboard");
    }
  }, [billingParam]);

  const userName = useMemo(() => {
    const name = session?.user?.name;
    if (!name) return "there";
    return name.split(" ")[0];
  }, [session]);

  const currentPlan = subscription?.plan || "FREE";
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Dashboard"
        description="Overview of your workspace"
      />

      <div className="p-6 lg:p-8">
        {/* Billing success banner */}
        {billingBanner === "success" && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-200">
            <p className="font-medium">Payment successful! Your subscription has been updated.</p>
            <button onClick={() => setBillingBanner(null)} className="shrink-0 rounded-lg p-1 hover:bg-green-100 dark:hover:bg-green-900/40">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {billingBanner === "canceled" && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200">
            <p className="font-medium">Checkout canceled. No changes were made.</p>
            <button onClick={() => setBillingBanner(null)} className="shrink-0 rounded-lg p-1 hover:bg-amber-100 dark:hover:bg-amber-900/40">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {/* Welcome Section */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-primary/10 bg-linear-to-r from-primary/10 via-purple-500/5 to-transparent p-6 shadow-card lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold lg:text-3xl">
                {greeting}, {userName}!
              </h1>
              <p className="mt-2 text-muted-foreground">
                Here&apos;s what&apos;s happening with your projects today.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                asChild
              >
                <Link href="/dashboard/projects">
                  <Zap className="mr-2 h-4 w-4" />
                  New Project
                </Link>
              </Button>
              {currentPlan === "FREE" && (
                <Button
                  onClick={() => openPlans()}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Upgrade Plan
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Projects"
            value="12"
            change="+2"
            changeType="positive"
            description="this month"
            icon={<BarChart3 className="h-6 w-6 text-primary" />}
          />
          <StatCard
            title="Team Members"
            value="8"
            change="+3"
            changeType="positive"
            description="new members"
            icon={<Users className="h-6 w-6 text-primary" />}
          />
          <StatCard
            title="Active Tasks"
            value="24"
            change="-5"
            changeType="negative"
            description="from last week"
            icon={<Activity className="h-6 w-6 text-primary" />}
          />
          <StatCard
            title="Current Plan"
            value={currentPlan}
            icon={<CreditCard className="h-6 w-6 text-primary" />}
          />
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chart Area */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Analytics Overview</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Your performance metrics for the last 30 days
                </p>
              </div>
              <Button variant="outline" size="sm">
                View Report
              </Button>
            </CardHeader>
            <CardContent>
              {/* Mini bar chart placeholder */}
              <div className="flex h-64 items-end gap-2 rounded-lg bg-muted/20 p-4">
                {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 95].map((h, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-sm bg-linear-to-t from-primary/60 to-primary transition-all hover:from-primary/80 hover:to-primary"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground/60">
                      {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50">
                  <div className="mt-0.5">
                    {item.status === "completed" && (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    )}
                    {item.status === "in-progress" && (
                      <Clock className="h-5 w-5 text-warning" />
                    )}
                    {item.status === "pending" && (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/projects">
              <Card className="card-hover cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
                    <BarChart3 className="h-5 w-5 text-chart-1" />
                  </div>
                  <div>
                    <p className="font-medium">Projects</p>
                    <p className="text-sm text-muted-foreground">
                      Manage your projects
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/team">
              <Card className="card-hover cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                    <Users className="h-5 w-5 text-chart-2" />
                  </div>
                  <div>
                    <p className="font-medium">Team</p>
                    <p className="text-sm text-muted-foreground">
                      Invite members
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <button onClick={() => openPlans()} className="text-left">
              <Card className="card-hover cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                    <CreditCard className="h-5 w-5 text-chart-3" />
                  </div>
                  <div>
                    <p className="font-medium">Billing</p>
                    <p className="text-sm text-muted-foreground">
                      Manage subscription
                    </p>
                  </div>
                </CardContent>
              </Card>
            </button>

            <Link href="/dashboard/settings/profile">
              <Card className="card-hover cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10">
                    <Activity className="h-5 w-5 text-chart-4" />
                  </div>
                  <div>
                    <p className="font-medium">Settings</p>
                    <p className="text-sm text-muted-foreground">
                      Account settings
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
