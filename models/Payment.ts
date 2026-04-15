import mongoose, { Schema, model, models, Document } from "mongoose"

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId
  planSlug: "free" | "starter" | "pro" | "agency"
  billingCycle: "monthly" | "annual"
  provider: "paypal" | "2checkout"
  providerOrderId?: string | null
  providerSubscriptionId?: string | null
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded" | "canceled"
  paymentType: "subscription" | "one_time"
  paidAt?: Date | null
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    planSlug: {
      type: String,
      enum: ["free", "starter", "pro", "agency"],
      required: true,
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "annual"],
      required: true,
    },
    provider: {
      type: String,
      enum: ["paypal", "2checkout"],
      required: true,
    },
    providerOrderId: {
      type: String,
      default: null,
      index: true,
    },
    providerSubscriptionId: {
      type: String,
      default: null,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded", "canceled"],
      default: "pending",
    },
    paymentType: {
      type: String,
      enum: ["subscription", "one_time"],
      default: "subscription",
    },
    paidAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
)

const Payment = models.Payment || model<IPayment>("Payment", PaymentSchema)

export default Payment