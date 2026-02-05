"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  Globe,
  HelpCircle,
  CreditCard,
  Info,
  LogOut,
  ChevronRight,
  Check,
  Sun,
  Moon,
  Monitor,
  Loader2,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useLocale } from "@/hooks/use-locale";
import { localeLabels, localeFlags, type Locale } from "@/i18n/config";
import { authClient } from "@/lib/auth-client";
import { useSidebar } from "@/components/dashboard/sidebar-provider";

type Theme = "light" | "dark" | "system";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem("theme") as Theme) || "system";
}

interface UserMenuProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  collapsed?: boolean;
}

type SubMenu = "language" | "theme" | "learn" | null;

export function UserMenu({ user, collapsed = false }: UserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [subMenu, setSubMenu] = useState<SubMenu>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { openPlans } = useSidebar();
  const [theme, setTheme] = useState<Theme>("system");
  const menuRef = useRef<HTMLDivElement>(null);

  const { locale, setLocale, isPending: isLocalePending, locales } = useLocale();

  useEffect(() => {
    setMounted(true);
    setTheme(getStoredTheme());
  }, []);

  // Apply theme
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "system") {
      localStorage.removeItem("theme");
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", systemDark);
    } else {
      localStorage.setItem("theme", theme);
      root.classList.toggle("dark", theme === "dark");
    }
  }, [theme, mounted]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSubMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (subMenu) {
          setSubMenu(null);
        } else {
          setOpen(false);
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, subMenu]);

  const toggleMenu = useCallback(() => {
    setOpen((prev) => {
      if (prev) setSubMenu(null);
      return !prev;
    });
  }, []);

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      router.push("/sign-in");
      router.refresh();
    } catch {
      setIsSigningOut(false);
    }
  }, [router]);

  const handleThemeChange = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    setSubMenu(null);
  }, []);

  const handleLocaleChange = useCallback(
    (newLocale: Locale) => {
      if (newLocale !== locale) {
        setLocale(newLocale);
      }
      setSubMenu(null);
    },
    [locale, setLocale]
  );

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      setSubMenu(null);
      router.push(href);
    },
    [router]
  );

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
    { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
    { value: "system", label: "System", icon: <Monitor className="h-4 w-4" /> },
  ];

  return (
    <div ref={menuRef} className="relative">
      {/* Dropdown - opens upward */}
      {open && (
        <div className="absolute bottom-full left-0 right-0 z-50 mb-2 animate-scale-in rounded-xl border border-border bg-popover p-1.5 shadow-floating">
          {/* Submenu: Language */}
          {subMenu === "language" ? (
            <div>
              <button
                onClick={() => setSubMenu(null)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                <span>Back</span>
              </button>
              <div className="my-1 h-px bg-border" />
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  disabled={isLocalePending}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">{localeFlags[loc]}</span>
                    {localeLabels[loc]}
                  </span>
                  {locale === loc && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          ) : subMenu === "theme" ? (
            /* Submenu: Theme */
            <div>
              <button
                onClick={() => setSubMenu(null)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                <span>Back</span>
              </button>
              <div className="my-1 h-px bg-border" />
              {themeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleThemeChange(opt.value)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="flex items-center gap-2.5">
                    {opt.icon}
                    {opt.label}
                  </span>
                  {mounted && theme === opt.value && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          ) : subMenu === "learn" ? (
            /* Submenu: Learn more */
            <div>
              <button
                onClick={() => setSubMenu(null)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                <span>Back</span>
              </button>
              <div className="my-1 h-px bg-border" />
              <a
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Documentation
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                GitHub
              </a>
              <button
                onClick={() => navigate("/pricing")}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Pricing
              </button>
            </div>
          ) : (
            /* Main menu */
            <div>
              {/* Email header */}
              <div className="px-3 py-2 text-sm font-medium text-foreground">
                {user?.email || "user@example.com"}
              </div>

              <div className="my-1 h-px bg-border" />

              {/* Settings */}
              <button
                onClick={() => navigate("/dashboard/settings/profile")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span className="flex items-center gap-2.5">
                  <Settings className="h-4 w-4" />
                  Settings
                </span>
                <kbd className="hidden text-xs text-muted-foreground sm:inline">
                  ⇧+Ctrl+,
                </kbd>
              </button>

              {/* Language */}
              <button
                onClick={() => setSubMenu("language")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span className="flex items-center gap-2.5">
                  <Globe className="h-4 w-4" />
                  Language
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* Theme */}
              <button
                onClick={() => setSubMenu("theme")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span className="flex items-center gap-2.5">
                  {mounted && theme === "dark" ? (
                    <Moon className="h-4 w-4" />
                  ) : mounted && theme === "light" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Monitor className="h-4 w-4" />
                  )}
                  Theme
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* Get help */}
              <button
                onClick={() => navigate("/dashboard/help")}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <HelpCircle className="h-4 w-4" />
                Get help
              </button>

              {/* View all plans */}
              <button
                onClick={() => {
                  setOpen(false);
                  setSubMenu(null);
                  openPlans();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <CreditCard className="h-4 w-4" />
                View all plans
              </button>

              {/* Learn more */}
              <button
                onClick={() => setSubMenu("learn")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span className="flex items-center gap-2.5">
                  <Info className="h-4 w-4" />
                  Learn more
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>

              <div className="my-1 h-px bg-border" />

              {/* Log out */}
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
              >
                {isSigningOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                {isSigningOut ? "Signing out..." : "Log out"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Trigger - user profile area */}
      <button
        onClick={toggleMenu}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-sidebar-accent",
          collapsed && "justify-center px-0",
          open && "bg-sidebar-accent"
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-sm font-medium text-white">
          {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
        </div>
        {!collapsed && (
          <div className="flex-1 overflow-hidden text-left">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.name || "User"}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/60">
              {user?.email || "user@example.com"}
            </p>
          </div>
        )}
      </button>

    </div>
  );
}
