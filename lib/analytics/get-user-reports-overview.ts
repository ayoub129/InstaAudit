import mongoose from "mongoose"
import { connectDB } from "@/lib/mongodb"
import { Audit } from "@/models/Audit"
import { AuditUsage } from "@/models/AuditUsage"
import { User } from "@/models/User"
import { PLAN_CONFIG, type PlanKey } from "@/lib/plans/plan-config"

type ScoreTrendPoint = {
  date: string
  avgScore: number
  audits: number
}

type MonthlyReport = {
  id: string
  name: string
  dateLabel: string
  profilesAnalyzed: number
  auditsRun: number
  avgScore: number
}

type OverviewStats = {
  totalAudits: number
  avgScore: number
  bestScore: number
  auditsThisMonth: number
  planLimit: number
  isUnlimited: boolean
  uniqueHandles: number
  scoreDelta30d: number
}

type ScoreDistributionBucket = {
  bucket: "Poor (0-39)" | "Fair (40-59)" | "Good (60-79)" | "Excellent (80-100)"
  count: number
}

type SourceBreakdownItem = {
  source: "graph_api" | "scraper" | "unknown"
  count: number
}

type WeakMetric = {
  key: string
  avgScore: number
  samples: number
}

type HandlePerformance = {
  handle: string
  audits: number
  avgScore: number
  bestScore: number
}

type RecentAudit = {
  id: string
  handle: string
  score: number
  date: string
  source: "graph_api" | "scraper" | "unknown"
}

type EngagementTimelinePoint = {
  date: string
  avgEngagementRate: number
  audits: number
}

type ContentMixOverview = {
  image: number
  carousel: number
  reel: number
}

type ModuleScoreBreakdownItem = {
  module: string
  avgScore: number
  samples: number
}

export type UserReportsOverview = {
  stats: OverviewStats
  trend: ScoreTrendPoint[]
  reports: MonthlyReport[]
  scoreDistribution: ScoreDistributionBucket[]
  sourceBreakdown: SourceBreakdownItem[]
  weakMetrics: WeakMetric[]
  topHandles: HandlePerformance[]
  recentAudits: RecentAudit[]
  engagementTimeline: EngagementTimelinePoint[]
  contentMix: ContentMixOverview
  moduleScoreBreakdown: ModuleScoreBreakdownItem[]
}

function periodLabel(periodKey: string) {
  const [year, month] = periodKey.split("-").map(Number)
  if (!year || !month) return periodKey
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })
}

function toPlan(value: unknown): PlanKey {
  if (value === "starter" || value === "pro" || value === "agency") {
    return value
  }
  return "free"
}

