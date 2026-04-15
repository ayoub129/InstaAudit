import type { ProfileData } from "@/lib/instagram/types"
import { getStatus, clamp, type MetricScore } from "./types"

export function scoreStrategy(
  profile: ProfileData,
  metricScores: Record<string, { score: number }>
): MetricScore {
  const details: string[] = []
  const posts = profile.posts

  // Strategy is a weighted composite of other signals plus some unique checks

  // Weighted composite (70 pts)
  const weights: Record<string, number> = {
    bio: 0.12,
    cta: 0.10,
    positioning: 0.12,
    captions: 0.14,
    hashtags: 0.12,
    content: 0.14,
    engagement: 0.26,
  }

  let compositeScore = 0
  for (const [key, weight] of Object.entries(weights)) {
    const metric = metricScores[key]
    if (metric) {
      compositeScore += metric.score * weight
    }
  }

  // Normalize to 70 pts max for composite
  const compositeContribution = (compositeScore / 100) * 70

  // Unique strategy signals (30 pts)
  let strategyBonus = 0

  // Content pillar consistency (10 pts) — check if captions share common themes/keywords
  if (posts.length >= 5) {
    const allWords = posts
      .flatMap((p) =>
        p.caption
          .toLowerCase()
          .replace(/#\w+/g, "")
          .split(/\s+/)
          .filter((w) => w.length > 4)
      )
    const freq: Record<string, number> = {}
    for (const word of allWords) freq[word] = (freq[word] ?? 0) + 1

    const repeated = Object.values(freq).filter((c) => c >= 3).length
    if (repeated >= 5) {
      strategyBonus += 10
    } else if (repeated >= 2) {
      strategyBonus += 6
      details.push(
        "Content themes aren't very consistent. Repeating 2–3 core topics signals a clear content pillar strategy."
      )
    } else {
      details.push(
        "Posts cover a very wide range of topics. Narrowing to 2–3 content pillars makes your account easier to follow and recommend."
      )
    }
  }

  // Follower / following ratio (10 pts)
  if (profile.followerCount > 0 && profile.followingCount > 0) {
    const ratio = profile.followerCount / profile.followingCount

    if (ratio >= 2) {
      strategyBonus += 10
    } else if (ratio >= 1) {
      strategyBonus += 6
      details.push(
        "Your following count is close to your follower count. A healthier ratio signals authority — unfollow inactive accounts."
      )
    } else {
      strategyBonus += 2
      details.push(
        `You're following more accounts than follow you (ratio ${ratio.toFixed(2)}). This can signal a follow-for-follow strategy, which hurts perceived authority.`
      )
    }
  }

  // Reel / video presence bonus (10 pts) — Reels get the most organic reach
  const hasReelsOrVideo = posts.some(
    (p) => p.mediaType === "reel" || p.mediaType === "video"
  )
  if (hasReelsOrVideo) {
    strategyBonus += 10
  } else {
    details.push(
      "No Reels or video content detected. Reels consistently get the highest organic reach on Instagram."
    )
  }

  const totalScore = compositeContribution + strategyBonus

  if (totalScore >= 80 && details.length === 0) {
    details.push("Well-rounded strategy with consistent content themes, strong engagement, and clear positioning.")
  }

  return {
    score: clamp(Math.round(totalScore)),
    status: getStatus(totalScore),
    details,
  }
}
