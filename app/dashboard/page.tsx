import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, Instagram, MessageSquare, ThumbsUp, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back, John!</h2>
          <p className="text-muted-foreground">Here's a summary of your Instagram audit results</p>
        </div>
        <Link href="/dashboard/audit">
          <Button className="bg-pink-500 hover:bg-pink-600">Start New Audit</Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bio Score</CardTitle>
            <Instagram className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78/100</div>
            <p className="text-xs text-muted-foreground">+5 from last audit</p>
            <div className="mt-4 h-1 w-full rounded-full bg-slate-100">
              <div className="h-1 w-[78%] rounded-full bg-pink-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6%</div>
            <p className="text-xs text-muted-foreground">+0.8% from last month</p>
            <div className="mt-4 h-1 w-full rounded-full bg-slate-100">
              <div className="h-1 w-[46%] rounded-full bg-pink-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Health</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85/100</div>
            <p className="text-xs text-muted-foreground">+12 from last audit</p>
            <div className="mt-4 h-1 w-full rounded-full bg-slate-100">
              <div className="h-1 w-[85%] rounded-full bg-pink-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Audits</CardTitle>
            <CardDescription>Your last 3 Instagram profile audits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Instagram className="h-5 w-5 text-slate-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">@johndoe</p>
                    <p className="text-sm text-muted-foreground">2 days ago</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Full Audit</p>
                </div>
                <Link href="/dashboard/reports/1">
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Instagram className="h-5 w-5 text-slate-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">@johndoe</p>
                    <p className="text-sm text-muted-foreground">1 week ago</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Bio Audit</p>
                </div>
                <Link href="/dashboard/reports/2">
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Instagram className="h-5 w-5 text-slate-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">@johndoe</p>
                    <p className="text-sm text-muted-foreground">2 weeks ago</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Content Audit</p>
                </div>
                <Link href="/dashboard/reports/3">
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Growth Insights</CardTitle>
            <CardDescription>Key metrics and trends for your Instagram account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Follower Growth</p>
                  <p className="text-sm text-muted-foreground">
                    You've gained 127 new followers in the last 30 days, a 12% increase from the previous period.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-100 p-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Comment Engagement</p>
                  <p className="text-sm text-muted-foreground">
                    Your comment rate has increased by 8%. Try responding to comments within 1 hour for better
                    engagement.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-amber-100 p-2">
                  <ThumbsUp className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Content Performance</p>
                  <p className="text-sm text-muted-foreground">
                    Your carousel posts are outperforming single images by 34%. Consider creating more carousel content.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
