"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  CalendarClock,
  Crown,
  FileText,
  LineChart,
  Sparkles,
} from "lucide-react"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { EmailVerificationBanner } from "@/components/dashboard/email-verification-banner"
import { ProfileInput } from "@/components/dashboard/profile-input"
import { AuditResults } from "@/components/dashboard/audit-results"
import { Button } from "@/components/ui/button"
import { MOCK_RESULTS } from "@/lib/audits/mock-data"

type AccessLevel = "free" | "paid" | "grace"
type PlanKey = "free" | "starter" | "pro" | "agency"

export default function DashboardPage() {
  const router = useRouter()
  const { data: session } = useSession()

  const [auditData, setAuditData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [hasAudited, setHasAudited] = useState(false)
  const [lastAuditAt, setLastAuditAt] = useState<string | null>(null)
  const [instagramConnected] = useState(false)
  const [usedAudits, setUsedAudits] = useState(0)
  const [auditError, setAuditError] = useState<string | null>(null)

  const subscriptionPlan = (session?.user?.subscriptionPlan ?? "free") as PlanKey
  const subscriptionStatus = session?.user?.subscriptionStatus ?? "inactive"
  const selectedPlan = session?.user?.selectedPlan ?? "free"

  const accessLevel: AccessLevel = useMemo(() => {
    if (subscriptionStatus === "active" && subscriptionPlan !== "free") {
      return "paid"
    }

    if (subscriptionStatus === "past_due") {
      return "grace"
    }

    return "free"
  }, [subscriptionPlan, subscriptionStatus])

  const showInactiveUpgradeBanner =
    selectedPlan !== "free" && subscriptionStatus === "inactive"

  const showPastDueBanner = subscriptionStatus === "past_due"
  const showCanceledBanner = subscriptionStatus === "canceled"

  const auditLimit = useMemo(() => {
    if (subscriptionPlan === "free") return 1
    if (subscriptionPlan === "starter") return 10
    return -1
  }, [subscriptionPlan])

  const isUnlimited = auditLimit === -1
  const remainingAudits = isUnlimited ? -1 : Math.max(auditLimit - usedAudits, 0)
  const canRunAudit = isUnlimited || remainingAudits > 0
  const canConnectInstagram = subscriptionPlan !== "free"

  const auditsRemainingText = isUnlimited
    ? "Unlimited"
    : `${remainingAudits} remaining`

  const handleAudit = async (username: string) => {
    setLoading(true)
    setAuditError(null)

    try {
      const res = await fetch("/api/audits/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      })

      const data = await res.json()

      if (!res.ok) {
        setAuditError(data?.error || "Failed to run audit.")
        return
      }

      setAuditData(data.result)
      setHasAudited(true)
      setLastAuditAt("Just now")
      setUsedAudits((prev) => (isUnlimited ? prev : prev + 1))
    } catch (error) {
      console.error(error)
      setAuditError("Something went wrong while running the audit.")
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = () => {
    const mockPlan = subscriptionPlan as "free" | "starter" | "pro" | "agency"
    const mock = MOCK_RESULTS[mockPlan] ?? MOCK_RESULTS.free
    setAuditData(mock)
    setHasAudited(true)
    setLastAuditAt("Just now")
    setAuditError(null)
  }

  const planLabel =
    accessLevel === "paid"
      ? `${subscriptionPlan} plan`
      : accessLevel === "grace"
      ? `${subscriptionPlan} plan · grace period`
      : "free plan"

  const stats = [
    {
      title: "Current plan",
      value: planLabel,
      icon: Crown,
    },
    {
      title: "Audits remaining",
      value: auditsRemainingText,
      icon: FileText,
    },
    {
      title: "Average score",
      value: hasAudited ? `${auditData?.overallScore}/100` : "—",
      icon: LineChart,
    },
    {
      title: "Last audit",
      value: lastAuditAt ?? "No audits yet",
      icon: CalendarClock,
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />

      <main className="ml-72 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <EmailVerificationBanner />

          {showInactiveUpgradeBanner && (
            <div className="mb-6 rounded-3xl border border-primary/20 bg-primary/5 px-5 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    Your {selectedPlan} plan is waiting to be activated
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Complete checkout to unlock everything included in your selected plan.
                  </p>
                </div>

                <Button
                  onClick={() => router.push("/checkout")}
                  className="rounded-xl"
                >
                  Complete checkout
                </Button>
              </div>
            </div>
          )}

          {showPastDueBanner && (
            <div className="mb-6 rounded-3xl border border-yellow-500/20 bg-yellow-500/10 px-5 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    Payment issue on your subscription
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your payment did not go through. Retry payment to avoid interruption.
                  </p>
                </div>

                <Button
                  onClick={() => router.push("/checkout")}
                  className="rounded-xl"
                >
                  Retry payment
                </Button>
              </div>
            </div>
          )}

          {showCanceledBanner && (
            <div className="mb-6 rounded-3xl border border-border bg-card/70 px-5 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    You’re currently on the free plan
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your premium subscription has ended. You can continue on free or upgrade again anytime.
                  </p>
                </div>

                <Button
                  onClick={() => router.push("/pricing")}
                  className="rounded-xl"
                >
                  View plans
                </Button>
              </div>
            </div>
          )}

          {auditError && (
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
              {auditError}
            </div>
          )}

          <section>
            {!hasAudited ? (
              <ProfileInput
                onAudit={handleAudit}
                onDemo={handleDemo}
                loading={loading}
                plan={subscriptionPlan}
                auditsRemainingText={auditsRemainingText}
                canRunAudit={canRunAudit}
                canConnectInstagram={canConnectInstagram}
                instagramConnected={instagramConnected}
                onConnectInstagram={() => router.push("/settings")}
              />
            ) : (
              <AuditResults
                data={auditData}
                onNewAudit={() => setHasAudited(false)}
                currentPlan={subscriptionPlan}
              />
            )}
          </section>

          {!hasAudited && (
            <>
              <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((item, index) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={index}
                      className="rounded-3xl border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-xl"
                    >
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>

                      <p className="text-sm text-muted-foreground">{item.title}</p>
                      <p className="mt-2 text-lg font-semibold capitalize text-foreground">
                        {item.value}
                      </p>
                    </div>
                  )
                })}
              </section>

              <section className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
                <div className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Recent activity
                  </div>

                  <h2 className="mt-3 text-2xl font-semibold text-foreground">
                    Recent audits
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Your latest audit reports will appear here so you can quickly reopen them.
                  </p>

                  <div className="mt-6">
                    <div className="rounded-2xl border border-dashed border-border bg-background/40 p-6 text-sm text-muted-foreground">
                      No audits yet. Run your first audit above to see reports here.
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Quick notes
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Focus on clarity first. Profiles usually improve fastest when the bio,
                    offer, and call to action are easier to understand.
                  </p>

                  <div className="mt-6 space-y-3">
                    {[
                      "Make your bio explain who you help and what result you provide.",
                      "Use stronger first lines in captions to stop the scroll.",
                      "Keep your content direction more consistent from post to post.",
                    ].map((tip, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-border bg-background/60 p-4 text-sm text-muted-foreground"
                      >
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}