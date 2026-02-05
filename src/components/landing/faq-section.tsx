"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

const faqs = [
  {
    question: "What do I get after purchase?",
    answer: "You get full access to the private GitHub repository containing the complete source code. This includes authentication, Stripe payments, dashboard, email system, i18n, and all the infrastructure code.",
  },
  {
    question: "How do I get the code?",
    answer: "After purchase, enter your GitHub username in the dashboard. We'll send you a collaborator invite to the private repository. Accept the invite and clone the repo.",
  },
  {
    question: "Do I get lifetime updates?",
    answer: "Yes. As a collaborator on the repo, you'll have access to all future updates, bug fixes, and new features pushed to the repository.",
  },
  {
    question: "Can I use this for multiple projects?",
    answer: "Yes. You can use King Template for as many projects as you want. There are no per-project licenses or restrictions.",
  },
  {
    question: "What's the refund policy?",
    answer: "We offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.",
  },
  {
    question: "Do I need a GitHub account?",
    answer: "Yes, a GitHub account is required to access the repository. You can create one for free at github.com.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-zinc-50 px-4 py-24 sm:px-6 lg:px-8 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-12 divide-y divide-zinc-200 dark:divide-zinc-800">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between py-5 text-left"
              >
                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-zinc-400 transition-transform",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              {openIndex === index && (
                <p className="pb-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
