export type AuditMetric = {
  score: number
  status: "poor" | "fair" | "good" | "excellent"
  details?: string[]
  rawData?: Record<string, unknown>
}

export type ScoredMetrics = Record<string, AuditMetric>

