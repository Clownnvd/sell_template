"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";

type Direction = "up" | "left" | "right";

const ANIMATION_MAP: Record<Direction, string> = {
  up: "animate-slide-up",
  left: "animate-slide-in-left",
  right: "animate-slide-in-right",
};

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        isVisible ? ANIMATION_MAP[direction] : "opacity-0",
        className
      )}
      style={{
        animationDelay: isVisible ? `${delay}ms` : undefined,
        animationFillMode: "both",
      }}
    >
      {children}
    </div>
  );
}
