import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import { hashToken } from "@/lib/security/tokens"
import { z } from "zod"

const resetPasswordSchema = z.object({
  token: z.string().trim().min(1, "Invalid or expired link."),
  password: z.string().min(8, "Password must be at least 8 characters."),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = resetPasswordSchema.safeParse(body)

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      const normalized: Record<string, string[]> = {}

      for (const [key, val] of Object.entries(fieldErrors)) {
        if (val?.length) normalized[key] = val
      }

      return NextResponse.json({ error: normalized }, { status: 400 })
    }

    const token = parsed.data.token.trim()
    const tokenHash = hashToken(token)
    const password = parsed.data.password

    await connectDB()

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordTokenExpires: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset link. Please request a new one." },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
        },
        $unset: {
          resetPasswordToken: 1,
          resetPasswordTokenExpires: 1,
        },
      }
    )

    return NextResponse.json({
      message: "Password updated. You can sign in now.",
    })
  } catch (err) {
    console.error("Reset password error:", err)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}