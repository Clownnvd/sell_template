import Link from "next/link";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/docs", label: "Docs" },
  { href: "/changelog", label: "Changelog" },
  { href: "/contact", label: "Contact" },
] as const;

const legalLinks = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refund", label: "Refund Policy" },
] as const;

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
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-1">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-muted-foreground/70 transition-colors hover:text-muted-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} King Template. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
