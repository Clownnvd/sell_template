"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSidebar } from "@/components/dashboard/sidebar-provider";

interface DashboardHeaderProps {
  title?: string;
  description?: string;
}

export function DashboardHeader({
  title,
  description,
}: DashboardHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { openMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/85 px-6 shadow-subtle backdrop-blur-xl">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={openMobile}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Page title */}
        {title && (
          <div>
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            {description && (
              <p className="hidden text-sm text-muted-foreground sm:block">{description}</p>
            )}
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden sm:block">
          {searchOpen ? (
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-64 rounded-lg border border-input bg-muted/50 px-3 text-sm outline-none transition-colors ring-ring focus:ring-2"
                autoFocus
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
      </div>
    </header>
  );
}
