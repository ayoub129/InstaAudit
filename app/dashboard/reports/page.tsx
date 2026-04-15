import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Calendar } from "lucide-react"

export default function ReportsPage() {
  const reports = [
    {
      id: 1,
      name: "Monthly Instagram Audit Report",
      date: "January 2025",
      profiles: 5,
    },
    {
      id: 2,
      name: "Quarterly Performance Analysis",
      date: "Q4 2024",
      profiles: 12,
    },
    {
      id: 3,
      name: "Content Strategy Deep Dive",
      date: "December 2024",
      profiles: 3,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <DashboardNav />
      <main className="ml-72 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-foreground/60">Download and review your audit reports</p>
        </div>

        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="border-border/40">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{report.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-foreground/60">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.date}
                      </span>
                      <span>{report.profiles} profiles analyzed</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
