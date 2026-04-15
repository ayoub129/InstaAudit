import mongoose, { Schema, model, models } from "mongoose"

const ConnectedInstagramAccountSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    instagramUserId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["BUSINESS", "CREATOR", "PERSONAL", "UNKNOWN"],
      default: "UNKNOWN",
    },
    accessToken: {
      type: String,
      required: true,
    },
    tokenExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
)

export const ConnectedInstagramAccount =
  models.ConnectedInstagramAccount ||
  model("ConnectedInstagramAccount", ConnectedInstagramAccountSchema)