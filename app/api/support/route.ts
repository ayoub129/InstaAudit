import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { SupportTicket } from "@/models/SupportTicket"
import { sendSupportTicketEmail } from "@/lib/email"

const VALID_CATEGORIES = ["billing", "audit", "account", "bug", "feature", "other"]

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { category, subject, message } = body

    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    if (!subject?.trim()) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 })
    }

    if (!message?.trim() || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      )
    }

    await connectDB()

    const ticket = await SupportTicket.create({
      userId: session.user.id,
      userName: session.user.name || "Unknown",
      userEmail: session.user.email || "",
      category,
      subject: subject.trim(),
      message: message.trim(),
    })

    // Send emails — don't block response if email fails
    try {
      await sendSupportTicketEmail({
        ticketId: ticket._id.toString(),
        userName: session.user.name || "Unknown",
        userEmail: session.user.email || "",
        category,
        subject: subject.trim(),
        message: message.trim(),
      })
    } catch (emailErr) {
      console.error("[support] Email failed (ticket still saved):", emailErr)
    }

    return NextResponse.json({
      success: true,
      ticketId: ticket._id.toString(),
      ticketRef: ticket._id.toString().slice(-6).toUpperCase(),
    })
  } catch (error) {
    console.error("[support POST]", error)
    return NextResponse.json({ error: "Failed to submit ticket" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const tickets = await SupportTicket.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("_id category subject status createdAt")
      .lean()

    return NextResponse.json({
      tickets: tickets.map((t: any) => ({
        id: t._id.toString(),
        ref: t._id.toString().slice(-6).toUpperCase(),
        category: t.category,
        subject: t.subject,
        status: t.status,
        createdAt: t.createdAt,
      })),
    })
  } catch (error) {
    console.error("[support GET]", error)
    return NextResponse.json({ error: "Failed to load tickets" }, { status: 500 })
  }
}
