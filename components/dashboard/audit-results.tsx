"use client"

import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Database,
  Globe,
  Lock,
  RotateCcw,
  Sparkles,
  Users,
  FileText,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { MetricCard } from "./metric-card"
import { TipsSection } from "./tips-section"
import { ContentPlanSection } from "./content-plan-section"
import { ScoreCircle } from "./score-circle"
import { cn } from "@/lib/utils"
import type { AuditResult, DayPlan } from "@/lib/audits/types"

type PlanKey = "free" | "starter" | "pro" | "agency"

const PLAN_LABELS: Record<PlanKey, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  agency: "Agency",
}

const PLAN_COLORS: Record<PlanKey, string> = {
  free: "border-border/60 bg-muted/40 text-muted-foreground",
  starter: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  pro: "border-primary/20 bg-primary/10 text-primary",
  agency: "border-amber-500/20 bg-amber-500/10 text-amber-400",
}

const METRIC_LABELS: Record<string, string> = {
  profileStrength: "Profile Strength",
  bioOptimization: "Bio Optimization",
  contentConsistency: "Content Consistency",
  engagementHealth: "Engagement Health",
  contentMix: "Content Mix",
  hashtagStrategy: "Hashtag Strategy",
  reelsPerformance: "Reels Performance",
  audienceQuality: "Audience Quality",
}

interface AuditResultsProps {
  data: AuditResult
  onNewAudit: () => void
  currentPlan: PlanKey
}

