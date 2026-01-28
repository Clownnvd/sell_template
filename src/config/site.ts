export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "SaaS Template",
  description: "A modern SaaS template built with Next.js 16, Prisma, and BetterAuth",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: `${process.env.NEXT_PUBLIC_APP_URL}/og.jpg`,
  links: {
    twitter: "https://twitter.com/yourusername",
    github: "https://github.com/yourusername/saas-template",
    docs: "https://docs.yoursite.com",
  },
  creator: "Your Name",
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "TypeScript",
    "SaaS",
    "Prisma",
    "BetterAuth",
    "Stripe",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
