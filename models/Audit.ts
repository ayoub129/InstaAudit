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
    postsAnalyzed: {
      type: Number,
      default: 0,
    },
    reelsAnalyzed: {
      type: Number,
      default: 0,
    },
    avgEngagementRate: {
      type: Number,
      default: 0,
    },
    engagementTrend: {
      type: String,
      enum: ["improving", "declining", "stable"],
      default: "stable",
    },
    postingFrequencyPerWeek: {
      type: Number,
      default: 0,
    },
    contentMix: {
      image: { type: Number, default: 0 },
      carousel: { type: Number, default: 0 },
      reel: { type: Number, default: 0 },
    },
    avgHashtagsPerPost: {
      type: Number,
      default: 0,
    },
    reelViewRate: {
      type: Number,
      default: 0,
    },
    followerFollowingRatio: {
      type: Number,
      default: 0,
    },
    moduleScores: {
      type: Schema.Types.Mixed,
      default: {},
    },
    dataSource: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
)

export const Audit = models.Audit || model("Audit", AuditSchema)