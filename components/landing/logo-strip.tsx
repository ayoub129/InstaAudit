"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react"

import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { ThumbnailGrid } from "@/components/landing/decorative-assets"
import { Button } from "@/components/ui/button"

export function LogoStrip() {
  const { ref, inView } = useInView()

  return (
    <section
      ref={ref}
      className={cn(
        "relative overflow-hidden px-5 py-10 sm:px-6 sm:py-12 md:px-8 transition-all duration-700",
        inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border/80 to-transparent" />
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="rounded-[1.75rem] border border-border/50 bg-background/65 px-5 py-6 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-6 sm:py-7 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              <div className="text-center sm:text-left">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Fast, free, AI-powered
                </div>

                <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  Get your free Instagram audit in under 30 seconds
                </h3>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-foreground/62">
                  Audit your bio, profile clarity, content positioning, and call-to-action strength
                  with actionable recommendations you can use right away.
                </p>

                <div className="mt-3 flex flex-col items-center gap-2 text-xs text-foreground/55 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                  <div className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    No credit card required
                  </div>
                  <div className="hidden h-1 w-1 rounded-full bg-foreground/20 sm:block" />
                  <div className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    Instant AI recommendations
                  </div>
                  <div className="hidden h-1 w-1 rounded-full bg-foreground/20 sm:block" />
                  <div className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    Built for creators and brands
                  </div>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 justify-center lg:justify-end">
              <Button
                asChild
                size="lg"
                className="group h-11 rounded-full bg-gradient-to-r from-primary to-accent px-6 text-sm font-medium shadow-lg shadow-primary/20 transition-all hover:from-primary/90 hover:to-accent/90 hover:shadow-xl hover:shadow-primary/30"
              >
                <Link href="/auth/signup">
                  Start free audit
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}