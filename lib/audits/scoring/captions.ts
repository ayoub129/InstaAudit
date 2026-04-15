import type { ProfileData } from "@/lib/instagram/types"
import { getStatus, clamp, type MetricScore } from "./types"

// Strong opening patterns that stop the scroll
const HOOK_PATTERNS =
  /^(did you know|stop |wait |here'?s |the truth|most people|nobody talks|i used to|this is why|how (i|to|we)|what (if|happens)|why (most|you|your|i)|the \w+ reason|\d+ (ways|tips|reasons|mistakes|things)|unpopular opinion|hot take|honest(ly)?|real talk)/i

const QUESTION_PATTERN = /\?/
const ENGAGEMENT_PATTERNS =
  /comment below|drop a|let me know|save this|share this|tag a friend|double tap|like if|what do you think|agree\?|thoughts\?|tell me/i

export function scoreCaptions(profile: ProfileData): MetricScore {
  const posts = profile.posts.filter((p) => p.caption.trim().length > 0)
  const details: string[] = []

  if (posts.length === 0) {
    return {
      score: 20,
      status: "poor",
      details: ["No captions found on recent posts. Captions are critical for reach and engagement."],
    }
  }

  let score = 0

  // --- Average caption length (25 pts) ---
  const avgLength =
    posts.reduce((sum, p) => sum + p.caption.length, 0) / posts.length

  if (avgLength >= 150 && avgLength <= 400) {
    score += 25
  } else if (avgLength >= 80 && avgLength < 150) {
    score += 18
    details.push("Captions are a bit short on average. Aim for 150–400 characters to tell a story or add value.")
  } else if (avgLength >= 400 && avgLength <= 600) {
    score += 20
  } else if (avgLength < 80) {
    score += 8
    details.push("Captions are very short. Longer captions tend to perform better on Instagram — they signal depth.")
  } else {
    score += 15
    details.push("Some captions are very long. While depth is good, keep the most important content in the first 2 lines.")
  }

  // --- Hook quality (25 pts) ---
  const postsWithHook = posts.filter((p) => {
    const firstLine = p.caption.split("\n")[0].trim()
    return HOOK_PATTERNS.test(firstLine)
  })
  const hookRatio = postsWithHook.length / posts.length

  if (hookRatio >= 0.6) {
    score += 25
  } else if (hookRatio >= 0.3) {
    score += 16
    details.push("Less than half of your posts open with a strong hook. The first line is what stops the scroll — make it count.")
  } else {
    score += 6
    details.push("Most captions don't open with a compelling first line. Start with a bold statement, question, or hook to grab attention.")
  }

  // --- Engagement prompts (25 pts) ---
  const postsWithEngagement = posts.filter(
    (p) =>
      QUESTION_PATTERN.test(p.caption) || ENGAGEMENT_PATTERNS.test(p.caption)
  )
  const engagementRatio = postsWithEngagement.length / posts.length

  if (engagementRatio >= 0.6) {
    score += 25
  } else if (engagementRatio >= 0.3) {
    score += 15
    details.push("Only some of your captions invite a response. Consistently ending with a question or prompt boosts comments.")
  } else {
    score += 5
    details.push("Most captions don't invite engagement. Ask questions or use prompts to start conversations in the comments.")
  }

  // --- Consistency (25 pts) ---
  // We measure consistency by checking if caption quality is reasonably uniform
  const captionLengths = posts.map((p) => p.caption.length)
  const mean = captionLengths.reduce((a, b) => a + b, 0) / captionLengths.length
  const variance =
    captionLengths.reduce((sum, l) => sum + Math.pow(l - mean, 2), 0) /
    captionLengths.length
  const stdDev = Math.sqrt(variance)
  const coefficientOfVariation = stdDev / (mean || 1)

  if (coefficientOfVariation < 0.5) {
    score += 25
  } else if (coefficientOfVariation < 1.0) {
    score += 16
    details.push("Caption length varies quite a bit. More consistent caption depth signals a consistent content strategy.")
  } else {
    score += 8
    details.push("Caption quality is very inconsistent. Some posts have detailed captions while others have almost none.")
  }

  return {
    score: clamp(score),
    status: getStatus(score),
    details,
  }
}
