import type { ScoringModule } from "./types"
import { scoreWithAI } from "@/lib/audits/ai-scorer"
import { average, sortPostsByNewest, stdDev } from "./helpers"

export const scoreReelsPerformance: ScoringModule = async (profile) => {
  const posts = sortPostsByNewest(profile.posts).slice(0, 30)
  const reels = posts.filter((p) => p.mediaType === "reel" || p.mediaType === "video")
  if (!reels.length || profile.followerCount <= 0) {
    return scoreWithAI(
      "reelsPerformance",
      { reelsCount: reels.length, followerCount: profile.followerCount },
      { username: profile.username, followers: profile.followerCount },
    )
  }

  // Fallback proxy: treat likes+comments as a conservative visible-performance proxy.
  const proxyViewRates = reels.map((r) => ((r.likeCount + r.commentCount) / profile.followerCount) * 100)
  const avgViewRate = average(proxyViewRates)
  const viewConsistency = stdDev(proxyViewRates)
  const hookWeakSignals = proxyViewRates.filter((v) => v < avgViewRate * 0.5).length
  const reelFrequencyVsFeed = reels.length / Math.max(1, posts.length)
  return scoreWithAI(
    "reelsPerformance",
    {
      reelsCount: reels.length,
      feedPostsAnalyzed: posts.length,
      avgViewRate: Number(avgViewRate.toFixed(2)),
      viewConsistency: Number(viewConsistency.toFixed(2)),
      hookWeakSignals,
      reelFrequencyVsFeed: Number(reelFrequencyVsFeed.toFixed(2)),
      followerCount: profile.followerCount,
    },
    {
      username: profile.username,
      followers: profile.followerCount,
    },
  )
}

