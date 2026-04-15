import mongoose, { Schema, model, models } from "mongoose"

const SupportTicketSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    category: {
      type: String,
      enum: ["billing", "audit", "account", "bug", "feature", "other"],
      required: true,
    },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
)

export const SupportTicket =
  models.SupportTicket || model("SupportTicket", SupportTicketSchema)
