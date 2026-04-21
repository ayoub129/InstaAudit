"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type AnalyticsInsightsProps = {
  trend: Array<{ date: string; avgScore: number; audits: number }>
  scoreDistribution: Array<{ bucket: string; count: number }>
  sourceBreakdown: Array<{ source: "graph_api" | "scraper" | "unknown"; count: number }>
  weakMetrics: Array<{ key: string; avgScore: number; samples: number }>
  topHandles: Array<{ handle: string; audits: number; avgScore: number; bestScore: number }>
  recentAudits: Array<{ id: string; handle: string; score: number; date: string; source: "graph_api" | "scraper" | "unknown" }>
  engagementTimeline: Array<{ date: string; avgEngagementRate: number; audits: number }>
  contentMix: { image: number; carousel: number; reel: number }
  moduleScoreBreakdown: Array<{ module: string; avgScore: number; samples: number }>
}

const chartConfig = {
  avgScore: { label: "Avg score", color: "#a855f7" },
  count: { label: "Count", color: "#7c3aed" },
  graph_api: { label: "Graph API", color: "#10b981" },
  scraper: { label: "Scraper", color: "#3b82f6" },
  unknown: { label: "Unknown", color: "#6b7280" },
} as const

function prettyMetricKey(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function prettySource(source: "graph_api" | "scraper" | "unknown") {
  if (source === "graph_api") return "Graph API"
  if (source === "scraper") return "Scraper"
  return "Unknown"
}

export function AnalyticsInsights({
  trend,
  scoreDistribution,
  sourceBreakdown,
  weakMetrics,
  topHandles,
  recentAudits,
  engagementTimeline,
  contentMix,
  moduleScoreBreakdown,
}: AnalyticsInsightsProps) {
  const trendData = trend.map((point) => ({
    ...point,
    day: point.date.slice(5),
  }))
  const engagementData = engagementTimeline.map((point) => ({
    ...point,
    day: point.date.slice(5),
  }))
  const sourcePieData = sourceBreakdown.map((item) => ({
    ...item,
    name: prettySource(item.source),
  }))
  const contentMixData = [
    { type: "Image", value: contentMix.image },
    { type: "Carousel", value: contentMix.carousel },
    { type: "Reel", value: contentMix.reel },
  ]

  return (
    <div className="mt-8 space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Score Trend (30 Days)</CardTitle>
            <CardDescription>Average score by day</CardDescription>
          </CardHeader>
          <CardContent>
            {trendData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No trend data available yet.</p>
            ) : (
              <ChartContainer config={chartConfig} className="h-[260px] w-full">
                <LineChart data={trendData} margin={{ left: 8, right: 8, top: 8 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent labelFormatter={(label) => `Date: ${label}`} />}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgScore"
                    stroke="var(--color-avgScore)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-avgScore)" }}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>How your audits are spread by quality band</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <BarChart data={scoreDistribution} margin={{ left: 8, right: 8, top: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="bucket" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Engagement Timeline</CardTitle>
            <CardDescription>Average engagement rate trend by day</CardDescription>
          </CardHeader>
          <CardContent>
            {engagementData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No engagement timeline data yet.</p>
            ) : (
              <ChartContainer config={chartConfig} className="h-[260px] w-full">
                <LineChart data={engagementData} margin={{ left: 8, right: 8, top: 8 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent labelFormatter={(label) => `Date: ${label}`} />}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgEngagementRate"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: "#22c55e" }}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Audit Source Split</CardTitle>
            <CardDescription>Where your audit data came from</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Pie data={sourcePieData} dataKey="count" nameKey="name" innerRadius={60} outerRadius={95}>
                  {sourcePieData.map((entry) => (
                    <Cell key={entry.source} fill={`var(--color-${entry.source})`} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Content Mix</CardTitle>
            <CardDescription>Average content type distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[260px] w-full">
              <BarChart data={contentMixData} margin={{ left: 8, right: 8, top: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="type" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-count)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Per-Module Score Breakdown</CardTitle>
            <CardDescription>Average score by module across audits</CardDescription>
          </CardHeader>
          <CardContent>
            {moduleScoreBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground">No module data yet.</p>
            ) : (
              <div className="space-y-3">
                {moduleScoreBreakdown.slice(0, 8).map((item) => (
                  <div key={item.module}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-foreground/70">{prettyMetricKey(item.module)}</span>
                      <span className="text-foreground/70">
                        {item.avgScore}/100 ({item.samples})
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${Math.max(4, Math.min(item.avgScore, 100))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Weakest Metrics</CardTitle>
            <CardDescription>Lowest average scoring audit categories</CardDescription>
          </CardHeader>
          <CardContent>
            {weakMetrics.length === 0 ? (
              <p className="text-sm text-muted-foreground">No metric-level data yet.</p>
            ) : (
              <div className="space-y-3">
                {weakMetrics.map((metric) => (
                  <div key={metric.key}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-foreground/70">{prettyMetricKey(metric.key)}</span>
                      <span className="text-foreground/70">
                        {metric.avgScore}/100 ({metric.samples})
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${Math.max(4, Math.min(metric.avgScore, 100))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Top Handles</CardTitle>
            <CardDescription>Your most-audited Instagram profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {topHandles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No handle data yet.</p>
            ) : (
              topHandles.map((item) => (
                <div key={item.handle} className="flex items-center justify-between rounded-xl border border-border/50 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">@{item.handle}</p>
                    <p className="text-xs text-muted-foreground">{item.audits} audits</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>Avg {item.avgScore}/100</p>
                    <p>Best {item.bestScore}/100</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle>Recent Audits</CardTitle>
            <CardDescription>Latest score snapshots</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentAudits.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent audits yet.</p>
            ) : (
              recentAudits.map((audit) => (
                <div key={audit.id} className="flex items-center justify-between rounded-xl border border-border/50 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">@{audit.handle}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(audit.date).toLocaleDateString()} - {prettySource(audit.source)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">{audit.score}/100</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
