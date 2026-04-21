import type { ScoringModule } from "./types"
import { scoreWithAI } from "@/lib/audits/ai-scorer"

const CTA_PATTERNS = /(dm|book|apply|join|click|visit|shop|start|message|contact|sign up)/i

export const scoreProfileStrength: ScoringModule = async (profile) => {
  const data = {
    hasProfilePic: true,
    fullNameLength: profile.fullName.trim().length,
    usernameLength: profile.username.trim().length,
    nameVsUsernameDifferent:
      profile.fullName.trim().toLowerCase() !== profile.username.trim().toLowerCase(),
    bioLength: profile.bio.trim().length,
    hasCtaInBio: CTA_PATTERNS.test(profile.bio),
    hasExternalLink: profile.hasLinkInBio,
    accountType: profile.accountType,
    isVerified: profile.isVerified,
  }

  return scoreWithAI("profileStrength", data, {
    username: profile.username,
    followers: profile.followerCount,
  })
}

