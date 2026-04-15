import type { ProfileData } from "@/lib/instagram/types"
import { getStatus, clamp, type MetricScore } from "./types"

const NICHE_KEYWORDS = [
  "fitness", "health", "wellness", "nutrition", "food", "travel", "fashion",
  "beauty", "business", "entrepreneur", "marketing", "finance", "tech",
  "design", "photography", "art", "music", "education", "coaching",
  "lifestyle", "parenting", "sports", "gaming", "cooking", "baking",
  "yoga", "mindfulness", "meditation", "motivation", "inspiration",
  "creator", "blogger", "influencer", "coach", "consultant", "freelancer",
  "photographer", "designer", "developer", "writer", "author", "speaker",
  "agency", "brand", "founder", "ceo", "strategist", "therapist", "doctor",
  "lawyer", "real estate", "investment", "crypto", "ecommerce", "saas",
]

const AUDIENCE_SIGNALS = [
  "helping", "for ", "teach", "guide", "support", "serving", "empowering",
  "entrepreneurs", "women", "men", "coaches", "moms", "dads", "students",
  "founders", "creators", "brands", "businesses", "teams", "people who",
  "those who", "anyone who",
]

const VALUE_PROP_PATTERNS =
  /help|teach|show|guide|provid|creat|build|grow|transform|impact|improv|scale|launch|manage|run|develop/i

const BIO_CTA_PATTERNS =
  /dm\s|link in bio|click|shop|book|schedule|sign up|subscribe|join|download|apply|enroll|get your|grab|check out|shop now|learn more/i

export function scoreBio(profile: ProfileData): MetricScore {
  const bio = profile.bio.trim()
  const bioLower = bio.toLowerCase()
  const details: string[] = []
  let score = 0

  if (!bio) {
    return {
      score: 0,
      status: "poor",
      details: [
        "No bio found. A clear bio is one of the most important parts of your Instagram profile.",
      ],
    }
  }

  // Has bio content
  score += 10

  // Length scoring (sweet spot 80–150 chars)
  const len = bio.length
  if (len >= 80 && len <= 150) {
    score += 18
  } else if (len >= 50 && len < 80) {
    score += 12
    details.push("Your bio is a bit short. Aim for 80–150 characters to communicate more value.")
  } else if (len >= 20 && len < 50) {
    score += 6
    details.push("Bio is very short. Expand it to explain who you are and what you offer.")
  } else if (len > 150 && len <= 200) {
    score += 14
    details.push("Bio is slightly long. Instagram truncates bios — make sure the key info is at the top.")
  } else if (len > 200) {
    score += 8
    details.push("Bio is too long. Keep it concise — the first 150 characters matter most.")
  }

  // Niche/topic present
  const hasNiche = NICHE_KEYWORDS.some((kw) => bioLower.includes(kw))
  if (hasNiche) {
    score += 15
  } else {
    details.push("Your niche or area of expertise isn't clear from your bio.")
  }

  // Audience signal
  const hasAudience = AUDIENCE_SIGNALS.some((sig) => bioLower.includes(sig))
  if (hasAudience) {
    score += 15
  } else {
    details.push("It's not clear who your content is for. Consider naming your target audience.")
  }

  // Value proposition
  const hasValueProp = VALUE_PROP_PATTERNS.test(bioLower)
  if (hasValueProp) {
    score += 15
  } else {
    details.push("No clear value proposition detected — what outcome or benefit do you provide?")
  }

  // Emojis as visual structure
  const hasEmoji = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/u.test(bio)
  if (hasEmoji) {
    score += 10
  } else {
    details.push("Consider adding emojis to structure your bio and make it more visually scannable.")
  }

  // CTA in bio text
  const hasBioCTA = BIO_CTA_PATTERNS.test(bio)
  if (hasBioCTA) {
    score += 17
  } else {
    details.push("Add a call-to-action to your bio (e.g. 'DM for collabs', 'Link below ↓').")
  }

  return {
    score: clamp(score),
    status: getStatus(score),
    details,
  }
}
