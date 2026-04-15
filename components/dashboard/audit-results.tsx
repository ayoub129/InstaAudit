"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Database,
  Globe,
  Lock,
  RotateCcw,
  Sparkles,
  Users,
  LayoutGrid,
  FileText,
  CheckCircle2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { MetricCard } from "./metric-card"
import { TipsSection } from "./tips-section"
import { ContentPlanSection } from "./content-plan-section"
import { ScoreCircle } from "./score-circle"
import { cn } from "@/lib/utils"
import { MOCK_RESULTS } from "@/lib/audits/mock-data"
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
  bio: "Bio",
  cta: "CTA",
  positioning: "Positioning",
  captions: "Captions",
  hashtags: "Hashtags",
  content: "Content",
  engagement: "Engagement",
  strategy: "Strategy",
}

interface AuditResultsProps {
  data: AuditResult
  onNewAudit: () => void
  currentPlan: PlanKey
}

export function AuditResults({ data, onNewAudit, currentPlan }: AuditResultsProps) {
  const router = useRouter()
  const [previewPlan, setPreviewPlan] = useState<PlanKey>(currentPlan)
  const [showSwitcher, setShowSwitcher] = useState(false)

  // In preview mode use mock data, otherwise use real data
  const isPreview = previewPlan !== currentPlan
  const displayData: AuditResult = isPreview ? MOCK_RESULTS[previewPlan] : data
  const displayPlan = previewPlan

  const snap = displayData.profileSnapshot
  const contentPlan = displayData.contentPlan as DayPlan[] | undefined
  const hasPlan = Array.isArray(contentPlan) && contentPlan.length > 0

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

            {isPreview && (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-400">
                Preview mode
              </span>
            )}
          </div>

          {/* Plan switcher */}
          <div className="relative">
            <button
              onClick={() => setShowSwitcher((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Preview plan view
              <span className="ml-0.5 text-primary">▾</span>
            </button>

            {showSwitcher && (
              <div className="absolute right-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-2xl border border-border/60 bg-popover shadow-xl backdrop-blur-xl">
                {(["free", "starter", "pro", "agency"] as PlanKey[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => { setPreviewPlan(p); setShowSwitcher(false) }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-primary/5",
                      previewPlan === p ? "text-primary font-medium" : "text-foreground/80"
                    )}
                  >
                    <span className="capitalize">{p}</span>
                    {previewPlan === p && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                    {p === currentPlan && previewPlan !== p && (
                      <span className="text-[10px] text-muted-foreground">your plan</span>
                    )}
                  </button>
                ))}
                {isPreview && (
                  <div className="border-t border-border px-4 py-2.5">
                    <button
                      onClick={() => { setPreviewPlan(currentPlan); setShowSwitcher(false) }}
                      className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                    >
                      Back to real results
                    </button>
                  </div>
                )}
              </div>
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
          {Object.entries(displayData.metrics).map(([key, metric]) => (
            <MetricCard
              key={key}
              label={METRIC_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1)}
              metric={metric}
            />
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
      {(displayPlan === "free" || displayPlan === "starter") && !isPreview && (
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
