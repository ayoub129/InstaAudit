import { Schema, model, models, type Model, type InferSchemaType } from "mongoose"

const AuditUsageSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    periodKey: {
      type: String,
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ["free", "starter", "pro", "agency"],
      required: true,
    },
    auditsUsed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

AuditUsageSchema.index({ userId: 1, periodKey: 1 }, { unique: true })

export type AuditUsageDocument = InferSchemaType<typeof AuditUsageSchema>

export const AuditUsage =
  (models.AuditUsage as Model<AuditUsageDocument>) ||
  model<AuditUsageDocument>("AuditUsage", AuditUsageSchema)