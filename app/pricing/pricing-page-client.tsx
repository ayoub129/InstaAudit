"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/landing/navigation"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Check, Sparkles, ShieldCheck, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const WHICH_PLAN_FAQ = [
  {
    q: "I just want to try InstaAudit. Which plan should I start with?",
    a: "Start with Free Audit if you want to test the product first. If you know you’ll want repeated audits and deeper recommendations, Starter is the next best step.",
  },
  {
    q: "I’m a creator or freelancer posting regularly. Which plan fits best?",
    a: "Starter works well if you want recurring audits without committing to unlimited usage. Pro is better if you want a more consistent workflow and deeper AI guidance.",
  },
  {
    q: "Who is Pro best for?",
    a: "Pro is the best fit for creators, consultants, and growing brands that want unlimited audits, stronger recommendations, and more ongoing strategic direction.",
  },
  {
    q: "Who is Agency for?",
    a: "Agency is designed for teams or client-based workflows where you need multiple accounts, collaboration, and broader usage across brands.",
  },
]

const ANNUAL_MONTHS_FREE = 2

type PricingCompare = {
  instagramAuditsPerMonth: string
  accounts: string
  aiScoreOutOf100: string
  profileAndContentBreakdown: string
  contentRecommendations: string
  sevenDayContentDirection: string
  positioningAndCtaSuggestions: string
  strategyInsights: string
  exportableReports: string
  multiAccountSupport: string
  teamCollaboration: string
  support: string
}

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
  compare: PricingCompare
}

type PricingApiResponse = {
  success: boolean
  plans: PricingPlan[]
  message?: string
}

function formatPrice(price: number) {
  return `$${price}`
}

function getPlanValue(plans: PricingPlan[], slug: string, key: keyof PricingCompare) {
  const plan = plans.find((p) => p.slug === slug)
  return plan?.compare?.[key] ?? "—"
}