export async function getUserReportsOverview(
  userId: string,
  options?: { days?: number; handle?: string },
): Promise<UserReportsOverview> {
  await connectDB()

  const objectId = new mongoose.Types.ObjectId(userId)
  const now = new Date()
  const days = Math.min(Math.max(options?.days ?? 30, 7), 90)
  const handleFilter = options?.handle?.trim().replace(/^@/, "").toLowerCase() || ""
  const monthKey = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`
  const trendStart = new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000)
  const baseMatch: Record<string, unknown> = { userId: objectId }
  if (handleFilter) {
    baseMatch.handle = handleFilter
  }

  const [user, totalAgg, trendAgg, monthlyAgg, usage, rawAudits, engagementAgg] = await Promise.all([
    User.findById(objectId)
      .select("subscriptionPlan selectedPlan")
      .lean<{ subscriptionPlan?: PlanKey; selectedPlan?: PlanKey } | null>(),
    Audit.aggregate([
      { $match: { ...baseMatch, createdAt: { $gte: trendStart } } },
      {
        $group: {
          _id: null,
          totalAudits: { $sum: 1 },
          avgScore: { $avg: { $ifNull: ["$result.overallScore", 0] } },
          bestScore: { $max: { $ifNull: ["$result.overallScore", 0] } },
        },
      },
    ]),
    Audit.aggregate([
      { $match: { ...baseMatch, createdAt: { $gte: trendStart } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          avgScore: { $avg: { $ifNull: ["$result.overallScore", 0] } },
          audits: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Audit.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" },
          },
          auditsRun: { $sum: 1 },
          avgScore: { $avg: { $ifNull: ["$result.overallScore", 0] } },
          handles: { $addToSet: "$handle" },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 6 },
    ]),
    AuditUsage.findOne({ userId: objectId, periodKey: monthKey })
      .select("auditsUsed")
      .lean(),
    Audit.find({ userId: objectId })
      .where(handleFilter ? { handle: handleFilter } : {})
      .where({ createdAt: { $gte: trendStart } })
      .sort({ createdAt: -1 })
      .limit(200)
      .select("handle createdAt result.overallScore result.profileSnapshot.dataSource result.metrics contentMix")
      .lean(),
    Audit.aggregate([
      { $match: { ...baseMatch, createdAt: { $gte: trendStart } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          avgEngagementRate: { $avg: { $ifNull: ["$avgEngagementRate", 0] } },
          audits: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ])

  const plan = toPlan(user?.subscriptionPlan ?? user?.selectedPlan)
  const planLimit = PLAN_CONFIG[plan].auditsPerMonth
  const isUnlimited = planLimit === -1
  const auditsThisMonth = usage?.auditsUsed ?? 0

  const totals = totalAgg[0] ?? { totalAudits: 0, avgScore: 0, bestScore: 0 }
  const dailyTrend = trendAgg.map((point) => ({
    date: String(point._id),
    avgScore: Math.round(Number(point.avgScore ?? 0)),
    audits: Number(point.audits ?? 0),
  }))
  const engagementTimeline: EngagementTimelinePoint[] = engagementAgg.map((point: any) => ({
    date: String(point._id),
    avgEngagementRate: Number(Number(point.avgEngagementRate ?? 0).toFixed(2)),
    audits: Number(point.audits ?? 0),
  }))

  const scores = rawAudits
    .map((audit: any) => Number(audit?.result?.overallScore ?? 0))
    .filter((score) => Number.isFinite(score))
  const handlesSet = new Set(rawAudits.map((audit: any) => String(audit.handle || "").toLowerCase()).filter(Boolean))

  const scoreDistribution: ScoreDistributionBucket[] = [
    { bucket: "Poor (0-39)", count: 0 },
    { bucket: "Fair (40-59)", count: 0 },
    { bucket: "Good (60-79)", count: 0 },
    { bucket: "Excellent (80-100)", count: 0 },
  ]
  for (const score of scores) {
    if (score < 40) scoreDistribution[0].count += 1
    else if (score < 60) scoreDistribution[1].count += 1
    else if (score < 80) scoreDistribution[2].count += 1
    else scoreDistribution[3].count += 1
  }

  const sourceCounts = { graph_api: 0, scraper: 0, unknown: 0 }
  for (const audit of rawAudits as any[]) {
    const source = audit?.result?.profileSnapshot?.dataSource
    if (source === "graph_api") sourceCounts.graph_api += 1
    else if (source === "scraper") sourceCounts.scraper += 1
    else sourceCounts.unknown += 1
  }
  const sourceBreakdown: SourceBreakdownItem[] = [
    { source: "graph_api", count: sourceCounts.graph_api },
    { source: "scraper", count: sourceCounts.scraper },
    { source: "unknown", count: sourceCounts.unknown },
  ]

  const metricMap = new Map<string, { sum: number; samples: number }>()
  for (const audit of rawAudits as any[]) {
    const metrics = audit?.result?.metrics
    if (!metrics || typeof metrics !== "object") continue
    for (const [key, value] of Object.entries(metrics as Record<string, any>)) {
      const score = Number(value?.score ?? 0)
      if (!Number.isFinite(score)) continue
      const current = metricMap.get(key) ?? { sum: 0, samples: 0 }
      current.sum += score
      current.samples += 1
      metricMap.set(key, current)
    }
  }
  const weakMetrics: WeakMetric[] = Array.from(metricMap.entries())
    .map(([key, value]) => ({
      key,
      avgScore: Math.round(value.sum / Math.max(value.samples, 1)),
      samples: value.samples,
    }))
    .sort((a, b) => a.avgScore - b.avgScore)
    .slice(0, 6)
  const moduleScoreBreakdown: ModuleScoreBreakdownItem[] = Array.from(metricMap.entries())
    .map(([key, value]) => ({
      module: key,
      avgScore: Math.round(value.sum / Math.max(value.samples, 1)),
      samples: value.samples,
    }))
    .sort((a, b) => b.avgScore - a.avgScore)

  const handleMap = new Map<string, { audits: number; sum: number; best: number }>()
  for (const audit of rawAudits as any[]) {
    const handle = String(audit.handle ?? "").toLowerCase()
    if (!handle) continue
    const score = Number(audit?.result?.overallScore ?? 0)
    const current = handleMap.get(handle) ?? { audits: 0, sum: 0, best: 0 }
    current.audits += 1
    current.sum += score
    current.best = Math.max(current.best, score)
    handleMap.set(handle, current)
  }
  const topHandles: HandlePerformance[] = Array.from(handleMap.entries())
    .map(([handle, value]) => ({
      handle,
      audits: value.audits,
      avgScore: Math.round(value.sum / Math.max(value.audits, 1)),
      bestScore: value.best,
    }))
    .sort((a, b) => (b.audits !== a.audits ? b.audits - a.audits : b.avgScore - a.avgScore))
    .slice(0, 6)

  const recentAudits: RecentAudit[] = (rawAudits as any[]).slice(0, 8).map((audit) => ({
    id: String(audit._id),
    handle: String(audit.handle ?? ""),
    score: Math.round(Number(audit?.result?.overallScore ?? 0)),
    date: new Date(audit.createdAt).toISOString(),
    source:
      audit?.result?.profileSnapshot?.dataSource === "graph_api"
        ? "graph_api"
        : audit?.result?.profileSnapshot?.dataSource === "scraper"
          ? "scraper"
          : "unknown",
  }))

  const firstTrendScore = dailyTrend[0]?.avgScore ?? 0
  const lastTrendScore = dailyTrend[dailyTrend.length - 1]?.avgScore ?? firstTrendScore
  const scoreDelta30d = lastTrendScore - firstTrendScore

  const contentMixAccumulator = { image: 0, carousel: 0, reel: 0, samples: 0 }
  for (const audit of rawAudits as any[]) {
    const mix = audit?.contentMix
    if (!mix || typeof mix !== "object") continue
    contentMixAccumulator.image += Number(mix.image ?? 0)
    contentMixAccumulator.carousel += Number(mix.carousel ?? 0)
    contentMixAccumulator.reel += Number(mix.reel ?? 0)
    contentMixAccumulator.samples += 1
  }
  const denom = Math.max(contentMixAccumulator.samples, 1)
  const contentMix: ContentMixOverview = {
    image: Number((contentMixAccumulator.image / denom).toFixed(1)),
    carousel: Number((contentMixAccumulator.carousel / denom).toFixed(1)),
    reel: Number((contentMixAccumulator.reel / denom).toFixed(1)),
  }

  return {
    stats: {
      totalAudits: Number(totals.totalAudits ?? 0),
      avgScore: Math.round(Number(totals.avgScore ?? 0)),
      bestScore: Math.round(Number(totals.bestScore ?? 0)),
      auditsThisMonth,
      planLimit: isUnlimited ? -1 : planLimit,
      isUnlimited,
      uniqueHandles: handlesSet.size,
      scoreDelta30d,
    },
    trend: dailyTrend,
    reports: monthlyAgg.map((entry) => {
      const period = String(entry._id)
      const profilesAnalyzed = Array.isArray(entry.handles) ? entry.handles.length : 0
      return {
        id: period,
        name: "Monthly Instagram Audit Report",
        dateLabel: periodLabel(period),
        profilesAnalyzed,
        auditsRun: Number(entry.auditsRun ?? 0),
        avgScore: Math.round(Number(entry.avgScore ?? 0)),
      }
    }),
    scoreDistribution,
    sourceBreakdown,
    weakMetrics,
    topHandles,
    recentAudits,
    engagementTimeline,
    contentMix,
    moduleScoreBreakdown,
  }
}
