"use client"

import { Card } from "@/components/ui/card"
import { Lightbulb, Sparkles } from "lucide-react"

interface TipsSectionProps {
  tips: string[]
}

export function TipsSection({ tips }: TipsSectionProps) {
  return (
    <Card className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 via-pink-500/10 to-orange-400/15 text-primary">
            <Lightbulb className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground">Recommended next steps</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Focus on these improvements first to strengthen your profile faster.
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs text-muted-foreground sm:inline-flex">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Actionable advice
        </div>
      </div>

      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="group flex gap-4 rounded-2xl border border-border bg-background/60 p-4 transition-all duration-300 hover:border-primary/20 hover:bg-primary/[0.04]"
          >
            <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary via-pink-500 to-orange-400 text-xs font-semibold text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
              {index + 1}
            </div>

            <p className="flex-1 text-sm leading-7 text-foreground/80">
              {tip}
            </p>
          </div>
        ))}
      </div>
    </Card>
  )
}