import type { PlanKey } from "@/lib/plans/plan-config"
import { getAuditUsage } from "./get-audit-usage"

export async function canRunAudit(userId: string, plan: PlanKey) {
  const usage = await getAuditUsage(userId, plan)

  if (usage.isUnlimited) {
    return {
      allowed: true,
      ...usage,
    }
  }

  return {
    allowed: usage.remaining > 0,
    ...usage,
  }
}