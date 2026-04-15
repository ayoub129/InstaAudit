"use client"

import { useInView } from "@/hooks/use-in-view"
import { Card } from "@/components/ui/card"
import { BarChart3, Zap, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThumbnailGrid } from "@/components/landing/decorative-assets"

const features = [
  {
    icon: BarChart3,
    title: "AI audit analysis",
    description:
      "Get a clear score out of 100 with deeper breakdowns across profile clarity, content positioning, captions, hashtags, and growth readiness.",
    bullets: ["Profile scoring", "Content breakdowns", "Clear priority areas"],
  },
  {
    icon: Zap,
    title: "7-day content direction",
    description:
      "Receive practical post ideas, content angles, and messaging suggestions tailored to your niche so you know what to create next.",
    bullets: ["Weekly post ideas", "Niche-aware guidance", "Stronger content planning"],
  },
  {
    icon: TrendingUp,
    title: "Actionable growth insights",
    description:
      "See what is helping, what is hurting, and what to improve first with fast recommendations you can actually apply right away.",
    bullets: ["Quick wins", "Priority recommendations", "Easy next steps"],
  },
]

export function FeaturesSection() {
  const { ref, inView } = useInView()

  return (
    <section
      id="features"
      ref={ref}
      className="relative overflow-hidden px-5 py-16 sm:px-6 sm:py-24 md:px-8 md:py-32"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-16 h-52 w-52 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute right-6 top-1/4 hidden opacity-35 lg:block">
        <ThumbnailGrid className="size-16" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div
          className={cn(
            "mx-auto mb-12 max-w-3xl text-center transition-all duration-700 sm:mb-16",
            inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Built to turn profile analysis into action
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Everything you need to understand what to fix, improve, and scale
          </h2>

          <p className="mt-4 text-base leading-7 text-foreground/62 sm:text-lg">
            InstaAudit gives you clear diagnostics, better content direction, and practical next steps
            so your Instagram strategy feels less random and more intentional.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <Card
                key={feature.title}
                className={cn(
                  "group relative overflow-hidden rounded-[1.75rem] border border-border/50 bg-background/65 p-6 shadow-[0_20px_55px_-24px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_28px_70px_-24px_rgba(99,102,241,0.28)] sm:p-7 md:p-8",
                  inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                )}
                style={{ transitionDelay: inView ? `${index * 100}ms` : "0ms" }}
              >
                <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-primary/8 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-70" />

                <div className="relative">
                  <div className="mb-5 inline-flex h-13 w-13 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/10 transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>

                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-foreground/62 sm:text-[15px]">
                    {feature.description}
                  </p>

                  <div className="mt-5 space-y-2.5">
                    {feature.bullets.map((bullet) => (
                      <div
                        key={bullet}
                        className="flex items-center gap-2 text-sm text-foreground/68"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}