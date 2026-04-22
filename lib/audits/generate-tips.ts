import OpenAI from "openai"
import type { ProfileData } from "@/lib/instagram/types"
import type { ScoredMetrics } from "@/lib/audits/metrics"
import type { PlanKey } from "@/lib/plans/plan-config"
import { generateRuleBasedTips } from "./tips/rule-based"
import { trackOpenAiApiCall } from "@/lib/analytics/usage-tracker"

export interface DayPlan {
  day: string
  contentType: "Reel" | "Carousel" | "Image" | "Story"
  topic: string
  captionHook: string
  hashtagTip: string
}

export interface AiTipsResult {
  tips: string[]
  contentPlan?: DayPlan[]
}

function industryErBenchmark(followers: number): number {
  if (followers < 10000) return 4.2
  if (followers < 50000) return 3.1
  if (followers < 100000) return 2.6
  if (followers < 500000) return 2.0
  if (followers < 1000000) return 1.6
  return 1.2
}

function inferNiche(profile: ProfileData): string {
  const text = `${profile.bio} ${profile.fullName}`.toLowerCase()
  if (text.includes("fitness")) return "Fitness"
  if (text.includes("real estate")) return "Real Estate"
  if (text.includes("saas")) return "SaaS"
  if (text.includes("beauty")) return "Beauty"
  if (text.includes("travel")) return "Travel"
  if (text.includes("food")) return "Food"
  return "General"
}

function toNum(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function buildDataSummary(profile: ProfileData, metrics: ScoredMetrics): string {
  const niche = inferNiche(profile)
  const engagementData = metrics.engagementHealth?.rawData ?? {}
  const consistencyData = metrics.contentConsistency?.rawData ?? {}
  const mixData = metrics.contentMix?.rawData ?? {}
  const hashtagData = metrics.hashtagStrategy?.rawData ?? {}
  const reelsData = metrics.reelsPerformance?.rawData ?? {}

  const avgEr = toNum(engagementData.avgEngagementRate)
  const benchmark = industryErBenchmark(profile.followerCount)
  const postsPerWeek = toNum(consistencyData.postsPerWeek)
  const daysSinceLastPost = toNum(consistencyData.daysSinceLastPost)
  const imageRate = toNum(mixData.imageRate)
  const carouselRate = toNum(mixData.carouselRate)
  const reelRate = toNum(mixData.reelAdoptionRate)
  const avgHashtagsPerPost = toNum(hashtagData.avgHashtagsPerPost)
  const repetitionRate = toNum(hashtagData.repetitionRate)
  const reelsCount = toNum(reelsData.reelsCount)

  const topPostType =
    (carouselRate ?? 0) > (imageRate ?? 0) && (carouselRate ?? 0) > (reelRate ?? 0)
      ? "carousels"
      : (reelRate ?? 0) > (imageRate ?? 0)
        ? "reels"
        : "static images"

  return `
Account: @${profile.username} | ${profile.followerCount.toLocaleString()} followers | ${profile.postCount.toLocaleString()} posts | ${niche} niche
Engagement rate: ${avgEr !== null ? `${avgEr.toFixed(2)}%` : "n/a"} (industry avg for this size: ${benchmark.toFixed(1)}%)
Posting: ${postsPerWeek !== null ? `${postsPerWeek.toFixed(1)}x/week` : "n/a"} (last post: ${daysSinceLastPost !== null ? `${Math.round(daysSinceLastPost)} days ago` : "n/a"})
Content mix: ${imageRate !== null ? `${Math.round(imageRate)}%` : "n/a"} static images, ${carouselRate !== null ? `${Math.round(carouselRate)}%` : "n/a"} carousels, ${reelRate !== null ? `${Math.round(reelRate)}%` : "n/a"} reels
Hashtags: avg ${avgHashtagsPerPost !== null ? avgHashtagsPerPost.toFixed(1) : "n/a"} per post (optimal: 5-12), ${repetitionRate !== null ? `${Math.round(repetitionRate * 100)}%` : "n/a"} repeated across posts
Reels: ${reelsCount !== null ? Math.round(reelsCount) : 0} in last 30 days (reels avg 3x more reach in this niche)
Top performing post type: ${topPostType}
`.trim()
}

function buildPrompt(profile: ProfileData, metrics: ScoredMetrics): string {
  const summary = buildDataSummary(profile, metrics)
  return `
You are an expert Instagram growth strategist.

Use the concrete account numbers below and generate 5 specific, actionable improvement tips.
Each tip must reference at least one actual number from the data.
Avoid generic advice.

${summary}

Respond ONLY with valid JSON in this exact format:
{
  "tips": ["tip1", "tip2", "tip3", "tip4", "tip5"]
}
`.trim()
}

async function generateAiTips(profile: ProfileData, metrics: ScoredMetrics): Promise<AiTipsResult> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured")
  const client = new OpenAI({ apiKey })
  const modelName = process.env.OPENAI_AUDIT_MODEL || "gpt-4o-mini"
  await trackOpenAiApiCall(modelName)

  const response = await client.chat.completions.create({
    model: modelName,
    messages: [{ role: "user", content: buildPrompt(profile, metrics) }],
    temperature: 0.3,
    max_tokens: 800,
    response_format: { type: "json_object" },
  })

  const content = response.choices[0]?.message?.content ?? "{}"
  const parsed = JSON.parse(content) as AiTipsResult
  return {
    tips: Array.isArray(parsed.tips) ? parsed.tips.slice(0, 5) : [],
  }
}

export async function generateTips(
  profile: ProfileData,
  metrics: ScoredMetrics,
  plan: PlanKey,
): Promise<AiTipsResult> {
  if (plan === "free") {
    return { tips: generateRuleBasedTips(profile, metrics) }
  }

  if (!process.env.OPENAI_API_KEY) {
    console.warn("[tips] OPENAI_API_KEY not set — falling back to rule-based tips")
    return { tips: generateRuleBasedTips(profile, metrics) }
  }

  try {
    return await generateAiTips(profile, metrics)
  } catch (err) {
    console.error("[tips] AI tip generation failed, using rule-based fallback:", err)
    return { tips: generateRuleBasedTips(profile, metrics) }
  }
}

