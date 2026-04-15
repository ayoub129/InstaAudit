import type { ProfileData } from "@/lib/instagram/types"
import { getStatus, clamp, type MetricScore } from "./types"

// Industry average engagement benchmarks by follower tier
function getBenchmarkEngagementRate(followerCount: number): number {
  if (followerCount < 1_000) return 8.0    // nano
  if (followerCount < 10_000) return 5.0   // micro
  if (followerCount < 100_000) return 2.5  // mid-tier
  if (followerCount < 1_000_000) return 1.5 // macro
  return 0.8                               // mega
}

export function scoreEngagement(profile: ProfileData): MetricScore {
  const posts = profile.posts
  const followerCount = profile.followerCount
  const details: string[] = []

  if (!followerCount || followerCount === 0) {
    return {
      score: 0,
      status: "poor",
      details: ["Follower count is unavailable — cannot calculate engagement rate."],
    }
  }

  // Use pre-computed avgEngagementRate from Graph API if available, else calculate
  let engagementRate: number

  if (profile.avgEngagementRate !== undefined) {
    engagementRate = profile.avgEngagementRate
  } else if (posts.length > 0) {
    const totalEngagement = posts.reduce(
      (sum, p) => sum + p.likeCount + p.commentCount,
      0
    )
    engagementRate = (totalEngagement / posts.length / followerCount) * 100
  } else {
    return {
      score: 20,
      status: "poor",
      details: ["No post data available to calculate engagement rate."],
    }
  }

  const benchmark = getBenchmarkEngagementRate(followerCount)
  const ratio = engagementRate / benchmark // how you compare to peers

  let score: number

  if (ratio >= 2.0) {
    score = 100
    details.push(
      `Exceptional engagement rate of ${engagementRate.toFixed(2)}% — over 2× the benchmark for your follower tier. Your audience is highly active.`
    )
  } else if (ratio >= 1.4) {
    score = 85
    details.push(
      `Strong engagement rate of ${engagementRate.toFixed(2)}% — above average for your follower count.`
    )
  } else if (ratio >= 0.8) {
    score = 70
    details.push(
      `Engagement rate of ${engagementRate.toFixed(2)}% — on par with the industry average (${benchmark.toFixed(1)}%) for your follower tier.`
    )
  } else if (ratio >= 0.4) {
    score = 45
    details.push(
      `Engagement rate of ${engagementRate.toFixed(2)}% is below average (benchmark: ${benchmark.toFixed(1)}%). Focus on content that prompts saves, comments, and shares.`
    )
  } else {
    score = 20
    details.push(
      `Low engagement rate of ${engagementRate.toFixed(2)}% compared to benchmark (${benchmark.toFixed(1)}%). This may indicate low content resonance or a disengaged audience.`
    )
  }

  // Extra insight on comments vs likes balance
  if (posts.length > 0) {
    const totalLikes = posts.reduce((sum, p) => sum + p.likeCount, 0)
    const totalComments = posts.reduce((sum, p) => sum + p.commentCount, 0)

    if (totalComments === 0) {
      details.push("None of your recent posts received comments. Focus on conversation-starting content and direct questions.")
    } else if (totalLikes > 0) {
      const commentToLikeRatio = totalComments / totalLikes
      if (commentToLikeRatio < 0.01) {
        details.push("Very few comments relative to likes. Comments are a stronger engagement signal — use prompts to spark discussions.")
      }
    }
  }

  return {
    score: clamp(score),
    status: getStatus(score),
    details,
  }
}
