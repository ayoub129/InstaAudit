"use client"

import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"

interface ScoreCircleProps {
  score: number
  maxScore?: number
}

export function ScoreCircle({ score, maxScore = 100 }: ScoreCircleProps) {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    let frame: number
    let start: number | null = null
    const duration = 1000

    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const value = Math.round(progress * score)
      setDisplayScore(value)

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    setDisplayScore(0)
    frame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frame)
  }, [score])

  const radius = 90
  const circumference = 2 * Math.PI * radius
  const progress = (displayScore / maxScore) * circumference
  const scoreTone = useMemo(() => {
    if (score >= 80) return "text-emerald-500 dark:text-emerald-300"
    if (score >= 65) return "text-blue-500 dark:text-blue-300"
    if (score >= 45) return "text-amber-500 dark:text-amber-300"
    return "text-red-500 dark:text-red-300"
  }, [score])

  const label = useMemo(() => {
    if (score >= 80) return "Strong"
    if (score >= 65) return "Good"
    if (score >= 45) return "Fair"
    return "Needs work"
  }, [score])

  return (
    <div className="relative h-56 w-56">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 220 220">
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-border/60"
        />
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-700 ease-out"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="55%" stopColor="rgb(236 72 153)" />
            <stop offset="100%" stopColor="rgb(249 115 22)" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-[18px] rounded-full border border-border/50 bg-background/70 backdrop-blur-xl" />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-5xl font-semibold tracking-tight", scoreTone)}>
          {displayScore}
        </span>
        <span className="mt-1 text-sm text-muted-foreground">/100</span>
        <span className="mt-3 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  )
}