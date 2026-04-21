"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, FileText, Calendar, RefreshCw } from "lucide-react";

type ReportItem = {
  id: string;
  reportType: "monthly" | "custom_30d" | "custom_range";
  periodKey: string;
  title: string;
  dateLabel: string;
  summary: {
    totalAudits: number;
    avgScore: number;
    bestScore: number;
    profilesAnalyzed: number;
  };
};

export function ReportsClient() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [creatingCustom, setCreatingCustom] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  async function loadReports() {
    setLoading(true);
    try {
      const res = await fetch("/api/reports/list", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load reports");
      const data = await res.json();
      setReports(data.reports ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function createLast30Days() {
    setCreating(true);
    try {
      const res = await fetch("/api/reports/generate-last-30d", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to generate report");
      await loadReports();
    } finally {
      setCreating(false);
    }
  }

  async function createCustomRange() {
    if (!startDate || !endDate) return;
    setCreatingCustom(true);
    try {
      const res = await fetch("/api/reports/generate-custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate }),
      });
      if (!res.ok) throw new Error("Failed to generate custom report");
      await loadReports();
    } finally {
      setCreatingCustom(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-end gap-2 rounded-xl border border-border/40 px-3 py-2">
          <div className="space-y-1">
            <p className="text-[11px] text-muted-foreground">Start</p>
            <Input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>
          <div className="space-y-1">
            <p className="text-[11px] text-muted-foreground">End</p>
            <Input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>
          <Button
            onClick={createCustomRange}
            disabled={creatingCustom || !startDate || !endDate}
          >
            {creatingCustom ? "Generating..." : "Create Custom Report"}
          </Button>
        </div>

        <Button
          onClick={createLast30Days}
          disabled={creating}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          {creating ? "Generating..." : "Create Last 30 Days Report"}
        </Button>
      </div>

      {loading ? (
        <Card className="border-border/40">
          <CardContent className="p-6 text-sm text-foreground/60">
            Loading reports...
          </CardContent>
        </Card>
      ) : reports.length === 0 ? (
        <Card className="border-border/40">
          <CardContent className="p-6 text-sm text-foreground/60">
            No report history yet. Run audits and your reports will appear here.
          </CardContent>
        </Card>
      ) : (
        reports.map((report) => (
          <Card key={report.id} className="border-border/40">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {report.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/60">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {report.dateLabel}
                    </span>
                    <span>
                      {report.summary.profilesAnalyzed} profiles analyzed
                    </span>
                    <span>{report.summary.totalAudits} audits run</span>
                    <span>Avg score: {report.summary.avgScore}/100</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                >
                  <a href={`/api/reports/${report.id}/download-csv`}>
                    <Download className="h-4 w-4" />
                    CSV
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                >
                  <a href={`/api/reports/${report.id}/download`}>
                    <Download className="h-4 w-4" />
                    PDF
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
