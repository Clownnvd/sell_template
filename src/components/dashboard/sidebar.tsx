"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { cn } from "@/utils/cn";
import { useSidebar } from "@/components/dashboard/sidebar-provider";
import { UserMenu } from "@/components/dashboard/user-menu";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    badge: "Soon",
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Team",
    href: "/dashboard/team",
    icon: <Users className="h-5 w-5" />,
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
    // Close mobile sidebar when navigating
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
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
          // Desktop: always visible, respects collapse
          "max-lg:-translate-x-full",
          collapsed ? "lg:w-17.5" : "lg:w-65",
          // Mobile: slide in/out based on isMobileOpen
          isMobileOpen && "max-lg:translate-x-0 max-lg:w-70 max-lg:shadow-dramatic",
        )}
      >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-2 font-semibold text-sidebar-foreground transition-opacity",
            collapsed && "opacity-0"
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg">SaaS App</span>
        </Link>
        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground lg:flex"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <div className={cn("mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50", collapsed && "hidden")}>
          Main
        </div>
        {mainNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={handleNavClick}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              isActive(item.href)
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-subtle"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? item.title : undefined}
          >
            <span className={cn(isActive(item.href) && "text-sidebar-primary-foreground")}>
              {item.icon}
            </span>
            {!collapsed && (
              <>
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        ))}
      </nav>

      {/* User Menu */}
      <div className="border-t border-sidebar-border p-3">
        <UserMenu user={user} collapsed={collapsed} />
      </div>
    </aside>
    </>
  );
}
