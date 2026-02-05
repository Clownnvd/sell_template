"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";

export function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-red-500/5 blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-20 md:py-28">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
            See it in action
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Watch how it{" "}
            <span className="bg-linear-to-r from-red-600 via-red-500 to-amber-500 bg-clip-text text-transparent dark:from-red-500 dark:to-amber-400">
              works
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From clone to production in minutes. See the full developer experience.
          </p>
        </div>

        {/* Video container */}
        <div className="relative mx-auto mt-12 max-w-4xl">
          <div className="absolute -inset-4 rounded-3xl bg-linear-to-r from-red-600/15 via-transparent to-amber-500/15 opacity-50 blur-2xl" />

          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-dramatic">
            {isPlaying ? (
              <div className="relative aspect-video w-full">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0"
                  title="Product Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <button
                  type="button"
                  onClick={() => setIsPlaying(false)}
                  className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                  aria-label="Close video"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div
                className="group relative aspect-video w-full cursor-pointer"
                onClick={() => setIsPlaying(true)}
                role="button"
                tabIndex={0}
                aria-label="Play demo video"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setIsPlaying(true);
                  }
                }}
              >
                {/* Video thumbnail */}
                <div className="absolute inset-0 bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900">
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 40L40 0' stroke='%23fff' stroke-width='0.5'/%3E%3C/svg%3E")`,
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-red-600/20 via-transparent to-transparent" />

                  {/* Dashboard mockup */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="w-full max-w-2xl space-y-4 opacity-20">
                      <div className="flex gap-4">
                        <div className="h-20 w-1/3 rounded-lg bg-white/10" />
                        <div className="h-20 w-1/3 rounded-lg bg-white/10" />
                        <div className="h-20 w-1/3 rounded-lg bg-white/10" />
                      </div>
                      <div className="h-32 rounded-lg bg-white/10" />
                      <div className="flex gap-4">
                        <div className="h-16 w-1/2 rounded-lg bg-white/10" />
                        <div className="h-16 w-1/2 rounded-lg bg-white/10" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 shadow-ferrari transition-all group-hover:scale-110 group-hover:shadow-xl">
                    <Play className="ml-1 h-8 w-8 text-white" fill="white" />
                  </div>
                </div>

                {/* Bottom bar */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-black/60 to-transparent p-6">
                  <div>
                    <div className="text-sm font-semibold text-white">Product Demo</div>
                    <div className="text-xs text-white/60">2:30 min</div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                    HD Quality
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
