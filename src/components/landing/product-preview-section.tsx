"use client";

import { useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const PREVIEW_SCREENS = [
  {
    label: "Landing Page",
    lightBg: "from-red-50 to-amber-50",
    darkBg: "from-zinc-900 to-zinc-800",
  },
  {
    label: "Dashboard",
    lightBg: "from-amber-50 to-orange-50",
    darkBg: "from-zinc-800 to-zinc-900",
  },
  {
    label: "Auth Flow",
    lightBg: "from-orange-50 to-red-50",
    darkBg: "from-zinc-900 to-zinc-950",
  },
];

export function ProductPreviewSection() {
  const [darkPreview, setDarkPreview] = useState(false);

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              See it in <span className="text-gradient">action</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A polished, production-ready template with light &amp; dark mode built in.
            </p>

            {/* Light/Dark toggle */}
            <div
              className="mt-6 inline-flex items-center gap-1 rounded-full border border-border bg-card p-1"
              role="radiogroup"
              aria-label="Preview theme"
            >
              <button
                type="button"
                role="radio"
                aria-checked={!darkPreview}
                onClick={() => setDarkPreview(false)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  !darkPreview
                    ? "bg-gradient-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sun className="size-3.5" aria-hidden="true" />
                Light
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={darkPreview}
                onClick={() => setDarkPreview(true)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  darkPreview
                    ? "bg-gradient-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Moon className="size-3.5" aria-hidden="true" />
                Dark
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Preview cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {PREVIEW_SCREENS.map((screen, i) => (
            <ScrollReveal key={screen.label} delay={i * 100}>
              <div className="border-gradient group overflow-hidden rounded-2xl">
                <div className="card-hover rounded-2xl border border-border bg-card p-1.5">
                  {/* Mock browser chrome */}
                  <div className="flex items-center gap-2 px-3 py-2">
                    <div className="flex gap-1.5">
                      <div className="size-2.5 rounded-full bg-red-400/60" />
                      <div className="size-2.5 rounded-full bg-amber-400/60" />
                      <div className="size-2.5 rounded-full bg-emerald-400/60" />
                    </div>
                    <div className="flex-1 rounded-md bg-muted/50 px-3 py-1">
                      <span className="text-[10px] text-muted-foreground">
                        king-template.vercel.app
                      </span>
                    </div>
                    <Monitor className="size-3 text-muted-foreground" />
                  </div>

                  {/* Preview area */}
                  <div
                    className={`flex aspect-4/3 flex-col items-center justify-center rounded-lg bg-linear-to-br transition-colors duration-500 ${
                      darkPreview ? screen.darkBg : screen.lightBg
                    }`}
                  >
                    {/* Placeholder skeleton */}
                    <div className="w-3/4 space-y-3 p-4">
                      <div
                        className={`h-3 w-2/3 rounded-full ${
                          darkPreview ? "bg-white/10" : "bg-black/5"
                        }`}
                      />
                      <div
                        className={`h-2 w-full rounded-full ${
                          darkPreview ? "bg-white/8" : "bg-black/4"
                        }`}
                      />
                      <div
                        className={`h-2 w-4/5 rounded-full ${
                          darkPreview ? "bg-white/8" : "bg-black/4"
                        }`}
                      />
                      <div className="mt-4 h-8 w-1/2 rounded-lg bg-gradient-primary opacity-80" />
                    </div>
                  </div>

                  {/* Label */}
                  <div className="px-3 py-2.5">
                    <span className="text-sm font-medium text-foreground">
                      {screen.label}
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={400}>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Replace placeholders with your own screenshots after purchase
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
