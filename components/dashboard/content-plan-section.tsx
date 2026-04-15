"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Calendar, Copy, Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DayPlan } from "@/lib/audits/types"

const CONTENT_TYPE_COLORS: Record<string, string> = {
  Reel: "border-pink-500/20 bg-pink-500/10 text-pink-400",
  Carousel: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  Image: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  Story: "border-violet-500/20 bg-violet-500/10 text-violet-400",
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="ml-2 shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

interface ContentPlanSectionProps {
  username: string
  plan?: DayPlan[]
}

export function ContentPlanSection({ username, plan }: ContentPlanSectionProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
            <Calendar className="h-3.5 w-3.5" />
            Pro — 7-day content direction
          </div>
          <h3 className="text-2xl font-semibold text-foreground">Your content plan</h3>
          <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
            Built specifically for @{username} based on your audit results — stronger hooks,
            better angles, and the right content mix for your account stage.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {(plan ?? []).map((item, index) => (
          <Card
            key={index}
            className="group flex flex-col rounded-3xl border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">{item.day}</p>
                <span
                  className={cn(
                    "mt-1 inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                    CONTENT_TYPE_COLORS[item.contentType] ??
                      "border-border bg-muted/50 text-muted-foreground"
                  )}
                >
                  {item.contentType}
                </span>
              </div>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {index + 1}
              </span>
            </div>

            <p className="mb-4 text-sm font-medium leading-5 text-foreground group-hover:text-primary/90 transition-colors">
              {item.topic}
            </p>

            <div className="mt-auto space-y-2.5">
              <div className="rounded-2xl border border-border bg-background/60 p-3">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                  Caption hook
                </p>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs leading-5 text-foreground/80 italic">"{item.captionHook}"</p>
                  <CopyButton text={item.captionHook} />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background/60 p-3">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                  Hashtag tip
                </p>
                <p className="text-xs leading-5 text-foreground/70">{item.hashtagTip}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 via-pink-500/10 to-orange-400/15 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Hook starters library</h4>
            <p className="text-sm text-muted-foreground">
              Reusable opening lines — click to copy and adapt them to your voice.
            </p>
          </div>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {[
            "What most people still get wrong about growth",
            "The change that made the biggest difference for me",
            "If I had to restart today, I'd do this first",
            "This is why your content may not be converting yet",
            "Nobody talks about this, but it's the real reason you're stuck",
            "Here's the honest truth about [your niche topic]",
          ].map((hook, i) => (
            <div
              key={i}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground/75 transition-all duration-300 hover:border-primary/20 hover:bg-primary/[0.04]"
            >
              <span className="leading-5">{hook}</span>
              <CopyButton text={hook} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
