import type { PlanKey } from "./plan-config"

type UserLike = {
  subscriptionPlan?: string | null
  subscriptionStatus?: string | null
}

export function getUserPlan(user?: UserLike | null): PlanKey {
  const plan = user?.subscriptionPlan
  const status = user?.subscriptionStatus

  if (plan === "starter" || plan === "pro" || plan === "agency" && status === "active") {
    return plan
  }

  return "free"
}