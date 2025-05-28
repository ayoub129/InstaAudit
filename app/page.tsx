import { LandingHero } from "@/components/landing/hero"
import { LandingFeatures } from "@/components/landing/features"
import { LandingTestimonials } from "@/components/landing/testimonials"
import { LandingPricing } from "@/components/landing/pricing"
import { LandingFAQ } from "@/components/landing/faq"
import { LandingFooter } from "@/components/landing/footer"
import { LandingHeader } from "@/components/landing/header"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <LandingFeatures />
        <LandingTestimonials />
        <LandingPricing />
        <LandingFAQ />
      </main>
      <LandingFooter />
    </div>
  )
}
