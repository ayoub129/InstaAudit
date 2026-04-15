import { NextResponse } from "next/server"
import crypto from "crypto"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import { sendVerificationEmail } from "@/lib/email"
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

    await connectDB()

    const existing = await User.findOne({ email })

    if (existing) {
      return NextResponse.json(
        {
          error: {
            email: ["An account with this email already exists."],
          },
        },
        { status: 409 }
      )
    }

    const verificationToken = crypto.randomBytes(32).toString("hex")
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const isFreePlan = selectedPlan === "free"

    const user = await User.create({
      name,
      email,
      password,
      emailVerified: null,
      verificationToken,
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
    })

    try {
      await sendVerificationEmail(user.email, user.name, verificationToken)
    } catch (emailError) {
      console.error("Send verification email failed:", emailError)

      await User.deleteOne({ _id: user._id })

      return NextResponse.json(
        {
          error:
            "We could not send the verification email. Please try signing up again in a moment.",
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message:
          "Account created successfully. Please check your email to verify your account before signing in.",
      },
      { status: 201 }
    )
  } catch (err) {
    console.error("Signup error:", err)

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}