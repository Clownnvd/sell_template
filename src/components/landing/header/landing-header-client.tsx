"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PurchaseDropdown } from "@/components/landing/header/purchase-dropdown";
import { cn } from "@/utils/cn";

type NavItem = { label: string; href: string };

export function LandingHeaderClient({
  navItems,
  isAuthed,
}: {
  navItems: NavItem[];
  isAuthed: boolean;
}) {
  const t = useTranslations("navigation");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/40 bg-background/90 shadow-subtle backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo - Ferrari style */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-red-600 to-red-800 text-white shadow-md dark:from-red-500 dark:to-red-700">
            <span className="text-sm font-bold">K</span>
          </div>
          <span className="text-base font-semibold tracking-tight">King Template</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-500/5 hover:text-foreground dark:hover:bg-red-500/10"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher variant="minimal" />
          <ThemeToggle />

          {isAuthed ? (
            <Button asChild className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700">
              <Link href="/dashboard">{t("dashboard")}</Link>
            </Button>
          ) : (
            <PurchaseDropdown />
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher variant="minimal" />
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out md:hidden",
          open ? "max-h-96 border-t border-border/40 animate-slide-down" : "max-h-0"
        )}
      >
        <div className="container mx-auto max-w-7xl bg-background/95 px-4 py-4 backdrop-blur-lg">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-500/5 hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {isAuthed ? (
            <div className="mt-4 border-t border-border/40 pt-4">
              <Button asChild className="w-full bg-red-600 hover:bg-red-700" onClick={() => setOpen(false)}>
                <Link href="/dashboard">{t("dashboard")}</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-2 border-t border-border/40 pt-4">
              <Link
                href="/pricing"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center rounded-xl bg-linear-to-r from-amber-600 to-amber-500 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-amber-500 hover:to-amber-400"
              >
                Purchase — View Plans
              </Link>
              <Button variant="outline" asChild onClick={() => setOpen(false)}>
                <Link href="/sign-in">{t("signIn")}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
