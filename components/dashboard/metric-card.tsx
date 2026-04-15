"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  label: string
  metric: {
    score: number
    status: string
  }
}

export function MetricCard({ label, metric }: MetricCardProps) {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    let frame: number
    let start: number | null = null
    const duration = 900

    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const next = Math.round(progress * metric.score)
      setDisplayScore(next)

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    setDisplayScore(0)
    frame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frame)
  }, [metric.score])

  const colors = useMemo(() => {
    switch (metric.status) {
      case "excellent":
        return {
          badge:
            "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
          bar: "from-emerald-400 to-emerald-600",
          ring: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
        }
      case "good":
        return {
          badge:
            "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300",
          bar: "from-blue-400 to-blue-600",
          ring: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
        }
      case "fair":
        return {
          badge:
            "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
          bar: "from-amber-400 to-orange-500",
          ring: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
        }
      case "poor":
        return {
          badge:
            "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300",
          bar: "from-red-400 to-red-600",
          ring: "bg-red-500/10 text-red-600 dark:text-red-300",
        }
      default:
        return {
          badge:
            "border-primary/20 bg-primary/10 text-primary",
          bar: "from-primary to-pink-500",
          ring: "bg-primary/10 text-primary",
        }
    }
  }, [metric.status])

  return (
    <Card className="group rounded-3xl border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Metric</p>
          <h4 className="mt-1 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
            {label}
          </h4>
        </div>

        <span
          className={cn(
            "rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize",
            colors.badge
          )}
        >
          {metric.status}
        </span>
      </div>

      <div className="mb-5 flex items-end justify-between">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-semibold tracking-tight text-foreground">
            {displayScore}
          </span>
          <span className="pb-1 text-sm text-muted-foreground">/100</span>
        </div>

        <div
          className={cn(
            "rounded-2xl px-3 py-1 text-xs font-medium",
            colors.ring
          )}
        >
          {displayScore >= 80
            ? "Strong"
            : displayScore >= 65
            ? "Solid"
            : displayScore >= 45
            ? "Needs work"
            : "Weak"}
        </div>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out",
            colors.bar
          )}
          style={{ width: `${displayScore}%` }}
        />
      </div>
    </Card>
  )
}