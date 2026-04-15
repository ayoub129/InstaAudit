"use client"

import { useState } from "react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import { Play, Sparkles } from "lucide-react"
import { ThumbnailGrid } from "@/components/landing/decorative-assets"
import { VideoModal } from "@/components/landing/video-modal"

export function DemoPreview() {
  const { ref, inView } = useInView()
  const [open, setOpen] = useState(false)

  const videoId = "dQw4w9WgXcQ" // 🔥 replace with your real demo later

  return (
    <section
      id="demo"
      ref={ref}
      className="relative overflow-hidden px-5 py-16 sm:px-6 sm:py-24 md:px-8 md:py-32"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-20 h-44 w-44 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute left-4 top-1/4 hidden opacity-40 lg:block">
        <ThumbnailGrid className="size-14" />
      </div>

      <div className="mx-auto max-w-5xl">
        <div
          className={cn(
            "mb-12 text-center transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            See the product in action
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Watch how InstaAudit turns data into clear growth direction
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-foreground/62 sm:text-lg">
            From profile input to actionable recommendations in seconds — this is how the full
            audit experience works.
          </p>
        </div>

        <div
          className={cn(
            "group relative overflow-hidden rounded-[2rem] border border-border/50 bg-background/60 shadow-[0_30px_80px_-24px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-500",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          {/* Thumbnail */}
          <div
            onClick={() => setOpen(true)}
            className="relative aspect-video w-full cursor-pointer overflow-hidden"
          >
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt="Demo preview"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-xl shadow-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                <Play className="h-10 w-10 fill-current pl-1" />
              </div>
            </div>

            {/* Label */}
            <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-4 py-1.5 text-sm text-white backdrop-blur">
              Watch demo
            </div>
          </div>
        </div>
      </div>

      <VideoModal open={open} onOpenChange={setOpen} videoId={videoId} />
    </section>
  )
}