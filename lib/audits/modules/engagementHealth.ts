import type { ScoringModule } from "./types"
import { scoreWithAI } from "@/lib/audits/ai-scorer"
import { average, sortPostsByNewest } from "./helpers"

export const scoreEngagementHealth: ScoringModule = async (profile) => {
  const posts = sortPostsByNewest(profile.posts).slice(0, 30)
  if (!posts.length || profile.followerCount <= 0) {
    return scoreWithAI(
      "engagementHealth",
      { postCount: posts.length, followerCount: profile.followerCount },
      { username: profile.username, followers: profile.followerCount },
    )
  }

  const engagementRates = posts.map((p) => ((p.likeCount + p.commentCount) / profile.followerCount) * 100)
  const avgEngagementRate = average(engagementRates)
  const likeToCommentRatio =
    posts.reduce((sum, p) => sum + p.likeCount, 0) / Math.max(1, posts.reduce((sum, p) => sum + p.commentCount, 0))

  const half = Math.max(1, Math.floor(posts.length / 2))
  const recentAvg = average(engagementRates.slice(0, half))
  const olderAvg = average(engagementRates.slice(half))
  const trendDelta = recentAvg - olderAvg
  const outlierPosts = engagementRates.filter((r) => r > avgEngagementRate * 2 || r < avgEngagementRate * 0.35).length
  return scoreWithAI(
    "engagementHealth",
    {
      postsAnalyzed: posts.length,
      avgEngagementRate: Number(avgEngagementRate.toFixed(2)),
      recentAvgER: Number(recentAvg.toFixed(2)),
      olderAvgER: Number(olderAvg.toFixed(2)),
      trendDelta: Number(trendDelta.toFixed(2)),
      likeToCommentRatio: Number(likeToCommentRatio.toFixed(2)),
      highestER: Number(Math.max(...engagementRates).toFixed(2)),
      lowestER: Number(Math.min(...engagementRates).toFixed(2)),
      outlierPosts,
      followerCount: profile.followerCount,
    },
    {
      username: profile.username,
      followers: profile.followerCount,
    },
  )
}

