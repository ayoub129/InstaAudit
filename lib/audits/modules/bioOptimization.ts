import type { ScoringModule } from "./types"
import { scoreWithAI } from "@/lib/audits/ai-scorer"

const NICHE_KEYWORDS = [
  "coach",
  "creator",
  "agency",
  "marketing",
  "fitness",
  "beauty",
  "saas",
  "founder",
  "ecom",
  "developer",
]

export const scoreBioOptimization: ScoringModule = async (profile) => {
  const linkCount = profile.hasLinkInBio ? 1 : 0

  const lowerBio = profile.bio.toLowerCase()
  const keywordMatches = NICHE_KEYWORDS.filter((k) => lowerBio.includes(k)).length
  const hasHighlightsSignal = /highlight|featured|faq|results|testimonials/i.test(lowerBio)
  const keywordDensity = profile.bio.trim().length
    ? (keywordMatches / profile.bio.trim().split(/\s+/).length) * 100
    : 0
  const data = {
    hasLinkInBio: profile.hasLinkInBio,
    linkCount,
    keywordMatches,
    keywordDensity: Number(keywordDensity.toFixed(2)),
    hasHighlightsSignal,
    bioLength: profile.bio.length,
    accountType: profile.accountType,
  }

  return scoreWithAI("bioOptimization", data, {
    username: profile.username,
    followers: profile.followerCount,
  })
}

