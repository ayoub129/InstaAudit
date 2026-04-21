import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ReportsClient } from "./reports-client"

export default async function ReportsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/dashboard/reports")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <DashboardNav />
      <main className="ml-72 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-foreground/60">Download and review your audit reports</p>
        </div>

        <ReportsClient />
      </main>
    </div>
  )
}
