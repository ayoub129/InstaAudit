import type { ProfileData } from "@/lib/instagram/types"
import type { ScoredMetrics } from "@/lib/audits/scoring/index"
import type { PlanKey } from "@/lib/plans/plan-config"
import { generateRuleBasedTips } from "./rule-based"
import { generateAiTips, type AiTipsResult } from "./ai-tips"

export type { DayPlan, AiTipsResult } from "./ai-tips"

export async function generateTips(
  profile: ProfileData,
  metrics: ScoredMetrics,
  plan: PlanKey
): Promise<AiTipsResult> {
  // Free plan: always rule-based (no AI cost)
  if (plan === "free") {
    return { tips: generateRuleBasedTips(profile, metrics) }
  }

  // Paid plans: AI-generated tips with rule-based fallback
  if (!process.env.OPENAI_API_KEY) {
    console.warn("[tips] OPENAI_API_KEY not set — falling back to rule-based tips")
    return { tips: generateRuleBasedTips(profile, metrics) }
  }

  try {
    return await generateAiTips(profile, metrics, plan)
  } catch (err) {
    console.error("[tips] AI tip generation failed, using rule-based fallback:", err)
    return { tips: generateRuleBasedTips(profile, metrics) }
  }
}