export function PricingPageClient() {
  const [annual, setAnnual] = useState(false)
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
          throw new Error(data.message || "Failed to load pricing")
        }

        if (isMounted) {
          setPlans(data.plans || [])
        }
      } catch (error) {
        console.error("Failed to fetch pricing:", error)
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

  const comparisonRows = useMemo(() => {
    return [
      {
        key: "instagramAuditsPerMonth",
        label: "Instagram audits per month",
      },
      {
        key: "accounts",
        label: "Accounts",
      },
      {
        key: "aiScoreOutOf100",
        label: "AI score out of 100",
      },
      {
        key: "profileAndContentBreakdown",
        label: "Profile and content breakdown",
      },
      {
        key: "contentRecommendations",
        label: "Content recommendations",
      },
      {
        key: "sevenDayContentDirection",
        label: "7-day content direction",
      },
      {
        key: "positioningAndCtaSuggestions",
        label: "Positioning and CTA suggestions",
      },
      {
        key: "strategyInsights",
        label: "Strategy insights",
      },
      {
        key: "exportableReports",
        label: "Exportable reports",
      },
      {
        key: "multiAccountSupport",
        label: "Multi-account support",
      },
      {
        key: "teamCollaboration",
        label: "Team collaboration",
      },
      {
        key: "support",
        label: "Support",
      },
    ] as { key: keyof PricingCompare; label: string }[]
  }, [])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(120,119,198,0.12),_transparent_35%),linear-gradient(to_bottom_right,var(--background),var(--background),rgba(99,102,241,0.04))]">
      <Navigation />

      <main className="px-5 py-14 sm:px-6 sm:py-18 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <section className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-background/60 px-6 py-12 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-8 sm:py-14 md:px-10 md:py-16">
            <div className="absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-12 h-52 w-52 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-accent/8 blur-3xl" />
            </div>

            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Pricing built for creators, brands, and growing teams
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Simple, transparent pricing
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-foreground/62 sm:text-lg">
                Start free, validate the value, and upgrade when you need more audits,
                deeper AI guidance, and broader workflow support.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <span
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    !annual
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  Monthly
                </span>

                <button
                  type="button"
                  onClick={() => setAnnual((a) => !a)}
                  className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border border-border/60 bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  role="switch"
                  aria-checked={annual}
                  aria-label="Toggle annual billing"
                >
                  <span
                    className={cn(
                      "inline-block h-5 w-5 rounded-full bg-background shadow transition-transform",
                      annual ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>

                <span
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    annual
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  Annual
                </span>

                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Save {ANNUAL_MONTHS_FREE} months
                </span>
              </div>

              <div className="mt-6 flex flex-col items-center justify-center gap-2 text-sm text-foreground/55 sm:flex-row sm:gap-4">
                <div className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Cancel anytime
                </div>
                <div className="hidden h-1 w-1 rounded-full bg-foreground/20 sm:block" />
                <div className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  No hidden fees
                </div>
                <div className="hidden h-1 w-1 rounded-full bg-foreground/20 sm:block" />
                <div className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Start with a free audit
                </div>
              </div>
            </div>
          </section>

          <section className="mt-12 pt-4">
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card
                    key={i}
                    className="h-[620px] rounded-[1.9rem] border border-border/50 bg-background/65 p-6"
                  />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-5">
                {plans.map((plan, index) => {
                  const price =
                    plan.priceMonthly === 0
                      ? 0
                      : annual
                      ? (plan.priceAnnual ?? plan.priceMonthly * 12)
                      : plan.priceMonthly

                  const period = plan.priceMonthly === 0 ? "" : annual ? "/year" : "/month"

                  return (
                    <Card
                      key={plan._id}
                      className={cn(
                        "relative flex h-full flex-col rounded-[1.9rem] p-6 shadow-[0_22px_60px_-26px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 sm:p-7",
                        plan.isPopular
                          ? "border border-primary/35 bg-gradient-to-br from-primary/10 via-background/95 to-accent/10 shadow-[0_30px_80px_-26px_rgba(99,102,241,0.35)]"
                          : "border border-border/50 bg-background/65 hover:border-primary/20 hover:shadow-[0_28px_70px_-26px_rgba(99,102,241,0.18)]"
                      )}
                      style={{ transitionDelay: `${index * 80}ms` }}
                    >
                      {plan.isPopular && (
                        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
                          <div className="rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-lg">
                            {plan.badge || "Most popular"}
                          </div>
                        </div>
                      )}

                      <div className="mb-7">
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                          {plan.name}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-foreground/60">
                          {plan.subtitle || plan.description}
                        </p>
                      </div>

                      <div className="mb-7">
                        <div className="flex flex-wrap items-end gap-1.5">
                          <span className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                            {formatPrice(price)}
                          </span>
                          {period && (
                            <span className="pb-1 text-sm text-foreground/55 sm:text-base">
                              {period}
                            </span>
                          )}
                        </div>

                        {annual && plan.priceMonthly > 0 && (
                          <p className="mt-2 text-sm text-foreground/50">
                            Equivalent to {formatPrice(plan.priceMonthly)}/month
                          </p>
                        )}

                        {!annual && plan.priceMonthly > 0 && (
                          <p className="mt-2 text-sm text-foreground/50">
                            {plan.note || "Billed monthly, cancel anytime"}
                          </p>
                        )}

                        {plan.priceMonthly === 0 && (
                          <p className="mt-2 text-sm text-foreground/50">
                            {plan.note || "Perfect for getting started"}
                          </p>
                        )}
                      </div>

                      <Button
                        asChild
                        className={cn(
                          "mb-7 h-11 rounded-full text-sm font-medium",
                          plan.isPopular &&
                            "bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20 hover:from-primary/90 hover:to-accent/90 hover:shadow-xl hover:shadow-primary/30"
                        )}
                        variant={plan.isPopular ? "default" : "outline"}
                      >
                        <Link
                          href="/auth/signup"
                        onClick={() => handlePlanSelect(plan.slug, annual ? "annual" : "monthly")}
                        >
                          {plan.ctaText}
                        </Link>
                      </Button>

                      <div className="mb-5 h-px w-full bg-gradient-to-r from-transparent via-border/80 to-transparent" />

                      <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                              <Check className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="text-sm leading-6 text-foreground/72">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {plan.isPopular && (
                        <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/8 px-4 py-3 text-sm text-primary">
                          Best choice for users who want regular audits and stronger ongoing guidance.
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            )}
          </section>

          <section className="mt-16">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Compare plans
                </h2>
                <p className="mt-2 text-sm leading-6 text-foreground/60 sm:text-base">
                  A clearer look at what changes as you move from free access to higher-usage plans.
                </p>
              </div>
            </div>

            <Card className="overflow-hidden rounded-[1.5rem] border border-border/50 bg-background/65 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/40 hover:bg-transparent">
                      <TableHead className="min-w-[220px] px-4 py-4 font-medium text-foreground">
                        Feature
                      </TableHead>
                      <TableHead className="min-w-[120px] px-4 py-4 text-center font-medium text-foreground">
                        Free
                      </TableHead>
                      <TableHead className="min-w-[120px] px-4 py-4 text-center font-medium text-foreground">
                        Starter
                      </TableHead>
                      <TableHead className="min-w-[120px] px-4 py-4 text-center font-medium text-foreground">
                        Pro
                      </TableHead>
                      <TableHead className="min-w-[120px] px-4 py-4 text-center font-medium text-foreground">
                        Agency
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {comparisonRows.map((row) => (
                      <TableRow key={row.key} className="border-border/40">
                        <TableCell className="px-4 py-4 font-medium text-foreground/90">
                          {row.label}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-center text-foreground/70">
                          {getPlanValue(plans, "free", row.key)}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-center text-foreground/70">
                          {getPlanValue(plans, "starter", row.key)}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-center text-foreground/70">
                          {getPlanValue(plans, "pro", row.key)}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-center text-foreground/70">
                          {getPlanValue(plans, "agency", row.key)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </section>

          <section className="mt-16">
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Which plan is right for me?
                </h2>
                <p className="mt-2 text-sm leading-6 text-foreground/60 sm:text-base">
                  A quick guide to help you choose based on how you plan to use InstaAudit.
                </p>
              </div>

              <Accordion type="single" collapsible className="space-y-3">
                {WHICH_PLAN_FAQ.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="overflow-hidden rounded-[1.25rem] border border-border/50 bg-background/65 px-5 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-300 hover:border-primary/20 sm:px-6"
                  >
                    <AccordionTrigger className="text-left text-base font-medium tracking-tight hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-sm leading-7 text-foreground/68 sm:text-[15px]">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          <section className="mt-16 text-center">
            <div className="mx-auto max-w-2xl rounded-[1.75rem] border border-border/50 bg-background/60 px-6 py-10 shadow-[0_20px_55px_-28px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:px-8">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Still unsure which plan fits?
              </h2>
              <p className="mt-3 text-sm leading-7 text-foreground/62 sm:text-base">
                Start with the free option or reach out if you want help choosing the right path for
                your workflow.
              </p>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-11 rounded-full">
                  <Link href="/auth/signup">
                    Start free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="h-11 rounded-full">
                  <Link href="/contact">Contact us</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}