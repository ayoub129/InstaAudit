"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Lock,
} from "lucide-react"

import { Navigation } from "@/components/landing/navigation"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Billing = "monthly" | "annual"
type Plan = "free" | "starter" | "pro" | "agency"

type SetupResponse = {
  success: boolean
  plan: {
    slug: Plan
    name: string
    billing: Billing
    price: number
    currency: string
    paypalPlanId: string
    features: string[]
    subtitle?: string
  }
  message?: string
}

type ActivateResponse = {
  success: boolean
  redirectTo?: string
  message?: string
}

export function CheckoutPageClient() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [planData, setPlanData] = useState<SetupResponse["plan"] | null>(null)

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  useEffect(() => {
    async function loadCheckout() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch("/api/paypal/subscription/setup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        const data: SetupResponse = await res.json()

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Unable to load checkout details.")
        }

        if (data.plan.slug === "free") {
          router.replace("/dashboard")
          return
        }

        setPlanData(data.plan)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to load checkout details."
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated") {
      loadCheckout()
    } else if (status === "unauthenticated") {
      router.replace("/auth/signin")
    }
  }, [router, status])

  const annualEquivalent = useMemo(() => {
    if (!planData || planData.billing !== "annual") return null
    return (planData.price / 12).toFixed(2)
  }, [planData])

  const onApproveSubscription = async (subscriptionID: string): Promise<void> => {
    try {
      setSubmitting(true)
      setError(null)
  
      const res = await fetch("/api/paypal/subscription/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId: subscriptionID,
        }),
      })
  
      const data: ActivateResponse = await res.json()
  
      if (!res.ok || !data.success) {
        await fetch("/api/paypal/subscription/abandon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
  
        router.replace("/dashboard?billing=abandoned")
        return
      }
  
      setSuccessMessage("Subscription activated successfully.")
      router.replace(data.redirectTo || "/dashboard")
    } catch (err) {
      console.error("onApproveSubscription error:", err)
  
      await fetch("/api/paypal/subscription/abandon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
  
      router.replace("/dashboard?billing=abandoned")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(120,119,198,0.12),_transparent_35%),linear-gradient(to_bottom_right,var(--background),var(--background),rgba(99,102,241,0.04))]">
      <Navigation />

      <main className="px-5 py-14 sm:px-6 sm:py-12 md:px-8 md:py-12">
        <div className="mx-auto max-w-7xl">
          <section className=" grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="rounded-[1.9rem] border border-border/50 bg-background/65 p-6 shadow-[0_22px_60px_-26px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-7">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary/80">
                    Billing
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    Payment details
                  </h2>
                </div>

                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/pricing">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to pricing
                  </Link>
                </Button>
              </div>

              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {successMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{successMessage}</p>
                </div>
              )}

              {loading ? (
                <div className="space-y-4">
                  <div className="h-8 w-48 rounded-xl bg-muted/60" />
                  <div className="h-24 rounded-2xl bg-muted/50" />
                  <div className="h-40 rounded-2xl bg-muted/50" />
                </div>
              ) : !planData ? null : (
                <>
                  <div className="mb-5 rounded-[1.4rem] border border-primary/20 bg-primary/5 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-sm text-foreground/55">Selected plan</p>
                        <h3 className="mt-1 text-2xl font-semibold text-foreground">
                          {planData.name}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-foreground/62">
                          {planData.subtitle || "Recurring InstaAudit subscription"}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="flex items-end gap-1.5 sm:justify-end">
                          <span className="text-4xl font-semibold tracking-tight text-foreground">
                            ${planData.price}
                          </span>
                          <span className="pb-1 text-sm text-foreground/55">
                            /{planData.billing === "annual" ? "year" : "month"}
                          </span>
                        </div>

                        {annualEquivalent && (
                          <p className="mt-2 text-sm text-foreground/50">
                            Equivalent to ${annualEquivalent}/month
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-5 rounded-[1.4rem] border border-border/50 bg-background/50 p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <h4 className="text-sm font-medium uppercase tracking-[0.18em] text-primary/80">
                        Pay with PayPal
                      </h4>
                    </div>

                    {!paypalClientId ? (
                      <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID in your environment.
                      </div>
                    ) : (
                      <PayPalScriptProvider
                        options={{
                          clientId: paypalClientId,
                          vault: true,
                          intent: "subscription",
                        }}
                      >
                        <div className={cn(submitting && "pointer-events-none opacity-70")}>
                         <PayPalButtons
                            style={{
                                layout: "vertical",
                                shape: "pill",
                                label: "subscribe",
                            }}
                            createSubscription={(_, actions) => {
                                if (!planData?.paypalPlanId) {
                                throw new Error("Missing PayPal plan ID.")
                                }

                                return actions.subscription.create({
                                plan_id: planData.paypalPlanId,
                                })
                            }}
                            onApprove={async (data) => {
                                if (!data.subscriptionID) {
                                setError("Payment failed. You are continuing with the free plan.")

                                await fetch("/api/paypal/subscription/abandon", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                })

                                router.replace("/dashboard?billing=abandoned")
                                return
                                }

                                await onApproveSubscription(data.subscriptionID)
                            }}
                            onCancel={async () => {
                                await fetch("/api/paypal/subscription/abandon", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                })

                                router.replace("/dashboard?billing=abandoned")
                            }}
                            onError={async () => {
                                setError("PayPal checkout failed. You are continuing with the free plan.")

                                await fetch("/api/paypal/subscription/abandon", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                })

                                router.replace("/dashboard?billing=abandoned")
                            }}
                            />
                        </div>
                      </PayPalScriptProvider>
                    )}

                    <div className="mt-4 inline-flex items-center gap-2 text-xs text-foreground/50">
                      <Lock className="h-3.5 w-3.5" />
                      Your payment is processed securely by PayPal.
                    </div>
                  </div>
                </>
              )}
            </Card>

            <div className="space-y-6">
              <Card className="rounded-[1.9rem] border border-border/50 bg-background/65 p-6 shadow-[0_22px_60px_-26px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-7">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  What’s included
                </h3>

                <div className="mt-5 space-y-3">
                  {planData?.features?.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm leading-6 text-foreground/72">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="rounded-[1.9rem] border border-border/50 bg-background/65 p-6 shadow-[0_22px_60px_-26px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-7">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  Subscription summary
                </h3>

                <div className="mt-5 space-y-4 text-sm text-foreground/68">
                  <div className="flex items-center justify-between gap-4">
                    <span>Account</span>
                    <span className="font-medium text-foreground">
                      {session?.user?.email || "Signed in user"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span>Plan</span>
                    <span className="font-medium capitalize text-foreground">
                      {planData?.slug || "-"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span>Billing</span>
                    <span className="font-medium capitalize text-foreground">
                      {planData?.billing || "-"}
                    </span>
                  </div>

                  <div className="h-px w-full bg-gradient-to-r from-transparent via-border/80 to-transparent" />

                  <div className="flex items-center justify-between gap-4">
                    <span>Total due now</span>
                    <span className="text-lg font-semibold text-foreground">
                      {planData ? `$${planData.price}` : "-"}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}