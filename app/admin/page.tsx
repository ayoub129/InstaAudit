import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import { Audit } from "@/models/Audit"
import Payment from "@/models/Payment"
import { SupportTicket } from "@/models/SupportTicket"
import { getAdminChurnReport, getAdminFunnelReport } from "@/lib/analytics/get-admin-reports"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { ApiUsageMetric } from "@/models/ApiUsageMetric"
import { AdminFinanceSettings } from "@/models/AdminFinanceSettings"
import { AdminFinanceControls } from "./admin-finance-controls"

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount)
}

function pct(part: number, whole: number) {
  if (!whole) return "0%"
  return `${Math.round((part / whole) * 100)}%`
}

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

type FeeConfig = {
  starterMonthly: number
  starterAnnual: number
  proMonthly: number
  proAnnual: number
  agencyMonthly: number
  agencyAnnual: number
}

const emptyFees: FeeConfig = {
  starterMonthly: 0,
  starterAnnual: 0,
  proMonthly: 0,
  proAnnual: 0,
  agencyMonthly: 0,
  agencyAnnual: 0,
}

function feeKey(planSlug: string, billingCycle: string): keyof FeeConfig | null {
  const key = `${String(planSlug)}-${String(billingCycle)}`
  if (key === "starter-monthly") return "starterMonthly"
  if (key === "starter-annual") return "starterAnnual"
  if (key === "pro-monthly") return "proMonthly"
  if (key === "pro-annual") return "proAnnual"
  if (key === "agency-monthly") return "agencyMonthly"
  if (key === "agency-annual") return "agencyAnnual"
  return null
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: { startDate?: string; endDate?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/auth/signin?callbackUrl=/admin")
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard?denied=admin")
  }

  await connectDB()

  const now = new Date()
  const defaultStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const defaultEnd = now

  const paramsRaw = searchParams ?? {}
  const startDateParam = paramsRaw.startDate
  const endDateParam = paramsRaw.endDate
  const startDateCandidate = startDateParam ? new Date(startDateParam) : defaultStart
  const endDateCandidate = endDateParam ? new Date(endDateParam) : defaultEnd
  const startDate = Number.isFinite(startDateCandidate.getTime()) ? startDateCandidate : defaultStart
  const endDate = Number.isFinite(endDateCandidate.getTime()) ? endDateCandidate : defaultEnd
  const rangeStart = startDate <= endDate ? startDate : defaultStart
  const rangeEnd = startDate <= endDate ? endDate : defaultEnd
  const rangeDays = Math.max(
    1,
    Math.floor((rangeEnd.getTime() - rangeStart.getTime()) / (24 * 60 * 60 * 1000)) + 1,
  )
  const rangeStartDayKey = dayKey(rangeStart)

  const [
    totalUsers,
    totalAdmins,
    suspendedUsers,
    verifiedUsers,
    newUsersInRange,
    activeSubscribers,
    pastDueSubscribers,
    canceledSubscribers,
    totalAudits,
    auditsInRange,
    completedPayments,
    failedPayments,
    paymentsInRangeAgg,
    revenueAgg,
    planMixAgg,
    supportOpen,
    supportInProgress,
    supportResolved,
    funnelReport,
    churnReport,
    recentUsers,
    recentPayments,
    recentAudits,
    scraperUsageInRangeAgg,
    openAiUsageInRangeAgg,
    feeMixInRangeAgg,
    financeSettingsDoc,
  ] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ accountStatus: "suspended" }),
    User.countDocuments({ emailVerified: { $ne: null } }),
    User.countDocuments({ createdAt: { $gte: rangeStart, $lte: rangeEnd } }),
    User.countDocuments({
      subscriptionStatus: "active",
      subscriptionPlan: { $in: ["starter", "pro", "agency"] },
    }),
    User.countDocuments({ subscriptionStatus: "past_due" }),
    User.countDocuments({ subscriptionStatus: "canceled" }),
    Audit.countDocuments({}),
    Audit.countDocuments({ createdAt: { $gte: rangeStart, $lte: rangeEnd } }),
    Payment.countDocuments({ status: "completed" }),
    Payment.countDocuments({ status: "failed" }),
    Payment.aggregate([
      { $match: { status: "completed", createdAt: { $gte: rangeStart, $lte: rangeEnd } } },
      { $group: { _id: null, totalRevenueInRange: { $sum: "$amount" }, totalPaymentsInRange: { $sum: 1 } } },
    ]),
    Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]),
    User.aggregate([
      { $match: { subscriptionPlan: { $in: ["free", "starter", "pro", "agency"] } } },
      { $group: { _id: "$subscriptionPlan", count: { $sum: 1 } } },
    ]),
    SupportTicket.countDocuments({ status: "open" }),
    SupportTicket.countDocuments({ status: "in_progress" }),
    SupportTicket.countDocuments({ status: "resolved" }),
    getAdminFunnelReport(rangeDays),
    getAdminChurnReport(rangeDays),
    User.find({ createdAt: { $gte: rangeStart, $lte: rangeEnd } })
      .sort({ createdAt: -1 })
      .limit(6)
      .select("name email createdAt subscriptionPlan")
      .lean(),
    Payment.find({ createdAt: { $gte: rangeStart, $lte: rangeEnd } })
      .sort({ createdAt: -1 })
      .limit(6)
      .select("amount currency status planSlug billingCycle createdAt")
      .lean(),
    Audit.find({ createdAt: { $gte: rangeStart, $lte: rangeEnd } })
      .sort({ createdAt: -1 })
      .limit(6)
      .select("handle planAtRun createdAt")
      .lean(),
    ApiUsageMetric.aggregate([
      { $match: { metricType: "scraper_api", day: { $gte: rangeStartDayKey } } },
      { $group: { _id: null, total: { $sum: "$count" } } },
    ]),
    ApiUsageMetric.aggregate([
      { $match: { metricType: "openai_api", day: { $gte: rangeStartDayKey } } },
      { $group: { _id: null, total: { $sum: "$count" } } },
    ]),
    Payment.aggregate([
      { $match: { status: "completed", createdAt: { $gte: rangeStart, $lte: rangeEnd } } },
      {
        $group: {
          _id: {
            provider: "$provider",
            planSlug: "$planSlug",
            billingCycle: "$billingCycle",
          },
          count: { $sum: 1 },
        },
      },
    ]),
    AdminFinanceSettings.findOne({ key: "default" }).lean(),
  ])

  const totalRevenue = Number(revenueAgg[0]?.totalRevenue ?? 0)
  const revenueInRange = Number(paymentsInRangeAgg[0]?.totalRevenueInRange ?? 0)
  const paymentsInRange = Number(paymentsInRangeAgg[0]?.totalPaymentsInRange ?? 0)
  const activeRate = pct(activeSubscribers, totalUsers)
  const verifiedRate = pct(verifiedUsers, totalUsers)
  const maxFunnel = Math.max(...funnelReport.steps.map((step) => step.count), 1)
  const planCounts = {
    free: Number(planMixAgg.find((p: any) => p._id === "free")?.count ?? 0),
    starter: Number(planMixAgg.find((p: any) => p._id === "starter")?.count ?? 0),
    pro: Number(planMixAgg.find((p: any) => p._id === "pro")?.count ?? 0),
    agency: Number(planMixAgg.find((p: any) => p._id === "agency")?.count ?? 0),
  }
  const financeSettings = {
    domainYearlyCost: Number((financeSettingsDoc as any)?.domainYearlyCost ?? 0),
    hostingMonthlyCost: Number((financeSettingsDoc as any)?.hostingMonthlyCost ?? 0),
    scraperMonthlyCost: Number((financeSettingsDoc as any)?.scraperMonthlyCost ?? 0),
    openAiCostPerCall: Number((financeSettingsDoc as any)?.openAiCostPerCall ?? 0),
    paypalFees: { ...emptyFees, ...((financeSettingsDoc as any)?.paypalFees ?? {}) },
    twoCheckoutFees: { ...emptyFees, ...((financeSettingsDoc as any)?.twoCheckoutFees ?? {}) },
  }
  const scraperApiCallsInRange = Number(scraperUsageInRangeAgg[0]?.total ?? 0)
  const openAiCallsInRange = Number(openAiUsageInRangeAgg[0]?.total ?? 0)
  const openAiEstimatedCostInRange = openAiCallsInRange * financeSettings.openAiCostPerCall
  const fixedMonthlyCosts =
    financeSettings.domainYearlyCost / 12 +
    financeSettings.hostingMonthlyCost +
    financeSettings.scraperMonthlyCost
  const processorFeesInRange = feeMixInRangeAgg.reduce((sum: number, row: any) => {
    const provider = String(row?._id?.provider ?? "")
    const planSlug = String(row?._id?.planSlug ?? "")
    const billingCycle = String(row?._id?.billingCycle ?? "")
    const count = Number(row?.count ?? 0)
    const key = feeKey(planSlug, billingCycle)
    if (!key) return sum
    if (provider === "paypal") {
      return sum + count * Number(financeSettings.paypalFees[key] ?? 0)
    }
    if (provider === "2checkout") {
      return sum + count * Number(financeSettings.twoCheckoutFees[key] ?? 0)
    }
    return sum
  }, 0)
  const netProfitInRange = revenueInRange - openAiEstimatedCostInRange - fixedMonthlyCosts - processorFeesInRange

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />

      <main className="ml-72 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <section className="mb-8 rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-primary/80">Admin Control Center</p>
                <h1 className="mt-2 text-3xl font-semibold text-foreground">Platform overview</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Real-time operational snapshot for users, subscriptions, revenue, audits, and support health.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Active range: {rangeStart.toLocaleDateString()} - {rangeEnd.toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <AdminFinanceControls initialSettings={financeSettings} />
                <form className="flex items-end gap-2 rounded-xl border border-border/60 bg-background/50 px-3 py-2" method="GET">
                  <label className="text-[11px] text-muted-foreground">
                    From
                    <input
                      name="startDate"
                      type="date"
                      defaultValue={rangeStart.toISOString().slice(0, 10)}
                      className="mt-1 block rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
                    />
                  </label>
                  <label className="text-[11px] text-muted-foreground">
                    To
                    <input
                      name="endDate"
                      type="date"
                      defaultValue={rangeEnd.toISOString().slice(0, 10)}
                      className="mt-1 block rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
                    />
                  </label>
                  <button
                    type="submit"
                    className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-xs font-medium hover:bg-muted/40"
                  >
                    Apply
                  </button>
                  <Link
                    href="/admin"
                    className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-xs font-medium hover:bg-muted/40"
                  >
                    Reset
                  </Link>
                </form>
                <Link
                  href="/admin/users"
                  className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-medium hover:bg-muted/40"
                >
                  Manage users
                </Link>
                <Link
                  href="/admin/support"
                  className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-medium hover:bg-muted/40"
                >
                  Support tickets
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Go to user dashboard
                </Link>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">Total users</p>
              <p className="mt-2 text-2xl font-semibold">{totalUsers}</p>
              <p className="mt-1 text-xs text-muted-foreground">{newUsersInRange} joined in selected range</p>
            </div>
            <div className="rounded-3xl border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">Admins</p>
              <p className="mt-2 text-2xl font-semibold">{totalAdmins}</p>
              <p className="mt-1 text-xs text-muted-foreground">{suspendedUsers} suspended users</p>
            </div>
            <div className="rounded-3xl border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">Active paid subscribers</p>
              <p className="mt-2 text-2xl font-semibold">{activeSubscribers}</p>
              <p className="mt-1 text-xs text-muted-foreground">{activeRate} of total users</p>
            </div>
            <div className="rounded-3xl border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">Total audits</p>
              <p className="mt-2 text-2xl font-semibold">{totalAudits}</p>
              <p className="mt-1 text-xs text-muted-foreground">{auditsInRange} audits in selected range</p>
            </div>
            <div className="rounded-3xl border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">Completed payments</p>
              <p className="mt-2 text-2xl font-semibold">{completedPayments}</p>
              <p className="mt-1 text-xs text-muted-foreground">{failedPayments} failed payments</p>
            </div>
            <div className="rounded-3xl border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">Revenue (completed)</p>
              <p className="mt-2 text-2xl font-semibold">{formatMoney(totalRevenue)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatMoney(revenueInRange)} in selected range ({paymentsInRange} payments)</p>
            </div>
            <div className="rounded-3xl border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">Support queue</p>
              <p className="mt-2 text-2xl font-semibold">{supportOpen + supportInProgress}</p>
              <p className="mt-1 text-xs text-muted-foreground">{supportOpen} open · {supportInProgress} in progress · {supportResolved} resolved</p>
            </div>
            <div className="rounded-3xl border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">Email verification</p>
              <p className="mt-2 text-2xl font-semibold">{verifiedRate}</p>
              <p className="mt-1 text-xs text-muted-foreground">{verifiedUsers} verified users</p>
            </div>
          </section>

          <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl border border-primary/30 bg-primary/5 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">Scraper API calls</p>
              <p className="mt-2 text-2xl font-semibold">{scraperApiCallsInRange}</p>
              <p className="mt-1 text-xs text-muted-foreground">RapidAPI + Instagram scraper calls in selected range</p>
            </div>
            <div className="rounded-3xl border border-primary/30 bg-primary/5 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">OpenAI API calls</p>
              <p className="mt-2 text-2xl font-semibold">{openAiCallsInRange}</p>
              <p className="mt-1 text-xs text-muted-foreground">Scoring and AI tip generation calls</p>
            </div>
            <div className="rounded-3xl border border-primary/30 bg-primary/5 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">OpenAI estimated cost</p>
              <p className="mt-2 text-2xl font-semibold">{formatMoney(openAiEstimatedCostInRange)}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatMoney(financeSettings.openAiCostPerCall)} per call (manual input)
              </p>
            </div>
            <div className="rounded-3xl border border-primary/30 bg-primary/5 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">Infrastructure costs (monthly)</p>
              <p className="mt-2 text-2xl font-semibold">{formatMoney(fixedMonthlyCosts)}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Domain yearly + hosting monthly + scraper monthly
              </p>
            </div>
            <div className="rounded-3xl border border-primary/30 bg-primary/5 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">Processor fees</p>
              <p className="mt-2 text-2xl font-semibold">{formatMoney(processorFeesInRange)}</p>
              <p className="mt-1 text-xs text-muted-foreground">PayPal + 2Checkout fees from configured per-plan values</p>
            </div>
            <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">Net profit</p>
              <p className="mt-2 text-2xl font-semibold">{formatMoney(netProfitInRange)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Revenue - OpenAI - infra - processor fees</p>
            </div>
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
              <h2 className="text-xl font-semibold">Plan distribution</h2>
              <div className="mt-4 space-y-3">
                {(["free", "starter", "pro", "agency"] as const).map((plan) => {
                  const value = planCounts[plan]
                  const width = totalUsers ? Math.max(6, Math.round((value / totalUsers) * 100)) : 0
                  return (
                    <div key={plan}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="capitalize text-muted-foreground">{plan}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/60">
                        <div className="h-2 rounded-full bg-primary/80" style={{ width: `${width}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Past due: {pastDueSubscribers} · Canceled: {canceledSubscribers}
              </p>
            </div>

            <div className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
              <h2 className="text-xl font-semibold">Recent users</h2>
              <div className="mt-4 space-y-2">
                {recentUsers.map((u: any) => (
                  <div key={String(u._id)} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">{u.name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs capitalize text-muted-foreground">{u.subscriptionPlan ?? "free"}</p>
                      <p className="text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
              <h2 className="text-xl font-semibold">Conversion funnel (30 days)</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Signup to paid conversion flow based on tracked events.
              </p>

              <div className="mt-4 space-y-3">
                {funnelReport.steps.map((step) => {
                  const width = Math.max(6, Math.round((step.count / maxFunnel) * 100))
                  return (
                    <div key={step.eventName}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{step.label}</span>
                        <span className="font-medium">{step.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/60">
                        <div className="h-2 rounded-full bg-primary/80" style={{ width: `${width}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                Signup completion: {funnelReport.conversionRates.signupToVerified}% · Checkout completion:{" "}
                {funnelReport.conversionRates.checkoutReadyToCompleted}%
              </p>
            </div>

            <div className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
              <h2 className="text-xl font-semibold">Churn signals (30 days)</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Subscription cancellations and checkout abandonment trends.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-border/50 bg-background/40 p-3">
                  <p className="text-xs text-muted-foreground">Canceled</p>
                  <p className="mt-1 text-lg font-semibold">{churnReport.totals.canceled}</p>
                </div>
                <div className="rounded-2xl border border-border/50 bg-background/40 p-3">
                  <p className="text-xs text-muted-foreground">Abandoned checkout</p>
                  <p className="mt-1 text-lg font-semibold">{churnReport.totals.checkoutAbandoned}</p>
                </div>
                <div className="rounded-2xl border border-border/50 bg-background/40 p-3">
                  <p className="text-xs text-muted-foreground">Churn vs completed</p>
                  <p className="mt-1 text-lg font-semibold">{churnReport.totals.churnVsCompletedPct}%</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {churnReport.trend.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No churn events yet in this period.</p>
                ) : (
                  churnReport.trend.slice(-8).map((point) => (
                    <div
                      key={point.date}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 px-3 py-2"
                    >
                      <p className="text-xs text-muted-foreground">{point.date}</p>
                      <p className="text-xs text-muted-foreground">
                        canceled {point.canceled} · completed {point.checkoutCompleted} · abandoned {point.checkoutAbandoned}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
              <h2 className="text-xl font-semibold">Recent payments</h2>
              <div className="mt-4 space-y-2">
                {recentPayments.map((p: any) => (
                  <div key={String(p._id)} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium capitalize">{p.planSlug} · {p.billingCycle}</p>
                      <p className="text-xs text-muted-foreground capitalize">{p.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatMoney(Number(p.amount ?? 0))}</p>
                      <p className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
              <h2 className="text-xl font-semibold">Recent audits</h2>
              <div className="mt-4 space-y-2">
                {recentAudits.map((a: any) => (
                  <div key={String(a._id)} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">@{a.handle}</p>
                      <p className="text-xs text-muted-foreground capitalize">{a.planAtRun} plan</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
