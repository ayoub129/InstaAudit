"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useInView } from "@/hooks/use-in-view"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type PricingPlan = {
  _id: string
  slug: string
  name: string
  subtitle: string
  description?: string
  priceMonthly: number
  priceAnnual?: number
  ctaText: string
  ctaLink?: string
  badge?: string
  isPopular: boolean
  order: number
  note?: string
  features: string[]
}

type PricingApiResponse = {
  success: boolean
  plans: PricingPlan[]
}

function formatPrice(price: number) {
  return `$${price}`
}

export function PricingSection() {
  const { ref, inView } = useInView()
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const handlePlanSelect = (planSlug: string, billing: "annual" | "monthly") => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "instaaudit_selected_pricing",
        JSON.stringify({
          plan: planSlug,
          billing: billing,
        })
      )
    }
  }

  useEffect(() => {
    let isMounted = true

    async function fetchPricing() {
      try {
        const res = await fetch("/api/pricing", { cache: "no-store" })
        const data: PricingApiResponse = await res.json()

        if (!res.ok || !data.success) {
          throw new Error("Failed to fetch pricing")
        }

        if (isMounted) {
          setPlans(data.plans || [])
        }
      } catch (error) {
        console.error(error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchPricing()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section id="pricing" ref={ref} className="relative px-5 py-16 sm:px-6 sm:py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div
          className={cn(
            "mb-12 text-center transition-all duration-700 sm:mb-16",
            inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-foreground/60">
            Start free. Upgrade when you need unlimited audits and AI-powered plans.
          </p>
          <Link
            href="/pricing"
            className="mt-4 inline-flex cursor-pointer items-center text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Compare all features →
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="min-h-[520px] p-5 sm:p-6 md:p-8" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-4">
            {plans.map((plan, index) => {
              const price = plan.priceMonthly
              const period = price === 0 ? "" : "/month"

              return (
                <Card
                  key={plan._id}
                  className={cn(
                    "relative flex flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6 md:p-8",
                    plan.isPopular
                      ? "border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5 shadow-lg shadow-primary/20 md:scale-105 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/25"
                      : "border-border/40 bg-white/50 backdrop-blur-sm hover:border-primary/30 dark:bg-card/80",
                    inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  )}
                  style={{ transitionDelay: inView ? `${index * 100}ms` : "0ms" }}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1 text-sm font-semibold text-white">
                      {plan.badge || "Most popular"}
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="mb-2 text-2xl font-bold text-foreground">{plan.name}</h3>
                    <p className="text-sm text-foreground/60">
                      {plan.subtitle || plan.description}
                    </p>
                  </div>

                  <div className="mb-2">
                    <span className="text-4xl font-bold text-foreground">
                      {formatPrice(price)}
                    </span>
                    {period && <span className="text-foreground/60">{period}</span>}
                  </div>

                  <p className="mb-6 text-sm text-foreground/50">
                    {plan.note || (price === 0 ? "Perfect for getting started" : "Billed monthly, cancel anytime")}
                  </p>

                  <Button
                    asChild
                    className={cn(
                      "mb-6 h-11 cursor-pointer",
                      plan.isPopular &&
                        "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 hover:shadow-lg"
                    )}
                    variant={plan.isPopular ? "default" : "outline"}
                  >
                    <Link
                      href="/auth/signup"
                      onClick={() => handlePlanSelect(plan.slug, "monthly")}
                    >
                      {plan.ctaText}
                    </Link>
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                        <span className="text-foreground/70">{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}