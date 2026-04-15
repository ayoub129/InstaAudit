import type { ProfileData } from "@/lib/instagram/types"
import { getStatus, clamp, type MetricScore } from "./types"

const SECONDS_PER_WEEK = 7 * 24 * 60 * 60

export function scoreContent(profile: ProfileData): MetricScore {
  const posts = profile.posts
  const details: string[] = []

  if (posts.length === 0) {
    return {
      score: 10,
      status: "poor",
      details: ["No recent posts found. Consistent posting is essential for growth on Instagram."],
    }
  }

  let score = 0
  const now = Math.floor(Date.now() / 1000)

  // Sort posts newest → oldest
  const sorted = [...posts].sort((a, b) => b.timestamp - a.timestamp)

  // --- Recency (20 pts) ---
  const newestPost = sorted[0]
  const daysSinceLastPost = newestPost.timestamp
    ? (now - newestPost.timestamp) / 86400
    : 999

  if (daysSinceLastPost <= 3) {
    score += 20
  } else if (daysSinceLastPost <= 7) {
    score += 14
    details.push(`Last post was ${Math.round(daysSinceLastPost)} days ago. Aim to post at least once a week.`)
  } else if (daysSinceLastPost <= 14) {
    score += 8
    details.push(`Last post was ${Math.round(daysSinceLastPost)} days ago. You've been inactive recently — get back on a schedule.`)
  } else {
    score += 2
    details.push(`Last post was over ${Math.round(daysSinceLastPost)} days ago. Inactivity significantly hurts reach and growth.`)
  }

  // --- Posting frequency (40 pts) ---
  let postsPerWeek = 0

  if (posts.length >= 2 && sorted[sorted.length - 1].timestamp) {
    const oldestTimestamp = sorted[sorted.length - 1].timestamp
    const newestTimestamp = sorted[0].timestamp
    const totalSeconds = newestTimestamp - oldestTimestamp

    if (totalSeconds > 0) {
      const totalWeeks = totalSeconds / SECONDS_PER_WEEK
      postsPerWeek = posts.length / Math.max(totalWeeks, 1)
    }
  }

  if (postsPerWeek >= 5) {
    score += 40
  } else if (postsPerWeek >= 3) {
    score += 34
  } else if (postsPerWeek >= 2) {
    score += 26
    details.push(`You're posting about ${postsPerWeek.toFixed(1)}x/week. Increasing to 3–5 posts/week can accelerate growth.`)
  } else if (postsPerWeek >= 1) {
    score += 16
    details.push(`You're posting about once a week. 3–5 posts/week is the recommended cadence for consistent growth.`)
  } else if (posts.length >= 2) {
    score += 8
    details.push("Posting frequency is very low. Aim for at least 3 posts per week to maintain visibility.")
  }

  // --- Content type diversity (20 pts) ---
  const types = new Set(posts.map((p) => p.mediaType))

  if (types.size >= 3) {
    score += 20
  } else if (types.size === 2) {
    score += 14
    const missing = ["image", "video", "carousel", "reel"].filter(
      (t) => !types.has(t as any)
    )
    details.push(
      `You're only using ${types.size} content types. Try adding ${missing.slice(0, 2).join(" or ")} to reach different audience segments.`
    )
  } else {
    score += 6
    details.push(
      "All recent posts are the same format. Mix photos, Reels, and carousels — each performs differently with the algorithm."
    )
  }

  // --- Cadence consistency (20 pts) ---
  if (sorted.length >= 4) {
    const intervals: number[] = []
    for (let i = 0; i < sorted.length - 1; i++) {
      const gap = sorted[i].timestamp - sorted[i + 1].timestamp
      if (gap > 0) intervals.push(gap)
    }

    if (intervals.length > 0) {
      const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length
      const variance =
        intervals.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
        intervals.length
      const stdDev = Math.sqrt(variance)
      const cv = stdDev / (mean || 1)

      if (cv < 0.5) {
        score += 20
      } else if (cv < 1.0) {
        score += 12
        details.push("Your posting schedule is somewhat irregular. A consistent cadence trains your audience (and the algorithm).")
      } else {
        score += 5
        details.push("Very inconsistent posting — long gaps followed by bursts. A regular schedule performs far better.")
      }
    }
  } else {
    score += 10 // Not enough posts to measure cadence
  }

  return {
    score: clamp(score),
    status: getStatus(score),
    details,
  }
}
