import mongoose, { Schema, model, models, Document } from "mongoose"

export interface IPricingPlan extends Document {
  slug: string
  name: string
  subtitle: string
  description?: string
  priceMonthly: number
  priceAnnual?: number
  ctaText: string
  ctaLink?: string
  badge?: string
  isPopular: boolean
  order: number
  note?: string
  features: string[]
  compare: {
    instagramAuditsPerMonth: string
    accounts: string
    aiScoreOutOf100: string
    profileAndContentBreakdown: string
    contentRecommendations: string
    sevenDayContentDirection: string
    positioningAndCtaSuggestions: string
    strategyInsights: string
    exportableReports: string
    multiAccountSupport: string
    teamCollaboration: string
    support: string
  }
  paypalProductId?: string | null
  paypalPlanIdMonthly?: string | null
  paypalPlanIdAnnual?: string | null
  createdAt: Date
  updatedAt: Date
}

const PricingSchema = new Schema<IPricingPlan>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    priceMonthly: {
      type: Number,
      required: true,
      min: 0,
    },
    priceAnnual: {
      type: Number,
      default: null,
    },
    ctaText: {
      type: String,
      required: true,
      trim: true,
    },
    ctaLink: {
      type: String,
      default: "",
      trim: true,
    },
    badge: {
      type: String,
      default: "",
      trim: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    paypalProductId: {
      type: String,
      default: null,
      trim: true,
    },
    paypalPlanIdMonthly: {
      type: String,
      default: null,
      trim: true,
    },
    paypalPlanIdAnnual: {
      type: String,
      default: null,
      trim: true,
    },
    compare: {
      instagramAuditsPerMonth: { type: String, default: "" },
      accounts: { type: String, default: "" },
      aiScoreOutOf100: { type: String, default: "" },
      profileAndContentBreakdown: { type: String, default: "" },
      contentRecommendations: { type: String, default: "" },
      sevenDayContentDirection: { type: String, default: "" },
      positioningAndCtaSuggestions: { type: String, default: "" },
      strategyInsights: { type: String, default: "" },
      exportableReports: { type: String, default: "" },
      multiAccountSupport: { type: String, default: "" },
      teamCollaboration: { type: String, default: "" },
      support: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
)

const Pricing = models.Pricing || model<IPricingPlan>("Pricing", PricingSchema)

export default Pricing