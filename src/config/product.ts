export interface Product {
  name: string;
  slug: string;
  description: string;
  price: number;
  priceInCents: number;
  priceVND: number;
  stripePriceId: string;
  features: string[];
}

export const product: Product = {
  name: "King Template",
  slug: "king-template",
  description:
    "Production-ready Next.js SaaS starter kit with auth, payments, dashboard, and more.",
  price: 99,
  priceInCents: 9900,
  priceVND: 2490000,
  stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_KING_TEMPLATE || "",
  features: [
    "Next.js 16 + React 19 + TypeScript",
    "Better Auth (email, GitHub, Google OAuth)",
    "Stripe payments integration",
    "Prisma ORM + PostgreSQL",
    "Dashboard with sidebar layout",
    "i18n with next-intl (EN/VI)",
    "Rate limiting + CSRF protection",
    "Email system with Resend + React Email",
    "Tailwind CSS 4 with dark mode",
    "Production security headers (CSP, XSS, etc.)",
    "Lifetime updates via GitHub access",
  ],
};
