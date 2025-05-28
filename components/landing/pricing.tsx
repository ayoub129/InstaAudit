"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useState } from "react"

export function LandingPricing() {
  const [annual, setAnnual] = useState(false)

  const plans = [
    {
      name: "Free",
      description: "Basic Instagram audit for individuals",
      price: { monthly: "$0", annually: "$0" },
      features: ["1 Instagram profile", "Basic bio analysis", "Limited content recommendations", "Weekly analytics"],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      description: "Advanced features for serious creators",
      price: { monthly: "$19", annually: "$190" },
      features: [
        "3 Instagram profiles",
        "Advanced bio optimization",
        "Unlimited content recommendations",
        "Daily analytics",
        "Competitor analysis",
        "Priority support",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Business",
      description: "Complete solution for businesses and agencies",
      price: { monthly: "$49", annually: "$490" },
      features: [
        "10 Instagram profiles",
        "Team collaboration",
        "White-label reports",
        "API access",
        "Advanced analytics",
        "Dedicated account manager",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-pink-100 px-3 py-1 text-sm text-pink-500">Pricing</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Simple, Transparent Pricing</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the plan that's right for you and start improving your Instagram presence today.
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-6">
            <span className={`text-sm ${!annual ? "font-medium" : "text-muted-foreground"}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200"
            >
              <span className="sr-only">Toggle annual billing</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  annual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm ${annual ? "font-medium" : "text-muted-foreground"}`}>
              Annual <span className="text-green-500 font-medium">(Save 20%)</span>
            </span>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col ${plan.popular ? "border-pink-500 relative shadow-lg" : "border shadow-sm"}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -mt-2 -mr-2 rounded-full bg-pink-500 px-3 py-1 text-xs font-medium text-white">
                  Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{annual ? plan.price.annually : plan.price.monthly}</span>
                  <span className="text-muted-foreground">
                    {plan.name === "Free" ? "" : annual ? "/year" : "/month"}
                  </span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/signup" className="w-full">
                  <Button className={`w-full ${plan.popular ? "bg-pink-500 hover:bg-pink-600" : ""}`}>
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
