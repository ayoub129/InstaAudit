import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { SupportTicket } from "@/models/SupportTicket"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { TicketManagementTable } from "./ticket-management-table"

type TicketRow = {
  _id: unknown
  subject: string
  category: string
  status: "open" | "in_progress" | "resolved" | "closed"
  userEmail: string
  createdAt: Date
}
type SerializedTicketRow = {
  id: string
  subject: string
  category: string
  status: "open" | "in_progress" | "resolved" | "closed"
  userEmail: string
  createdAt: string
}

export default async function AdminSupportPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/auth/signin?callbackUrl=/admin/support")
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard?denied=admin")
  }

  await connectDB()

  const [openCount, inProgressCount, resolvedCount, closedCount, tickets] =
    await Promise.all([
      SupportTicket.countDocuments({ status: "open" }),
      SupportTicket.countDocuments({ status: "in_progress" }),
      SupportTicket.countDocuments({ status: "resolved" }),
      SupportTicket.countDocuments({ status: "closed" }),
      SupportTicket.find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .select("subject category status userEmail createdAt")
        .lean()
        .then((rows) => rows as unknown as TicketRow[]),
    ])

  const serializedTickets: SerializedTicketRow[] = tickets.map((ticket) => ({
    id: String(ticket._id),
    subject: ticket.subject,
    category: ticket.category,
    status: ticket.status,
    userEmail: ticket.userEmail,
    createdAt: new Date(ticket.createdAt).toISOString(),
  }))

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />

      <main className="ml-72 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <section className="mb-8 rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-primary/80">Admin Support</p>
                <h1 className="mt-2 text-3xl font-semibold text-foreground">Support tickets</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Review and track support queue activity.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/admin"
                  className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-medium hover:bg-muted/40"
                >
                  Back to admin overview
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Go to user dashboard
                </Link>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">Open</p>
              <p className="mt-2 text-2xl font-semibold">{openCount}</p>
            </div>
            <div className="rounded-3xl border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">In progress</p>
              <p className="mt-2 text-2xl font-semibold">{inProgressCount}</p>
            </div>
            <div className="rounded-3xl border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="mt-2 text-2xl font-semibold">{resolvedCount}</p>
            </div>
            <div className="rounded-3xl border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-sm text-muted-foreground">Closed</p>
              <p className="mt-2 text-2xl font-semibold">{closedCount}</p>
            </div>
          </section>

          <TicketManagementTable tickets={serializedTickets} />
        </div>
      </main>
    </div>
  )
}
