import { AuditUsage } from "@/models/AuditUsage"
import { getPeriodKey } from "./get-period-key"
import type { PlanKey } from "@/lib/plans/plan-config"

export async function incrementAuditUsage(userId: string, plan: PlanKey) {
  const periodKey = getPeriodKey()

  await AuditUsage.findOneAndUpdate(
    { userId, periodKey },
    {
      $setOnInsert: {
        userId,
        periodKey,
        plan,
      },
      $inc: {
        auditsUsed: 1,
      },
    },
    { upsert: true, new: true }
  )
}