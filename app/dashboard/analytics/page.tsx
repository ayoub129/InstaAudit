import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Eye, Heart } from "lucide-react"

export default function AnalyticsPage() {
  const stats = [
    {
      label: "Total Audits",
      value: "24",
      change: "+12%",
      icon: Eye,
    },
    {
      label: "Avg Score",
      value: "76.5",
      change: "+4.2%",
      icon: TrendingUp,
    },
    {
      label: "Followers Tracked",
      value: "8,240",
      change: "+18%",
      icon: Users,
    },
    {
      label: "Engagement Rate",
      value: "3.8%",
      change: "+0.5%",
      icon: Heart,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <DashboardNav />
      <main className="ml-72 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-foreground/60">Track your Instagram audit metrics and trends</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="border-border/40">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-foreground/70">{stat.label}</CardTitle>
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                    <span className="text-xs font-medium text-green-500">{stat.change}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mt-8 border-border/40">
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
            <CardDescription>Your audit scores trend for the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center text-foreground/50">
              <p>Chart visualization coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
