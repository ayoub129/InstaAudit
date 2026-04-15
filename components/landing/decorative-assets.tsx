"use client"

import { cn } from "@/lib/utils"
import { BarChart3, Heart, Zap } from "lucide-react"

/** Organic blob shape for backgrounds */
export function BlobShape({
  className,
  ...props
}: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-24 text-primary/20", className)}
      {...props}
    >
      <path
        d="M60 8c20 0 38 12 48 28 10 16 12 36 6 52s-20 28-36 32-34-2-48-14-22-32-24-48 8-46 54-50z"
        fill="currentColor"
        fillOpacity="0.5"
      />
    </svg>
  )
}

/** Instagram-style thumbnail grid (3x3) – refined gradients */
export function ThumbnailGrid({ className }: { className?: string }) {
  const cells = [
    "from-primary/40 to-accent/25",
    "from-accent/35 to-primary/25",
    "from-primary/30 to-accent/30",
    "from-accent/30 to-primary/35",
    "from-primary/45 to-accent/35",
    "from-accent/40 to-primary/30",
    "from-primary/30 to-accent/35",
    "from-accent/35 to-primary/30",
    "from-primary/40 to-accent/30",
  ]
  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-[2px] rounded-xl overflow-hidden border border-border/50 bg-background/50 p-1.5 shadow-md ring-1 ring-black/5 dark:ring-white/5",
        className
      )}
    >
      {cells.map((g, i) => (
        <div
          key={i}
          className={cn("aspect-square rounded-sm bg-gradient-to-br shadow-inner", g)}
        />
      ))}
    </div>
  )
}

/** Small stat/icon badge */
export function IconBadge({
  icon: Icon,
  className,
}: {
  icon: React.ElementType
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 border border-primary/20 shadow-sm",
        className
      )}
    >
      <Icon className="h-5 w-5 text-primary" />
    </div>
  )
}

/** Device-style phone mockup – app screen with audit preview */
export function MiniPhone({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-[1.25rem] border-[3px] border-border bg-card/90 p-1.5 shadow-xl ring-2 ring-primary/10",
        "w-14 sm:w-16 aspect-[9/19]",
        className
      )}
    >
      <div className="mx-auto mb-1 h-1.5 w-8 rounded-full bg-muted-foreground/20" />
      <div className="flex-1 rounded-xl overflow-hidden bg-gradient-to-b from-muted/80 to-background flex flex-col p-2 gap-1.5">
        <div className="flex items-center gap-1.5">
          <div className="size-5 rounded-md bg-gradient-to-br from-primary to-accent" />
          <div className="h-1.5 w-10 rounded bg-muted-foreground/20" />
        </div>
        <div className="flex-1 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center">
          <BarChart3 className="h-4 w-4 text-primary/60" />
        </div>
        <div className="flex gap-1">
          <div className="h-1 flex-1 rounded bg-primary/30" />
          <div className="h-1 w-2 rounded bg-accent/30" />
        </div>
      </div>
    </div>
  )
}

/** Small metric card visual */
export function MiniMetricCard({
  icon: Icon,
  value,
  label,
  className,
}: {
  icon: React.ElementType
  value: string
  label: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/40 bg-card/80 px-3 py-2 shadow-sm flex items-center gap-2",
        className
      )}
    >
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-xs font-bold text-foreground leading-none">{value}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

/** Decorative corner accent */
export function CornerAccent({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute size-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl",
        className
      )}
    />
  )
}

/** Small "photo" stack for testimonials / social proof */
export function PhotoStack() {
  return (
    <div className="flex -space-x-2">
      {[BarChart3, Heart, Zap].map((Icon, i) => (
        <div
          key={i}
          className="flex size-9 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br from-primary/20 to-accent/20 text-primary shadow"
          style={{ zIndex: 3 - i }}
        >
          <Icon className="h-4 w-4" />
        </div>
      ))}
    </div>
  )
}

/** Mini audit “screenshot” for testimonial cards */
export function AuditScreenshotMock({
  score,
  className,
}: {
  score: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/50 bg-card/90 p-3 shadow-lg",
        className
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
          <div>
            <div className="h-2 w-16 rounded bg-muted-foreground/20" />
            <div className="mt-0.5 h-1 w-10 rounded bg-muted-foreground/10" />
          </div>
        </div>
        <span className="text-sm font-bold text-primary">{score}/100</span>
      </div>
      <div className="space-y-1.5">
        {["Bio", "Hashtags", "Engagement"].map((l, i) => (
          <div key={i} className="flex justify-between text-xs">
            <span className="text-muted-foreground">{l}</span>
            <span className="text-foreground font-medium">
              {["Good", "Improve", "Strong"][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
