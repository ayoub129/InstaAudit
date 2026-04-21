import { connectDB } from "@/lib/mongodb";
import { AnalyticsEvent } from "@/models/AnalyticsEvent";
import { PipelineStage } from "mongoose";

type FunnelStep = {
  eventName: string;
  label: string;
  count: number;
};

type DailyTrendPoint = {
  date: string;
  canceled: number;
  checkoutCompleted: number;
  checkoutAbandoned: number;
};

export type AdminFunnelReport = {
  rangeDays: number;
  steps: FunnelStep[];
  conversionRates: {
    signupToVerified: number;
    checkoutReadyToCompleted: number;
  };
};

export type AdminChurnReport = {
  rangeDays: number;
  totals: {
    canceled: number;
    checkoutAbandoned: number;
    checkoutCompleted: number;
    churnVsCompletedPct: number;
  };
  trend: DailyTrendPoint[];
};

function toPct(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

export async function getAdminFunnelReport(
  rangeDays = 30,
): Promise<AdminFunnelReport> {
  await connectDB();
  const start = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000);

  const pipeline = [
    {
      $match: {
        occurredAt: { $gte: start },
        eventName: {
          $in: [
            "signup_submitted",
            "signup_completed",
            "checkout_setup_ready",
            "checkout_completed",
          ],
        },
      },
    },
    {
      $group: {
        _id: "$eventName",
        count: { $sum: 1 },
      },
    },
  ];

  const rows = (await AnalyticsEvent.aggregate(pipeline)) as Array<{
    _id: string;
    count: number;
  }>;

  const countMap = new Map(
    rows.map((row) => [row._id, Number(row.count ?? 0)]),
  );
  const steps: FunnelStep[] = [
    {
      eventName: "signup_submitted",
      label: "Signup Submitted",
      count: countMap.get("signup_submitted") ?? 0,
    },
    {
      eventName: "signup_completed",
      label: "Signup Completed",
      count: countMap.get("signup_completed") ?? 0,
    },
    {
      eventName: "checkout_setup_ready",
      label: "Checkout Ready",
      count: countMap.get("checkout_setup_ready") ?? 0,
    },
    {
      eventName: "checkout_completed",
      label: "Checkout Completed",
      count: countMap.get("checkout_completed") ?? 0,
    },
  ];

  return {
    rangeDays,
    steps,
    conversionRates: {
      signupToVerified: toPct(steps[1].count, steps[0].count),
      checkoutReadyToCompleted: toPct(steps[3].count, steps[2].count),
    },
  };
}

export async function getAdminChurnReport(
  rangeDays = 30,
): Promise<AdminChurnReport> {
  await connectDB();
  const start = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000);

  const totalsPipeline = [
    {
      $match: {
        occurredAt: { $gte: start },
        eventName: {
          $in: [
            "subscription_canceled",
            "checkout_abandoned",
            "checkout_completed",
          ],
        },
      },
    },
    {
      $group: {
        _id: "$eventName",
        count: { $sum: 1 },
      },
    },
  ];

  const trendPipeline = [
    {
      $match: {
        occurredAt: { $gte: start },
        eventName: {
          $in: [
            "subscription_canceled",
            "checkout_abandoned",
            "checkout_completed",
          ],
        },
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$occurredAt" } },
          eventName: "$eventName",
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.date": 1 } },
  ];

  const totalsRows = (await AnalyticsEvent.aggregate(totalsPipeline)) as Array<{
    _id: string;
    count: number;
  }>;
  const trendRows = (await AnalyticsEvent.aggregate(
    trendPipeline as PipelineStage[],
  )) as Array<{
    _id: { date: string; eventName: string };
    count: number;
  }>;

  const totalsMap = new Map(
    totalsRows.map((row) => [row._id, Number(row.count ?? 0)]),
  );
  const canceled = totalsMap.get("subscription_canceled") ?? 0;
  const checkoutAbandoned = totalsMap.get("checkout_abandoned") ?? 0;
  const checkoutCompleted = totalsMap.get("checkout_completed") ?? 0;

  const trendMap = new Map<string, DailyTrendPoint>();
  for (const row of trendRows) {
    const date = row._id.date;
    const eventName = row._id.eventName;
    const existing = trendMap.get(date) ?? {
      date,
      canceled: 0,
      checkoutCompleted: 0,
      checkoutAbandoned: 0,
    };

    if (eventName === "subscription_canceled")
      existing.canceled = Number(row.count ?? 0);
    if (eventName === "checkout_completed")
      existing.checkoutCompleted = Number(row.count ?? 0);
    if (eventName === "checkout_abandoned")
      existing.checkoutAbandoned = Number(row.count ?? 0);

    trendMap.set(date, existing);
  }

  return {
    rangeDays,
    totals: {
      canceled,
      checkoutAbandoned,
      checkoutCompleted,
      churnVsCompletedPct: toPct(canceled, checkoutCompleted),
    },
    trend: Array.from(trendMap.values()),
  };
}
