import { PLAN_CONFIG, type PlanKey } from "@/lib/plans/plan-config";
import type { AuditResult } from "./types";
import { fetchProfile, ProfileFetchError } from "@/lib/instagram/fetch-profile";
import type { ScoredMetrics } from "./metrics";
import {
  scoreAudienceQuality,
  scoreBioOptimization,
  scoreContentConsistency,
  scoreContentMix,
  scoreEngagementHealth,
  scoreHashtagStrategy,
  scoreProfileStrength,
  scoreReelsPerformance,
} from "./modules";
import { generateTips } from "./generate-tips";

export { ProfileFetchError };

export async function runAudit({
  username,
  plan,
  userId,
}: {
  username: string;
  plan: PlanKey;
  userId: string;
}): Promise<AuditResult> {
  const depth = PLAN_CONFIG[plan].auditDepth;

  // 1. Fetch real profile data (Graph API for connected accounts, scraper otherwise)
  const profile = await fetchProfile(username, plan, userId);

  // 2. Score the profile based on plan depth
  const metrics = await runScoring(profile, depth);

  // 3. Calculate overall score (weighted average)
  const overallScore = calculateOverallScore(metrics, depth);
  const findings = extractFindings(metrics);

  // 4. Generate tips (AI for paid plans, rule-based for free)
  const { tips, contentPlan } = await generateTips(profile, metrics, plan);

  // 5. Build locked previews (upsell hints for lower-tier users)
  const lockedPreviews = buildLockedPreviews(depth);

  return {
    username: profile.username || username,
    overallScore,
    metrics,
    findings,
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
  };
}

function buildLockedPreviews(depth: AuditDepth): AuditResult["lockedPreviews"] {
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
    ];
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
    ];
  }

  return [];
}

// Re-export depth type so callers don't need to import it separately
type AuditDepth = "basic" | "full" | "advanced";

type ModuleResult = {
  score: number;
  findings: string[];
  rawData: Record<string, unknown>;
};

function statusFromScore(
  score: number,
): "poor" | "fair" | "good" | "excellent" {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "fair";
  return "poor";
}

function toMetric(module: ModuleResult) {
  return {
    score: Math.max(0, Math.min(100, Math.round(module.score))),
    status: statusFromScore(module.score),
    details: module.findings,
    rawData: module.rawData,
  } as const;
}

async function runScoring(
  profile: Awaited<ReturnType<typeof fetchProfile>>,
  depth: AuditDepth,
): Promise<ScoredMetrics> {
  const [profileStrength, bioOptimization] = await Promise.all([
    scoreProfileStrength(profile),
    scoreBioOptimization(profile),
  ]);

  const basic: ScoredMetrics = {
    profileStrength: toMetric(profileStrength),
    bioOptimization: toMetric(bioOptimization),
  };
  if (depth === "basic") return basic;

  const [contentConsistency, engagementHealth, contentMix, hashtagStrategy] =
    await Promise.all([
      scoreContentConsistency(profile),
      scoreEngagementHealth(profile),
      scoreContentMix(profile),
      scoreHashtagStrategy(profile),
    ]);

  const full: ScoredMetrics = {
    ...basic,
    contentConsistency: toMetric(contentConsistency),
    engagementHealth: toMetric(engagementHealth),
    contentMix: toMetric(contentMix),
    hashtagStrategy: toMetric(hashtagStrategy),
  };
  if (depth === "full") return full;

  const [reelsPerformance, audienceQuality] = await Promise.all([
    scoreReelsPerformance(profile),
    scoreAudienceQuality(profile),
  ]);

  return {
    ...full,
    reelsPerformance: toMetric(reelsPerformance),
    audienceQuality: toMetric(audienceQuality),
  };
}

function calculateOverallScore(
  metrics: ScoredMetrics,
  depth: AuditDepth,
): number {
  const weights: Record<AuditDepth, Record<string, number>> = {
    basic: {
      profileStrength: 0.6,
      bioOptimization: 0.4,
    },
    full: {
      profileStrength: 0.2,
      engagementHealth: 0.25,
      contentMix: 0.2,
      contentConsistency: 0.2,
      hashtagStrategy: 0.15,
    },
    advanced: {
      profileStrength: 0.15,
      bioOptimization: 0.1,
      contentConsistency: 0.1,
      engagementHealth: 0.15,
      contentMix: 0.1,
      hashtagStrategy: 0.1,
      reelsPerformance: 0.15,
      audienceQuality: 0.15,
    },
  };

  const map = weights[depth];
  let total = 0;
  for (const [key, weight] of Object.entries(map)) {
    const m = metrics[key];
    if (m) total += m.score * weight;
  }
  return Math.round(total);
}

function extractFindings(metrics: ScoredMetrics): string[] {
  const findings: string[] = [];

  const engagement = metrics.engagementHealth;
  if (engagement?.details?.length) {
    findings.push(engagement.details[0]);
  }
  const hashtag = metrics.hashtagStrategy;
  if (hashtag?.details?.length) {
    findings.push(hashtag.details[0]);
  }
  const consistency = metrics.contentConsistency;
  if (consistency?.details?.length) {
    findings.push(consistency.details[0]);
  }
  const profile = metrics.profileStrength;
  if (profile?.details?.length) {
    findings.push(profile.details[0]);
  }

  return findings.slice(0, 6);
}
