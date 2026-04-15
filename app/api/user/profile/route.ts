import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import { ConnectedInstagramAccount } from "@/models/ConnectedInstagramAccount"
import { Audit } from "@/models/Audit"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const [user, instagram, auditCount] = await Promise.all([
      User.findById(session.user.id)
        .select("name email image createdAt googleId subscriptionPlan subscriptionStatus subscriptionBilling subscriptionCurrentPeriodEnd cancelAtPeriodEnd")
        .lean(),
      ConnectedInstagramAccount.findOne({ userId: session.user.id })
        .select("username accountType instagramUserId tokenExpiresAt createdAt")
        .lean(),
      Audit.countDocuments({ userId: session.user.id }),
    ])

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const u = user as any
    return NextResponse.json({
      user: {
        name: u.name,
        email: u.email,
        image: u.image ?? null,
        createdAt: u.createdAt,
        hasPassword: !u.googleId,
        subscriptionPlan: u.subscriptionPlan ?? "free",
        subscriptionStatus: u.subscriptionStatus ?? "inactive",
        subscriptionBilling: u.subscriptionBilling ?? "monthly",
        subscriptionCurrentPeriodEnd: u.subscriptionCurrentPeriodEnd ?? null,
        cancelAtPeriodEnd: u.cancelAtPeriodEnd ?? false,
      },
      instagram: instagram
        ? {
            username: (instagram as any).username,
            accountType: (instagram as any).accountType,
            instagramUserId: (instagram as any).instagramUserId,
            tokenExpiresAt: (instagram as any).tokenExpiresAt ?? null,
            connectedAt: (instagram as any).createdAt,
          }
        : null,
      auditCount,
    })
  } catch (error) {
    console.error("[user/profile GET]", error)
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, image } = body

    const update: Record<string, unknown> = {}

    if (typeof name === "string") {
      const trimmed = name.trim()
      if (!trimmed) {
        return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 })
      }
      update.name = trimmed
    }

    if (image !== undefined) {
      // Accept null (clear) or a string (URL or base64 data URL)
      if (image !== null && typeof image !== "string") {
        return NextResponse.json({ error: "Invalid image value" }, { status: 400 })
      }
      update.image = image
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
    }

    await connectDB()
    await User.findByIdAndUpdate(session.user.id, { $set: update })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[user/profile PATCH]", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
