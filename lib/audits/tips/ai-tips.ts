import OpenAI from "openai"
import type { ProfileData } from "@/lib/instagram/types"
import type { ScoredMetrics } from "@/lib/audits/metrics"
import type { PlanKey } from "@/lib/plans/plan-config"
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

function buildPrompt(
  profile: ProfileData,
  metrics: ScoredMetrics,
  plan: PlanKey
): string {
  const sampleCaptions = profile.posts
    .slice(0, 5)
    .map((p, i) => `Post ${i + 1}: "${p.caption.slice(0, 200).trim()}"`)
    .join("\n")

  const metricsText = Object.entries(metrics)
    .map(([key, m]) => `${key}: ${m.score}/100 (${m.status})`)
    .join(", ")

  const isAdvanced = plan === "pro" || plan === "agency"

  const base = `
You are an expert Instagram growth strategist. Analyze this Instagram profile and provide specific, actionable advice.

USERNAME: @${profile.username}
BIO: "${profile.bio}"
FOLLOWERS: ${profile.followerCount.toLocaleString()}
FOLLOWING: ${profile.followingCount.toLocaleString()}
TOTAL POSTS: ${profile.postCount}
HAS LINK IN BIO: ${profile.hasLinkInBio ? "Yes" : "No"}
ACCOUNT TYPE: ${profile.accountType}
DATA SOURCE: ${profile.dataSource === "graph_api" ? "Connected account (official API)" : "Public scrape"}

AUDIT SCORES:
${metricsText}

RECENT CAPTION SAMPLES:
${sampleCaptions || "No captions available"}
`.trim()

  if (isAdvanced) {
    return `
${base}

TASK:
1. Write exactly 6 specific, personalized audit tips based on the ACTUAL bio text and caption samples above. Reference real content when possible — not generic advice. Each tip should be 1–2 sentences.
2. Create a 7-day content plan tailored to this account's niche and current weaknesses.

Respond ONLY with valid JSON in this exact format:
{
  "tips": ["tip1", "tip2", "tip3", "tip4", "tip5", "tip6"],
  "contentPlan": [
    {
      "day": "Monday",
      "contentType": "Reel",
      "topic": "brief topic idea",
      "captionHook": "suggested opening line for the caption",
      "hashtagTip": "brief hashtag strategy note"
    }
  ]
}
`.trim()
  }

  return `
${base}

TASK:
Write exactly 5 specific, personalized audit tips based on the ACTUAL bio text and caption samples above. Reference real content when possible — not generic advice. Each tip should be 1–2 sentences.

Respond ONLY with valid JSON in this exact format:
{
  "tips": ["tip1", "tip2", "tip3", "tip4", "tip5"]
}
`.trim()
}

export async function generateAiTips(
  profile: ProfileData,
  metrics: ScoredMetrics,
  plan: PlanKey
): Promise<AiTipsResult> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured")
  }

  const client = new OpenAI({ apiKey })
  await trackOpenAiApiCall("gpt-4o-mini")

  const prompt = buildPrompt(profile, metrics, plan)

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: plan === "pro" || plan === "agency" ? 1200 : 700,
    response_format: { type: "json_object" },
  })

  const content = response.choices[0]?.message?.content ?? "{}"
  const parsed = JSON.parse(content)

  return {
    tips: Array.isArray(parsed.tips) ? parsed.tips : [],
    contentPlan: Array.isArray(parsed.contentPlan)
      ? parsed.contentPlan
      : undefined,
  }
}
