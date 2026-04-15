"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset link.")
    }
  }, [token])

  const passwordChecks = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasLetter: /[A-Za-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    }
  }, [password])

  const getFieldError = (field: string) => fieldErrors[field]?.[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    const errors: Record<string, string[]> = {}

    if (!password) {
      errors.password = ["Password is required."]
    } else if (password.length < 8) {
      errors.password = ["Password must be at least 8 characters."]
    }

    if (!confirmPassword) {
      errors.confirmPassword = ["Please confirm your password."]
    } else if (password !== confirmPassword) {
      errors.confirmPassword = ["Passwords do not match."]
    }

    if (!token) {
      setError("Invalid or missing reset link.")
      return
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.error && typeof data.error === "object") {
          setFieldErrors(data.error as Record<string, string[]>)
        } else {
          setError(data.error ?? "Something went wrong. Please try again.")
        }
        return
      }

      setSuccess(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(120,119,198,0.12),_transparent_35%),linear-gradient(to_bottom_right,var(--background),var(--background),rgba(99,102,241,0.04))] px-4 py-10">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
          <Card className="w-full max-w-md rounded-3xl border-border/60 bg-background/75 shadow-2xl backdrop-blur">
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Invalid or missing reset link. Request a new one to continue.</p>
              </div>

              <Button asChild className="h-11 w-full rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                <Link href="/auth/forgot-password">Request reset link</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(120,119,198,0.12),_transparent_35%),linear-gradient(to_bottom_right,var(--background),var(--background),rgba(99,102,241,0.04))] px-4 py-10">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
          <Card className="w-full max-w-md rounded-3xl border-border/60 bg-background/75 shadow-2xl backdrop-blur">
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-start gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Password updated successfully. You can sign in now.</p>
              </div>

              <Button asChild className="h-11 w-full rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                <Link href="/auth/signin">Sign in</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
                Set a new password for your account.
              </h1>

              <p className="mt-4 max-w-md text-base leading-7 text-foreground/65">
                Choose a strong password you’ll remember and use it to securely access your account.
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
                    Set new password
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm leading-6">
                    Enter your new password below to complete the reset process.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                {error && (
                  <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                      New password
                    </label>

                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
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

                    {getFieldError("password") ? (
                      <p className="text-xs text-destructive">{getFieldError("password")}</p>
                    ) : (
                      <div className="grid gap-1 text-xs text-foreground/55">
                        <p className={passwordChecks.minLength ? "text-green-600 dark:text-green-400" : ""}>
                          • At least 8 characters
                        </p>
                        <p className={passwordChecks.hasLetter ? "text-green-600 dark:text-green-400" : ""}>
                          • Includes a letter
                        </p>
                        <p className={passwordChecks.hasNumber ? "text-green-600 dark:text-green-400" : ""}>
                          • Includes a number
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                      Confirm new password
                    </label>

                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          setError(null)
                          setFieldErrors((prev) => ({ ...prev, confirmPassword: [] }))
                        }}
                        className={`h-11 rounded-xl bg-background/60 pr-11 ${
                          getFieldError("confirmPassword")
                            ? "border-destructive focus-visible:ring-destructive/30"
                            : "border-border/60"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 transition hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {getFieldError("confirmPassword") && (
                      <p className="text-xs text-destructive">{getFieldError("confirmPassword")}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-11 w-full rounded-xl bg-gradient-to-r from-primary to-accent text-sm font-medium hover:from-primary/90 hover:to-accent/90"
                  >
                    {isLoading ? "Updating password..." : "Update password"}
                  </Button>
                </form>

                <p className="text-center text-sm text-foreground/60">
                  <Link href="/auth/signin" className="font-medium text-primary hover:underline">
                    Back to sign in
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(120,119,198,0.12),_transparent_35%),linear-gradient(to_bottom_right,var(--background),var(--background),rgba(99,102,241,0.04))]">
          <p className="text-foreground/60">Loading...</p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}