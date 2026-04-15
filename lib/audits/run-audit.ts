import { PLAN_CONFIG, type PlanKey } from "@/lib/plans/plan-config"
import type { AuditResult } from "./types"
import { fetchProfile, ProfileFetchError } from "@/lib/instagram/fetch-profile"
import { runScoring, calculateOverallScore } from "./scoring/index"
import { generateTips } from "./tips/index"

export { ProfileFetchError }

export async function runAudit({
  username,
  plan,
  userId,
}: {
  username: string
  plan: PlanKey
  userId: string
}): Promise<AuditResult> {
  const depth = PLAN_CONFIG[plan].auditDepth

  // 1. Fetch real profile data (Graph API for connected accounts, scraper otherwise)
  const profile = await fetchProfile(username, plan, userId)

  // 2. Score the profile based on plan depth
  const metrics = runScoring(profile, depth)

  // 3. Calculate overall score (weighted average)
  const overallScore = calculateOverallScore(metrics, depth)

  // 4. Generate tips (AI for paid plans, rule-based for free)
  const { tips, contentPlan } = await generateTips(profile, metrics, plan)

  // 5. Build locked previews (upsell hints for lower-tier users)
  const lockedPreviews = buildLockedPreviews(depth)

  return {
    username: profile.username || username,
    overallScore,
    metrics,
    tips,
    contentPlan,
    profileSnapshot: {
      followerCount: profile.followerCount,
      followingCount: profile.followingCount,
      postCount: profile.postCount,
      bio: profile.bio,
      hasLinkInBio: profile.hasLinkInBio,
      accountType: profile.accountType,
      dataSource: profile.dataSource,
    },
    lockedPreviews,
  }
}

function buildLockedPreviews(
  depth: AuditDepth
): AuditResult["lockedPreviews"] {
  if (depth === "basic") {
    return [
      {
        key: "captions",
        title: "Caption & hashtag analysis",
        requiredPlan: "starter",
      },
      {
        key: "contentPlan",
        title: "AI-powered 7-day content plan",
        requiredPlan: "pro",
      },
    ]
  }

  if (depth === "full") {
    return [
      {
        key: "contentPlan",
        title: "AI-powered 7-day content plan",
        requiredPlan: "pro",
      },
      {
        key: "engagement",
        title: "Engagement rate analysis",
        requiredPlan: "pro",
      },
    ]
  }

  return []
}

// Re-export depth type so callers don't need to import it separately
type AuditDepth = "basic" | "full" | "advanced"
