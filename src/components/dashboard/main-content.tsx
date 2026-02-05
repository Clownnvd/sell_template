"use client";

import { cn } from "@/utils/cn";
import { useSidebar } from "@/components/dashboard/sidebar-provider";

export function DashboardMainContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <main
      className={cn(
        "transition-all duration-300",
        collapsed ? "lg:pl-17.5" : "lg:pl-65"
      )}
    >
      <div className="min-h-screen">{children}</div>
    </main>
  );
}
