import type { NextAuthOptions, User as NextAuthUser } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import type { Types } from "mongoose"
import { cookies } from "next/headers"
import { connectDB } from "@/lib/mongodb"
import { User, comparePassword } from "@/models/User"

type Plan = "free" | "starter" | "pro" | "agency"
type Billing = "monthly" | "annual"
type SubscriptionStatus = "inactive" | "trialing" | "active" | "past_due" | "canceled"
type CheckoutStatus = "not_started" | "abandoned" | "completed"
type PaymentProvider = "paypal" | "2checkout" | null

interface UserLean {
  _id: Types.ObjectId
  email: string
  name: string
  password?: string
  image?: string | null
  googleId?: string | null
  emailVerified?: Date | null

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

interface AppAuthUser extends NextAuthUser {
  id: string
  rememberMe?: boolean
  emailVerified?: Date | null

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

const PLAN_VALUES: readonly Plan[] = ["free", "starter", "pro", "agency"]
const BILLING_VALUES: readonly Billing[] = ["monthly", "annual"]

function getSafePlan(value: unknown): Plan {
  return PLAN_VALUES.includes(value as Plan) ? (value as Plan) : "free"
}

function getSafeBilling(value: unknown): Billing {
  return BILLING_VALUES.includes(value as Billing)
    ? (value as Billing)
    : "monthly"
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember me", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password.")
        }

        const email = credentials.email.trim().toLowerCase()

        await connectDB()

        const user = await User.findOne({ email })
          .select("+password")
          .lean()
          .then((doc) => doc as UserLean | null)

        if (!user) {
          throw new Error("No account found with this email.")
        }

        if (!user.password) {
          throw new Error("This account uses Google sign-in. Please continue with Google.")
        }

        const ok = await comparePassword(credentials.password, user.password)

        if (!ok) {
          throw new Error("Incorrect email or password.")
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in.")
        }

        const rememberMe = credentials.rememberMe === "true"

        const authUser: AppAuthUser = {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image ?? null,
          rememberMe,
          emailVerified: user.emailVerified ?? null,

          selectedPlan: user.selectedPlan ?? "free",
          selectedBilling: user.selectedBilling ?? "monthly",

          subscriptionPlan: user.subscriptionPlan ?? "free",
          subscriptionBilling: user.subscriptionBilling ?? "monthly",
          subscriptionStatus: user.subscriptionStatus ?? "inactive",

          paymentProvider: user.paymentProvider ?? null,
          providerSubscriptionId: user.providerSubscriptionId ?? null,

          cancelAtPeriodEnd: user.cancelAtPeriodEnd ?? false,
          gracePeriodEndsAt: user.gracePeriodEndsAt ?? null,

          checkoutStatus:
            user.checkoutStatus ??
            ((user.selectedPlan ?? "free") === "free" ? "completed" : "not_started"),
        }

