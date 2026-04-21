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

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/auth/signin?callbackUrl=/admin")
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard?denied=admin")
  }

  await connectDB()

  const now = new Date()
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [
    totalUsers,
    totalAdmins,
    suspendedUsers,
    verifiedUsers,
    newUsers7d,
    activeSubscribers,
    pastDueSubscribers,
    canceledSubscribers,
    totalAudits,
    audits7d,
    completedPayments,
    failedPayments,
    payments30dAgg,
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
  ] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ accountStatus: "suspended" }),
    User.countDocuments({ emailVerified: { $ne: null } }),
    User.countDocuments({ createdAt: { $gte: last7d } }),
    User.countDocuments({
      subscriptionStatus: "active",
      subscriptionPlan: { $in: ["starter", "pro", "agency"] },
    }),
    User.countDocuments({ subscriptionStatus: "past_due" }),
    User.countDocuments({ subscriptionStatus: "canceled" }),
    Audit.countDocuments({}),
    Audit.countDocuments({ createdAt: { $gte: last7d } }),
    Payment.countDocuments({ status: "completed" }),
    Payment.countDocuments({ status: "failed" }),
    Payment.aggregate([
      { $match: { status: "completed", createdAt: { $gte: last30d } } },
      { $group: { _id: null, totalRevenue30d: { $sum: "$amount" }, totalPayments30d: { $sum: 1 } } },
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
    getAdminFunnelReport(30),
    getAdminChurnReport(30),
    User.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .select("name email createdAt subscriptionPlan")
      .lean(),
    Payment.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .select("amount currency status planSlug billingCycle createdAt")
      .lean(),
    Audit.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .select("handle planAtRun createdAt")
      .lean(),
  ])

  const totalRevenue = Number(revenueAgg[0]?.totalRevenue ?? 0)
  const revenue30d = Number(payments30dAgg[0]?.totalRevenue30d ?? 0)
  const payments30d = Number(payments30dAgg[0]?.totalPayments30d ?? 0)
  const activeRate = pct(activeSubscribers, totalUsers)
  const verifiedRate = pct(verifiedUsers, totalUsers)
  const maxFunnel = Math.max(...funnelReport.steps.map((step) => step.count), 1)
  const planCounts = {
    free: Number(planMixAgg.find((p: any) => p._id === "free")?.count ?? 0),
    starter: Number(planMixAgg.find((p: any) => p._id === "starter")?.count ?? 0),
    pro: Number(planMixAgg.find((p: any) => p._id === "pro")?.count ?? 0),
    agency: Number(planMixAgg.find((p: any) => p._id === "agency")?.count ?? 0),
  }

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
              </div>

              <div className="flex items-center gap-2">
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
              <p className="mt-1 text-xs text-muted-foreground">{newUsers7d} joined in last 7 days</p>
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
              <p className="mt-1 text-xs text-muted-foreground">{audits7d} audits in last 7 days</p>
            </div>
            <div className="rounded-3xl border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">Completed payments</p>
              <p className="mt-2 text-2xl font-semibold">{completedPayments}</p>
              <p className="mt-1 text-xs text-muted-foreground">{failedPayments} failed payments</p>
            </div>
            <div className="rounded-3xl border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">Revenue (completed)</p>
              <p className="mt-2 text-2xl font-semibold">{formatMoney(totalRevenue)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatMoney(revenue30d)} in last 30 days ({payments30d} payments)</p>
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
