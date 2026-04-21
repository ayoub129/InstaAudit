import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdminApiSession } from "@/lib/auth/admin-guard"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"

const updateUserSchema = z.object({
  userId: z.string().trim().min(1),
  action: z.enum(["promote", "demote", "suspend", "unsuspend"]),
  reason: z.string().trim().max(300).optional(),
})

export async function PATCH(request: Request) {
  const guard = await requireAdminApiSession()
  if (!guard.ok) return guard.response

  try {
    const body = await request.json()
    const parsed = updateUserSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 })
    }

    await connectDB()

    const actorEmail = guard.session?.user?.email?.toLowerCase()
    const actor = await User.findOne({ email: actorEmail }).select("_id role")
    if (!actor || actor.role !== "admin") {
      return NextResponse.json({ error: "Admin account not found." }, { status: 403 })
    }

    const { userId, action, reason } = parsed.data
    const target = await User.findById(userId).select(
      "_id email role accountStatus suspendedAt suspensionReason",
    )

    if (!target) {
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }

    const isSelf = String(target._id) === String(actor._id)

    if ((action === "demote" || action === "suspend") && isSelf) {
      return NextResponse.json(
        { error: `You cannot ${action} your own account.` },
        { status: 400 },
      )
    }

    if (action === "demote" && target.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" })
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "You cannot demote the last admin." },
          { status: 400 },
        )
      }
    }

    const update: Record<string, unknown> = {}

    switch (action) {
      case "promote":
        update.role = "admin"
        break
      case "demote":
        update.role = "user"
        break
      case "suspend":
        update.accountStatus = "suspended"
        update.suspendedAt = new Date()
        update.suspensionReason = reason ?? null
        break
      case "unsuspend":
        update.accountStatus = "active"
        update.suspendedAt = null
        update.suspensionReason = null
        break
    }

    await User.updateOne({ _id: target._id }, { $set: update })

    const updated = await User.findById(target._id)
      .select("name email role accountStatus suspendedAt suspensionReason")
      .lean()

    return NextResponse.json({ success: true, user: updated })
  } catch (error) {
    console.error("admin users update error:", error)
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 })
  }
}
