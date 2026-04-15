import { NextResponse } from "next/server"
import crypto from "crypto"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import { sendPasswordResetEmail } from "@/lib/email"

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Valid email is required."),
})

const GENERIC_MESSAGE =
  "If an account exists with this email, you will receive a reset link."

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = forgotPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 }
      )
    }

    const email = parsed.data.email.trim().toLowerCase()

    await connectDB()

    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      return NextResponse.json({ message: GENERIC_MESSAGE }, { status: 200 })
    }

    // Google-only account: silently return success
    if (!user.password) {
      return NextResponse.json({ message: GENERIC_MESSAGE }, { status: 200 })
    }

    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 60 * 60 * 1000)

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: token,
          resetPasswordTokenExpires: expires,
        },
      }
    )

    try {
      await sendPasswordResetEmail(user.email, user.name, token)
    } catch (emailErr) {
      console.error("Send password reset email failed:", emailErr)

      return NextResponse.json(
        {
          error:
            "We could not send the reset email right now. Please try again in a moment.",
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: GENERIC_MESSAGE }, { status: 200 })
  } catch (err) {
    console.error("Forgot password error:", err)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}