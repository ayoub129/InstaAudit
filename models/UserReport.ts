import mongoose, { Schema, model, models } from "mongoose"

const UserReportSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reportType: {
      type: String,
      enum: ["monthly", "custom_30d", "custom_range"],
      required: true,
      index: true,
    },
    periodKey: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    summary: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
  },
  { timestamps: true },
)

UserReportSchema.index({ userId: 1, reportType: 1, periodKey: 1 }, { unique: true })

export const UserReport = models.UserReport || model("UserReport", UserReportSchema)
