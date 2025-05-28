"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Download, FileText, BarChart2, PieChart, LineChart } from "lucide-react"
import { format } from "date-fns"

export default function ReportsPage() {
  const [date, setDate] = useState<Date>()
  const [reportType, setReportType] = useState("performance")
  const [timeRange, setTimeRange] = useState("30")

  const reportTypes = [
    {
      id: "performance",
      title: "Performance Report",
      description: "Detailed analysis of your Instagram performance metrics",
      icon: BarChart2
    },
    {
      id: "audience",
      title: "Audience Insights",
      description: "Comprehensive breakdown of your audience demographics",
      icon: PieChart
    },
    {
      id: "content",
      title: "Content Analysis",
      description: "Analysis of your content performance and engagement",
      icon: LineChart
    },
    {
      id: "competitor",
      title: "Competitor Analysis",
      description: "Compare your performance with competitors",
      icon: BarChart2
    }
  ]

  const timeRanges = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 90 days" },
    { value: "180", label: "Last 6 months" },
    { value: "365", label: "Last year" }
  ]

  const handleGenerateReport = () => {
    // Implement report generation logic here
    console.log("Generating report:", { reportType, timeRange, date })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Generate detailed reports about your Instagram performance</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Report Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
            <CardDescription>Configure your report settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        <span>{type.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  {timeRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Custom Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button
              className="w-full bg-pink-500 hover:bg-pink-600"
              onClick={handleGenerateReport}
            >
              Generate Report
            </Button>
          </CardContent>
        </Card>

        {/* Report Types */}
        <div className="space-y-4">
          {reportTypes.map((type) => (
            <Card key={type.id} className="cursor-pointer hover:bg-slate-50">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-pink-100 p-3">
                  <type.icon className="h-6 w-6 text-pink-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
                <Download className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Your recently generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: 1,
                type: "Performance Report",
                date: "2024-03-15",
                size: "2.4 MB"
              },
              {
                id: 2,
                type: "Audience Insights",
                date: "2024-03-10",
                size: "1.8 MB"
              },
              {
                id: 3,
                type: "Content Analysis",
                date: "2024-03-05",
                size: "3.2 MB"
              }
            ].map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-slate-100 p-2">
                    <FileText className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{report.type}</h4>
                    <p className="text-sm text-muted-foreground">
                      Generated on {new Date(report.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{report.size}</span>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 