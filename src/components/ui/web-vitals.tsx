"use client";

import { useEffect } from "react";

/**
 * Tracks Core Web Vitals (LCP, FID/INP, CLS) using PerformanceObserver.
 * In production, pipe metrics to your analytics service.
 * Renders nothing — mount in root layout.
 */
export function WebVitals() {
  useEffect(() => {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (process.env.NODE_ENV === "development") {
          console.debug(
            `[Web Vital] ${entry.entryType}: ${entry.name} ${Math.round(entry.startTime)}ms`
          );
        }
      }
    });

    try {
      observer.observe({ type: "largest-contentful-paint", buffered: true });
      observer.observe({ type: "first-input", buffered: true });
      observer.observe({ type: "layout-shift", buffered: true });
    } catch {
      // Some entry types may not be supported in all browsers
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
