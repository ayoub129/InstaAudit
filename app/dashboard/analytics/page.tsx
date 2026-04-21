import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { authOptions } from "@/lib/auth"
import { getUserReportsOverview } from "@/lib/analytics/get-user-reports-overview"
import { AnalyticsPageClient } from "./analytics-page-client"
import { getUserPlan } from "@/lib/plans/get-user-plan"

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/dashboard/analytics")
  }

  const data = await getUserReportsOverview(session.user.id)
  const plan = getUserPlan(session.user)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <DashboardNav />
      <main className="ml-72 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-foreground/60">Track your Instagram audit metrics and trends</p>
        </div>

        <AnalyticsPageClient initialData={data} plan={plan} />
      </main>
    </div>
  )
}
