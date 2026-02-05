"use client";

import { useEffect, useState, useCallback } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "./button";

type Theme = "light" | "dark" | "system";

// Get initial theme from localStorage (only runs on client)
function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem("theme") as Theme) || "system";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage after mount
  /* eslint-disable react-hooks/set-state-in-effect -- Intentional: hydration pattern */
  useEffect(() => {
    setMounted(true);
    setTheme(getStoredTheme());
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Apply theme to DOM and save to localStorage
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

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle("dark", e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme, mounted]);

  const cycleTheme = useCallback(() => {
    const next: Record<Theme, Theme> = {
      light: "dark",
      dark: "system",
      system: "light",
    };
    setTheme((current) => next[current]);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="h-9 w-9 transition-colors"
      title={`Current: ${theme}. Click to change.`}
    >
      {theme === "light" ? <Sun className="h-4 w-4" /> : null}
      {theme === "dark" ? <Moon className="h-4 w-4" /> : null}
      {theme === "system" ? <Monitor className="h-4 w-4" /> : null}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
