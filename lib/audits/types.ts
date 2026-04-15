import type { DayPlan } from "./tips/ai-tips"

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

export type AuditResult = {
  username: string
  overallScore: number
  metrics: Record<string, { score: number; status: string; details?: string[] }>
  tips: string[]
  contentPlan?: DayPlan[]
  profileSnapshot?: ProfileSnapshot
  lockedPreviews?: Array<{
    key: string
    title: string
    requiredPlan: "starter" | "pro" | "agency"
  }>
}
