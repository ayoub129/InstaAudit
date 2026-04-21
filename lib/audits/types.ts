import type { DayPlan } from "./generate-tips"
import type { AuditMetric } from "./metrics"

export type AuditDepth = "basic" | "full" | "advanced"

export type { DayPlan }

export interface ProfileSnapshot {
  followerCount: number
  followingCount: number
  postCount: number
  bio: string
  hasLinkInBio: boolean
  accountType: string
  dataSource: "graph_api" | "scraper"
}

export type InsightSource = "graph" | "scraper" | "inferred"

export interface AuditInsights {
  postsAnalyzed?: number
  reelsAnalyzed?: number
  avgEngagementRate?: number
  engagementTrend?: "improving" | "declining" | "stable"
  postingFrequencyPerWeek?: number
  contentMix?: {
    image: number
    carousel: number
    reel: number
  }
  avgHashtagsPerPost?: number
  reelViewRate?: number
  followerFollowingRatio?: number
  dataSource?: Partial<Record<string, InsightSource>>
}

export type AuditResult = {
  username: string
  overallScore: number
  metrics: Record<string, AuditMetric>
  findings: string[]
  tips: string[]
  contentPlan?: DayPlan[]
  profileSnapshot?: ProfileSnapshot
  auditInsights?: AuditInsights
  lockedPreviews?: Array<{
    key: string
    title: string
    requiredPlan: "starter" | "pro" | "agency"
  }>
}
