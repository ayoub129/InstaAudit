import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import Pricing from "@/models/Pricing"
import { trackEvent } from "@/lib/analytics/track-event"

type Plan = "free" | "starter" | "pro" | "agency"
type Billing = "monthly" | "annual"

interface UserLean {
  _id: string
  email: string
  selectedPlan?: Plan
  selectedBilling?: Billing
}

interface PricingLean {
  _id: string
  slug: Plan
  name: string
  subtitle: string
  priceMonthly: number
  priceAnnual?: number | null
  paypalPlanIdMonthly?: string | null
  paypalPlanIdAnnual?: string | null
  features: string[]
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      await trackEvent({
        eventName: "checkout_setup_unauthorized",
      })
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      )
    }

    await connectDB()

    const user = await User.findOne({
        email: session.user.email.toLowerCase(),
      })
        .lean()
        .then((doc) => doc as UserLean | null)

    if (!user) {
      await trackEvent({
        eventName: "checkout_setup_user_not_found",
      })
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      )
    }

    const selectedPlan = user.selectedPlan || "free"
    const selectedBilling = user.selectedBilling || "monthly"

    if (selectedPlan === "free") {
      await trackEvent({
        eventName: "checkout_setup_free_plan",
        userId: String(user._id),
        properties: { selectedPlan, selectedBilling },
      })
      return NextResponse.json({
        success: true,
        plan: {
          slug: "free",
          name: "Free Audit",
          billing: "monthly",
          price: 0,
          currency: "USD",
          paypalPlanId: "",
          features: [],
        },
      })
    }

    const pricing = await Pricing.findOne({ slug: selectedPlan })
  .lean()
  .then((doc) => doc as PricingLean | null)

    if (!pricing) {
      await trackEvent({
        eventName: "checkout_setup_pricing_missing",
        userId: String(user._id),
        properties: { selectedPlan, selectedBilling },
      })
      return NextResponse.json(
        { success: false, message: "Pricing plan not found." },
        { status: 404 }
      )
    }

    const paypalPlanId =
      selectedBilling === "annual"
        ? pricing.paypalPlanIdAnnual
        : pricing.paypalPlanIdMonthly

    const price =
      selectedBilling === "annual"
        ? pricing.priceAnnual
        : pricing.priceMonthly

    if (!paypalPlanId) {
      await trackEvent({
        eventName: "checkout_setup_paypal_config_missing",
        userId: String(user._id),
        properties: { selectedPlan, selectedBilling },
      })
      return NextResponse.json(
        { success: false, message: "Missing PayPal plan configuration." },
        { status: 400 }
      )
    }

    await trackEvent({
      eventName: "checkout_setup_ready",
      userId: String(user._id),
      properties: {
        selectedPlan,
        selectedBilling,
        paypalPlanId,
      },
    })

    return NextResponse.json({
      success: true,
      plan: {
        slug: pricing.slug,
        name: pricing.name,
        subtitle: pricing.subtitle,
        billing: selectedBilling,
        price,
        currency: "USD",
        paypalPlanId,
        features: pricing.features || [],
      },
    })
  } catch (error) {
    console.error("subscription/setup error:", error)
    await trackEvent({
      eventName: "checkout_setup_failed_unexpected",
      properties: {
        error: error instanceof Error ? error.message : "unknown_error",
      },
    })
    return NextResponse.json(
      { success: false, message: "Failed to prepare checkout." },
      { status: 500 }
    )
  }
}