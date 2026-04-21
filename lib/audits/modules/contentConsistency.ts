import type { ScoringModule } from "./types"
import { scoreWithAI } from "@/lib/audits/ai-scorer"
import { average, secondsToDays, sortPostsByNewest, stdDev } from "./helpers"

export const scoreContentConsistency: ScoringModule = async (profile) => {
  const posts = sortPostsByNewest(profile.posts).slice(0, 30)
  if (posts.length < 2) {
    return scoreWithAI("contentConsistency", { postCount: posts.length }, {
      username: profile.username,
      followers: profile.followerCount,
    })
  }

  const gapsDays = posts.slice(0, -1).map((p, i) => secondsToDays(p.timestamp - posts[i + 1].timestamp))
  const avgGapDays = average(gapsDays)
  const postsPerWeek = avgGapDays > 0 ? 7 / avgGapDays : posts.length
  const longestGapDays = Math.max(...gapsDays)
  const scheduleVariance = stdDev(gapsDays)
  const daysSinceLastPost = secondsToDays(Date.now() / 1000 - posts[0].timestamp)
  return scoreWithAI(
    "contentConsistency",
    {
      postsAnalyzed: posts.length,
      postsPerWeek: Number(postsPerWeek.toFixed(2)),
      longestGapDays: Number(longestGapDays.toFixed(2)),
      scheduleVariance: Number(scheduleVariance.toFixed(2)),
      daysSinceLastPost: Number(daysSinceLastPost.toFixed(2)),
    },
    {
      username: profile.username,
      followers: profile.followerCount,
    },
  )
}

