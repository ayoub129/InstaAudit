import mongoose, { Schema, model, models } from "mongoose"

const AnalyticsEventSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
    eventName: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    occurredAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    properties: {
      type: Schema.Types.Mixed,
      default: {},
    },
    path: {
      type: String,
      default: null,
    },
    method: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
)

AnalyticsEventSchema.index({ eventName: 1, occurredAt: -1 })
AnalyticsEventSchema.index({ userId: 1, occurredAt: -1 })

export const AnalyticsEvent =
  models.AnalyticsEvent || model("AnalyticsEvent", AnalyticsEventSchema)
