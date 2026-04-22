import { connectDB } from "@/lib/mongodb"
import { ApiUsageMetric } from "@/models/ApiUsageMetric"

function dayKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

export async function trackApiCall(endpoint: string) {
  await connectDB()
  await ApiUsageMetric.updateOne(
    { day: dayKey(), metricType: "api_total", endpoint },
    { $inc: { count: 1 } },
    { upsert: true },
  )
}

export async function trackScraperApiCall(endpoint: string) {
  await connectDB()
  await ApiUsageMetric.updateOne(
    { day: dayKey(), metricType: "scraper_api", endpoint },
    { $inc: { count: 1 } },
    { upsert: true },
  )
}

export async function trackOpenAiApiCall(modelName: string) {
  await connectDB()
  await ApiUsageMetric.updateOne(
    { day: dayKey(), metricType: "openai_api", endpoint: modelName || "unknown-model" },
    { $inc: { count: 1 } },
    { upsert: true },
  )
}
