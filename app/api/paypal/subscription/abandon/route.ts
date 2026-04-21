import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import { trackEvent } from "@/lib/analytics/track-event"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      await trackEvent({
        eventName: "checkout_abandon_unauthorized",
        request,
      })
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({
      email: session.user.email.toLowerCase(),
    })

    if (!user) {
      await trackEvent({
        eventName: "checkout_abandon_user_not_found",
        request,
      })
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    if (user.subscriptionStatus !== "active") {
      user.checkoutStatus = "abandoned"
      user.subscriptionPlan = "free"
      user.subscriptionBilling = "monthly"
      user.subscriptionStatus = "inactive"
      await user.save()

      await trackEvent({
        eventName: "checkout_abandoned",
        userId: String(user._id),
        properties: {
          selectedPlan: user.selectedPlan ?? "free",
          selectedBilling: user.selectedBilling ?? "monthly",
        },
        request,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("abandon subscription error:", error)
    await trackEvent({
      eventName: "checkout_abandon_failed_unexpected",
      properties: {
        error: error instanceof Error ? error.message : "unknown_error",
      },
      request,
    })
    return NextResponse.json(
      { success: false, message: "Failed to update checkout state" },
      { status: 500 }
    )
  }
}