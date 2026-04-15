"use client"

import { useInView } from "@/hooks/use-in-view"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  ClipboardPaste,
  Sparkles,
  FileBarChart,
  TrendingUp,
  CheckCircle2,
} from "lucide-react"
import { MiniPhone } from "@/components/landing/decorative-assets"

const STEPS = [
  {
    icon: ClipboardPaste,
    title: "Paste your handle",
    description:
      "Enter your Instagram username to start. No password required and no manual setup.",
    detail: "Fast start · public profile only",
  },
  {
    icon: Sparkles,
    title: "AI analyzes your profile",
    description:
      "We review your positioning, bio clarity, captions, call-to-actions, and content signals in seconds.",
    detail: "Bio · content · messaging",
  },
  {
    icon: FileBarChart,
    title: "Get your audit report",
    description:
      "Receive a structured score, priority weaknesses, and specific recommendations you can apply right away.",
    detail: "Score · breakdowns · next steps",
  },
  {
    icon: TrendingUp,
    title: "Implement and grow",
    description:
      "Use the suggested fixes and content direction to improve profile clarity, engagement, and consistency.",
    detail: "Practical actions · better growth path",
  },
]

export function HowItWorks() {
  const { ref, inView } = useInView()

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-transparent via-secondary/10 to-transparent px-5 py-16 sm:px-6 sm:py-24 md:px-8 md:py-32"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-20 h-48 w-48 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute right-8 top-20 hidden opacity-35 lg:block">
        <MiniPhone />
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
            Simple workflow, actionable output
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            From profile input to growth direction in four simple steps
          </h2>

          <p className="mt-4 text-base leading-7 text-foreground/62 sm:text-lg">
            InstaAudit is built to feel fast and clear. You enter your handle, we analyze the
            profile, and you get focused recommendations without the usual guesswork.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon

            return (
              <div key={step.title} className="relative">
                <Card
                  className={cn(
                    "group relative h-full overflow-hidden rounded-[1.75rem] border border-border/50 bg-background/65 p-6 shadow-[0_20px_55px_-24px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_28px_70px_-24px_rgba(99,102,241,0.28)] sm:p-7",
                    inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  )}
                  style={{ transitionDelay: inView ? `${index * 100}ms` : "0ms" }}
                >
                  <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/8 blur-2xl opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="inline-flex h-13 w-13 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/10 transition-transform duration-300 group-hover:scale-105">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>

                      <span className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/50">
                        Step {index + 1}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-foreground/62 sm:text-[15px]">
                      {step.description}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-sm text-foreground/68">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      <span>{step.detail}</span>
                    </div>
                  </div>
                </Card>

                {index < STEPS.length - 1 && (
                  <div className="pointer-events-none absolute -right-3 top-1/2 hidden -translate-y-1/2 xl:flex">
                    <div className="rounded-full border border-border/50 bg-background/70 px-3 py-1 text-foreground/30 shadow-sm backdrop-blur">
                      <span className="text-lg">→</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}