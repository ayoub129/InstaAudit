import type { RawPost } from "@/lib/instagram/types"

export const clampScore = (value: number): number =>
  Math.max(0, Math.min(100, Math.round(value)))

export const secondsToDays = (seconds: number): number => seconds / 86400

export const average = (values: number[]): number =>
  values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0

export const stdDev = (values: number[]): number => {
  if (values.length <= 1) return 0
  const mean = average(values)
  const variance = average(values.map((v) => (v - mean) ** 2))
  return Math.sqrt(variance)
}

export const sortPostsByNewest = (posts: RawPost[]): RawPost[] =>
  [...posts].sort((a, b) => b.timestamp - a.timestamp)

