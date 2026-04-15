import type { ProfileData } from "@/lib/instagram/types"
import { getStatus, clamp, type MetricScore } from "./types"

const NICHE_INDICATORS =
  /fitness|health|wellness|food|travel|fashion|beauty|business|entrepreneur|marketing|finance|tech|design|photography|art|music|education|coaching|lifestyle|parenting|sports|gaming|cooking|yoga|mindfulness|creator|blogger|coach|consultant|photographer|designer|developer|writer|author|speaker|agency|brand|founder|ceo|strategist|therapist|real estate|crypto|ecommerce/i

const AUDIENCE_INDICATORS =
  /for |helping|teach|coaches|entrepreneurs|women|men|moms|dads|students|founders|creators|brands|businesses|people who|those who/i

const VALUE_INDICATORS =
  /help(ing|s)? .+?(grow|build|scale|achieve|get|create|launch|improve|transform|reach|make|earn|lose|gain|learn|start|run|manage)|i (teach|show|guide|help)|we (help|build|create|teach)/i

const CLARITY_INDICATORS =
  /\||\n|•|·|\/|–|—/

export function scorePositioning(profile: ProfileData): MetricScore {
  const bio = profile.bio.trim()
  const bioLower = bio.toLowerCase()
  const details: string[] = []
  let score = 0

  if (!bio) {
    return {
      score: 0,
      status: "poor",
      details: ["No bio — impossible to assess positioning without one."],
    }
  }

  // Niche identified (35 pts)
  const hasNiche = NICHE_INDICATORS.test(bio)
  if (hasNiche) {
    score += 35
  } else {
    details.push(
      "Your niche or industry isn't identifiable from your bio. Be specific about what you do or cover."
    )
  }

  // Target audience named or implied (35 pts)
  const hasAudience = AUDIENCE_INDICATORS.test(bio)
  if (hasAudience) {
    score += 35
  } else {
    details.push(
      "Your bio doesn't make it obvious who you serve or who should follow you."
    )
  }

  // Value/result communicated (30 pts)
  const hasValue =
    VALUE_INDICATORS.test(bio) ||
    /result|outcome|transformation|grow|scale|build|achieve|earn|lose|gain/i.test(bioLower)
  if (hasValue) {
    score += 20
  } else {
    details.push(
      "Your bio doesn't communicate a clear outcome or benefit for your audience."
    )
  }

  // Visual structure / clarity bonus (10 pts)
  const hasStructure = CLARITY_INDICATORS.test(bio)
  if (hasStructure) {
    score += 10
  }

  if (score >= 85 && details.length === 0) {
    details.push("Strong positioning — your bio clearly communicates who you are, who you serve, and what value you provide.")
  }

  return {
    score: clamp(score),
    status: getStatus(score),
    details,
  }
}
