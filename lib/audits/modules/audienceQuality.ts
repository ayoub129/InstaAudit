import type { ScoringModule } from "./types"
import { scoreWithAI } from "@/lib/audits/ai-scorer"

const NICHE_TERMS = [
  "coach",
  "fitness",
  "saas",
  "agency",
  "beauty",
  "crypto",
  "food",
  "travel",
  "real estate",
]

export const scoreAudienceQuality: ScoringModule = async (profile) => {
  const followerFollowingRatio = profile.followerCount / Math.max(1, profile.followingCount)
  const lower = `${profile.bio} ${profile.fullName}`.toLowerCase()
  const nicheAlignment = NICHE_TERMS.some((k) => lower.includes(k))
  return scoreWithAI(
    "audienceQuality",
    {
      followerCount: profile.followerCount,
      followingCount: profile.followingCount,
      followerFollowingRatio,
      followingWarning: profile.followingCount > 5000,
      nicheAlignment,
      accountType: profile.accountType,
    },
    {
      username: profile.username,
      followers: profile.followerCount,
    },
  )
}

