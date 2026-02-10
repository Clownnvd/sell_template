import Image from "next/image";
import { HeroParallax, type ProductItem } from "@/components/ui/hero-parallax";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const products: ProductItem[] = [
  { title: "Landing Page", link: "#", thumbnail: "/images/hero/hero-01.jpg" },
  { title: "Dashboard", link: "#", thumbnail: "/images/hero/hero-02.jpg" },
  { title: "Auth Flow", link: "#", thumbnail: "/images/hero/hero-03.jpg" },
  { title: "Dark Mode", link: "#", thumbnail: "/images/hero/hero-04.jpg" },
  { title: "Pricing", link: "#", thumbnail: "/images/hero/hero-05.jpg" },
  { title: "Dashboard Dark", link: "#", thumbnail: "/images/hero/hero-06.jpg" },
  { title: "Auth Dark", link: "#", thumbnail: "/images/hero/hero-07.jpg" },
  { title: "Settings", link: "#", thumbnail: "/images/hero/hero-08.jpg" },
  { title: "Email Templates", link: "#", thumbnail: "/images/hero/hero-09.jpg" },
  { title: "i18n Support", link: "#", thumbnail: "/images/hero/hero-10.jpg" },
  { title: "Mobile View", link: "#", thumbnail: "/images/hero/hero-11.jpg" },
  { title: "API Docs", link: "#", thumbnail: "/images/hero/hero-12.jpg" },
  { title: "Stripe Integration", link: "#", thumbnail: "/images/hero/hero-13.jpg" },
  { title: "GitHub OAuth", link: "#", thumbnail: "/images/hero/hero-14.jpg" },
  { title: "Deployment", link: "#", thumbnail: "/images/hero/hero-15.jpg" },
];

const mobilePreviewProducts = products.slice(0, 6);

function MobilePreview() {
  return (
    <section className="px-4 py-16 sm:px-6 md:hidden">
      <div className="mx-auto max-w-lg">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              See every page{" "}
              <span className="text-gradient">in action</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Production-ready pages — landing, dashboard, auth, billing, and more.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {mobilePreviewProducts.map((product) => (
              <div
                key={product.title}
                className="overflow-hidden rounded-xl border border-border shadow-sm"
              >
                <Image
                  src={product.thumbnail!}
                  alt={product.title}
                  width={400}
                  height={300}
                  className="aspect-4/3 w-full object-cover object-top"
                  loading="lazy"
                />
                <div className="bg-card px-3 py-2">
                  <span className="text-xs font-medium text-muted-foreground">{product.title}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function HeroParallaxSection() {
  return (
    <>
      <MobilePreview />
      <div className="hidden md:block">
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
      </div>
    </>
  );
}
