"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  Globe,
  HelpCircle,
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
  const [theme, setTheme] = useState<Theme>("system");
  const menuRef = useRef<HTMLDivElement>(null);

  const { locale, setLocale, isPending: isLocalePending, locales } = useLocale();

  useEffect(() => {
    setMounted(true);
    setTheme(getStoredTheme());
  }, []);

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
    { value: "light", label: "Light", icon: <Sun className="size-4" /> },
    { value: "dark", label: "Dark", icon: <Moon className="size-4" /> },
    { value: "system", label: "System", icon: <Monitor className="size-4" /> },
  ];

  return (
    <div ref={menuRef} className="relative">
      {open && (
        <div className="absolute bottom-full left-0 right-0 z-50 mb-2 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          {/* Submenu: Language */}
          {subMenu === "language" ? (
            <div>
              <button
                onClick={() => setSubMenu(null)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                <ChevronRight className="size-4 rotate-180" />
                <span>Back</span>
              </button>
              <div className="my-1 h-px bg-zinc-100 dark:bg-zinc-800" />
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  disabled={isLocalePending}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">{localeFlags[loc]}</span>
                    {localeLabels[loc]}
                  </span>
                  {locale === loc && <Check className="size-4 text-zinc-900 dark:text-white" />}
                </button>
              ))}
            </div>
          ) : subMenu === "theme" ? (
            <div>
              <button
                onClick={() => setSubMenu(null)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                <ChevronRight className="size-4 rotate-180" />
                <span>Back</span>
              </button>
              <div className="my-1 h-px bg-zinc-100 dark:bg-zinc-800" />
              {themeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleThemeChange(opt.value)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                  <span className="flex items-center gap-2.5">
                    {opt.icon}
                    {opt.label}
                  </span>
                  {mounted && theme === opt.value && <Check className="size-4 text-zinc-900 dark:text-white" />}
                </button>
              ))}
            </div>
          ) : subMenu === "learn" ? (
            <div>
              <button
                onClick={() => setSubMenu(null)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                <ChevronRight className="size-4 rotate-180" />
                <span>Back</span>
              </button>
              <div className="my-1 h-px bg-zinc-100 dark:bg-zinc-800" />
              <a
                href="https://nextjs.org/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                Documentation
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                GitHub
              </a>
            </div>
          ) : (
            /* Main menu */
            <div>
              <div className="px-3 py-2 text-sm font-medium text-zinc-900 dark:text-white">
                {user?.email || "user@example.com"}
              </div>

              <div className="my-1 h-px bg-zinc-100 dark:bg-zinc-800" />

              <button
                onClick={() => navigate("/dashboard/settings/profile")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                <span className="flex items-center gap-2.5">
                  <Settings className="size-4" />
                  Settings
                </span>
              </button>

              <button
                onClick={() => setSubMenu("language")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                <span className="flex items-center gap-2.5">
                  <Globe className="size-4" />
                  Language
                </span>
                <ChevronRight className="size-4 text-zinc-400" />
              </button>

              <button
                onClick={() => setSubMenu("theme")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                <span className="flex items-center gap-2.5">
                  {mounted && theme === "dark" ? (
                    <Moon className="size-4" />
                  ) : mounted && theme === "light" ? (
                    <Sun className="size-4" />
                  ) : (
                    <Monitor className="size-4" />
                  )}
                  Theme
                </span>
                <ChevronRight className="size-4 text-zinc-400" />
              </button>

              <button
                onClick={() => navigate("/dashboard/help")}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                <HelpCircle className="size-4" />
                Get help
              </button>

              <button
                onClick={() => setSubMenu("learn")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                <span className="flex items-center gap-2.5">
                  <Info className="size-4" />
                  Learn more
                </span>
                <ChevronRight className="size-4 text-zinc-400" />
              </button>

              <div className="my-1 h-px bg-zinc-100 dark:bg-zinc-800" />

              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                {isSigningOut ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <LogOut className="size-4" />
                )}
                {isSigningOut ? "Signing out..." : "Log out"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Trigger */}
      <button
        onClick={toggleMenu}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
          collapsed && "justify-center px-0",
          open && "bg-zinc-100 dark:bg-zinc-800"
        )}
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">
          {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
        </div>
        {!collapsed && (
          <div className="flex-1 overflow-hidden text-left">
            <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
              {user?.name || "User"}
            </p>
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
              {user?.email || "user@example.com"}
            </p>
          </div>
        )}
      </button>
    </div>
  );
}
