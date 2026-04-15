"use client"

import { useInView } from "@/hooks/use-in-view"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { ThumbnailGrid } from "@/components/landing/decorative-assets"
import { Sparkles } from "lucide-react"

const FAQ_ITEMS = [
  {
    q: "Do I need to connect my Instagram account?",
    a: "No. You only need to enter a public Instagram username. InstaAudit is designed to work without asking for your Instagram password or direct account access.",
  },
  {
    q: "How long does an audit take?",
    a: "In most cases, your audit is generated in under 30 seconds. The goal is to give you quick feedback, clear scoring, and practical next steps without making you wait.",
  },
  {
    q: "Is the free audit really free?",
    a: "Yes. You can start with a free audit and explore the product before upgrading. No credit card is required to get started.",
  },
  {
    q: "What kind of recommendations will I get?",
    a: "You’ll receive a structured audit with a score, profile observations, and actionable recommendations around things like profile clarity, messaging, content direction, and stronger calls-to-action.",
  },
  {
    q: "Who is InstaAudit built for?",
    a: "InstaAudit is useful for creators, freelancers, consultants, small businesses, personal brands, and marketers who want clearer feedback on how their Instagram presence comes across.",
  },
  {
    q: "Can I audit more than one account?",
    a: "That depends on your plan. Free access is designed for getting started, while paid plans are better suited for users who want more ongoing audits and broader usage.",
  },
  {
    q: "Do I need technical or marketing experience to use it?",
    a: "Not at all. InstaAudit is built to make profile feedback easier to understand, even if you are not a marketer. The goal is clarity, not complicated analytics dashboards.",
  },
]

export function FAQSection() {
  const { ref, inView } = useInView()

  return (
    <section
      id="faq"
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-transparent via-secondary/10 to-transparent px-5 py-16 sm:px-6 sm:py-24 md:px-8 md:py-32"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-16 h-44 w-44 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute right-8 top-24 hidden opacity-30 lg:block">
        <ThumbnailGrid className="size-12" />
      </div>

      <div className="mx-auto max-w-4xl">
        <div
          className={cn(
            "mx-auto mb-12 max-w-3xl text-center transition-all duration-700 sm:mb-16",
            inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Answers before you get started
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Frequently asked questions
          </h2>

          <p className="mt-4 text-base leading-7 text-foreground/62 sm:text-lg">
            Everything you need to know before trying InstaAudit or choosing the right plan.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className={cn(
            "space-y-3 transition-all duration-500",
            inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
          style={{ transitionDelay: inView ? "100ms" : "0ms" }}
        >
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={item.q}
              value={`item-${index}`}
              className="overflow-hidden rounded-[1.35rem] border border-border/50 bg-background/65 px-5 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-300 hover:border-primary/25 hover:shadow-[0_22px_50px_-24px_rgba(99,102,241,0.18)] sm:px-6"
            >
              <AccordionTrigger className="py-5 text-left text-base font-medium tracking-tight text-foreground hover:no-underline">
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
  )
}