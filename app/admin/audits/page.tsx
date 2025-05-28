import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, Eye } from "lucide-react"

export default function AdminAuditsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Audits</h2>
        <p className="text-muted-foreground">Monitor and manage Instagram audits</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Management</CardTitle>
          <CardDescription>View and manage all Instagram audits in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search audits..." className="w-full bg-background pl-8" />
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
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Instagram Handle
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b transition-colors hover:bg-slate-50">
                      <td className="p-4 align-middle font-medium">AUD-1001</td>
                      <td className="p-4 align-middle">john.doe@example.com</td>
                      <td className="p-4 align-middle">@johndoe</td>
                      <td className="p-4 align-middle">Full Audit</td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Completed
                        </span>
                      </td>
                      <td className="p-4 align-middle">May 22, 2025</td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b transition-colors hover:bg-slate-50">
                      <td className="p-4 align-middle font-medium">AUD-1002</td>
                      <td className="p-4 align-middle">sarah.smith@example.com</td>
                      <td className="p-4 align-middle">@sarahsmith</td>
                      <td className="p-4 align-middle">Bio Audit</td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Completed
                        </span>
                      </td>
                      <td className="p-4 align-middle">May 21, 2025</td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b transition-colors hover:bg-slate-50">
                      <td className="p-4 align-middle font-medium">AUD-1003</td>
                      <td className="p-4 align-middle">mike.johnson@example.com</td>
                      <td className="p-4 align-middle">@mikejohnson</td>
                      <td className="p-4 align-middle">Content Audit</td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          In Progress
                        </span>
                      </td>
                      <td className="p-4 align-middle">May 22, 2025</td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b transition-colors hover:bg-slate-50">
                      <td className="p-4 align-middle font-medium">AUD-1004</td>
                      <td className="p-4 align-middle">emily.chen@example.com</td>
                      <td className="p-4 align-middle">@emilychen</td>
                      <td className="p-4 align-middle">Full Audit</td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Completed
                        </span>
                      </td>
                      <td className="p-4 align-middle">May 20, 2025</td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b transition-colors hover:bg-slate-50">
                      <td className="p-4 align-middle font-medium">AUD-1005</td>
                      <td className="p-4 align-middle">david.wilson@example.com</td>
                      <td className="p-4 align-middle">@davidwilson</td>
                      <td className="p-4 align-middle">Bio Audit</td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          Failed
                        </span>
                      </td>
                      <td className="p-4 align-middle">May 19, 2025</td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="transition-colors hover:bg-slate-50">
                      <td className="p-4 align-middle font-medium">AUD-1006</td>
                      <td className="p-4 align-middle">lisa.brown@example.com</td>
                      <td className="p-4 align-middle">@lisabrown</td>
                      <td className="p-4 align-middle">Content Audit</td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                          Queued
                        </span>
                      </td>
                      <td className="p-4 align-middle">May 22, 2025</td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing <strong>1-6</strong> of <strong>120</strong> audits
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
