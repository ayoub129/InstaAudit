import { Schema, model, models } from "mongoose"

const feeConfig = {
  starterMonthly: { type: Number, default: 0, min: 0 },
  starterAnnual: { type: Number, default: 0, min: 0 },
  proMonthly: { type: Number, default: 0, min: 0 },
  proAnnual: { type: Number, default: 0, min: 0 },
  agencyMonthly: { type: Number, default: 0, min: 0 },
  agencyAnnual: { type: Number, default: 0, min: 0 },
}

const AdminFinanceSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    domainYearlyCost: { type: Number, default: 0, min: 0 },
    hostingMonthlyCost: { type: Number, default: 0, min: 0 },
    scraperMonthlyCost: { type: Number, default: 0, min: 0 },
    openAiCostPerCall: { type: Number, default: 0, min: 0 },
    paypalFees: { type: feeConfig, default: () => ({}) },
    twoCheckoutFees: { type: feeConfig, default: () => ({}) },
  },
  { timestamps: true },
)

export const AdminFinanceSettings =
  models.AdminFinanceSettings || model("AdminFinanceSettings", AdminFinanceSettingsSchema)
