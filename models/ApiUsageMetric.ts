import mongoose, { Schema, model, models } from "mongoose"

const ApiUsageMetricSchema = new Schema(
  {
    day: {
      type: String,
      required: true,
      index: true,
    },
    metricType: {
      type: String,
      enum: ["api_total", "openai_api", "scraper_api"],
      required: true,
      index: true,
    },
    endpoint: {
      type: String,
      default: "",
      index: true,
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
)

ApiUsageMetricSchema.index({ day: 1, metricType: 1, endpoint: 1 }, { unique: true })

export const ApiUsageMetric =
  models.ApiUsageMetric || model("ApiUsageMetric", ApiUsageMetricSchema)
