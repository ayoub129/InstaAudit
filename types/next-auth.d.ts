import "next-auth"
import "next-auth/jwt"

type Plan = "free" | "starter" | "pro" | "agency"
type Billing = "monthly" | "annual"
type Role = "user" | "admin"
type AccountStatus = "active" | "suspended"
type SubscriptionStatus = "inactive" | "trialing" | "active" | "past_due" | "canceled"
type CheckoutStatus = "not_started" | "abandoned" | "completed"
type PaymentProvider = "paypal" | "2checkout" | null

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      emailVerified?: Date | null
      role?: Role
      accountStatus?: AccountStatus

      selectedPlan?: Plan
      selectedBilling?: Billing

      subscriptionPlan?: Plan
      subscriptionBilling?: Billing
      subscriptionStatus?: SubscriptionStatus

      paymentProvider?: PaymentProvider
      providerSubscriptionId?: string | null

      cancelAtPeriodEnd?: boolean
      gracePeriodEndsAt?: Date | null

      checkoutStatus?: CheckoutStatus
    }
  }

  interface User {
    id: string
    emailVerified?: Date | null
    role?: Role
    accountStatus?: AccountStatus

    selectedPlan?: Plan
    selectedBilling?: Billing

    subscriptionPlan?: Plan
    subscriptionBilling?: Billing
    subscriptionStatus?: SubscriptionStatus

    paymentProvider?: PaymentProvider
    providerSubscriptionId?: string | null

    cancelAtPeriodEnd?: boolean
    gracePeriodEndsAt?: Date | null

    checkoutStatus?: CheckoutStatus
    rememberMe?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    emailVerified?: Date | null
    role?: Role
    accountStatus?: AccountStatus

    selectedPlan?: Plan
    selectedBilling?: Billing

    subscriptionPlan?: Plan
    subscriptionBilling?: Billing
    subscriptionStatus?: SubscriptionStatus

    paymentProvider?: PaymentProvider
    providerSubscriptionId?: string | null

    cancelAtPeriodEnd?: boolean
    gracePeriodEndsAt?: Date | null

    checkoutStatus?: CheckoutStatus
  }
}