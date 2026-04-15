"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { MailCheck, X } from "lucide-react"

export function EmailVerificationBanner() {
  const { data: session, status } = useSession()
  const [dismissed, setDismissed] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  if (status !== "authenticated" || !session?.user) return null
  if (session.user.emailVerified) return null
  if (dismissed) return null

  const handleResend = async () => {
    setSending(true)
    try {
      const res = await fetch("/api/auth/send-verification", { method: "POST" })
      if (res.ok) setSent(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-amber-400/20 bg-amber-400/10 shadow-[0_10px_30px_rgba(251,191,36,0.08)]">
      <div className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300/15 text-amber-200">
            <MailCheck className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              {sent ? "Verification email sent" : "Verify your email address"}
            </p>
            <p className="mt-1 text-sm leading-6 text-white/70">
              {sent
                ? "Check your inbox and confirm your address to keep your account secure."
                : "Confirm your email to secure your account and keep your access fully protected."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!sent && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResend}
              disabled={sending}
              className="rounded-xl border-amber-300/30 bg-transparent text-white hover:bg-amber-300/10"
            >
              {sending ? "Sending..." : "Resend email"}
            </Button>
          )}

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="rounded-xl p-2 text-white/50 transition hover:bg-white/5 hover:text-white"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}