import mongoose from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser {
  _id: string
  email: string
  name: string
  role?: "user" | "admin"
  accountStatus?: "active" | "suspended"
  suspendedAt?: Date | null
  suspensionReason?: string | null
  password?: string
  googleId?: string | null
  image?: string | null
  emailVerified?: Date | null
  verificationToken?: string | null
  verificationTokenExpires?: Date | null
  resetPasswordToken?: string | null
  resetPasswordTokenExpires?: Date | null
  createdAt: Date
  updatedAt: Date

  selectedPlan?: "free" | "starter" | "pro" | "agency"
  selectedBilling?: "monthly" | "annual"

  subscriptionPlan?: "free" | "starter" | "pro" | "agency"
  subscriptionBilling?: "monthly" | "annual"
  subscriptionStatus?: "inactive" | "trialing" | "active" | "past_due" | "canceled"

  paymentProvider?: "paypal" | "2checkout" | null
  subscriptionCurrentPeriodEnd?: Date | null
  providerCustomerId: string | null,
  providerSubscriptionId?: string | null
  cancelAtPeriodEnd?: boolean
  gracePeriodEndsAt?: Date | null
  checkoutStatus?: "not_started" | "abandoned" | "completed"

  notificationPrefs?: {
    emailNotifications: boolean
    auditAlerts: boolean
    weeklyDigest: boolean
    productUpdates: boolean
  }
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    suspendedAt: {
      type: Date,
      default: null,
    },
    suspensionReason: {
      type: String,
      default: null,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      select: false,
      default: undefined,
    },
    googleId: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpires: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordTokenExpires: {
      type: Date,
      default: null,
    },
    selectedPlan: {
      type: String,
      enum: ["free", "starter", "pro", "agency"],
      default: "free",
    },
    selectedBilling: {
      type: String,
      enum: ["monthly", "annual"],
      default: "monthly",
    },
    subscriptionPlan: {
      type: String,
      enum: ["free", "starter", "pro", "agency"],
      default: "free",
    },
    subscriptionBilling: {
      type: String,
      enum: ["monthly", "annual"],
      default: "monthly",
    },
    subscriptionStatus: {
      type: String,
      enum: ["inactive", "trialing", "active", "past_due", "canceled"],
      default: "inactive",
    },
    checkoutStatus: {
      type: String,
      enum: ["not_started" , "abandoned" , "completed"],
      default: "not_started",
    },
    paymentProvider: {
      type: String,
      enum: ["paypal", "2checkout", null],
      default: null,
    },
    subscriptionCurrentPeriodEnd: {
      type: Date,
      default: null,
    },
    providerCustomerId:{
      type: String,
      default: null,
    } ,
    providerSubscriptionId:{
      type: String,
      default: null,
    } ,
    cancelAtPeriodEnd: { 
      type: Boolean,
    },
    gracePeriodEndsAt:{
      type: Date,
      default: null
    },
    notificationPrefs: {
      type: {
        emailNotifications: { type: Boolean, default: true },
        auditAlerts: { type: Boolean, default: true },
        weeklyDigest: { type: Boolean, default: false },
        productUpdates: { type: Boolean, default: true },
      },
      default: () => ({
        emailNotifications: true,
        auditAlerts: true,
        weeklyDigest: false,
        productUpdates: true,
      }),
    },
  },
  { timestamps: true }
)

UserSchema.index({ googleId: 1 }, { sparse: true })

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  if (!this.password) return next()

  this.password = await bcrypt.hash(this.password, 12)
  next()
})

export const User =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema)

export async function comparePassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(plain, hashed)
}