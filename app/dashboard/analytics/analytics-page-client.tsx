"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Eye,
  Gauge,
  Target,
  Hash,
  ArrowUpDown,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { AnalyticsInsights } from "./analytics-insights";
import type { UserReportsOverview } from "@/lib/analytics/get-user-reports-overview";
import { PostAuditCard } from "./post-audit-card";
import type { PlanKey } from "@/lib/plans/plan-config";

type AnalyticsPageClientProps = {
  initialData: UserReportsOverview;
  plan: PlanKey;
};

export function AnalyticsPageClient({
  initialData,
  plan,
}: AnalyticsPageClientProps) {
  const [data, setData] = useState<UserReportsOverview>(initialData);
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const latestHandle = initialData.recentAudits[0]?.handle?.toLowerCase() ?? "";
  const [selectedHandle, setSelectedHandle] = useState(latestHandle);
  const [handleDropdownOpen, setHandleDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasInitializedHandle, setHasInitializedHandle] = useState(false);

  const availableHandles = useMemo(() => {
    const handles = new Set<string>();
    for (const item of initialData.recentAudits) {
      if (item.handle) handles.add(item.handle.toLowerCase());
    }
    for (const item of initialData.topHandles) {
      if (item.handle) handles.add(item.handle.toLowerCase());
    }
    return Array.from(handles);
  }, [initialData.recentAudits, initialData.topHandles]);

  async function fetchAnalytics(nextDays: 7 | 30 | 90, nextHandle: string) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("days", String(nextDays));
      if (nextHandle) {
        params.set("handle", nextHandle);
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

  async function handleDateRangeChange(nextDays: 7 | 30 | 90) {
    setDays(nextDays);
    await fetchAnalytics(nextDays, selectedHandle);
  }

  async function handleSelectHandle(nextHandle: string) {
    const normalized = nextHandle.replace(/^@/, "").toLowerCase();
    setSelectedHandle(normalized);
    setHandleDropdownOpen(false);
    await fetchAnalytics(days, normalized);
  }

  useEffect(() => {
    if (hasInitializedHandle) return;
    if (!selectedHandle) {
      setHasInitializedHandle(true);
      return;
    }
    setHasInitializedHandle(true);
    void fetchAnalytics(days, selectedHandle);
  }, [days, hasInitializedHandle, selectedHandle]);

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
                className="hover:scale-100 active:scale-100"
                onClick={() => handleDateRangeChange(value as 7 | 30 | 90)}
                disabled={loading}
              >
                {value}d
              </Button>
            ))}
          </div>
        </div>

        <div className="min-w-[220px] flex-1 space-y-1">
          <p className="text-xs text-muted-foreground">Account</p>
          <Popover open={handleDropdownOpen} onOpenChange={setHandleDropdownOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={handleDropdownOpen}
                className="w-full justify-between bg-background hover:scale-100 active:scale-100"
                disabled={loading || availableHandles.length === 0}
              >
                {selectedHandle ? `@${selectedHandle}` : "Select account"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search handle..." />
                <CommandList>
                  <CommandEmpty>No handles found.</CommandEmpty>
                  <CommandGroup>
                    {availableHandles.map((handle) => (
                      <CommandItem key={handle} value={handle} onSelect={() => void handleSelectHandle(handle)}>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedHandle === handle ? "opacity-100" : "opacity-0",
                          )}
                        />
                        @{handle}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
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
