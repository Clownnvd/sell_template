const faqs = [
  {
    q: "Can I change my plan later?",
    a: "Yes. You can upgrade or downgrade anytime. Changes apply to your next billing cycle.",
  },
  {
    q: "What payment methods do you accept?",
    a: "All major cards via Stripe. You can also manage invoices and subscriptions from the customer portal.",
  },
  {
    q: "Do you offer refunds?",
    a: "For paid plans, you can offer a money-back guarantee policy. Implement it through your support flow and Stripe settings.",
  },
  {
    q: "Is this template production-ready?",
    a: "It’s designed with production patterns: server-first routing, protected pages, Stripe webhooks, and a scalable org model.",
  },
  {
    q: "Can I self-host?",
    a: "Yes. Deploy on Vercel, a VPS, or any Node platform that supports Next.js and your database.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="scroll-mt-24">
      <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            FAQ
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Quick answers to common questions.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card">
          {faqs.map((item) => (
            <details key={item.q} className="group p-6">
              <summary className="cursor-pointer list-none select-none">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-semibold">{item.q}</h3>
                  <span className="text-muted-foreground transition group-open:rotate-45">
                    +
                  </span>
                </div>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
