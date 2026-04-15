import { NextResponse } from "next/server"
import { z } from "zod"
import { connectDB } from "@/lib/mongodb"
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber"

const newsletterSchema = z.object({
  email: z.string().trim().email("Valid email is required."),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = newsletterSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      )
    }

    const email = parsed.data.email.trim().toLowerCase()

    await connectDB()

    const existing = await NewsletterSubscriber.findOne({ email })

    if (existing) {
      return NextResponse.json({
        message: "You’re already subscribed.",
      })
    }

    await NewsletterSubscriber.create({ email })

    return NextResponse.json({
      message: "Thanks for subscribing!",
    })
  } catch (err) {
    console.error("Newsletter subscribe error:", err)

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}