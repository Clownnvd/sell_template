import dynamic from "next/dynamic";
import { HeroSection } from "@/components/landing/hero-section";
import { LogosSection } from "@/components/landing/logos-section";
import { HeroParallaxSection } from "@/components/landing/hero-parallax-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { ROISection } from "@/components/landing/roi-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FinalCTASection } from "@/components/landing/final-cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";

// ISR: Revalidate landing page every hour
export const revalidate = 3600;

// Below-fold client sections — lazy loaded for bundle splitting
const HowItWorksSection = dynamic(() =>
  import("@/components/landing/how-it-works-section").then((m) => ({
    default: m.HowItWorksSection,
  }))
);
const PricingSection = dynamic(() =>
  import("@/components/landing/pricing-section").then((m) => ({
    default: m.PricingSection,
  }))
);
const FAQSection = dynamic(() =>
  import("@/components/landing/faq-section").then((m) => ({
    default: m.FAQSection,
  }))
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg"
      >
        Skip to content
      </a>
      <main id="main-content">
        <HeroSection />
        <LogosSection />
        <HeroParallaxSection />
        <FeaturesSection />
        <ROISection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
