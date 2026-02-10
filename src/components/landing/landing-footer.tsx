import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-border px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded bg-gradient-primary text-xs font-bold text-white">
              K
            </div>
            <span className="text-lg font-bold text-foreground">King Template</span>
          </div>
          <nav className="flex gap-6">
            <Link href="/#features" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              Features
            </Link>
            <Link href="/#pricing" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              Pricing
            </Link>
            <Link href="/#faq" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              FAQ
            </Link>
          </nav>
        </div>
        <div className="mt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} King Template. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
