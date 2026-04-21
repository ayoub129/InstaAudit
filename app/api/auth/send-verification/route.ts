import { NextResponse } from "next/server"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import { sendVerificationEmail } from "@/lib/email"
import { generateSecureToken, hashToken } from "@/lib/security/tokens"

const resendSchema = z.object({
  email: z.string().trim().email("Valid email is required."),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = resendSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Valid email is required." },
        { status: 400 }
      )
    }

    const email = parsed.data.email.trim().toLowerCase()

    await connectDB()

    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email." },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json({
        message: "This email is already verified. You can sign in now.",
      })
    }

    const token = generateSecureToken()
    const tokenHash = hashToken(token)
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          verificationToken: tokenHash,
          verificationTokenExpires: expires,
        },
      }
    )

    await sendVerificationEmail(user.email, user.name, token)

    return NextResponse.json({
      message: "Verification email sent successfully.",
    })
  } catch (err) {
    console.error("Send verification error:", err)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}