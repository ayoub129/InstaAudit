import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import { getPayPalAccessToken, PAYPAL_BASE } from "@/lib/paypal"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const reason = body?.reason || "Cancelled by user"

    await connectDB()

    const user = await User.findById(session.user.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.subscriptionStatus !== "active" && user.subscriptionStatus !== "trialing") {
      return NextResponse.json(
        { error: "No active subscription to cancel" },
        { status: 400 }
      )
    }

    const subscriptionId = user.providerSubscriptionId

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "No PayPal subscription ID found on your account" },
        { status: 400 }
      )
    }

    // Call PayPal to cancel the subscription
    const accessToken = await getPayPalAccessToken()

    const paypalRes = await fetch(
      `${PAYPAL_BASE}/v1/billing/subscriptions/${subscriptionId}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      }
    )

    // PayPal returns 204 No Content on success
    if (!paypalRes.ok && paypalRes.status !== 204) {
      let errMsg = "Failed to cancel subscription with PayPal"
      try {
        const errData = await paypalRes.json()
        errMsg = errData?.message || errMsg
      } catch {}
      console.error("[paypal/cancel] PayPal error:", paypalRes.status, errMsg)
      return NextResponse.json({ error: errMsg }, { status: 502 })
    }

    // Update user in DB: mark as canceled, keep access until period end
    user.subscriptionStatus = "canceled"
    user.cancelAtPeriodEnd = true
    await user.save()

    console.log(
      `[paypal/cancel] Subscription ${subscriptionId} canceled for user ${session.user.id}`
    )

    return NextResponse.json({
      success: true,
      message:
        "Your subscription has been canceled. You'll keep access until the end of your current billing period.",
      periodEnd: user.subscriptionCurrentPeriodEnd ?? null,
    })
  } catch (error) {
    console.error("[paypal/cancel] Unexpected error:", error)
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    )
  }
}
