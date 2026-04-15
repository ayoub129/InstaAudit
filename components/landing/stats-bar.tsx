"use client"

import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { TrendingUp, Users, Star, Zap, Sparkles } from "lucide-react"
import { ThumbnailGrid } from "@/components/landing/decorative-assets"

const STATS = [
  {
    icon: TrendingUp,
    value: "45%",
    label: "Average reach increase",
    subtext: "after applying audit recommendations",
  },
  {
    icon: Users,
    value: "10K+",
    label: "Audits completed",
    subtext: "for creators, brands, and businesses",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Average user rating",
    subtext: "based on early product feedback",
  },
  {
    icon: Zap,
    value: "30s",
    label: "Average audit time",
    subtext: "from input to actionable output",
  },
]

export function StatsBar() {
  const { ref, inView } = useInView()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-5 py-14 sm:px-6 sm:py-18 md:px-8 md:py-24"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-10 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/80 to-transparent" />
      </div>

      <div className="pointer-events-none absolute left-1/2 top-8 hidden -translate-x-1/2 opacity-35 sm:block">
        <ThumbnailGrid className="size-12" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div
          className={cn(
            "mx-auto mb-10 max-w-2xl text-center transition-all duration-700",
            inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Fast insights, real direction
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            A faster way to understand what’s helping or hurting your Instagram growth
          </h2>

          <p className="mt-3 text-sm leading-6 text-foreground/62 sm:text-base">
            InstaAudit turns profile analysis into clear scores, faster decisions, and practical next
            steps you can actually use.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map((stat, index) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className={cn(
                  "group relative overflow-hidden rounded-[1.6rem] border border-border/50 bg-background/65 p-5 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_60px_-24px_rgba(99,102,241,0.28)] sm:p-6",
                  inView ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                )}
                style={{ transitionDelay: inView ? `${index * 90}ms` : "0ms" }}
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/8 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-70" />

                <div className="relative">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/10 transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                      {stat.value}
                    </p>

                    <p className="text-sm font-medium text-foreground">
                      {stat.label}
                    </p>

                    <p className="text-sm leading-6 text-foreground/58">
                      {stat.subtext}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}