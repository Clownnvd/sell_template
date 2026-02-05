import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-200 px-4 py-12 sm:px-6 lg:px-8 dark:border-zinc-800">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-zinc-900 dark:text-white">King Template</span>
          </div>
          <nav className="flex gap-6">
            <Link href="/#features" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
              Features
            </Link>
            <Link href="/#pricing" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
              Pricing
            </Link>
            <Link href="/#faq" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
              FAQ
            </Link>
          </nav>
        </div>
        <div className="mt-8 text-center text-xs text-zinc-400 dark:text-zinc-500">
          &copy; {new Date().getFullYear()} King Template. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
