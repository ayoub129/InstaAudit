import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import Payment from "@/models/Payment"
import Pricing from "@/models/Pricing"
import { getPayPalAccessToken, PAYPAL_BASE } from "@/lib/paypal"

type Plan = "free" | "starter" | "pro" | "agency"
type Billing = "monthly" | "annual"

interface UserDocLean {
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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const subscriptionId = body?.subscriptionId

    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, message: "Missing subscription ID." },
        { status: 400 }
      )
    }

    await connectDB()

    const user = await User.findOne({
      email: session.user.email.toLowerCase(),
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      )
    }

    const selectedPlan: Plan = user.selectedPlan || "free"
    const selectedBilling: Billing = user.selectedBilling || "monthly"

    if (selectedPlan === "free") {
      return NextResponse.json(
        { success: false, message: "Free plan does not require payment." },
        { status: 400 }
      )
    }

    const pricing = await Pricing.findOne({ slug: selectedPlan })
      .lean()
      .then((doc) => doc as PricingLean | null)

    if (!pricing) {
      return NextResponse.json(
        { success: false, message: "Pricing plan not found." },
        { status: 404 }
      )
    }

    const accessToken = await getPayPalAccessToken()

    const paypalRes = await fetch(
      `${PAYPAL_BASE}/v1/billing/subscriptions/${subscriptionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    )

    const paypalData = await paypalRes.json()

    if (!paypalRes.ok) {
      return NextResponse.json(
        {
          success: false,
          message: paypalData?.message || "Failed to verify PayPal subscription.",
        },
        { status: 400 }
      )
    }

    const validStatuses = ["ACTIVE", "APPROVAL_PENDING", "APPROVED"]
    if (!validStatuses.includes(paypalData.status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Unexpected PayPal subscription status: ${paypalData.status}`,
        },
        { status: 400 }
      )
    }

    const amount =
      selectedBilling === "annual"
        ? pricing.priceAnnual
        : pricing.priceMonthly

    const existingPayment = await Payment.findOne({
      provider: "paypal",
      providerSubscriptionId: subscriptionId,
    })

    if (!existingPayment) {
      await Payment.create({
        userId: user._id,
        planSlug: selectedPlan,
        billingCycle: selectedBilling,
        provider: "paypal",
        providerOrderId: null,
        providerSubscriptionId: subscriptionId,
        amount,
        currency: "USD",
        status: "completed",
        paymentType: "subscription",
        paidAt: new Date(),
        metadata: paypalData,
      })
    }

    user.subscriptionPlan = selectedPlan
    user.subscriptionBilling = selectedBilling
    user.subscriptionStatus = "active"
    user.paymentProvider = "paypal"
    user.providerSubscriptionId = subscriptionId
    user.subscriptionCurrentPeriodEnd =
      paypalData.billing_info?.next_billing_time
        ? new Date(paypalData.billing_info.next_billing_time)
        : null

    await user.save()

    return NextResponse.json({
      success: true,
      redirectTo: "/dashboard",
      message: "Subscription activated successfully.",
    })
  } catch (error) {
    console.error("subscription/activate error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to activate subscription." },
      { status: 500 }
    )
  }
}