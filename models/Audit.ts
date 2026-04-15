import mongoose, { Schema, model, models } from "mongoose"

const AuditSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    handle: {
      type: String,
      required: true,
      index: true,
    },
    planAtRun: {
      type: String,
      enum: ["free", "starter", "pro", "agency"],
      required: true,
    },
    auditType: {
      type: String,
      enum: ["basic", "full", "advanced"],
      required: true,
    },
    result: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
)

export const Audit = models.Audit || model("Audit", AuditSchema)