export function AuditResults({ data, onNewAudit, currentPlan }: AuditResultsProps) {
  const router = useRouter()

  const displayData: AuditResult = data
  const displayPlan = currentPlan

  const snap = displayData.profileSnapshot
  const contentPlan = displayData.contentPlan as DayPlan[] | undefined
  const hasPlan = Array.isArray(contentPlan) && contentPlan.length > 0
  const metricEntries = Object.entries(displayData.metrics)

  const getNumeric = (value: unknown, fallback = 0) =>
    typeof value === "number" && Number.isFinite(value) ? value : fallback

  const contentMixRaw = displayData.metrics.contentMix?.rawData
  const engagementRaw = displayData.metrics.engagementHealth?.rawData
  const consistencyRaw = displayData.metrics.contentConsistency?.rawData
  const hashtagRaw = displayData.metrics.hashtagStrategy?.rawData
  const persistedInsights = displayData.auditInsights
  const insightSources = persistedInsights?.dataSource ?? {}

  const sourceMeta: Record<"graph" | "scraper" | "inferred", { label: string; className: string }> = {
    graph: {
      label: "Graph",
      className: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
    },
    scraper: {
      label: "Scraper",
      className: "border-blue-500/25 bg-blue-500/10 text-blue-400",
    },
    inferred: {
      label: "Inferred",
      className: "border-amber-500/25 bg-amber-500/10 text-amber-400",
    },
  }

  const resolveSource = (field: string) => {
    const source = insightSources[field]
    return source && sourceMeta[source] ? sourceMeta[source] : null
  }

  const contentMixStats = {
    image: Math.round(getNumeric(persistedInsights?.contentMix?.image, getNumeric(contentMixRaw?.imageRate))),
    carousel: Math.round(
      getNumeric(persistedInsights?.contentMix?.carousel, getNumeric(contentMixRaw?.carouselRate)),
    ),
    reel: Math.round(getNumeric(persistedInsights?.contentMix?.reel, getNumeric(contentMixRaw?.reelAdoptionRate))),
  }

  const insightChips = [
    {
      label: "Posts analyzed",
      value: String(
        Math.round(
          getNumeric(persistedInsights?.postsAnalyzed) ||
            getNumeric(consistencyRaw?.postsAnalyzed) ||
            getNumeric(engagementRaw?.postsAnalyzed) ||
            0,
        ),
      ),
      sourceKey: "postsAnalyzed",
    },
    {
      label: "Avg engagement rate",
      value: `${getNumeric(
        persistedInsights?.avgEngagementRate,
        getNumeric(engagementRaw?.avgEngagementRate),
      ).toFixed(2)}%`,
      sourceKey: "avgEngagementRate",
    },
    {
      label: "Posting frequency",
      value: `${getNumeric(
        persistedInsights?.postingFrequencyPerWeek,
        getNumeric(consistencyRaw?.postsPerWeek),
      ).toFixed(1)}/week`,
      sourceKey: "postingFrequencyPerWeek",
    },
    {
      label: "Avg hashtags",
      value: `${getNumeric(
        persistedInsights?.avgHashtagsPerPost,
        getNumeric(hashtagRaw?.avgHashtagsPerPost),
      ).toFixed(1)}/post`,
      sourceKey: "avgHashtagsPerPost",
    },
  ]

  return (
    <div className="space-y-6">

      {/* ── Hero header ───────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6 shadow-sm backdrop-blur-xl md:p-10">

        {/* Top row: handle + plan badge | switcher */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-sm font-medium text-muted-foreground">
              @{displayData.username}
            </span>

            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize",
                PLAN_COLORS[displayPlan]
              )}
            >
              {PLAN_LABELS[displayPlan]} Plan
            </span>

            {snap && (
              <span className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-2.5 py-0.5 text-[11px] text-muted-foreground">
                {snap.dataSource === "graph_api" ? (
                  <Database className="h-3 w-3 text-emerald-400" />
                ) : (
                  <Globe className="h-3 w-3 text-blue-400" />
                )}
                {snap.dataSource === "graph_api" ? "Connected account" : "Public data"}
              </span>
            )}

          </div>
        </div>

        {/* Score + headline */}
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Instagram Profile Audit
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
              {displayPlan === "free"
                ? "Your free audit covers bio, CTA, and positioning — the profile layer that visitors see first."
                : displayPlan === "starter"
                ? "Full audit across 6 dimensions: profile, captions, hashtags, and content consistency."
                : "Advanced audit with engagement benchmarking, strategy scoring, and a 7-day content plan."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={onNewAudit}
                variant="outline"
                size="sm"
                className="rounded-xl gap-2"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Audit another profile
              </Button>

              {currentPlan === "free" && (
                <Button
                  onClick={() => router.push("/pricing")}
                  size="sm"
                  className="rounded-xl gap-2 bg-gradient-to-r from-primary via-pink-500 to-orange-400 text-white hover:opacity-90"
                >
                  Upgrade for full audit
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            {displayData.findings.length > 0 && (
              <div className="mt-5 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Key findings
                </p>
                {displayData.findings.slice(0, 3).map((finding, idx) => (
                  <p key={`${finding}-${idx}`} className="text-sm text-foreground/85">
                    - {finding}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center md:justify-end">
            <ScoreCircle score={displayData.overallScore} />
          </div>
        </div>
      </div>

      {/* ── Profile snapshot row ───────────────────────────────────── */}
      {snap && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Followers", value: formatCount(snap.followerCount), icon: Users },
            { label: "Following", value: formatCount(snap.followingCount), icon: Users },
            { label: "Posts", value: formatCount(snap.postCount), icon: FileText },
            {
              label: "Link in bio",
              value: snap.hasLinkInBio ? "Yes ✓" : "Missing",
              icon: Globe,
              accent: snap.hasLinkInBio ? "text-emerald-400" : "text-red-400",
            },
          ].map(({ label, value, icon: Icon, accent }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card/70 px-4 py-3 backdrop-blur-xl"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground">{label}</p>
                <p className={cn("truncate text-sm font-semibold text-foreground", accent)}>
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/50 bg-card/70 p-5 backdrop-blur-xl">
          <p className="text-sm font-semibold text-foreground">Engagement & publishing snapshot</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {insightChips.map((item) => {
              const source = resolveSource(item.sourceKey)
              return (
              <div key={item.label} className="rounded-xl border border-border/40 bg-background/40 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] text-muted-foreground">{item.label}</p>
                  {source && (
                    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", source.className)}>
                      {source.label}
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
              </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/70 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">Content mix</p>
            {resolveSource("contentMix") && (
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                  resolveSource("contentMix")?.className,
                )}
              >
                {resolveSource("contentMix")?.label}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Distribution across analyzed content</p>
          <div className="mt-4 space-y-3">
            {[
              { key: "image", label: "Images", value: contentMixStats.image, color: "bg-blue-500" },
              { key: "carousel", label: "Carousels", value: contentMixStats.carousel, color: "bg-purple-500" },
              { key: "reel", label: "Reels", value: contentMixStats.reel, color: "bg-emerald-500" },
            ].map((item) => (
              <div key={item.key}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-foreground/70">{item.label}</span>
                  <span className="text-foreground/70">{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className={cn("h-2 rounded-full", item.color)}
                    style={{ width: `${Math.max(3, Math.min(item.value, 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Metrics grid ──────────────────────────────────────────── */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Score breakdown</h3>
          <span className="ml-1 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground">
            {Object.keys(displayData.metrics).length} metrics
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {metricEntries.map(([key, metric]) => (
            <MetricCard
              key={key}
              label={METRIC_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1)}
              metric={metric}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">Per-module details</h3>
        <div className="grid gap-3 lg:grid-cols-2">
          {metricEntries.map(([key, metric]) => (
            <div key={`details-${key}`} className="rounded-2xl border border-border/50 bg-card/70 p-4 backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">
                  {METRIC_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1)}
                </p>
                <span className="text-xs font-medium text-muted-foreground">{metric.score}/100</span>
              </div>
              {metric.details?.length ? (
                <ul className="space-y-1">
                  {metric.details.slice(0, 3).map((detail, idx) => (
                    <li key={`${key}-d-${idx}`} className="text-xs text-foreground/80">
                      - {detail}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">No findings yet.</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Tips ──────────────────────────────────────────────────── */}
      <TipsSection tips={displayData.tips} />

      {/* ── Content plan (pro / agency) ────────────────────────────── */}
      {hasPlan && (
        <ContentPlanSection username={displayData.username} plan={contentPlan} />
      )}

      {/* ── Locked previews ───────────────────────────────────────── */}
      {displayData.lockedPreviews && displayData.lockedPreviews.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">Unlock more insights</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {displayData.lockedPreviews.map((item) => (
              <div
                key={item.key}
                className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-5 backdrop-blur-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Available on the{" "}
                      <span className="capitalize text-primary">{item.requiredPlan}</span>{" "}
                      plan and above.
                    </p>
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted/40">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-background/0 to-background/30 backdrop-blur-[1px]" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Upgrade CTA ───────────────────────────────────────────── */}
      {(displayPlan === "free" || displayPlan === "starter") && (
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/8 via-pink-500/5 to-orange-400/8 p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-pink-500/15 to-orange-400/20 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-foreground">
            {displayPlan === "free" ? "Unlock the full audit" : "Go deeper with Pro"}
          </h3>
          <p className="mx-auto mb-6 max-w-lg text-sm leading-6 text-muted-foreground">
            {displayPlan === "free"
              ? "Upgrade to Starter to unlock caption analysis, hashtag scoring, content frequency, and AI-generated tips personalized to your profile."
              : "Upgrade to Pro to unlock engagement benchmarking, strategy scoring, and a 7-day AI content plan built around your account."}
          </p>
          <Button
            onClick={() => router.push("/pricing")}
            className="rounded-xl gap-2 bg-gradient-to-r from-primary via-pink-500 to-orange-400 text-white hover:opacity-90"
          >
            View plans
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}
