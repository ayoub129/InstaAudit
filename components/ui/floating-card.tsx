"use client"

import type React from "react"

interface FloatingCardProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FloatingCard({ children, delay = 0, className = "" }: FloatingCardProps) {
  return (
    <div
      className={`float-animation ${className}`}
      style={{
        animationDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  )
}
