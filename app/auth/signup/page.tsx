"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type FieldErrors = Record<string, string[]>
type SelectedPlan = "free" | "starter" | "pro" | "agency"
type SelectedBilling = "monthly" | "annual"

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

export default function SignUpPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan>("free")
  const [selectedBilling, setSelectedBilling] =
    useState<SelectedBilling>("monthly")

  useEffect(() => {
    const savedPricing = localStorage.getItem("instaaudit_selected_pricing")

    if (!savedPricing) return

    try {
      const parsed = JSON.parse(savedPricing)

      const safePlan: SelectedPlan = ["free", "starter", "pro", "agency"].includes(
        parsed?.plan
      )
        ? parsed.plan
        : "free"

      const safeBilling: SelectedBilling = ["monthly", "annual"].includes(
        parsed?.billing
      )
        ? parsed.billing
        : "monthly"

      setSelectedPlan(safePlan)
      setSelectedBilling(safeBilling)
    } catch (error) {
      console.error("Failed to parse selected pricing", error)
    }
  }, [])

  const passwordChecks = useMemo(() => {
    const password = formData.password
    return {
      minLength: password.length >= 8,
      hasLetter: /[A-Za-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    }
  }, [formData.password])

  const setSingleFieldError = (field: string, message: string) => {
    setFieldErrors((prev) => ({
      ...prev,
      [field]: [message],
    }))
  }

  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => {
      const copy = { ...prev }
      delete copy[field]
      return copy
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError(null)
    setSuccessMessage(null)
    clearFieldError(name)

    if (name === "password" || name === "confirmPassword") {
      clearFieldError("confirmPassword")
      clearFieldError("password")
    }
  }

  const validateForm = () => {
    const errors: FieldErrors = {}

    if (!formData.name.trim()) {
      errors.name = ["Full name is required."]
    }

    if (!formData.email.trim()) {
      errors.email = ["Email is required."]
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = ["Please enter a valid email address."]
      }
    }

    if (!formData.password) {
      errors.password = ["Password is required."]
    } else if (formData.password.length < 8) {
      errors.password = ["Password must be at least 8 characters."]
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = ["Please confirm your password."]
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = ["Passwords do not match."]
    }

    if (!acceptedTerms) {
      errors.terms = ["You must agree to the Terms of Service and Privacy Policy."]
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setFieldErrors({})

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          selectedPlan,
          selectedBilling,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.error && typeof data.error === "object") {
          setFieldErrors(data.error as FieldErrors)
        } else {
          setError(data.error ?? "Something went wrong. Please try again.")
        }
        return
      }

      localStorage.removeItem("instaaudit_selected_pricing")
      router.push("/auth/signin?verify=1")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setError(null)
    setSuccessMessage(null)
    clearFieldError("terms")
  
  
    setIsGoogleLoading(true)
  
    try {
      const saveRes = await fetch("/api/auth/save-selected-pricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedPlan,
          selectedBilling,
        }),
      })
  
      if (!saveRes.ok) {
        const data = await saveRes.json().catch(() => null)
        setError(data?.error ?? "Could not save selected plan. Please try again.")
        return
      }
  
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const getFieldError = (field: string) => fieldErrors[field]?.[0]

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
                Create your account and start auditing profiles in minutes.
              </h1>

              <p className="mt-4 max-w-md text-base leading-7 text-foreground/65">
                Join InstaAudit to access your dashboard, reports, and AI-powered Instagram insights.
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
                    Get Started
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm leading-6">
                    Create your InstaAudit account and continue to your dashboard.
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

                {successMessage && (
                  <div className="flex items-start gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{successMessage}</p>
                  </div>
                )}

                <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
                  <p className="text-sm text-foreground/70">
                    Selected plan:{" "}
                    <span className="font-semibold capitalize text-foreground">
                      {selectedPlan}
                    </span>
                  </p>
                  <p className="text-sm text-foreground/70">
                    Billing:{" "}
                    <span className="font-semibold capitalize text-foreground">
                      {selectedBilling}
                    </span>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                      Full name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className={`h-11 rounded-xl bg-background/60 ${
                        getFieldError("name")
                          ? "border-destructive focus-visible:ring-destructive/30"
                          : "border-border/60"
                      }`}
                    />
                    {getFieldError("name") && (
                      <p className="text-xs text-destructive">{getFieldError("name")}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
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
                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
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
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {getFieldError("password") ? (
                      <p className="text-xs text-destructive">{getFieldError("password")}</p>
                    ) : (
                      <div className="grid gap-1 text-xs text-foreground/55">
                        <p
                          className={
                            passwordChecks.minLength
                              ? "text-green-600 dark:text-green-400"
                              : ""
                          }
                        >
                          • At least 8 characters
                        </p>
                        <p
                          className={
                            passwordChecks.hasLetter
                              ? "text-green-600 dark:text-green-400"
                              : ""
                          }
                        >
                          • Includes a letter
                        </p>
                        <p
                          className={
                            passwordChecks.hasNumber
                              ? "text-green-600 dark:text-green-400"
                              : ""
                          }
                        >
                          • Includes a number
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-foreground"
                    >
                      Confirm password
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
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
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {getFieldError("confirmPassword") && (
                      <p className="text-xs text-destructive">
                        {getFieldError("confirmPassword")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                        getFieldError("terms")
                          ? "border-destructive/40 bg-destructive/5"
                          : "border-border/60 bg-background/40 hover:bg-background/70"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => {
                          setAcceptedTerms(e.target.checked)
                          clearFieldError("terms")
                        }}
                        className="mt-1 h-4 w-4 rounded border-border"
                      />
                      <span className="text-sm leading-6 text-foreground/75">
                        I agree to the{" "}
                        <Link
                          href="/legal/terms"
                          className="font-medium text-primary hover:underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/legal/privacy"
                          className="font-medium text-primary hover:underline"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </span>
                    </label>
                    {getFieldError("terms") && (
                      <p className="text-xs text-destructive">{getFieldError("terms")}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || isGoogleLoading}
                    className="h-11 w-full rounded-xl bg-gradient-to-r from-primary to-accent text-sm font-medium hover:from-primary/90 hover:to-accent/90"
                  >
                    {isLoading ? "Creating account..." : "Create account"}
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
                  onClick={handleGoogleSignup}
                  disabled={isLoading || isGoogleLoading}
                  className="h-11 w-full rounded-xl border-border/60 bg-background/60 text-sm font-medium hover:bg-background hover:text-black"
                >
                  <span className="mr-2">
                    <GoogleIcon />
                  </span>
                  {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
                </Button>

                <p className="text-center text-sm text-foreground/60">
                  Already have an account?{" "}
                  <Link href="/auth/signin" className="font-medium text-primary hover:underline">
                    Sign in
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