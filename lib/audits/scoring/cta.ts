import type { ProfileData } from "@/lib/instagram/types"
import { getStatus, clamp, type MetricScore } from "./types"

const BIO_ACTION_WORDS =
  /link in bio|dm me|dm for|message me|shop|book|schedule|sign up|subscribe|join|download|apply|click|get your|grab|check out|learn more|shop now|order|follow|watch|visit|swipe up/i

const CAPTION_CTA_PATTERNS =
  /link in bio|dm|comment below|save this|share this|tag a friend|drop a|let me know|what do you think|double tap|like if|follow for|click the link|check out|grab your|get yours|sign up|subscribe|book|schedule|download|join|apply|learn more/i

export function scoreCta(profile: ProfileData, hasPosts: boolean): MetricScore {
  const bio = profile.bio
  const details: string[] = []
  let score = 0

  // Link in bio (strongest signal)
  if (profile.hasLinkInBio) {
    score += hasPosts ? 40 : 55
  } else {
    details.push(
      "No link found in your bio. Add a link (or Linktree) to direct followers to your content or offers."
    )
  }

  // Action words in bio text
  const hasBioAction = BIO_ACTION_WORDS.test(bio)
  if (hasBioAction) {
    score += hasPosts ? 25 : 45
  } else {
    details.push("Your bio doesn't clearly tell visitors what action to take next.")
  }

  // Check captions for CTAs (only when posts are available)
  if (hasPosts && profile.posts.length > 0) {
    const postsWithCta = profile.posts.filter((p) =>
      CAPTION_CTA_PATTERNS.test(p.caption)
    )
    const ctaRatio = postsWithCta.length / profile.posts.length

    if (ctaRatio >= 0.6) {
      score += 35
    } else if (ctaRatio >= 0.3) {
      score += 22
      details.push(
        "Less than half of your posts include a clear call-to-action in the caption."
      )
    } else if (ctaRatio > 0) {
      score += 10
      details.push(
        "Very few of your posts have a call-to-action. Most posts should guide followers on what to do next."
      )
    } else {
      details.push(
        "None of your recent posts have a call-to-action. Always end captions with a clear next step for your audience."
      )
    }
  }

  if (score >= 85 && details.length === 0) {
    details.push("Strong CTA presence across both bio and posts — keep it up.")
  }

  return {
    score: clamp(score),
    status: getStatus(score),
    details,
  }
}
