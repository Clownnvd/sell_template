"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/dashboard/sidebar-provider";

interface DashboardHeaderProps {
  title?: string;
  description?: string;
}

export function DashboardHeader({
  title,
  description,
}: DashboardHeaderProps) {
  const { openMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-zinc-200 bg-white/85 px-6 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/85">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={openMobile}
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </Button>

        {title && (
          <div>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h1>
            {description && (
              <p className="hidden text-sm text-zinc-500 sm:block dark:text-zinc-400">{description}</p>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
