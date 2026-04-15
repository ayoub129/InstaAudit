"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { AlertCircle, CheckCircle2, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldError, setFieldError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldError(null)

    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      setFieldError("Email is required.")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setFieldError("Please enter a valid email address.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.")
        return
      }

      setSent(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
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
                Reset your password and get back into your account.
              </h1>

              <p className="mt-4 max-w-md text-base leading-7 text-foreground/65">
                Enter your email address and we’ll send you a secure password reset link.
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
                    Forgot password?
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm leading-6">
                    Enter your email and we’ll send you a link to reset your password.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                {sent ? (
                  <>
                    <div className="flex items-start gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>
                        If an account exists with that email, you&apos;ll receive a reset link shortly. Check your inbox and spam folder.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                      <div className="flex items-start gap-3 text-sm text-foreground/70">
                        <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                        <p>
                          Didn&apos;t receive anything? Wait a minute, then try again or check your spam folder.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Button asChild variant="outline" className="h-11 rounded-xl">
                        <Link href="/auth/signin">Back to sign in</Link>
                      </Button>

                      <Button
                        type="button"
                        className="h-11 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                        onClick={() => {
                          setSent(false)
                          setError(null)
                          setFieldError(null)
                        }}
                      >
                        Try another email
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {error && (
                      <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            setError(null)
                            setFieldError(null)
                          }}
                          className={`h-11 rounded-xl bg-background/60 ${
                            fieldError
                              ? "border-destructive focus-visible:ring-destructive/30"
                              : "border-border/60"
                          }`}
                        />
                        {fieldError && <p className="text-xs text-destructive">{fieldError}</p>}
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="h-11 w-full rounded-xl bg-gradient-to-r from-primary to-accent text-sm font-medium hover:from-primary/90 hover:to-accent/90"
                      >
                        {isLoading ? "Sending reset link..." : "Send reset link"}
                      </Button>
                    </form>

                    <p className="text-center text-sm text-foreground/60">
                      <Link href="/auth/signin" className="font-medium text-primary hover:underline">
                        Back to sign in
                      </Link>
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}