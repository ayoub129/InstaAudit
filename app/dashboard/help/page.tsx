"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  HelpCircle,
  Loader2,
  Mail,
  MessageSquare,
  Send,
  Tag,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const CATEGORIES = [
  { value: "billing", label: "Billing & subscription" },
  { value: "audit", label: "Audit & results" },
  { value: "account", label: "Account & profile" },
  { value: "bug", label: "Bug report" },
  { value: "feature", label: "Feature request" },
  { value: "other", label: "Other" },
]

const CATEGORY_COLORS: Record<string, string> = {
  billing: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  audit: "border-primary/30 bg-primary/10 text-primary",
  account: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  bug: "border-red-500/30 bg-red-500/10 text-red-400",
  feature: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  other: "border-border/60 bg-muted/40 text-muted-foreground",
}

const STATUS_COLORS: Record<string, string> = {
  open: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  in_progress: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  resolved: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  closed: "border-border/60 bg-muted/40 text-muted-foreground",
}

const FAQS = [
  {
    q: "How does the Instagram audit work?",
    a: "InstaAudit analyzes your public Instagram profile across multiple metrics — bio clarity, CTA effectiveness, caption quality, hashtag strategy, posting frequency, and engagement patterns. The result is a 0–100 score with specific tips for improvement.",
  },
  {
    q: "Why is my profile showing incorrect data?",
    a: "We fetch data from Instagram's public API. If your account is private, recently changed, or if Instagram is rate-limiting requests, results may be delayed or incomplete. Try auditing again after a few minutes.",
  },
  {
    q: "How do I connect my Instagram account?",
    a: "Instagram account connection is available on Starter and higher plans. Go to your Dashboard and click 'Connect Instagram'. This grants access to deeper metrics like engagement rate from the Graph API.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes. Go to Billing in the dashboard and click 'Cancel plan'. Your access continues until the end of your current billing period with no further charges.",
  },
  {
    q: "How long does support take to respond?",
    a: "We aim to respond to all tickets within 24 hours on business days. Billing issues are prioritized and typically resolved faster.",
  },
]

interface Ticket {
  id: string
  ref: string
  category: string
  subject: string
  status: string
  createdAt: string
}

export default function HelpPage() {
  const { data: session } = useSession()

  // Form state
  const [category, setCategory] = useState("other")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<{ ref: string } | null>(null)

  // Past tickets
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loadingTickets, setLoadingTickets] = useState(true)

  // FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/support")
      .then((r) => r.json())
      .then((d) => setTickets(d.tickets ?? []))
      .catch(() => {})
      .finally(() => setLoadingTickets(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, subject, message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSubmitted({ ref: data.ticketRef })
      setSubject("")
      setMessage("")
      setCategory("other")
      // Prepend to ticket list
      setTickets((prev) => [
        {
          id: data.ticketId,
          ref: data.ticketRef,
          category,
          subject: subject.trim(),
          status: "open",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ])
    } catch (e: any) {
      toast.error(e.message || "Failed to submit. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />

      <main className="ml-72 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">

          {/* ── Header ───────────────────────────────────────────────── */}
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <HelpCircle className="h-4 w-4 text-primary" />
              Help & Support
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              How can we help?
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Submit a ticket below and we'll get back to you within 24 hours.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_380px]">

            {/* ── Left: form + tickets ─────────────────────────────── */}
            <div className="space-y-5">

              {/* Contact form */}
              <div className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
                <div className="mb-5 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Send us a message</h2>
                    <p className="text-xs text-muted-foreground">
                      Logged in as {session?.user?.email}
                    </p>
                  </div>
                </div>

                {submitted ? (
                  <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 py-10 text-center">
                    <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                    <div>
                      <p className="font-semibold text-foreground">Message received!</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Ticket reference:{" "}
                        <span className="font-mono font-bold text-foreground">
                          #{submitted.ref}
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        A confirmation was sent to {session?.user?.email}. We'll reply within 24 hours.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 rounded-xl"
                      onClick={() => setSubmitted(null)}
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Category */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Category
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((c) => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => setCategory(c.value)}
                            className={cn(
                              "rounded-xl border px-3 py-1.5 text-xs font-medium transition-all",
                              category === c.value
                                ? CATEGORY_COLORS[c.value]
                                : "border-border/50 bg-background/60 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                            )}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        maxLength={120}
                        placeholder="Brief description of your issue…"
                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Message
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={5}
                        minLength={10}
                        placeholder="Describe your issue in detail. Include any error messages, steps to reproduce, or screenshots if relevant…"
                        className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <p className="mt-1 text-right text-[11px] text-muted-foreground">
                        {message.length} characters
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting || !subject.trim() || message.trim().length < 10}
                      className="rounded-xl gap-2 bg-gradient-to-r from-primary via-pink-500 to-orange-400 text-white hover:opacity-90 disabled:opacity-50"
                    >
                      {submitting ? (
                        <><Loader2 className="h-4 w-4 animate-spin" />Sending…</>
                      ) : (
                        <><Send className="h-4 w-4" />Send message</>
                      )}
                    </Button>
                  </form>
                )}
              </div>

              {/* Past tickets */}
              <div className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-foreground">Your tickets</h2>
                  {loadingTickets && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                </div>

                {!loadingTickets && tickets.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-background/40 py-8 text-center text-sm text-muted-foreground">
                    No tickets yet. Submit a message above if you need help.
                  </div>
                ) : (
                  <div className="divide-y divide-border/40">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="flex items-start justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[11px] text-muted-foreground">
                              #{ticket.ref}
                            </span>
                            <span
                              className={cn(
                                "rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize",
                                CATEGORY_COLORS[ticket.category]
                              )}
                            >
                              {ticket.category}
                            </span>
                          </div>
                          <p className="mt-1 truncate text-sm font-medium text-foreground">
                            {ticket.subject}
                          </p>
                          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                          </div>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold capitalize",
                            STATUS_COLORS[ticket.status]
                          )}
                        >
                          {ticket.status.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: direct contact + FAQ ──────────────────────── */}
            <div className="space-y-5">

              {/* Direct contact */}
              <div className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
                <h2 className="mb-4 text-base font-semibold text-foreground">Direct contact</h2>
                <div className="space-y-3">
                  <a
                    href="mailto:support@instaaudit.org"
                    className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/50 px-4 py-3.5 transition-colors hover:border-primary/30 hover:bg-primary/5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Email support</p>
                      <p className="text-xs text-muted-foreground">support@instaaudit.org</p>
                    </div>
                  </a>

                  <div className="rounded-2xl border border-border/50 bg-background/50 px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Response time</p>
                        <p className="text-xs text-muted-foreground">Within 24 hours · Mon–Fri</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <h2 className="text-base font-semibold text-foreground">FAQ</h2>
                </div>

                <div className="divide-y divide-border/40">
                  {FAQS.map((faq, i) => (
                    <div key={i} className="py-3 first:pt-0 last:pb-0">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="flex w-full items-start justify-between gap-3 text-left"
                      >
                        <p className="text-sm font-medium text-foreground">{faq.q}</p>
                        {openFaq === i ? (
                          <ChevronUp className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                      </button>
                      {openFaq === i && (
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.a}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
