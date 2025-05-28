import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Plus, MoreHorizontal } from "lucide-react"

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button className="bg-pink-500 hover:bg-pink-600">
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage all users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search users..." className="w-full bg-background pl-8" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">Filter</Button>
                <Button variant="outline">Export</Button>
              </div>
            </div>
            <div className="rounded-lg border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50 transition-colors">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Plan</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Joined</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b transition-colors hover:bg-slate-50">
                      <td className="p-4 align-middle font-medium">John Doe</td>
                      <td className="p-4 align-middle">john.doe@example.com</td>
                      <td className="p-4 align-middle">Pro</td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="p-4 align-middle">Jan 12, 2025</td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b transition-colors hover:bg-slate-50">
                      <td className="p-4 align-middle font-medium">Sarah Smith</td>
                      <td className="p-4 align-middle">sarah.smith@example.com</td>
                      <td className="p-4 align-middle">Business</td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="p-4 align-middle">Feb 3, 2025</td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b transition-colors hover:bg-slate-50">
                      <td className="p-4 align-middle font-medium">Mike Johnson</td>
                      <td className="p-4 align-middle">mike.johnson@example.com</td>
                      <td className="p-4 align-middle">Free</td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          Inactive
                        </span>
                      </td>
                      <td className="p-4 align-middle">Mar 15, 2025</td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b transition-colors hover:bg-slate-50">
                      <td className="p-4 align-middle font-medium">Emily Chen</td>
                      <td className="p-4 align-middle">emily.chen@example.com</td>
                      <td className="p-4 align-middle">Pro</td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="p-4 align-middle">Apr 8, 2025</td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b transition-colors hover:bg-slate-50">
                      <td className="p-4 align-middle font-medium">David Wilson</td>
                      <td className="p-4 align-middle">david.wilson@example.com</td>
                      <td className="p-4 align-middle">Business</td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="p-4 align-middle">May 1, 2025</td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </td>
                    </tr>
                    <tr className="transition-colors hover:bg-slate-50">
                      <td className="p-4 align-middle font-medium">Lisa Brown</td>
                      <td className="p-4 align-middle">lisa.brown@example.com</td>
                      <td className="p-4 align-middle">Pro</td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                          Pending
                        </span>
                      </td>
                      <td className="p-4 align-middle">May 10, 2025</td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing <strong>1-6</strong> of <strong>100</strong> users
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
