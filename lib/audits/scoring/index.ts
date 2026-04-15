import type { ProfileData } from "@/lib/instagram/types"
import type { AuditDepth } from "@/lib/audits/types"
import type { MetricScore } from "./types"
import { scoreBio } from "./bio"
import { scoreCta } from "./cta"
import { scorePositioning } from "./positioning"
import { scoreCaptions } from "./captions"
import { scoreHashtags } from "./hashtags"
import { scoreContent } from "./content"
import { scoreEngagement } from "./engagement"
import { scoreStrategy } from "./strategy"

export type ScoredMetrics = Record<string, MetricScore>

export function runScoring(
  profile: ProfileData,
  depth: AuditDepth
): ScoredMetrics {
  const hasPosts = profile.posts.length > 0

  const basic: ScoredMetrics = {
    bio: scoreBio(profile),
    cta: scoreCta(profile, hasPosts),
    positioning: scorePositioning(profile),
  }

  if (depth === "basic") return basic

  const full: ScoredMetrics = {
    ...basic,
    captions: scoreCaptions(profile),
    hashtags: scoreHashtags(profile),
    content: scoreContent(profile),
  }

  if (depth === "full") return full

  // Advanced — includes engagement and strategy
  const withEngagement: ScoredMetrics = {
    ...full,
    engagement: scoreEngagement(profile),
  }

  const strategy = scoreStrategy(profile, withEngagement)

  return {
    ...withEngagement,
    strategy,
  }
}

export function calculateOverallScore(
  metrics: ScoredMetrics,
  depth: AuditDepth
): number {
  const weights: Record<string, Record<string, number>> = {
    basic: {
      bio: 0.40,
      cta: 0.30,
      positioning: 0.30,
    },
    full: {
      bio: 0.15,
      cta: 0.12,
      positioning: 0.13,
      captions: 0.22,
      hashtags: 0.16,
      content: 0.22,
    },
    advanced: {
      bio: 0.10,
      cta: 0.08,
      positioning: 0.10,
      captions: 0.15,
      hashtags: 0.10,
      content: 0.15,
      engagement: 0.18,
      strategy: 0.14,
    },
  }

  const w = weights[depth]
  let total = 0

  for (const [key, weight] of Object.entries(w)) {
    const metric = metrics[key]
    if (metric) total += metric.score * weight
  }

  return Math.round(total)
}
