"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronUp, User } from "lucide-react";
import { cn } from "@/utils/cn";

interface Product {
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  href: string;
  ctaLabel?: string;
}

const products: Product[] = [
  {
    name: "Free",
    subtitle: "Perfect for getting started",
    price: 0,
    href: "/pricing",
    ctaLabel: "Get Started — Free",
  },
  {
    name: "Basic",
    subtitle: "Essential for small teams",
    price: 29,
    href: "/pricing",
    ctaLabel: "Get Basic — $29/mo",
  },
  {
    name: "Pro",
    subtitle: "For growing businesses",
    price: 99,
    badge: "POPULAR",
    href: "/pricing",
    ctaLabel: "Get Pro — $99/mo",
  },
];

export function PurchaseDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Account icon */}
      <div className="flex items-center gap-2">
        <Link
          href="/sign-in"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-colors hover:border-red-500/30 hover:text-foreground"
          aria-label="Account"
        >
          <User className="h-4 w-4" />
        </Link>

        {/* Purchase button */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all",
            "bg-linear-to-r from-amber-600 to-amber-500 text-white shadow-md",
            "hover:from-amber-500 hover:to-amber-400 hover:shadow-lg",
            "dark:from-amber-600 dark:to-amber-500 dark:hover:from-amber-500 dark:hover:to-amber-400"
          )}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          Purchase
          <ChevronUp
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              !isOpen && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Dropdown */}
      <div
        className={cn(
          "absolute right-0 top-full z-50 mt-2 w-80 origin-top-right transition-all duration-200",
          isOpen
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        )}
      >
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-dramatic backdrop-blur-xl dark:bg-zinc-900/95">
          {products.map((product, index) => (
            <div
              key={product.name}
              className={cn(
                "relative",
                index < products.length - 1 && "border-b border-border/30"
              )}
            >
              <div className="p-4">
                {/* Product header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold">{product.name}</span>
                      {product.badge ? (
                        <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-600 dark:text-amber-400">
                          {product.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {product.subtitle}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    {product.originalPrice ? (
                      <div className="text-xs text-muted-foreground line-through">
                        ${product.originalPrice}
                      </div>
                    ) : null}
                    <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                      ${product.price}
                    </div>
                  </div>
                </div>

                {/* CTA button */}
                {product.ctaLabel ? (
                  <Link
                    href={product.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "mt-3 flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
                      product.badge
                        ? "bg-linear-to-r from-red-600 to-red-500 text-white shadow-md hover:from-red-500 hover:to-red-400"
                        : product.price === 0
                          ? "border border-border bg-background text-foreground hover:bg-muted"
                          : "bg-linear-to-r from-amber-600 to-amber-500 text-white shadow-md hover:from-amber-500 hover:to-amber-400"
                    )}
                  >
                    {product.ctaLabel}
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
