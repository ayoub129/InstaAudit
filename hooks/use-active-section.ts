"use client"

import { useEffect, useState } from "react"

const SECTION_IDS = ["features", "how-it-works", "testimonials", "pricing", "faq"] as const

export type SectionId = (typeof SECTION_IDS)[number]

export function useActiveSection() {
  const [active, setActive] = useState<SectionId | null>(null)

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const visibility: Record<string, number> = {}

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          visibility[id] = entry.intersectionRatio
          const most = Object.entries(visibility).reduce((a, b) =>
            (a[1] ?? 0) >= (b[1] ?? 0) ? a : b
          )
          if (most[1] > 0) setActive(most[0] as SectionId)
        },
        { threshold: [0, 0.1, 0.5, 1], rootMargin: "-20% 0px -60% 0px" }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return active
}
