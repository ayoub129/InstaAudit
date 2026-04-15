export type ScoreStatus = "poor" | "fair" | "good" | "excellent"

export interface MetricScore {
  score: number
  status: ScoreStatus
  details: string[]
}

export function getStatus(score: number): ScoreStatus {
  if (score >= 80) return "excellent"
  if (score >= 60) return "good"
  if (score >= 40) return "fair"
  return "poor"
}

export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value))
}
