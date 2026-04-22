"use client"

import type React from "react"
import { useState } from "react"
import {
  ArrowRight,
  CheckCircle2,
  Instagram,
  Link2,
  Lock,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ProfileInputProps {
  onAudit: (username: string) => void
  loading: boolean
  auditProgress?: number
  auditPhase?: string
  plan: "free" | "starter" | "pro" | "agency"
  auditsRemainingText: string
  canRunAudit: boolean
  canConnectInstagram: boolean
  instagramConnected?: boolean
  onConnectInstagram?: () => void
}

const quickSuggestions = ["creatorhub", "brandstudio", "growthcoach", "agencymode"]

export function ProfileInput({
  onAudit,
  loading,
  auditProgress = 0,
  auditPhase = "Running audit",
  plan,
  auditsRemainingText,
  canRunAudit,
  canConnectInstagram,
  instagramConnected = false,
  onConnectInstagram,
}: ProfileInputProps) {
  const [username, setUsername] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = username.trim().replace(/^@/, "")
    if (clean && canRunAudit && !loading) {
      onAudit(clean)
    }
  }

  return (
    <Card className="rounded-[28px] border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl sm:p-8">
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-sm text-muted-foreground">
              <Instagram className="h-4 w-4 text-primary" />
              New Instagram audit
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Run a new audit
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Enter an Instagram handle and get a clearer view of profile positioning,
              content direction, calls to action, and growth opportunities.
            </p>
          </div>

          {canConnectInstagram && (
            <Button
              type="button"
              variant={instagramConnected ? "outline" : "default"}
              onClick={onConnectInstagram}
              className="rounded-2xl"
            >
              <Link2 className="mr-2 h-4 w-4" />
              {instagramConnected ? "Instagram Connected" : "Connect Instagram"}
            </Button>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <div className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-muted-foreground">
            Plan: <span className="font-medium capitalize text-foreground">{plan}</span>
          </div>

          <div className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-muted-foreground">
            Audits: <span className="font-medium text-foreground">{auditsRemainingText}</span>
          </div>

          {!canRunAudit && (
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-amber-700 dark:text-amber-300">
              <Lock className="h-4 w-4" />
              Audit limit reached for your plan
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="rounded-[24px] border border-border bg-background/60 p-3 sm:p-4">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Instagram className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <span className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-muted-foreground">
                  @
                </span>

                <Input
                  placeholder="yourhandle"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading || !canRunAudit}
                  className="h-14 rounded-2xl border-border bg-background pl-14"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !username.trim() || !canRunAudit}
                className="h-14 rounded-2xl bg-gradient-to-r from-primary via-pink-500 to-orange-400 px-6 text-white hover:opacity-95"
              >
                {loading ? (
                  `${Math.round(auditProgress)}%`
                ) : !canRunAudit ? (
                  "Limit reached"
                ) : (
                  <>
                    Start audit
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            {loading && (
              <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                  <span className="font-medium text-foreground">{auditPhase}</span>
                  <span className="font-semibold text-primary">{Math.round(auditProgress)}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-background/70">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-pink-500 to-orange-400 transition-all duration-500"
                    style={{ width: `${Math.max(6, Math.min(100, auditProgress))}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Instant feedback
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Clear recommendations
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Better profile direction
            </div>
          </div>

        </div>
      </div>
    </Card>
  )
}