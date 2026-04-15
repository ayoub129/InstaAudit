"use client"

interface AnimatedProgressProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
}

export function AnimatedProgress({ value, max = 100, className = "", showLabel = true }: AnimatedProgressProps) {
  const percentage = (value / max) * 100

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-border/40">
          <div
            className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        {showLabel && <span className="ml-3 text-sm font-medium text-foreground">{Math.round(percentage)}%</span>}
      </div>
    </div>
  )
}
