"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, AlertCircle, CheckCircle2, MailCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.6 3.4 14.5 2.5 12 2.5A9.5 9.5 0 0 0 2.5 12 9.5 9.5 0 0 0 12 21.5c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.9H12Z"
      />
      <path
        fill="#34A853"
        d="M2.5 12c0 1.9.7 3.7 1.9 5.1l3.1-2.4c-.8-.7-1.3-1.7-1.3-2.7s.5-2 1.3-2.7L4.4 6.9A9.4 9.4 0 0 0 2.5 12Z"
      />
      <path
        fill="#FBBC05"
        d="M12 21.5c2.6 0 4.8-.9 6.4-2.5l-3.1-2.4c-.8.6-1.8 1-3.3 1-2.5 0-4.7-1.7-5.4-4l-3.2 2.5A9.5 9.5 0 0 0 12 21.5Z"
      />
      <path
        fill="#4285F4"
        d="M18.4 19c1.8-1.7 2.8-4.1 2.8-6.9 0-.6-.1-1.1-.2-1.9H12v3.9h5.4c-.3 1.4-1.1 2.6-2.1 3.5l3.1 2.4Z"
      />
    </svg>
  )
}

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [resendState, setResendState] = useState<{
    loading: boolean
    success: string | null
    error: string | null
  }>({
    loading: false,
    success: null,
    error: null,
  })

  const router = useRouter()
  const searchParams = useSearchParams()

  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"
  const verified = searchParams.get("verified") === "1"
  const verify = searchParams.get("verify") === "1"

  const getFieldError = (field: string) => fieldErrors[field]?.[0]

  const extractEmailFromError = (message: string) => {
    const match = message.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i)
    return match ? match[0].toLowerCase() : email.trim().toLowerCase()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setResendState({ loading: false, success: null, error: null })

    const normalizedEmail = email.trim().toLowerCase()
    const errors: Record<string, string[]> = {}

    if (!normalizedEmail) {
      errors.email = ["Email is required."]
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      errors.email = ["Please enter a valid email address."]
    }

    if (!password) {
      errors.password = ["Password is required."]
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsLoading(true)

    try {
      const res = await signIn("credentials", {
        email: normalizedEmail,
        password,
        rememberMe: rememberMe ? "true" : "false",
        redirect: false,
        callbackUrl: "/dashboard",
      })

      if (res?.error) {
        setError(res.error)
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setFieldErrors({})
    setResendState({ loading: false, success: null, error: null })
    setIsGoogleLoading(true)

    try {
      await signIn("google", { callbackUrl })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleResendVerification = async () => {
    const targetEmail = extractEmailFromError(error || "")
    if (!targetEmail) {
      setResendState({
        loading: false,
        success: null,
        error: "Enter your email first so we can resend the verification link.",
      })
      return
    }

    setResendState({ loading: true, success: null, error: null })

    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: targetEmail }),
      })

      const data = await res.json()

      if (!res.ok) {
        setResendState({
          loading: false,
          success: null,
          error: data.error || "Could not resend verification email.",
        })
        return
      }

      setResendState({
        loading: false,
        success: data.message || "Verification email sent successfully.",
        error: null,
      })
    } catch {
      setResendState({
        loading: false,
        success: null,
        error: "Something went wrong. Please try again.",
      })
    }
  }

  const showResendButton =
    !!error &&
    error.toLowerCase().includes("verify your email")

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
                Welcome back to your Instagram audit workspace.
              </h1>

              <p className="mt-4 max-w-md text-base leading-7 text-foreground/65">
                Sign in to access your dashboard, reports, and future AI-powered profile insights.
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
                    Welcome back
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm leading-6">
                    Sign in to continue to your InstaAudit dashboard.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                {verified && (
                  <div className="flex items-start gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>Email verified successfully. You can sign in now.</p>
                  </div>
                )}

                {verify && (
                  <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
                    <MailCheck className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                      Your account was created. Please check your email and verify your account before signing in.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="space-y-3 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>{error}</p>
                    </div>

                    {showResendButton && (
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={resendState.loading}
                        className="text-sm font-medium underline underline-offset-4 hover:opacity-80 disabled:opacity-50"
                      >
                        {resendState.loading ? "Sending verification email..." : "Resend verification email"}
                      </button>
                    )}
                  </div>
                )}

                {resendState.success && (
                  <div className="flex items-start gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{resendState.success}</p>
                  </div>
                )}

                {resendState.error && (
                  <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{resendState.error}</p>
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
                        setFieldErrors((prev) => ({ ...prev, email: [] }))
                      }}
                      className={`h-11 rounded-xl bg-background/60 ${
                        getFieldError("email")
                          ? "border-destructive focus-visible:ring-destructive/30"
                          : "border-border/60"
                      }`}
                    />
                    {getFieldError("email") && (
                      <p className="text-xs text-destructive">{getFieldError("email")}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium text-foreground">
                        Password
                      </label>
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          setError(null)
                          setFieldErrors((prev) => ({ ...prev, password: [] }))
                        }}
                        className={`h-11 rounded-xl bg-background/60 pr-11 ${
                          getFieldError("password")
                            ? "border-destructive focus-visible:ring-destructive/30"
                            : "border-border/60"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 transition hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {getFieldError("password") && (
                      <p className="text-xs text-destructive">{getFieldError("password")}</p>
                    )}
                  </div>

                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border/60 bg-background/40 px-4 py-3 hover:bg-background/70">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-border"
                    />
                    <span className="text-sm text-foreground/75">Keep me signed in</span>
                  </label>

                  <Button
                    type="submit"
                    disabled={isLoading || isGoogleLoading}
                    className="h-11 w-full rounded-xl bg-gradient-to-r from-primary to-accent text-sm font-medium hover:from-primary/90 hover:to-accent/90"
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-background px-3 text-xs uppercase tracking-[0.18em] text-foreground/45">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading || isGoogleLoading}
                  className="h-11 w-full rounded-xl border-border/60 bg-background/60 text-sm font-medium hover:bg-background hover:text-black"
                >
                  <span className="mr-2">
                    <GoogleIcon />
                  </span>
                  {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
                </Button>

                <p className="text-center text-sm text-foreground/60">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/signup" className="font-medium text-primary hover:underline">
                    Get started
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}