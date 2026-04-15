import type { ScoredMetrics } from "@/lib/audits/scoring/index"
import type { ProfileData } from "@/lib/instagram/types"

/**
 * Generates actionable tips purely from score thresholds — no AI call needed.
 * Used for the free plan and as a fallback when the OpenAI call fails.
 */
export function generateRuleBasedTips(
  profile: ProfileData,
  metrics: ScoredMetrics
): string[] {
  const tips: string[] = []

  // Bio tips
  const bio = metrics.bio
  if (bio) {
    if (bio.score < 40) {
      tips.push(
        "Rewrite your bio from scratch. It should answer three questions in 2–3 lines: Who are you? Who do you help? What should they do next?"
      )
    } else if (bio.score < 65) {
      tips.push(
        "Strengthen your bio by adding one clear sentence about who you help and what outcome they can expect from following you."
      )
    }
  }

  // CTA tips
  const cta = metrics.cta
  if (cta) {
    if (!profile.hasLinkInBio) {
      tips.push(
        "Add a link to your bio immediately. Use a link aggregator (Linktree, Beacons) if you have multiple destinations."
      )
    } else if (cta.score < 55) {
      tips.push(
        "Your bio has a link but doesn't tell people why to click it. Add a short CTA like 'Grab the free guide ↓' to increase clicks."
      )
    }
  }

  // Positioning tips
  const pos = metrics.positioning
  if (pos) {
    if (pos.score < 45) {
      tips.push(
        "Your positioning is unclear. Define your niche and target audience explicitly in your bio — people decide to follow in seconds."
      )
    } else if (pos.score < 65) {
      tips.push(
        "Your niche is somewhat visible but could be sharper. Try this formula: 'I help [audience] achieve [result] through [method]'."
      )
    }
  }

  // Caption tips (when post data is available)
  const cap = metrics.captions
  if (cap) {
    if (cap.score < 45) {
      tips.push(
        "Focus on your caption first lines. The first 1–2 lines either stop the scroll or lose the viewer. Lead with a bold statement or question."
      )
    } else if (cap.score < 65) {
      tips.push(
        "End more of your captions with a question or prompt. Asking 'What's your experience with this?' significantly boosts comment rates."
      )
    }
  }

  // Hashtag tips
  const ht = metrics.hashtags
  if (ht) {
    if (ht.score < 40) {
      tips.push(
        "Your hashtag strategy needs work. Use 5–15 relevant hashtags per post, mixing niche-specific tags with broader discovery tags."
      )
    } else if (ht.score < 65) {
      tips.push(
        "Rotate your hashtag sets so you're not using the same 10 tags on every post — Instagram deprioritizes repetitive hashtag patterns."
      )
    }
  }

  // Content frequency tips
  const cont = metrics.content
  if (cont) {
    if (cont.score < 40) {
      tips.push(
        "Post more consistently. Even 3 posts per week on a fixed schedule beats sporadic bursts. The algorithm rewards regularity."
      )
    } else if (cont.score < 65) {
      tips.push(
        "Add Reels to your content mix if you haven't already. Reels get 3–4× the reach of static images for most accounts."
      )
    }
  }

  // Engagement tips (advanced plans)
  const eng = metrics.engagement
  if (eng && eng.score < 55) {
    tips.push(
      "Engagement rate is below average. Focus on content that prompts saves and shares — these are the strongest engagement signals for the algorithm."
    )
  }

  // Strategy tip
  const strat = metrics.strategy
  if (strat && strat.score < 60) {
    tips.push(
      "Define 2–3 content pillars and stick to them. Accounts with a clear, consistent theme grow faster because followers know exactly what to expect."
    )
  }

  // Generic positive reinforcement if doing well across the board
  const avgScore =
    Object.values(metrics).reduce((sum, m) => sum + m.score, 0) /
    Object.keys(metrics).length

  if (avgScore >= 75 && tips.length === 0) {
    tips.push(
      "Your profile is performing well across all dimensions. To push further, focus on testing different content formats and doubling down on your best-performing posts."
    )
  }

  return tips.slice(0, 5)
}
