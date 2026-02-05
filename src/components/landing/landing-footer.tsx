import Link from "next/link";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/#faq" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/api-docs" },
      { label: "Status", href: "/status" },
    ],
  },
];

const socialLinks = [
  { icon: XIcon, href: "https://twitter.com", label: "X (Twitter)" },
  { icon: GitHubIcon, href: "https://github.com", label: "GitHub" },
  { icon: LinkedInIcon, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: MailIcon, href: "mailto:hello@example.com", label: "Email" },
];

export function LandingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-muted/20">
      {/* Red gradient divider */}
      <div className="absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-red-500/40 to-transparent" />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-red-500/5 blur-[100px]" />
        <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-amber-500/5 blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-2 gap-12 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-red-600 to-red-800 text-white shadow-lg dark:from-red-500 dark:to-red-700">
                <span className="text-lg font-bold">K</span>
              </div>
              <span className="text-xl font-bold">King Template</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Build your SaaS faster with a production-ready starter. Authentication, payments, and dashboard included.
            </p>

            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:border-red-500/30 hover:text-red-600 dark:hover:text-red-400"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold">{group.title}</h4>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-16 rounded-2xl border border-border bg-card/50 p-8 shadow-card">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h3 className="text-lg font-semibold">Subscribe to our newsletter</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get the latest updates and news directly to your inbox.
              </p>
            </div>
            <div className="flex w-full max-w-md gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address for newsletter"
                className="h-12 flex-1 rounded-xl border border-border bg-background px-4 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
              <button
                type="button"
                className="h-12 rounded-xl bg-red-600 px-6 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} King Template. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Built with</span>
            <span className="text-red-500">&hearts;</span>
            <span>using</span>
            <span className="font-medium text-foreground">Next.js</span>
            <span>&</span>
            <span className="font-medium text-foreground">Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
