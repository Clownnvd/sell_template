"use client";

import { HeroParallax, type ProductItem } from "@/components/ui/hero-parallax";

const products: ProductItem[] = [
  {
    title: "Landing Page",
    link: "#",
    thumbnail: "https://picsum.photos/id/0/800/600",
  },
  {
    title: "Dashboard",
    link: "#",
    thumbnail: "https://picsum.photos/id/1/800/600",
  },
  {
    title: "Auth Flow",
    link: "#",
    thumbnail: "https://picsum.photos/id/2/800/600",
  },
  {
    title: "Dark Mode",
    link: "#",
    thumbnail: "https://picsum.photos/id/3/800/600",
  },
  {
    title: "Pricing",
    link: "#",
    thumbnail: "https://picsum.photos/id/10/800/600",
  },
  {
    title: "Dashboard Dark",
    link: "#",
    thumbnail: "https://picsum.photos/id/20/800/600",
  },
  {
    title: "Auth Dark",
    link: "#",
    thumbnail: "https://picsum.photos/id/26/800/600",
  },
  {
    title: "Settings",
    link: "#",
    thumbnail: "https://picsum.photos/id/36/800/600",
  },
  {
    title: "Email Templates",
    link: "#",
    thumbnail: "https://picsum.photos/id/48/800/600",
  },
  {
    title: "i18n Support",
    link: "#",
    thumbnail: "https://picsum.photos/id/60/800/600",
  },
  {
    title: "Mobile View",
    link: "#",
    thumbnail: "https://picsum.photos/id/96/800/600",
  },
  {
    title: "API Docs",
    link: "#",
    thumbnail: "https://picsum.photos/id/119/800/600",
  },
  {
    title: "Stripe Integration",
    link: "#",
    thumbnail: "https://picsum.photos/id/160/800/600",
  },
  {
    title: "GitHub OAuth",
    link: "#",
    thumbnail: "https://picsum.photos/id/180/800/600",
  },
  {
    title: "Deployment",
    link: "#",
    thumbnail: "https://picsum.photos/id/201/800/600",
  },
];

export function HeroParallaxSection() {
  return (
    <HeroParallax
      products={products}
      heading={
        <>
          See every page
          <br />
          <span className="text-gradient">in action</span>
        </>
      }
      subheading="King Template ships with a complete set of production-ready pages — landing, dashboard, auth, billing, and more. Scroll to explore what you get."
    />
  );
}
