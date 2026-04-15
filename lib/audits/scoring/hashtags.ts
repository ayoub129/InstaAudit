import type { ProfileData } from "@/lib/instagram/types"
import { getStatus, clamp, type MetricScore } from "./types"

export function scoreHashtags(profile: ProfileData): MetricScore {
  const posts = profile.posts
  const details: string[] = []

  if (posts.length === 0) {
    return {
      score: 0,
      status: "poor",
      details: ["No posts found to analyze hashtag strategy."],
    }
  }

  let score = 0

  // --- Usage rate (20 pts) ---
  const postsWithHashtags = posts.filter((p) => p.hashtags.length > 0)
  const usageRate = postsWithHashtags.length / posts.length

  if (usageRate >= 0.8) {
    score += 20
  } else if (usageRate >= 0.5) {
    score += 12
    details.push("Not all posts use hashtags. Consistent hashtag usage improves discoverability.")
  } else {
    score += 4
    details.push("Most posts don't use hashtags. Hashtags are one of Instagram's main discovery mechanisms.")
  }

  // --- Count per post (30 pts) ---
  const hashtagCounts = posts.map((p) => p.hashtags.length)
  const avgCount =
    hashtagCounts.reduce((a, b) => a + b, 0) / hashtagCounts.length

  if (avgCount >= 5 && avgCount <= 15) {
    score += 30
  } else if (avgCount >= 3 && avgCount < 5) {
    score += 20
    details.push(
      `You're averaging ~${Math.round(avgCount)} hashtags per post. 5–15 hashtags is the current sweet spot on Instagram.`
    )
  } else if (avgCount > 15 && avgCount <= 25) {
    score += 22
    details.push(
      "Using more than 15 hashtags per post can look spammy. Focus on 5–15 highly relevant ones."
    )
  } else if (avgCount > 25) {
    score += 10
    details.push(
      "Over 25 hashtags per post is over-stuffed and may hurt reach. Quality over quantity."
    )
  } else if (avgCount < 3 && avgCount > 0) {
    score += 12
    details.push(
      `You're only using ~${Math.round(avgCount)} hashtags per post. Increase to 5–15 for better reach.`
    )
  }

  // --- Consistency across posts (25 pts) ---
  const countsVariance = calcVariance(hashtagCounts)
  const stdDev = Math.sqrt(countsVariance)

  if (stdDev <= 3) {
    score += 25
  } else if (stdDev <= 7) {
    score += 16
    details.push("Hashtag count varies quite a bit between posts. Try to maintain a consistent strategy.")
  } else {
    score += 8
    details.push("Hashtag usage is very inconsistent. Some posts have many, others have none — standardize your approach.")
  }

  // --- Variety / not reusing the same set every post (25 pts) ---
  if (posts.length >= 3) {
    const allHashtagSets = posts.map((p) => new Set(p.hashtags))
    const uniquenessScores: number[] = []

    for (let i = 0; i < allHashtagSets.length - 1; i++) {
      const setA = allHashtagSets[i]
      const setB = allHashtagSets[i + 1]
      const intersection = [...setA].filter((h) => setB.has(h)).length
      const union = new Set([...setA, ...setB]).size
      const similarity = union > 0 ? intersection / union : 0
      uniquenessScores.push(1 - similarity) // diversity score
    }

    const avgDiversity =
      uniquenessScores.reduce((a, b) => a + b, 0) / uniquenessScores.length

    if (avgDiversity >= 0.5) {
      score += 25
    } else if (avgDiversity >= 0.25) {
      score += 16
      details.push("You're reusing many of the same hashtags across posts. Mix in new hashtags to reach different audiences.")
    } else {
      score += 8
      details.push("Almost identical hashtags used on every post. Instagram may suppress reach when the same tags are repeated — rotate them.")
    }
  } else {
    score += 18 // Not enough posts to judge variety
  }

  return {
    score: clamp(score),
    status: getStatus(score),
    details,
  }
}

function calcVariance(nums: number[]): number {
  if (nums.length === 0) return 0
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length
  return nums.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / nums.length
}
