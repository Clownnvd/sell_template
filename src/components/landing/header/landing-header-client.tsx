"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Menu, X, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
          ? "border-b border-zinc-200 bg-white/90 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
            <span className="text-sm font-bold">K</span>
          </div>
          <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
            King Template
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
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
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">{t("dashboard")}</Link>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">{t("signIn")}</Link>
              </Button>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
              >
                Buy Now — $99
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher variant="minimal" />
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-white"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out md:hidden",
          open ? "max-h-96 border-t border-zinc-200 dark:border-zinc-800" : "max-h-0"
        )}
      >
        <div className="mx-auto max-w-5xl bg-white/95 px-4 py-4 backdrop-blur-lg dark:bg-zinc-950/95">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-4 py-3 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {isAuthed ? (
            <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <Button asChild variant="outline" className="w-full" onClick={() => setOpen(false)}>
                <Link href="/dashboard">{t("dashboard")}</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <Link
                href="/sign-up"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
              >
                Buy Now — $99
                <ArrowRight className="size-4" />
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
