import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"

const DEFAULT_PREFS = {
  emailNotifications: true,
  auditAlerts: true,
  weeklyDigest: false,
  productUpdates: true,
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findById(session.user.id)
      .select("notificationPrefs")
      .lean() as any

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      prefs: user.notificationPrefs ?? DEFAULT_PREFS,
    })
  } catch (error) {
    console.error("[user/notifications GET]", error)
    return NextResponse.json({ error: "Failed to load preferences" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { emailNotifications, auditAlerts, weeklyDigest, productUpdates } = body

    const prefs: Record<string, boolean> = {}

    if (typeof emailNotifications === "boolean") prefs["notificationPrefs.emailNotifications"] = emailNotifications
    if (typeof auditAlerts === "boolean") prefs["notificationPrefs.auditAlerts"] = auditAlerts
    if (typeof weeklyDigest === "boolean") prefs["notificationPrefs.weeklyDigest"] = weeklyDigest
    if (typeof productUpdates === "boolean") prefs["notificationPrefs.productUpdates"] = productUpdates

    if (Object.keys(prefs).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
    }

    await connectDB()
    await User.findByIdAndUpdate(session.user.id, { $set: prefs })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[user/notifications PATCH]", error)
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 })
  }
}
