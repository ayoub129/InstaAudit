import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Instagram, TrendingUp, Users } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">Welcome to the InstaAudit admin panel</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,853</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,429</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audits Completed</CardTitle>
            <Instagram className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$48,294</div>
            <p className="text-xs text-muted-foreground">+6% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Overview of recent platform activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium">New Users Today</div>
                    <div className="text-2xl font-bold">42</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium">Audits Today</div>
                    <div className="text-2xl font-bold">128</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium">Active Users</div>
                    <div className="text-2xl font-bold">1,842</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium">Support Tickets</div>
                    <div className="text-2xl font-bold">12</div>
                  </div>
                </div>
                <div className="rounded-lg border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b bg-slate-50 transition-colors">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Action</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b transition-colors hover:bg-slate-50">
                          <td className="p-4 align-middle">john.doe@example.com</td>
                          <td className="p-4 align-middle">Completed Audit</td>
                          <td className="p-4 align-middle">May 22, 2025 14:30</td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Success
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-slate-50">
                          <td className="p-4 align-middle">sarah.smith@example.com</td>
                          <td className="p-4 align-middle">New Subscription</td>
                          <td className="p-4 align-middle">May 22, 2025 13:45</td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Success
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-slate-50">
                          <td className="p-4 align-middle">mike.johnson@example.com</td>
                          <td className="p-4 align-middle">Cancelled Subscription</td>
                          <td className="p-4 align-middle">May 22, 2025 12:15</td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                              Cancelled
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b transition-colors hover:bg-slate-50">
                          <td className="p-4 align-middle">emily.chen@example.com</td>
                          <td className="p-4 align-middle">New User</td>
                          <td className="p-4 align-middle">May 22, 2025 11:30</td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                              New
                            </span>
                          </td>
                        </tr>
                        <tr className="transition-colors hover:bg-slate-50">
                          <td className="p-4 align-middle">david.wilson@example.com</td>
                          <td className="p-4 align-middle">Support Request</td>
                          <td className="p-4 align-middle">May 22, 2025 10:45</td>
                          <td className="p-4 align-middle">
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                              Pending
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Distribution</CardTitle>
                <CardDescription>Breakdown of active subscriptions by plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-pink-500"></div>
                        <span className="text-sm font-medium">Pro Plan</span>
                      </div>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 w-[65%] rounded-full bg-pink-500"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium">Business Plan</span>
                      </div>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 w-[25%] rounded-full bg-blue-500"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                        <span className="text-sm font-medium">Free Plan</span>
                      </div>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 w-[10%] rounded-full bg-gray-500"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Audit Types</CardTitle>
                <CardDescription>Distribution of audit types performed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-pink-500"></div>
                        <span className="text-sm font-medium">Full Audit</span>
                      </div>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 w-[45%] rounded-full bg-pink-500"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm font-medium">Bio Audit</span>
                      </div>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 w-[30%] rounded-full bg-purple-500"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium">Content Audit</span>
                      </div>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 w-[25%] rounded-full bg-green-500"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly user growth over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-slate-50 flex items-center justify-center">
                <p className="text-muted-foreground">Chart placeholder</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>Monthly revenue over the past year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-slate-50 flex items-center justify-center">
                <p className="text-muted-foreground">Chart placeholder</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
              <CardDescription>Generate and download system reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">User Activity Report</h3>
                      <p className="text-sm text-muted-foreground">
                        Detailed report of user activity, logins, and audit completions
                      </p>
                    </div>
                    <button className="inline-flex items-center justify-center rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-pink-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                      Generate
                    </button>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Financial Report</h3>
                      <p className="text-sm text-muted-foreground">Revenue, subscriptions, and financial metrics</p>
                    </div>
                    <button className="inline-flex items-center justify-center rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-pink-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                      Generate
                    </button>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Audit Performance Report</h3>
                      <p className="text-sm text-muted-foreground">
                        Analysis of audit types, completion rates, and user satisfaction
                      </p>
                    </div>
                    <button className="inline-flex items-center justify-center rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-pink-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                      Generate
                    </button>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">System Performance Report</h3>
                      <p className="text-sm text-muted-foreground">Server metrics, response times, and system health</p>
                    </div>
                    <button className="inline-flex items-center justify-center rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-pink-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                      Generate
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
