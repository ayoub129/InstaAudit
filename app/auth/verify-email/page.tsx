"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertCircle, CheckCircle2, Mail, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const [email, setEmail] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState<string | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)

  const isMissing = error === "missing"
  const isInvalid = error === "invalid"
  const isDefault = !error

  const handleResend = async () => {
    setSendError(null)
    setSendSuccess(null)

    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      setSendError("Please enter your email address.")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setSendError("Please enter a valid email address.")
      return
    }

    setIsSending(true)

    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      })

      const data = await res.json()

      if (!res.ok) {
        setSendError(data.error || "Could not resend verification email.")
        return
      }

      setSendSuccess(data.message || "Verification email sent successfully.")
    } catch {
      setSendError("Something went wrong. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(120,119,198,0.12),_transparent_35%),linear-gradient(to_bottom_right,var(--background),var(--background),rgba(99,102,241,0.04))] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full items-stretch gap-8 lg:grid-cols-2">
          <div className="hidden rounded-3xl border border-border/50 bg-background/40 p-8 backdrop-blur lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
                <span className="text-2xl font-bold text-primary-foreground">I</span>
              </div>

              <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-primary/80">
                InstaAudit
              </p>

              <h1 className="max-w-md text-4xl font-semibold leading-tight text-foreground">
                Verify your email and complete your account setup.
              </h1>

              <p className="mt-4 max-w-md text-base leading-7 text-foreground/65">
                We use email verification to protect accounts and keep your sign-in flow secure.
              </p>
            </div>

          </div>

          <div className="mx-auto flex w-full max-w-md items-center">
            <Card className="w-full rounded-3xl border-border/60 bg-background/75 shadow-2xl backdrop-blur">
              <CardHeader className="space-y-3 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent lg:hidden">
                  <span className="text-xl font-bold text-primary-foreground">I</span>
                </div>

                <div>
                  <CardTitle className="text-3xl font-semibold tracking-tight">
                    {isMissing && "Link required"}
                    {isInvalid && "Invalid or expired link"}
                    {isDefault && "Verify your email"}
                  </CardTitle>

                  <CardDescription className="mt-2 text-sm leading-6">
                    {isMissing &&
                      "Open the verification link from your email, or request a new one below."}
                    {isInvalid &&
                      "This verification link is invalid or expired. Enter your email below and we’ll send you a fresh link."}
                    {isDefault &&
                      "We sent a verification link to your email. Click the link in your inbox to verify your address."}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                {isDefault && (
                  <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                      After verification, you’ll be able to sign in with your email and password.
                    </p>
                  </div>
                )}

                {(isMissing || isInvalid) && (
                  <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                      {isMissing
                        ? "No verification token was found in the URL."
                        : "The verification link is no longer valid."}
                    </p>
                  </div>
                )}

                {(isMissing || isInvalid) && (
                  <div className="space-y-4 rounded-2xl border border-border/60 bg-background/40 p-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setSendError(null)
                          setSendSuccess(null)
                        }}
                        className="h-11 rounded-xl border-border/60 bg-background/60"
                      />
                    </div>

                    {sendError && (
                      <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <p>{sendError}</p>
                      </div>
                    )}

                    {sendSuccess && (
                      <div className="flex items-start gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                        <p>{sendSuccess}</p>
                      </div>
                    )}

                    <Button
                      type="button"
                      onClick={handleResend}
                      disabled={isSending}
                      className="h-11 w-full rounded-xl bg-gradient-to-r from-primary to-accent text-sm font-medium hover:from-primary/90 hover:to-accent/90"
                    >
                      {isSending ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Sending verification email...
                        </>
                      ) : (
                        "Resend verification email"
                      )}
                    </Button>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button asChild variant="outline" className="h-11 rounded-xl">
                    <Link href="/auth/signin">Go to sign in</Link>
                  </Button>

                  <Button asChild className="h-11 rounded-xl">
                    <Link href="/auth/signup">Create account</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(120,119,198,0.12),_transparent_35%),linear-gradient(to_bottom_right,var(--background),var(--background),rgba(99,102,241,0.04))]">
          <p className="text-foreground/60">Loading...</p>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}