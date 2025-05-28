"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BarChart3, Instagram, CreditCard, TrendingUp } from "lucide-react"

export default function AdminAnalyticsPage() {
  // Mock data for admin analytics
  const metrics = {
    users: 2345,
    audits: 12890,
    subscriptions: 432,
    revenue: 12450,
    growth: 8.2,
  }

  return (
    <div className="space-y-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Analytics</h1>
        <p className="text-muted-foreground">Overview of platform-wide metrics and trends</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.users.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+120 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audits Run</CardTitle>
            <Instagram className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.audits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+1,200 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.subscriptions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+30 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+${(metrics.revenue * 0.1).toLocaleString()} this month</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Growth Rate</CardTitle>
            <CardDescription>Month-over-month user growth</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-3xl font-bold">{metrics.growth}%</div>
                <p className="text-xs text-muted-foreground">Compared to last month</p>
              </div>
            </div>
            <div className="mt-6 h-2 w-full rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-pink-500" style={{ width: `${metrics.growth * 10}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform events</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>New user <span className="font-medium">@janedoe</span> signed up</li>
              <li>Audit run for <span className="font-medium">@brandx</span></li>
              <li>Subscription upgraded by <span className="font-medium">@johnsmith</span></li>
              <li>New user <span className="font-medium">@alex</span> signed up</li>
              <li>Audit run for <span className="font-medium">@influencer</span></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 