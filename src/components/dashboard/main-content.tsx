"use client";

import { cn } from "@/utils/cn";
import { useSidebar } from "@/components/dashboard/sidebar-provider";
import { PlansOverlay } from "@/components/dashboard/plans-overlay";

export function DashboardMainContent({ children }: { children: React.ReactNode }) {
  const { collapsed, showPlans, closePlans } = useSidebar();

  return (
    <>
      <main
        className={cn(
          "transition-all duration-300",
          collapsed ? "lg:pl-17.5" : "lg:pl-65"
        )}
      >
        <div className="min-h-screen">{children}</div>
      </main>
      <PlansOverlay open={showPlans} onClose={closePlans} />
    </>
  );
}
