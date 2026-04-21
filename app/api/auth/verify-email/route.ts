import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import { hashToken } from "@/lib/security/tokens"

function getRedirectUrl(path: string, request: Request) {
  try {
    const base = new URL(request.url).origin
    return `${base}${path}`
  } catch {
    return `${process.env.NEXTAUTH_URL || "http://localhost:3000"}${path}`
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")?.trim()

  if (!token) {
    return NextResponse.redirect(
      getRedirectUrl("/auth/verify-email?error=missing", request)
    )
  }

  const tokenHash = hashToken(token)

  try {
    await connectDB()

    const user = await User.findOne({
      verificationToken: tokenHash,
      verificationTokenExpires: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.redirect(
        getRedirectUrl("/auth/verify-email?error=invalid", request)
      )
    }

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          emailVerified: new Date(),
        },
        $unset: {
          verificationToken: 1,
          verificationTokenExpires: 1,
        },
      }
    )

    return NextResponse.redirect(
      getRedirectUrl("/auth/signin?verified=1", request)
    )
  } catch (err) {
    console.error("Verify email error:", err)

    return NextResponse.redirect(
      getRedirectUrl("/auth/verify-email?error=invalid", request)
    )
  }
}