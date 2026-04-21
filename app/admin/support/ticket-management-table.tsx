"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

type TicketRow = {
  id: string
  subject: string
  category: string
  status: "open" | "in_progress" | "resolved" | "closed"
  userEmail: string
  createdAt: string
}

type Props = {
  tickets: TicketRow[]
}

function formatDate(date: string) {
  return new Date(date).toLocaleString()
}

function statusBadgeClass(status: TicketRow["status"]) {
  if (status === "open") return "border-red-500/40 bg-red-500/10 text-red-300"
  if (status === "in_progress") return "border-amber-500/40 bg-amber-500/10 text-amber-300"
  if (status === "resolved") return "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
  return "border-border/60 bg-muted/40 text-foreground"
}

function readable(value: string) {
  return value.replace("_", " ")
}

export function TicketManagementTable({ tickets }: Props) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const text = query.trim().toLowerCase()
      if (text) {
        const haystack = `${ticket.subject} ${ticket.userEmail} ${ticket.category}`.toLowerCase()
        if (!haystack.includes(text)) return false
      }

      if (statusFilter !== "all" && ticket.status !== statusFilter) return false
      return true
    })
  }, [tickets, query, statusFilter])

  async function updateStatus(ticketId: string, status: TicketRow["status"]) {
    setBusyId(ticketId)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch("/api/admin/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, status }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || "Failed to update ticket status.")
        return
      }

      setSuccess("Ticket status updated.")
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section className="mt-8 rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
      <h2 className="text-2xl font-semibold text-foreground">Latest tickets</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Filter and update ticket status directly from this table.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search subject, category, or email..."
          className="h-10 rounded-xl border border-border bg-background/70 px-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-xl border border-border bg-background/70 px-3 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-300">
          {success}
        </div>
      )}

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="text-muted-foreground">
            <tr className="border-b border-border">
              <th className="py-2 pr-3 font-medium">Subject</th>
              <th className="py-2 pr-3 font-medium">Category</th>
              <th className="py-2 pr-3 font-medium">Status</th>
              <th className="py-2 pr-3 font-medium">User</th>
              <th className="py-2 pr-3 font-medium">Created</th>
              <th className="py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => {
              const isBusy = busyId === ticket.id
              return (
                <tr key={ticket.id} className="border-b border-border/60 align-top">
                  <td className="py-2 pr-3">{ticket.subject}</td>
                  <td className="py-2 pr-3 capitalize">{ticket.category}</td>
                  <td className="py-2 pr-3">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${statusBadgeClass(
                        ticket.status,
                      )}`}
                    >
                      {readable(ticket.status)}
                    </span>
                  </td>
                  <td className="py-2 pr-3">{ticket.userEmail}</td>
                  <td className="py-2 pr-3">{formatDate(ticket.createdAt)}</td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-2">
                      {(["open", "in_progress", "resolved", "closed"] as const).map((status) => (
                        <button
                          key={status}
                          type="button"
                          disabled={isBusy || ticket.status === status}
                          onClick={() => updateStatus(ticket.id, status)}
                          className="rounded-lg border border-border px-2 py-1 text-xs capitalize hover:bg-muted/40 disabled:opacity-50"
                        >
                          {readable(status)}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
            {filteredTickets.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  No tickets match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
