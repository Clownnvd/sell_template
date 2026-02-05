"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, HelpCircle } from "lucide-react";

import { cn } from "@/utils/cn";

type FAQKey = "changePlan" | "paymentMethods" | "refunds" | "production" | "selfHost" | "support";

const faqKeys: FAQKey[] = ["changePlan", "paymentMethods", "refunds", "production", "selfHost", "support"];

function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={cn("border-b border-border/50 last:border-0", isOpen && "border-red-500/20")}>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-red-600 dark:hover:text-red-400 sm:py-6"
      >
        <span className="font-medium">{question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180 text-red-600 dark:text-red-400"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <p className="leading-relaxed text-muted-foreground pr-12">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQSection() {
  const t = useTranslations("landing.faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative scroll-mt-24 overflow-hidden bg-muted/20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-red-500/5 blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-20 md:py-32">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
                <HelpCircle className="h-4 w-4" />
                {t("badge")}
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                {t("title")}{" "}
                <span className="bg-linear-to-r from-red-600 via-red-500 to-amber-500 bg-clip-text text-transparent dark:from-red-500 dark:to-amber-400">
                  {t("titleHighlight")}
                </span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">{t("description")}</p>

              <div className="mt-8">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700"
                >
                  {t("contactSupport")}
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border/50 bg-card/50 px-6 shadow-card backdrop-blur-sm">
              {faqKeys.map((key, index) => (
                <FAQItem
                  key={key}
                  question={t(`items.${key}.q`)}
                  answer={t(`items.${key}.a`)}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
