import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { User, comparePassword } from "@/models/User"

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      )
    }

    await connectDB()

    const user = await User.findById(session.user.id).select("+password").lean() as any

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!user.password) {
      return NextResponse.json(
        { error: "Your account uses Google sign-in and does not have a password" },
        { status: 400 }
      )
    }

    const valid = await comparePassword(currentPassword, user.password)
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    // Save new password — the pre-save hook will hash it
    const userDoc = await User.findById(session.user.id)
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    userDoc.password = newPassword
    await userDoc.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[user/password PATCH]", error)
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
  }
}
