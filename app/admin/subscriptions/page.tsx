"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, TrendingUp, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminSubscriptionsPage() {
  // Mock data for subscriptions
  const summary = {
    active: 432,
    newThisMonth: 30,
    churned: 5,
    revenue: 12450,
  }

  const subscriptions = [
    { id: 1, user: "@janedoe", plan: "Pro", status: "Active", start: "2024-03-01", renew: "2024-04-01", amount: 49 },
    { id: 2, user: "@johnsmith", plan: "Basic", status: "Active", start: "2024-02-15", renew: "2024-03-15", amount: 19 },
    { id: 3, user: "@alex", plan: "Pro", status: "Active", start: "2024-03-10", renew: "2024-04-10", amount: 49 },
    { id: 4, user: "@brandx", plan: "Enterprise", status: "Active", start: "2024-01-20", renew: "2024-04-20", amount: 199 },
    { id: 5, user: "@influencer", plan: "Basic", status: "Churned", start: "2023-12-01", renew: "-", amount: 19 },
  ]

  return (
    <div className="space-y-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Subscriptions</h1>
        <p className="text-muted-foreground">Manage and review all platform subscriptions</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.active.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">New subscriptions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churned</CardTitle>
            <User className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.churned}</div>
            <p className="text-xs text-muted-foreground">Lost this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Subscriptions</CardTitle>
          <CardDescription>Latest subscription activity</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left font-medium">User</th>
                <th className="px-4 py-2 text-left font-medium">Plan</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-left font-medium">Start</th>
                <th className="px-4 py-2 text-left font-medium">Renew</th>
                <th className="px-4 py-2 text-left font-medium">Amount</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="border-b last:border-0">
                  <td className="px-4 py-2 font-medium">{sub.user}</td>
                  <td className="px-4 py-2">{sub.plan}</td>
                  <td className={`px-4 py-2 ${sub.status === "Active" ? "text-green-600" : "text-red-500"}`}>{sub.status}</td>
                  <td className="px-4 py-2">{sub.start}</td>
                  <td className="px-4 py-2">{sub.renew}</td>
                  <td className="px-4 py-2">${sub.amount}</td>
                  <td className="px-4 py-2">
                    <Button size="sm" variant="outline">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
} 