import { getUserPlan } from "@/lib/plans/get-user-plan"
import { getAuditUsage } from "@/lib/audits/get-audit-usage"
import { getConnectedInstagramAccount } from "@/lib/instagram/get-connected-instagram-account"

export async function getDashboardData(user: {
  id: string
  subscriptionPlan?: string | null
  subscriptionStatus?: string | null
}) {
  const plan = getUserPlan(user)
  const usage = await getAuditUsage(user.id, plan)

  const instagramAccount =
    plan === "free" ? null : await getConnectedInstagramAccount(user.id)

  return {
    plan,
    usage,
    instagramAccount,
  }
}