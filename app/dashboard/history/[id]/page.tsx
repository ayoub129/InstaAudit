"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  History,
  Loader2,
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { AuditResults } from "@/components/dashboard/audit-results"
import { Button } from "@/components/ui/button"
import type { AuditResult } from "@/lib/audits/types"

type PlanKey = "free" | "starter" | "pro" | "agency"

interface AuditDetail {
  id: string
  handle: string
  planAtRun: PlanKey
  auditType: string
  result: AuditResult
  createdAt: string
}

export default function AuditDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [audit, setAudit] = useState<AuditDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/audits/${id}`)
        if (res.status === 404) {
          setError("Audit not found.")
          return
        }
        if (!res.ok) throw new Error("Failed to load")
        const data = await res.json()
        setAudit(data.audit)
      } catch {
        setError("Could not load this audit. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />

      <main className="ml-72 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">

          {/* ── Back nav + metadata ───────────────────────────────────── */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-xl gap-2"
              >
                <Link href="/dashboard/history">
                  <ArrowLeft className="h-4 w-4" />
                  Audit History
                </Link>
              </Button>

              {audit && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <History className="h-3.5 w-3.5" />
                  <span>@{audit.handle}</span>
                  <span className="text-border">·</span>
                  <Calendar className="h-3.5 w-3.5" />
                  <span title={format(new Date(audit.createdAt), "PPPp")}>
                    {formatDistanceToNow(new Date(audit.createdAt), { addSuffix: true })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Content ───────────────────────────────────────────────── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-border/50 bg-card/70 py-32 backdrop-blur-xl shadow-sm">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">Loading audit report…</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10 py-24 text-center">
              <p className="text-sm text-red-400">{error}</p>
              <Button asChild variant="outline" className="mt-6 rounded-xl" size="sm">
                <Link href="/dashboard/history">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to history
                </Link>
              </Button>
            </div>
          ) : audit ? (
            <AuditResults
              data={audit.result}
              onNewAudit={() => window.location.href = "/dashboard"}
              currentPlan={audit.planAtRun}
            />
          ) : null}
        </div>
      </main>
    </div>
  )
}
