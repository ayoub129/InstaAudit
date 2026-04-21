import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdminApiSession } from "@/lib/auth/admin-guard"
import { connectDB } from "@/lib/mongodb"
import { SupportTicket } from "@/models/SupportTicket"

const updateTicketSchema = z.object({
  ticketId: z.string().trim().min(1),
  status: z.enum(["open", "in_progress", "resolved", "closed"]),
})

export async function PATCH(request: Request) {
  const guard = await requireAdminApiSession()
  if (!guard.ok) return guard.response

  try {
    const body = await request.json()
    const parsed = updateTicketSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 })
    }

    await connectDB()

    const { ticketId, status } = parsed.data
    const ticket = await SupportTicket.findById(ticketId)

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found." }, { status: 404 })
    }

    ticket.status = status
    await ticket.save()

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket._id.toString(),
        status: ticket.status,
      },
    })
  } catch (error) {
    console.error("admin support update error:", error)
    return NextResponse.json({ error: "Failed to update ticket." }, { status: 500 })
  }
}
