import mongoose from "mongoose"
import { connectDB } from "@/lib/mongodb"
import { AnalyticsEvent } from "@/models/AnalyticsEvent"

type EventProperties = Record<string, unknown>

type TrackEventInput = {
  eventName: string
  userId?: string | null
  properties?: EventProperties
  request?: Request
}

function normalizeUserId(userId?: string | null) {
  if (!userId) return null
  return mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : null
}

export async function trackEvent({
  eventName,
  userId,
  properties = {},
  request,
}: TrackEventInput) {
  try {
    await connectDB()

    await AnalyticsEvent.create({
      userId: normalizeUserId(userId),
      eventName,
      occurredAt: new Date(),
      properties,
      path: request ? new URL(request.url).pathname : null,
      method: request?.method ?? null,
      userAgent: request?.headers.get("user-agent") ?? null,
    })
  } catch (error) {
    console.error(`[analytics/track-event] Failed for "${eventName}":`, error)
  }
}
