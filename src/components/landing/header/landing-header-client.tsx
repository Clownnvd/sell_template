"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type NavItem = { label: string; href: string };

export function LandingHeaderClient({
  navItems,
  isAuthed,
}: {
  navItems: NavItem[];
  isAuthed: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isSignIn = pathname === "/sign-in";
  const isSignUp = pathname === "/sign-up";

  // Các page "app" bạn muốn ẩn hoàn toàn nút auth/get-started
  const isAppPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/billing");

  // ✅ Rule của bạn
  const showAuthButtons = !isAuthed && !isAppPage;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-muted">
            <span className="text-sm font-bold">K</span>
          </div>
          <span className="text-sm font-semibold tracking-tight">King Template</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          {showAuthButtons ? (
            <>
              {isSignIn ? (
                <Button asChild>
                  <Link href="/sign-up">Create account</Link>
                </Button>
              ) : isSignUp ? (
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/sign-up">Get started</Link>
                  </Button>
                </>
              )}
            </>
          ) : null}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-2 text-sm md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden", open ? "border-t border-border/60" : "hidden")}>
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {showAuthButtons ? (
            <div className="mt-4 flex flex-col gap-2">
              {isSignIn ? (
                <Button asChild onClick={() => setOpen(false)}>
                  <Link href="/sign-up">Create account</Link>
                </Button>
              ) : isSignUp ? (
                <Button variant="ghost" asChild onClick={() => setOpen(false)}>
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild onClick={() => setOpen(false)}>
                    <Link href="/sign-in">Sign in</Link>
                  </Button>
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link href="/sign-up">Get started</Link>
                  </Button>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
