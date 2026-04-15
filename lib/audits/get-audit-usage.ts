import { AuditUsage, type AuditUsageDocument } from "@/models/AuditUsage"
import { getPeriodKey } from "./get-period-key"
import { PLAN_CONFIG, type PlanKey } from "@/lib/plans/plan-config"

export async function getAuditUsage(userId: string, plan: PlanKey) {
  const periodKey = getPeriodKey()

  const usage = await AuditUsage.findOne({ userId, periodKey })
    .lean<AuditUsageDocument | null>()

  const used = usage?.auditsUsed ?? 0
  const limit = PLAN_CONFIG[plan].auditsPerMonth

  return {
    used,
    limit,
    remaining: limit === -1 ? -1 : Math.max(limit - used, 0),
    isUnlimited: limit === -1,
    periodKey,
  }
}