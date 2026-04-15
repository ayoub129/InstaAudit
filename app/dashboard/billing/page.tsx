"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  Check,
  CreditCard,
  Crown,
  Loader2,
  Sparkles,
  XCircle,
  Zap,
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PlanKey = "free" | "starter" | "pro" | "agency"

const PLAN_CONFIG: Record<PlanKey, {
  label: string
  monthlyPrice: number
  annualPrice: number
  description: string
  features: string[]
  color: string
  badgeColor: string
}> = {
  free: {
    label: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Get started with the basics",
    features: ["1 audit / month", "Bio, CTA & positioning score", "Basic tips"],
    color: "border-border/60 bg-muted/40",
    badgeColor: "border-border/60 bg-muted/40 text-muted-foreground",
  },
  starter: {
    label: "Starter",
    monthlyPrice: 19,
    annualPrice: 15,
    description: "For creators getting serious",
    features: ["10 audits / month", "6-metric full audit", "Caption & hashtag analysis", "Instagram account connection", "AI-generated tips"],
    color: "border-blue-500/20 bg-blue-500/5",
    badgeColor: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  },
  pro: {
    label: "Pro",
    monthlyPrice: 39,
    annualPrice: 31,
    description: "Unlimited power for growth",
    features: ["Unlimited audits", "Advanced 8-metric audit", "Engagement benchmarking", "7-day AI content plan", "Strategy scoring", "Exportable reports"],
    color: "border-primary/20 bg-primary/5",
    badgeColor: "border-primary/20 bg-primary/10 text-primary",
  },
  agency: {
    label: "Agency",
    monthlyPrice: 99,
    annualPrice: 79,
    description: "For agencies managing many clients",
    features: ["Everything in Pro", "Multi-account support", "Team workspace", "Client reports", "Priority support"],
    color: "border-amber-500/20 bg-amber-500/5",
    badgeColor: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  },
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
  trialing: { label: "Trialing", color: "border-blue-500/30 bg-blue-500/10 text-blue-400" },
  past_due: { label: "Past due", color: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400" },
  canceled: { label: "Canceled", color: "border-red-500/30 bg-red-500/10 text-red-400" },
  inactive: { label: "Inactive", color: "border-border/60 bg-muted/40 text-muted-foreground" },
}

export default function BillingPage() {
  const router = useRouter()
  const { data: session, update: updateSession } = useSession()

  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [canceling, setCanceling] = useState(false)

  const plan = (session?.user?.subscriptionPlan ?? "free") as PlanKey
  const status = session?.user?.subscriptionStatus ?? "inactive"
  const billing = session?.user?.subscriptionBilling ?? "monthly"
  const periodEnd = (session?.user as any)?.subscriptionCurrentPeriodEnd ?? null
  const cancelAtPeriodEnd = (session?.user as any)?.cancelAtPeriodEnd ?? false
  const provider = session?.user?.paymentProvider ?? null

  async function handleCancelSubscription() {
    setCanceling(true)
    try {
      const res = await fetch("/api/paypal/subscription/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason || "Cancelled by user" }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(data.message || "Subscription canceled.")
      setShowCancelDialog(false)
      // Refresh session so status badge updates
      await updateSession()
    } catch (e: any) {
      toast.error(e.message || "Failed to cancel subscription")
    } finally {
      setCanceling(false)
    }
  }

  const planCfg = PLAN_CONFIG[plan]
  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.inactive
  const isFreePlan = plan === "free"
  const isPaid = status === "active" && !isFreePlan

  const currentPrice = billing === "annual" ? planCfg.annualPrice : planCfg.monthlyPrice

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />

      <main className="ml-72 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1100px]">

          {/* Page header */}
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4 text-primary" />
              Billing
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing & Plans</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              View your subscription details and manage your plan.
            </p>
          </div>

          <div className="space-y-5">

            {/* ── Current plan card ─────────────────────────────────── */}
            <div className={cn(
              "rounded-3xl border p-6 shadow-sm backdrop-blur-xl",
              planCfg.color
            )}>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Crown className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Current plan</p>
                      <h2 className="text-xl font-bold text-foreground">{planCfg.label}</h2>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", statusCfg.color)}>
                      {statusCfg.label}
                    </span>

                    {!isFreePlan && (
                      <span className="rounded-full border border-border/60 bg-background/60 px-2.5 py-0.5 text-[11px] text-muted-foreground capitalize">
                        {billing} billing · ${currentPrice}/mo
                      </span>
                    )}

                    {cancelAtPeriodEnd && (
                      <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-[11px] text-red-400">
                        Cancels at period end
                      </span>
                    )}

                    {provider && (
                      <span className="rounded-full border border-border/60 bg-background/60 px-2.5 py-0.5 text-[11px] capitalize text-muted-foreground">
                        via {provider}
                      </span>
                    )}
                  </div>

                  {periodEnd && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {cancelAtPeriodEnd ? "Access ends" : "Renews on"}{" "}
                      {format(new Date(periodEnd), "MMMM d, yyyy")}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                  {isFreePlan ? (
                    <Button
                      onClick={() => router.push("/pricing")}
                      className="rounded-xl gap-2 bg-gradient-to-r from-primary via-pink-500 to-orange-400 text-white hover:opacity-90"
                    >
                      <Zap className="h-4 w-4" />
                      Upgrade now
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => router.push("/pricing")}
                        variant="outline"
                        size="sm"
                        className="rounded-xl gap-2"
                      >
                        <ArrowRight className="h-4 w-4" />
                        Change plan
                      </Button>
                      {!cancelAtPeriodEnd && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                          onClick={() => setShowCancelDialog(true)}
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel plan
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Included features */}
              <div className="mt-5 border-t border-border/40 pt-5">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Included in your plan
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {planCfg.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Plan comparison ───────────────────────────────────── */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">Available plans</h2>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {(Object.entries(PLAN_CONFIG) as [PlanKey, typeof PLAN_CONFIG[PlanKey]][]).map(([key, cfg]) => {
                  const isCurrent = key === plan

                  return (
                    <div
                      key={key}
                      className={cn(
                        "relative rounded-3xl border p-5 shadow-sm backdrop-blur-xl transition-all",
                        isCurrent
                          ? cn("border-primary/30", cfg.color)
                          : "border-border/50 bg-card/70"
                      )}
                    >
                      {isCurrent && (
                        <div className="absolute -top-2.5 left-4">
                          <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                            Current plan
                          </span>
                        </div>
                      )}

                      <div className="mb-4">
                        <p className="text-base font-bold text-foreground">{cfg.label}</p>
                        <p className="text-xs text-muted-foreground">{cfg.description}</p>
                        <div className="mt-3">
                          <span className="text-2xl font-bold text-foreground">${cfg.monthlyPrice}</span>
                          <span className="text-xs text-muted-foreground">/mo</span>
                          {cfg.annualPrice > 0 && (
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                              ${cfg.annualPrice}/mo billed annually
                            </p>
                          )}
                        </div>
                      </div>

                      <ul className="mb-5 space-y-2">
                        {cfg.features.slice(0, 4).map((f) => (
                          <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                            {f}
                          </li>
                        ))}
                        {cfg.features.length > 4 && (
                          <li className="text-xs text-muted-foreground">
                            +{cfg.features.length - 4} more…
                          </li>
                        )}
                      </ul>

                      {isCurrent ? (
                        <Button disabled className="w-full rounded-xl" size="sm">
                          Current plan
                        </Button>
                      ) : key === "free" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full rounded-xl"
                          onClick={() => setShowCancelDialog(true)}
                        >
                          Downgrade to Free
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full rounded-xl bg-gradient-to-r from-primary via-pink-500 to-orange-400 text-white hover:opacity-90"
                          onClick={() => router.push("/pricing")}
                        >
                          {plan === "free" || PLAN_CONFIG[plan].monthlyPrice < cfg.monthlyPrice
                            ? "Upgrade"
                            : "Switch"}{" "}
                          to {cfg.label}
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── Billing info note ─────────────────────────────────── */}
            <div className="rounded-3xl border border-primary/15 bg-primary/5 p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Need help with billing?</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    For invoice requests, refunds, or subscription changes, reach out via our{" "}
                    <a href="/support" className="text-primary underline-offset-2 hover:underline">
                      support page
                    </a>
                    . We typically respond within 24 hours.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ── Cancel confirmation dialog ──────────────────────────────── */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => !canceling && setShowCancelDialog(false)}
          />

          {/* Dialog */}
          <div className="relative w-full max-w-md rounded-3xl border border-red-500/20 bg-card shadow-2xl p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h2 className="text-lg font-bold text-foreground">Cancel subscription?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your subscription will be canceled and you&apos;ll lose access to{" "}
              <span className="font-medium capitalize text-foreground">{plan}</span> features
              {periodEnd
                ? ` on ${format(new Date(periodEnd), "MMMM d, yyyy")}`
                : " at the end of your billing period"}
              . You can resubscribe anytime.
            </p>

            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Reason for canceling <span className="text-muted-foreground/60">(optional)</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                disabled={canceling}
                placeholder="Too expensive, not using it, switching tools…"
                rows={3}
                className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500/30 disabled:opacity-60"
              />
            </div>

            <div className="mt-5 flex gap-2">
              <Button
                onClick={handleCancelSubscription}
                disabled={canceling}
                className="flex-1 rounded-xl bg-red-500 text-white hover:bg-red-600"
              >
                {canceling ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Canceling…</>
                ) : (
                  "Yes, cancel subscription"
                )}
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setShowCancelDialog(false)}
                disabled={canceling}
              >
                Keep subscription
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