        return authUser
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/auth/signin",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true
      }

      await connectDB()

      const email = user.email?.trim().toLowerCase()
      if (!email) return false

      const cookieStore = await cookies()
      const selectedPlan = getSafePlan(
        cookieStore.get("instaaudit_selected_plan")?.value
      )
      const selectedBilling = getSafeBilling(
        cookieStore.get("instaaudit_selected_billing")?.value
      )

      const existingUser = await User.findOne({ email })

      if (!existingUser) {
        const isFreePlan = selectedPlan === "free"

        await User.create({
          name: user.name?.trim() || "Google User",
          email,
          googleId: account.providerAccountId,
          image: user.image || null,
          emailVerified: new Date(),
          password: undefined,
          verificationToken: null,
          verificationTokenExpires: null,
          resetPasswordToken: null,
          resetPasswordTokenExpires: null,

          selectedPlan,
          selectedBilling,

          subscriptionPlan: "free",
          subscriptionBilling: "monthly",
          subscriptionStatus: isFreePlan ? "active" : "inactive",

          paymentProvider: null,
          providerCustomerId: null,
          providerSubscriptionId: null,

          cancelAtPeriodEnd: false,
          gracePeriodEndsAt: null,

          subscriptionCurrentPeriodEnd: null,
          checkoutStatus: isFreePlan ? "completed" : "not_started",
        })
      } else {
        const updateData: Record<string, unknown> = {
          googleId: existingUser.googleId || account.providerAccountId,
          image: user.image || existingUser.image || null,
        }

        if (!existingUser.emailVerified) {
          updateData.emailVerified = new Date()
        }

        if (!existingUser.selectedPlan || existingUser.selectedPlan === "free") {
          updateData.selectedPlan = selectedPlan
        }

        if (!existingUser.selectedBilling) {
          updateData.selectedBilling = selectedBilling
        }

        if (!existingUser.checkoutStatus) {
          updateData.checkoutStatus =
            selectedPlan === "free" ? "completed" : "not_started"
        }

        if (typeof existingUser.cancelAtPeriodEnd === "undefined") {
          updateData.cancelAtPeriodEnd = false
        }

        if (typeof existingUser.gracePeriodEndsAt === "undefined") {
          updateData.gracePeriodEndsAt = null
        }

        await User.updateOne({ _id: existingUser._id }, { $set: updateData })
      }

      cookieStore.delete("instaaudit_selected_plan")
      cookieStore.delete("instaaudit_selected_billing")

      return true
    },

    async jwt({ token, user, account }) {
      const appUser = user as AppAuthUser | undefined

      if (appUser) {
        token.id = appUser.id
        token.email = appUser.email
        token.name = appUser.name
        token.picture = appUser.image

        if (appUser.emailVerified != null) {
          token.emailVerified = appUser.emailVerified
        } else if (account?.provider === "google") {
          token.emailVerified = new Date()
        }

        token.selectedPlan = appUser.selectedPlan ?? "free"
        token.selectedBilling = appUser.selectedBilling ?? "monthly"

        token.subscriptionPlan = appUser.subscriptionPlan ?? "free"
        token.subscriptionBilling = appUser.subscriptionBilling ?? "monthly"
        token.subscriptionStatus = appUser.subscriptionStatus ?? "inactive"

        token.paymentProvider = appUser.paymentProvider ?? null
        token.providerSubscriptionId = appUser.providerSubscriptionId ?? null

        token.cancelAtPeriodEnd = appUser.cancelAtPeriodEnd ?? false
        token.gracePeriodEndsAt = appUser.gracePeriodEndsAt ?? null

        token.checkoutStatus =
          appUser.checkoutStatus ??
          ((appUser.selectedPlan ?? "free") === "free" ? "completed" : "not_started")

        const rememberMe = appUser.rememberMe === true
        const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60
        token.exp = Math.floor(Date.now() / 1000) + maxAge
      }

      if (token.email) {
        await connectDB()

        const dbUser = await User.findOne({
          email: String(token.email).toLowerCase(),
        })
          .lean()
          .then((doc) => doc as UserLean | null)

        if (dbUser) {
          token.id = dbUser._id.toString()

          token.selectedPlan = dbUser.selectedPlan ?? "free"
          token.selectedBilling = dbUser.selectedBilling ?? "monthly"

          token.subscriptionPlan = dbUser.subscriptionPlan ?? "free"
          token.subscriptionBilling = dbUser.subscriptionBilling ?? "monthly"
          token.subscriptionStatus = dbUser.subscriptionStatus ?? "inactive"

          token.paymentProvider = dbUser.paymentProvider ?? null
          token.providerSubscriptionId = dbUser.providerSubscriptionId ?? null

          token.cancelAtPeriodEnd = dbUser.cancelAtPeriodEnd ?? false
          token.gracePeriodEndsAt = dbUser.gracePeriodEndsAt ?? null

          token.checkoutStatus =
            dbUser.checkoutStatus ??
            ((dbUser.selectedPlan ?? "free") === "free" ? "completed" : "not_started")

          if (dbUser.emailVerified != null) {
            token.emailVerified = dbUser.emailVerified
          }
        }
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string | null | undefined
        session.user.emailVerified = token.emailVerified as Date | null | undefined

        session.user.selectedPlan = token.selectedPlan as Plan | undefined
        session.user.selectedBilling = token.selectedBilling as Billing | undefined

        session.user.subscriptionPlan = token.subscriptionPlan as Plan | undefined
        session.user.subscriptionBilling =
          token.subscriptionBilling as Billing | undefined
        session.user.subscriptionStatus =
          token.subscriptionStatus as SubscriptionStatus | undefined

        session.user.paymentProvider =
          token.paymentProvider as PaymentProvider | undefined
        session.user.providerSubscriptionId =
          token.providerSubscriptionId as string | null | undefined

        session.user.cancelAtPeriodEnd =
          token.cancelAtPeriodEnd as boolean | undefined
        session.user.gracePeriodEndsAt =
          token.gracePeriodEndsAt as Date | null | undefined

        session.user.checkoutStatus =
          token.checkoutStatus as CheckoutStatus | undefined
      }

      return session
    },
  },
}