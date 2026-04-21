"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TrendingUp,
  Eye,
  Gauge,
  Target,
  Hash,
  ArrowUpDown,
  Download,
} from "lucide-react";
import { AnalyticsInsights } from "./analytics-insights";
import type { UserReportsOverview } from "@/lib/analytics/get-user-reports-overview";
import { PostAuditCard } from "./post-audit-card";
import type { PlanKey } from "@/lib/plans/plan-config";

type AnalyticsPageClientProps = {
  initialData: UserReportsOverview;
  plan: PlanKey;
};

function toCsv(rows: Array<Record<string, string | number>>) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const raw = String(row[header] ?? "");
          const escaped = raw.replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(","),
    ),
  ];
  return lines.join("\n");
}

export function AnalyticsPageClient({
  initialData,
  plan,
}: AnalyticsPageClientProps) {
  const [data, setData] = useState<UserReportsOverview>(initialData);
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);

  async function applyFilters() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("days", String(days));
      if (handle.trim()) {
        params.set("handle", handle.trim().replace(/^@/, "").toLowerCase());
      }

      const res = await fetch(`/api/reports/overview?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const next = (await res.json()) as UserReportsOverview;
      setData(next);
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(
    () => [
      {
        label: "Total Audits",
        value: String(data.stats.totalAudits),
        helper: "Audits in selected range",
        icon: Eye,
      },
      {
        label: "Average Score",
        value: `${data.stats.avgScore}/100`,
        helper: "Overall average quality score",
        icon: TrendingUp,
      },
      {
        label: "Best Score",
        value: `${data.stats.bestScore}/100`,
        helper: "Top result in selected range",
        icon: Target,
      },
      {
        label: "Usage This Month",
        value: data.stats.isUnlimited
          ? `${data.stats.auditsThisMonth} / Unlimited`
          : `${data.stats.auditsThisMonth} / ${data.stats.planLimit}`,
        helper: "Current monthly usage",
        icon: Gauge,
      },
      {
        label: "Unique Handles",
        value: String(data.stats.uniqueHandles),
        helper: "Distinct profiles you audited",
        icon: Hash,
      },
      {
        label: "Score Change",
        value: `${data.stats.scoreDelta30d >= 0 ? "+" : ""}${data.stats.scoreDelta30d}`,
        helper: "First vs latest score in range",
        icon: ArrowUpDown,
      },
    ],
    [data],
  );

  function exportCsv() {
    const trendRows = data.trend.map((row) => ({
      type: "trend",
      date: row.date,
      handle: "",
      score: row.avgScore,
      audits: row.audits,
      source: "",
    }));
    const recentRows = data.recentAudits.map((row) => ({
      type: "recent_audit",
      date: new Date(row.date).toISOString().slice(0, 10),
      handle: row.handle,
      score: row.score,
      audits: "",
      source: row.source,
    }));
    const csv = toCsv([...trendRows, ...recentRows]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-${days}d${handle ? `-${handle.replace(/^@/, "")}` : ""}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-border/40 bg-card/50 p-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Date range</p>
          <div className="flex gap-2">
            {[7, 30, 90].map((value) => (
              <Button
                key={value}
                variant={days === value ? "default" : "outline"}
                size="sm"
                onClick={() => setDays(value as 7 | 30 | 90)}
              >
                {value}d
              </Button>
            ))}
          </div>
        </div>

        <div className="min-w-[220px] flex-1 space-y-1">
          <p className="text-xs text-muted-foreground">Handle filter</p>
          <Input
            value={handle}
            onChange={(event) => setHandle(event.target.value)}
            placeholder="@username"
          />
        </div>

        <Button onClick={applyFilters} disabled={loading}>
          {loading ? "Applying..." : "Apply filters"}
        </Button>
        <Button
          variant="outline"
          onClick={exportCsv}
          className="gap-2 bg-transparent"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border/40">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-foreground/70">
                    {stat.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </span>
                </div>
                <p className="mt-2 text-xs text-foreground/60">{stat.helper}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AnalyticsInsights
        trend={data.trend}
        scoreDistribution={data.scoreDistribution}
        sourceBreakdown={data.sourceBreakdown}
        weakMetrics={data.weakMetrics}
        topHandles={data.topHandles}
        recentAudits={data.recentAudits}
        engagementTimeline={data.engagementTimeline}
        contentMix={data.contentMix}
        moduleScoreBreakdown={data.moduleScoreBreakdown}
      />
      <PostAuditCard plan={plan} />
    </>
  );
}
