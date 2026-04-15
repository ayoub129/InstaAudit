"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Sparkles,
  BarChart3,
  BadgeCheck,
} from "lucide-react"
import { ThumbnailGrid, MiniPhone } from "@/components/landing/decorative-assets"

interface HeroSectionProps {
  onWatchDemo?: () => void
}

export function HeroSection({ onWatchDemo }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20 md:px-8 md:pb-28 md:pt-24 lg:pb-36 lg:pt-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-24 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/80 to-transparent" />
      </div>

      <div className="pointer-events-none absolute right-10 top-24 hidden opacity-60 lg:block">
        <ThumbnailGrid className="size-24" />
      </div>

      <div className="pointer-events-none absolute bottom-28 left-10 hidden opacity-55 md:block">
        <MiniPhone className="float-animation" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        <div className="text-center lg:text-left">
          <div className="mb-6 flex justify-center lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              AI-powered Instagram audit for creators and brands
            </span>
          </div>

          <h1 className="max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:max-w-3xl lg:text-7xl">
            Turn your Instagram profile into a{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              growth engine
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-7 text-foreground/68 sm:text-lg sm:leading-8 lg:mx-0">
            Get an instant AI audit of your bio, content positioning, captions, profile clarity,
            and growth opportunities. InstaAudit helps you spot what is weak, what is working,
            and what to improve next.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button
              asChild
              size="lg"
              className="group h-12 rounded-full bg-gradient-to-r from-primary to-accent px-7 text-sm font-medium shadow-lg shadow-primary/20 transition-all hover:from-primary/90 hover:to-accent/90 hover:shadow-xl hover:shadow-primary/30 sm:h-13 sm:px-8 sm:text-base"
            >
              <Link href="/auth/signup">
                Get free audit
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 sm:h-5 sm:w-5" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={onWatchDemo}
              className="h-12 rounded-full border-border/70 bg-background/60 px-7 text-sm font-medium backdrop-blur transition-all hover:border-primary/40 hover:bg-primary/5 sm:h-13 sm:px-8 sm:text-base"
            >
              <PlayCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Watch demo
            </Button>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 text-sm text-foreground/58 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
            <div className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Free audit
            </div>
            <div className="hidden h-1 w-1 rounded-full bg-foreground/20 sm:block" />
            <div className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              No credit card required
            </div>
            <div className="hidden h-1 w-1 rounded-full bg-foreground/20 sm:block" />
            <div className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Results in under 30 seconds
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/50 bg-background/55 px-4 py-4 backdrop-blur">
              <p className="text-2xl font-semibold tracking-tight text-foreground">10k+</p>
              <p className="mt-1 text-sm text-foreground/60">Profiles ready to audit at scale</p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-background/55 px-4 py-4 backdrop-blur">
              <p className="text-2xl font-semibold tracking-tight text-foreground">AI first</p>
              <p className="mt-1 text-sm text-foreground/60">Actionable recommendations, not fluff</p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-background/55 px-4 py-4 backdrop-blur">
              <p className="text-2xl font-semibold tracking-tight text-foreground">Fast setup</p>
              <p className="mt-1 text-sm text-foreground/60">Start improving your profile in minutes</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="absolute -left-6 top-12 hidden rounded-2xl border border-border/50 bg-background/80 px-4 py-3 shadow-xl backdrop-blur md:block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12">
                <BadgeCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Profile clarity improved</p>
                <p className="text-xs text-foreground/55">Bio and positioning recommendations ready</p>
              </div>
            </div>
          </div>

          <div className="absolute -right-4 top-6 z-10 rounded-2xl border border-border/50 bg-background/85 px-4 py-3 shadow-xl backdrop-blur">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-foreground/45">
              Audit score
            </p>
            <p className="mt-1 text-2xl font-semibold text-foreground">78/100</p>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-background/75 p-3 shadow-[0_30px_80px_-24px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="overflow-hidden rounded-[1.5rem] border border-border/50 bg-gradient-to-br from-background via-background to-secondary/15">
              <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary to-accent" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">@brandname</p>
                    <p className="text-xs text-foreground/50">Instagram profile audit</p>
                  </div>
                </div>

                <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Live analysis
                </div>
              </div>

              <div className="grid gap-5 p-5">
                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-2xl border border-border/50 bg-background/70 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">Profile overview</p>
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="mb-2 flex items-center justify-between text-xs text-foreground/55">
                          <span>Bio clarity</span>
                          <span>82%</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary/60">
                          <div className="h-2 w-[82%] rounded-full bg-gradient-to-r from-primary to-accent" />
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between text-xs text-foreground/55">
                          <span>Content positioning</span>
                          <span>74%</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary/60">
                          <div className="h-2 w-[74%] rounded-full bg-gradient-to-r from-primary to-accent" />
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between text-xs text-foreground/55">
                          <span>CTA strength</span>
                          <span>67%</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary/60">
                          <div className="h-2 w-[67%] rounded-full bg-gradient-to-r from-primary to-accent" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/50 bg-background/70 p-4">
                    <p className="mb-3 text-sm font-medium text-foreground">Top recommendation</p>
                    <div className="rounded-2xl bg-primary/8 p-4">
                      <p className="text-sm font-semibold text-foreground">
                        Make your bio outcome driven
                      </p>
                      <p className="mt-2 text-sm leading-6 text-foreground/60">
                        Clarify who you help, what result you create, and add a stronger call-to-action.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/50 bg-background/70 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">Quick wins</p>
                    <span className="text-xs text-foreground/45">Generated by AI</span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-secondary/45 p-3">
                      <p className="text-sm font-medium text-foreground">Rewrite bio</p>
                      <p className="mt-1 text-xs leading-5 text-foreground/55">
                        Improve clarity and audience targeting
                      </p>
                    </div>

                    <div className="rounded-xl bg-secondary/45 p-3">
                      <p className="text-sm font-medium text-foreground">Refine captions</p>
                      <p className="mt-1 text-xs leading-5 text-foreground/55">
                        Add stronger hooks and call-to-actions
                      </p>
                    </div>

                    <div className="rounded-xl bg-secondary/45 p-3">
                      <p className="text-sm font-medium text-foreground">Fix positioning</p>
                      <p className="mt-1 text-xs leading-5 text-foreground/55">
                        Make your niche easier to understand
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-5 right-10 hidden rounded-2xl border border-border/50 bg-background/85 px-4 py-3 shadow-xl backdrop-blur md:block">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-foreground/45">
              Instant output
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              Bio, content, hooks, CTA
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}