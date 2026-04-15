"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  ChevronRight,
  Clock,
  FileSearch,
  History,
  Instagram,
  Loader2,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PlanKey = "free" | "starter" | "pro" | "agency"

interface AuditSummary {
  id: string
  handle: string
  planAtRun: PlanKey
  auditType: string
  overallScore: number
  createdAt: string
}

const PLAN_COLORS: Record<PlanKey, string> = {
  free: "border-border/60 bg-muted/40 text-muted-foreground",
  starter: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  pro: "border-primary/20 bg-primary/10 text-primary",
  agency: "border-amber-500/20 bg-amber-500/10 text-amber-400",
}

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-400"
  if (score >= 60) return "text-blue-400"
  if (score >= 40) return "text-yellow-400"
  return "text-red-400"
}

function scoreBg(score: number) {
  if (score >= 80) return "bg-emerald-500/10 border-emerald-500/20"
  if (score >= 60) return "bg-blue-500/10 border-blue-500/20"
  if (score >= 40) return "bg-yellow-500/10 border-yellow-500/20"
  return "bg-red-500/10 border-red-500/20"
}

function scoreLabel(score: number) {
  if (score >= 80) return "Excellent"
  if (score >= 60) return "Good"
  if (score >= 40) return "Fair"
  return "Poor"
}

export default function AuditHistoryPage() {
  const [audits, setAudits] = useState<AuditSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/audits/history")
        if (!res.ok) throw new Error("Failed to load")
        const data = await res.json()
        setAudits(data.audits ?? [])
      } catch {
        setError("Could not load audit history. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = audits.filter((a) =>
    a.handle.toLowerCase().includes(search.toLowerCase())
  )

  const avgScore =
    audits.length > 0
      ? Math.round(audits.reduce((sum, a) => sum + a.overallScore, 0) / audits.length)
      : null

  const bestScore = audits.length > 0 ? Math.max(...audits.map((a) => a.overallScore)) : null

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />

      <main className="ml-72 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">

          {/* ── Page header ───────────────────────────────────────────── */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <History className="h-4 w-4 text-primary" />
                Audit History
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                All audits
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Browse every audit you've run — click any row to view the full report.
              </p>
            </div>

            <Button
              asChild
              className="rounded-xl gap-2 bg-gradient-to-r from-primary via-pink-500 to-orange-400 text-white hover:opacity-90 self-start sm:self-auto"
            >
              <Link href="/dashboard">
                <Sparkles className="h-4 w-4" />
                Run new audit
              </Link>
            </Button>
          </div>

          {/* ── Stats bar ─────────────────────────────────────────────── */}
          {!loading && audits.length > 0 && (
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Total audits",
                  value: audits.length.toString(),
                  icon: FileSearch,
                },
                {
                  label: "Average score",
                  value: avgScore !== null ? `${avgScore}/100` : "—",
                  icon: TrendingUp,
                },
                {
                  label: "Best score",
                  value: bestScore !== null ? `${bestScore}/100` : "—",
                  icon: Sparkles,
                },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-3xl border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-xl"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-1.5 text-xl font-bold text-foreground">{value}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Search ────────────────────────────────────────────────── */}
          {!loading && audits.length > 0 && (
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-border/50 bg-card/70 px-4 py-3 backdrop-blur-xl shadow-sm">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by Instagram handle…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {/* ── Content ───────────────────────────────────────────────── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-border/50 bg-card/70 py-24 backdrop-blur-xl shadow-sm">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">Loading your audit history…</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
              {error}
            </div>
          ) : audits.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/40 py-24 text-center backdrop-blur-xl">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <History className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">No audits yet</h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Run your first audit from the dashboard and it will appear here automatically.
              </p>
              <Button
                asChild
                className="mt-6 rounded-xl gap-2 bg-gradient-to-r from-primary via-pink-500 to-orange-400 text-white hover:opacity-90"
              >
                <Link href="/dashboard">
                  Run first audit
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-border/50 bg-card/70 py-16 text-center backdrop-blur-xl shadow-sm">
              <p className="text-sm text-muted-foreground">
                No audits found for &ldquo;{search}&rdquo;
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-border/50 bg-card/70 shadow-sm backdrop-blur-xl">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 border-b border-border/50 px-6 py-3">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Handle
                </span>
                <span className="hidden text-xs font-medium uppercase tracking-wider text-muted-foreground sm:block">
                  Score
                </span>
                <span className="hidden text-xs font-medium uppercase tracking-wider text-muted-foreground md:block">
                  Plan
                </span>
                <span className="hidden text-xs font-medium uppercase tracking-wider text-muted-foreground lg:block">
                  Date
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  &nbsp;
                </span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-border/40">
                {filtered.map((audit) => (
                  <Link
                    key={audit.id}
                    href={`/dashboard/history/${audit.id}`}
                    className="group grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 px-6 py-4 transition-colors hover:bg-primary/5"
                  >
                    {/* Handle */}
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-pink-500/15 to-orange-400/20 text-primary">
                        <Instagram className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">@{audit.handle}</p>
                        <p className="text-xs text-muted-foreground capitalize sm:hidden">
                          {scoreLabel(audit.overallScore)} · {audit.overallScore}/100
                        </p>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="hidden sm:flex items-center gap-2">
                      <div
                        className={cn(
                          "flex h-8 w-16 items-center justify-center rounded-xl border text-sm font-bold",
                          scoreBg(audit.overallScore),
                          scoreColor(audit.overallScore)
                        )}
                      >
                        {audit.overallScore}
                      </div>
                    </div>

                    {/* Plan badge */}
                    <div className="hidden md:block">
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize",
                          PLAN_COLORS[audit.planAtRun]
                        )}
                      >
                        {audit.planAtRun}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="hidden items-center gap-1.5 lg:flex text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      {formatDistanceToNow(new Date(audit.createdAt), { addSuffix: true })}
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Showing {filtered.length} of {audits.length} audit{audits.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
