"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { ThumbnailGrid } from "@/components/landing/decorative-assets"

export function CTAStrip() {
  return (
    <section className="relative overflow-hidden border-y border-border/40 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 px-5 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-1/4 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute left-8 top-1/2 hidden -translate-y-1/2 opacity-30 lg:block">
        <ThumbnailGrid className="size-16" />
      </div>
      <div className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 opacity-30 lg:block">
        <ThumbnailGrid className="size-16" />
      </div>

      <div className="mx-auto max-w-3xl px-0 text-center sm:px-2">
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Ready to improve your profile?
          </span>
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Start your free Instagram audit today
        </h2>

        <p className="mb-8 text-base leading-7 text-foreground/70 sm:text-lg">
          Get fast, AI-powered feedback on your profile clarity, content direction, and growth opportunities.
          No credit card required.
        </p>

        <Button
          asChild
          size="lg"
          className="group h-12 rounded-full bg-gradient-to-r from-primary to-accent px-8 text-base shadow-lg shadow-primary/20 hover:from-primary/90 hover:to-accent/90 hover:shadow-xl hover:shadow-primary/30"
        >
          <Link href="/auth/signup">
            Get free audit
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </div>
    </section>
  )
}