import type { ScoringModule } from "./types"
import { scoreWithAI } from "@/lib/audits/ai-scorer"
import { average, sortPostsByNewest } from "./helpers"

const BANNED_HASHTAGS = new Set([
  "#adulting",
  "#always",
  "#beautyblogger",
  "#brain",
  "#curvygirls",
  "#desk",
  "#dm",
  "#kansas",
  "#mileycyrus",
  "#pushups",
  "#singlelife",
])

export const scoreHashtagStrategy: ScoringModule = async (profile) => {
  const posts = sortPostsByNewest(profile.posts).slice(0, 30)
  const postsWithTags = posts.filter((p) => p.hashtags.length > 0)
  if (!postsWithTags.length) {
    return scoreWithAI(
      "hashtagStrategy",
      { postsAnalyzed: posts.length, hashtagPosts: 0 },
      { username: profile.username, followers: profile.followerCount },
    )
  }

  const avgHashtagsPerPost = average(postsWithTags.map((p) => p.hashtags.length))
  const allTags = postsWithTags.flatMap((p) => p.hashtags.map((h) => h.toLowerCase()))
  const uniqueTags = new Set(allTags)
  const repetitionRate = 1 - uniqueTags.size / Math.max(1, allTags.length)
  const brandedCount = Array.from(uniqueTags).filter((h) => h.includes(profile.username.toLowerCase())).length
  const broadCount = Array.from(uniqueTags).filter((h) => h.length <= 12).length
  const nicheCount = uniqueTags.size - broadCount - brandedCount
  const bannedUsed = Array.from(uniqueTags).filter((h) => BANNED_HASHTAGS.has(h))
  return scoreWithAI(
    "hashtagStrategy",
    {
      postsAnalyzed: posts.length,
      avgHashtagsPerPost: Number(avgHashtagsPerPost.toFixed(2)),
      totalHashtagUses: allTags.length,
      uniqueHashtagCount: uniqueTags.size,
      repetitionRate: Number(repetitionRate.toFixed(2)),
      nicheCount,
      broadCount,
      brandedCount,
      bannedUsed,
      sampleHashtags: Array.from(uniqueTags).slice(0, 20),
    },
    {
      username: profile.username,
      followers: profile.followerCount,
    },
  )
}

