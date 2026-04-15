"use client"

import { useState } from "react"
import { Navigation } from "@/components/landing/navigation"
import { HeroSection } from "@/components/landing/hero-section"
import { LogoStrip } from "@/components/landing/logo-strip"
import { StatsBar } from "@/components/landing/stats-bar"
import { HowItWorks } from "@/components/landing/how-it-works"
import { FeaturesSection } from "@/components/landing/features-section"
import { DemoPreview } from "@/components/landing/demo-preview"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { FAQSection } from "@/components/landing/faq-section"
import { CTAStrip } from "@/components/landing/cta-strip"
import { Footer } from "@/components/landing/footer"
import { DemoModal } from "@/components/landing/demo-modal"

export function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      <Navigation />
      <HeroSection onWatchDemo={() => setDemoOpen(true)} />
      <LogoStrip />
      <StatsBar />
      <FeaturesSection />
      <HowItWorks />
      <DemoPreview />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTAStrip />
      <Footer />
      <DemoModal open={demoOpen} onOpenChange={setDemoOpen} />
    </main>
  )
}
