"use client"

import { useInView } from "@/hooks/use-in-view"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Sparkles, Quote } from "lucide-react"
import { cn } from "@/lib/utils"
import { AuditScreenshotMock } from "@/components/landing/decorative-assets"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Content Creator",
    initials: "SC",
    content:
      "InstaAudit helped me understand exactly what was holding my engagement back. I increased my reach by 45% in just 2 weeks.",
    rating: 5,
    score: 82,
  },
  {
    name: "Marcus Johnson",
    role: "Small Business Owner",
    initials: "MJ",
    content:
      "The 7-day content direction saved me hours of brainstorming. The recommendations are practical and much easier to implement than generic advice.",
    rating: 5,
    score: 78,
  },
  {
    name: "Emily Rodriguez",
    role: "Digital Marketer",
    initials: "ER",
    content:
      "Finally, a tool that gives actionable insights instead of just numbers. The output feels clear, focused, and actually useful for strategy decisions.",
    rating: 5,
    score: 91,
  },
  {
    name: "Alex Kim",
    role: "Influencer",
    initials: "AK",
    content:
      "The audit report is detailed without being overwhelming. My team already used the recommendations to improve positioning and profile clarity.",
    rating: 5,
    score: 88,
  },
  {
    name: "Jordan Lee",
    role: "Social Media Manager",
    initials: "JL",
    content:
      "We started using InstaAudit across multiple client accounts. The score breakdowns make it much easier to explain what needs fixing first.",
    rating: 5,
    score: 85,
  },
  {
    name: "Sam Taylor",
    role: "Freelance Creator",
    initials: "ST",
    content:
      "The free audit gave me enough value to take the product seriously. It quickly showed what was weak in my profile and what to improve next.",
    rating: 5,
    score: 79,
  },
]

export function TestimonialsSection() {
  const { ref, inView } = useInView()

  return (
    <section
      id="testimonials"
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-secondary/10 to-transparent px-5 py-16 sm:px-6 sm:py-24 md:px-8 md:py-32"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-16 h-44 w-44 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div
          className={cn(
            "mx-auto mb-10 max-w-3xl text-center transition-all duration-700 sm:mb-14",
            inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Social proof with product context
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Loved by creators, consultants, and growing brands
          </h2>

          <p className="mt-4 text-base leading-7 text-foreground/62 sm:text-lg">
            Real feedback from people using InstaAudit to understand what is weak, what is working,
            and what to improve next.
          </p>
        </div>

        <div
          className={cn(
            "relative px-8 transition-all duration-500 sm:px-12 lg:px-14",
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
          style={{ transitionDelay: inView ? "150ms" : "0ms" }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
              containScroll: "trimSnaps",
            }}
            className="relative w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((t) => (
                <CarouselItem
                  key={`${t.name}-${t.role}`}
                  className="basis-full py-8 px-5  md:basis-1/2 xl:basis-1/3"
                >
                  <div className="h-full">
                    <div className="group flex h-full min-h-[360px] flex-col overflow-hidden rounded-[1.75rem] border border-border/50 bg-background/65 shadow-[0_20px_55px_-24px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_28px_70px_-24px_rgba(99,102,241,0.28)]">
                      <div className="relative p-5 sm:p-6">
                        <div className="absolute right-5 top-5 rounded-full bg-primary/8 p-2 text-primary">
                          <Quote className="h-4 w-4" />
                        </div>

                        <div className="mb-4 flex items-center gap-1">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-accent text-accent"
                            />
                          ))}
                        </div>

                        <p className="text-sm leading-7 text-foreground/82 sm:text-[15px]">
                          “{t.content}”
                        </p>

                        <div className="mt-6">
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/45">
                              Audit result
                            </p>
                            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                              Score {t.score}
                            </span>
                          </div>

                          <div className="rounded-2xl border border-border/50 bg-background/70 p-3">
                            <AuditScreenshotMock
                              score={t.score}
                              className="w-full max-w-[220px]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center gap-3 border-t border-border/40 bg-muted/20 px-5 py-4 sm:px-6">
                        <Avatar className="h-11 w-11 border-2 border-primary/20">
                          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                            {t.initials}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground">
                            {t.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {t.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="-left-1 border-border/60 bg-background/90 shadow-sm hover:bg-muted/80 sm:-left-10 lg:-left-12" />
            <CarouselNext className="-right-1 border-border/60 bg-background/90 shadow-sm hover:bg-muted/80 sm:-right-10 lg:-right-12" />
          </Carousel>
        </div>
      </div>
    </section>
  )
}