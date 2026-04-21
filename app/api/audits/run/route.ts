import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { Audit } from "@/models/Audit"
import { getUserPlan } from "@/lib/plans/get-user-plan"
import { canRunAudit } from "@/lib/audits/can-run-audit"
import { incrementAuditUsage } from "@/lib/audits/increment-audit-usage"
import { runAudit, ProfileFetchError } from "@/lib/audits/run-audit"
import { trackEvent } from "@/lib/analytics/track-event"

function normalizeHandle(input: string) {
  return input.trim().replace(/^@/, "").toLowerCase()
}

function toNum(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

function buildAuditAnalyticsFields(result: {
  profileSnapshot?: {
    followerCount?: number
    followingCount?: number
    dataSource?: "graph_api" | "scraper"
  }
  metrics?: Record<string, { score: number; details?: string[]; rawData?: Record<string, unknown> }>
}) {
  const source = result.profileSnapshot?.dataSource === "graph_api" ? "graph" : "scraper"
  const metrics = result.metrics ?? {}
  const contentConsistency = metrics.contentConsistency?.rawData ?? {}
  const engagementHealth = metrics.engagementHealth?.rawData ?? {}
  const contentMix = metrics.contentMix?.rawData ?? {}
  const hashtagStrategy = metrics.hashtagStrategy?.rawData ?? {}
  const reelsPerformance = metrics.reelsPerformance?.rawData ?? {}
  const audienceQuality = metrics.audienceQuality?.rawData ?? {}

  const postsAnalyzed = Math.round(
    toNum(contentConsistency.postsAnalyzed) ||
      toNum(engagementHealth.postsAnalyzed) ||
      toNum(contentMix.postsAnalyzed),
  )
  const reelsAnalyzed = Math.round(toNum(reelsPerformance.reelsCount))
  const avgEngagementRate = toNum(engagementHealth.avgEngagementRate)
  const trendDelta = toNum(engagementHealth.trendDelta)
  const engagementTrend: "improving" | "declining" | "stable" =
    trendDelta > 0.2 ? "improving" : trendDelta < -0.2 ? "declining" : "stable"

  const postingFrequencyPerWeek = toNum(contentConsistency.postsPerWeek)
  const contentMixFields = {
    image: toNum(contentMix.imageRate),
    carousel: toNum(contentMix.carouselRate),
    reel: toNum(contentMix.reelAdoptionRate),
  }
  const avgHashtagsPerPost = toNum(hashtagStrategy.avgHashtagsPerPost)
  const reelViewRate = toNum(reelsPerformance.avgViewRate)

  const followerFollowingRatio =
    toNum(audienceQuality.followerFollowingRatio) ||
    (toNum(result.profileSnapshot?.followerCount) /
      Math.max(1, toNum(result.profileSnapshot?.followingCount)))

  const moduleScores = Object.fromEntries(
    Object.entries(metrics).map(([moduleName, moduleValue]) => [
      moduleName,
      {
        score: toNum(moduleValue.score),
        findings: Array.isArray(moduleValue.details) ? moduleValue.details : [],
      },
    ]),
  )

  const dataSource = {
    postsAnalyzed: source,
    reelsAnalyzed: source,
    avgEngagementRate: source,
    engagementTrend: source,
    postingFrequencyPerWeek: source,
    contentMix: source,
    avgHashtagsPerPost: source,
    reelViewRate: source,
    followerFollowingRatio: source,
    moduleScores: source,
  } as const

  return {
    postsAnalyzed,
    reelsAnalyzed,
    avgEngagementRate,
    engagementTrend,
    postingFrequencyPerWeek,
    contentMix: contentMixFields,
    avgHashtagsPerPost,
    reelViewRate,
    followerFollowingRatio,
    moduleScores,
    dataSource,
  }
}

export async function POST(request: Request) {
  let sessionUserId: string | undefined
  try {
    const session = await getServerSession(authOptions)
    sessionUserId = session?.user?.id

    if (!session?.user?.id) {
      await trackEvent({
        eventName: "audit_run_unauthorized",
        request,
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = session.user.id
    sessionUserId = userId

    const body = await request.json()
    const username = normalizeHandle(body.username || "")

    if (!username) {
      await trackEvent({
        eventName: "audit_run_validation_failed",
        userId: sessionUserId,
        properties: {
          error: "missing_handle",
        },
        request,
      })
      return NextResponse.json(
        { error: "Instagram handle is required" },
        { status: 400 }
      )
    }

    await connectDB()

    const plan = getUserPlan(session.user)

    const usage = await canRunAudit(userId, plan)

    if (!usage.allowed) {
      await trackEvent({
        eventName: "audit_blocked_limit_reached",
        userId: sessionUserId,
        properties: {
          plan,
          used: usage.used,
          limit: usage.limit,
        },
        request,
      })
      return NextResponse.json(
        {
          error: "Audit limit reached",
          code: "AUDIT_LIMIT_REACHED",
          plan,
        },
        { status: 403 }
      )
    }

    console.log(`[audit/run] Starting audit for @${username} | plan=${plan} | userId=${userId}`)
    await trackEvent({
      eventName: "audit_run_started",
      userId,
      properties: {
        handle: username,
        plan,
      },
      request,
    })

    const result = await runAudit({
      username,
      plan,
      userId,
    })

    console.log(`[audit/run] Audit complete for @${username} | score=${result.overallScore} | source=${result.profileSnapshot?.dataSource}`)

    const auditType =
      plan === "free" ? "basic" : plan === "starter" ? "full" : "advanced"

    const analyticsFields = buildAuditAnalyticsFields(result)

    const audit = await Audit.create({
      userId,
      handle: username,
      planAtRun: plan,
      auditType,
      result,
      ...analyticsFields,
    })

    await incrementAuditUsage(userId, plan)

    await trackEvent({
      eventName: "audit_run_completed",
      userId,
      properties: {
        handle: username,
        plan,
        auditType,
        overallScore: result.overallScore,
        source: result.profileSnapshot?.dataSource ?? null,
      },
      request,
    })

    return NextResponse.json({
      success: true,
      auditId: audit._id,
      result: {
        ...result,
        auditInsights: {
          postsAnalyzed: analyticsFields.postsAnalyzed,
          reelsAnalyzed: analyticsFields.reelsAnalyzed,
          avgEngagementRate: analyticsFields.avgEngagementRate,
          engagementTrend: analyticsFields.engagementTrend,
          postingFrequencyPerWeek: analyticsFields.postingFrequencyPerWeek,
          contentMix: analyticsFields.contentMix,
          avgHashtagsPerPost: analyticsFields.avgHashtagsPerPost,
          reelViewRate: analyticsFields.reelViewRate,
          followerFollowingRatio: analyticsFields.followerFollowingRatio,
          dataSource: analyticsFields.dataSource,
        },
      },
    })
  } catch (error) {
    // Known profile-fetch errors — surface them to the user directly
    if (error instanceof ProfileFetchError) {
      console.error(`[audit/run] ProfileFetchError code=${error.code}: ${error.message}`)
      await trackEvent({
        eventName: "audit_run_failed_profile_fetch",
        userId: sessionUserId,
        properties: {
          code: error.code,
          message: error.message,
        },
        request,
      })
      const statusMap: Record<string, number> = {
        NOT_FOUND: 404,
        PRIVATE_ACCOUNT: 422,
        RATE_LIMITED: 429,
        BLOCKED: 503,
        TOKEN_EXPIRED: 401,
        FETCH_FAILED: 502,
      }
      const status = statusMap[error.code] ?? 502
      return NextResponse.json({ error: error.message, code: error.code }, { status })
    }

    console.error("[audit/run] Unexpected error:", error)
    await trackEvent({
      eventName: "audit_run_failed_unexpected",
      userId: sessionUserId,
      properties: {
        error: error instanceof Error ? error.message : "unknown_error",
      },
      request,
    })
    return NextResponse.json(
      { error: "Failed to run audit" },
      { status: 500 }
    )
  }
}
