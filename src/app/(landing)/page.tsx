import { HeroSection } from "@/components/landing/hero-section";
import { LogosSection } from "@/components/landing/logos-section";
import { HeroParallaxSection } from "@/components/landing/hero-parallax-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { ROISection } from "@/components/landing/roi-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FinalCTASection } from "@/components/landing/final-cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
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
