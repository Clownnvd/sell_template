import { HeroSection } from "@/components/landing/hero-section";
import { LogosSection } from "@/components/landing/logos-section";
import { VideoSection } from "@/components/landing/video-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingTeaserSection } from "@/components/landing/pricing-teaser-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FinalCTASection } from "@/components/landing/final-cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <LogosSection />
        <VideoSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingTeaserSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
