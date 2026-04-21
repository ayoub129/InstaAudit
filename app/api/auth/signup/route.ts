import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import { sendVerificationEmail } from "@/lib/email"
import { generateSecureToken, hashToken } from "@/lib/security/tokens"
import { trackEvent } from "@/lib/analytics/track-event"
import { z } from "zod"

const PLAN_VALUES = ["free", "starter", "pro", "agency"] as const
const BILLING_VALUES = ["monthly", "annual"] as const

const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  selectedPlan: z.enum(PLAN_VALUES).optional().default("free"),
  selectedBilling: z.enum(BILLING_VALUES).optional().default("monthly"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = signupSchema.safeParse(body)

    if (!parsed.success) {
      await trackEvent({
        eventName: "signup_validation_failed",
        properties: {
          fields: Object.keys(parsed.error.flatten().fieldErrors),
        },
        request,
      })

      const fieldErrors = parsed.error.flatten().fieldErrors
      const normalized: Record<string, string[]> = {}

      for (const [key, val] of Object.entries(fieldErrors)) {
        if (val?.length) normalized[key] = val
      }

      return NextResponse.json({ error: normalized }, { status: 400 })
    }

    const name = parsed.data.name.trim()
    const email = parsed.data.email.trim().toLowerCase()
    const password = parsed.data.password
    const selectedPlan = parsed.data.selectedPlan
    const selectedBilling = parsed.data.selectedBilling

    await trackEvent({
      eventName: "signup_submitted",
      properties: { selectedPlan, selectedBilling },
      request,
    })

    await connectDB()

    const existing = await User.findOne({ email })

    if (existing) {
      await trackEvent({
        eventName: "signup_failed_existing_user",
        userId: String(existing._id),
        properties: { selectedPlan, selectedBilling },
        request,
      })

      return NextResponse.json(
        {
          error: {
            email: ["An account with this email already exists."],
          },
        },
        { status: 409 }
      )
    }

    const verificationToken = generateSecureToken()
    const verificationTokenHash = hashToken(verificationToken)
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const isFreePlan = selectedPlan === "free"

    const user = await User.create({
      name,
      email,
      role: "user",
      accountStatus: "active",
      password,
      emailVerified: null,
      verificationToken: verificationTokenHash,
      verificationTokenExpires,

      selectedPlan,
      selectedBilling,

      subscriptionPlan: isFreePlan ? "free" : "free",
      subscriptionBilling: isFreePlan ? "monthly" : "monthly",
      subscriptionStatus: isFreePlan ? "active" : "inactive",

      paymentProvider: null,
      providerCustomerId: null,
      providerSubscriptionId: null,
      subscriptionCurrentPeriodEnd: null,
      checkoutStatus: isFreePlan ? "completed" : "not_started",
    })

    try {
      await sendVerificationEmail(user.email, user.name, verificationToken)
    } catch (emailError) {
      console.error("Send verification email failed:", emailError)

      await User.deleteOne({ _id: user._id })

      await trackEvent({
        eventName: "signup_failed_verification_email",
        userId: String(user._id),
        properties: { selectedPlan, selectedBilling },
        request,
      })

      return NextResponse.json(
        {
          error:
            "We could not send the verification email. Please try signing up again in a moment.",
        },
        { status: 500 }
      )
    }

    await trackEvent({
      eventName: "signup_completed",
      userId: String(user._id),
      properties: { selectedPlan, selectedBilling },
      request,
    })

    return NextResponse.json(
      {
        message:
          "Account created successfully. Please check your email to verify your account before signing in.",
      },
      { status: 201 }
    )
  } catch (err) {
    console.error("Signup error:", err)

    await trackEvent({
      eventName: "signup_failed_unexpected",
      properties: {
        error:
          err instanceof Error
            ? err.message
            : "unknown_error",
      },
      request,
    })

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}