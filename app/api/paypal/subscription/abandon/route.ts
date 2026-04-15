import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({
      email: session.user.email.toLowerCase(),
    })

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    if (user.subscriptionStatus !== "active") {
      user.checkoutStatus = "abandoned"
      user.subscriptionPlan = "free"
      user.subscriptionBilling = "monthly"
      user.subscriptionStatus = "inactive"
      await user.save()
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("abandon subscription error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update checkout state" },
      { status: 500 }
    )
  }
}