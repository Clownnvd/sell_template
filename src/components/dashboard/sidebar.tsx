"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { cn } from "@/utils/cn";
import { useSidebar } from "@/components/dashboard/sidebar-provider";
import { UserMenu } from "@/components/dashboard/user-menu";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="size-5" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings/profile",
    icon: <Settings className="size-5" />,
  },
];

interface DashboardSidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { isMobileOpen, closeMobile, collapsed, toggleCollapsed } = useSidebar();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const handleNavClick = () => {
    closeMobile();
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-zinc-200 bg-white transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950",
          "max-lg:-translate-x-full",
          collapsed ? "lg:w-17.5" : "lg:w-65",
          isMobileOpen && "max-lg:translate-x-0 max-lg:w-70 max-lg:shadow-xl",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-2 font-semibold text-zinc-900 transition-opacity dark:text-white",
              collapsed && "opacity-0"
            )}
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white">
              <span className="text-sm font-bold text-white dark:text-zinc-900">K</span>
            </div>
            <span className="text-lg">King Template</span>
          </Link>
          <button
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden size-8 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 lg:flex dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive(item.href)
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.title : undefined}
            >
              <span>{item.icon}</span>
              {!collapsed && <span className="flex-1">{item.title}</span>}
            </Link>
          ))}
        </nav>

        {/* User Menu */}
        <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
          <UserMenu user={user} collapsed={collapsed} />
        </div>
      </aside>
    </>
  );
}
