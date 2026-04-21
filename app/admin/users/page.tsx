import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { UserManagementTable } from "../user-management-table"

type UserRow = {
  _id: unknown
  name: string
  email: string
  role?: "user" | "admin"
  accountStatus?: "active" | "suspended"
  suspendedAt?: Date | null
  suspensionReason?: string | null
  emailVerified?: Date | null
  googleId?: string | null
  checkoutStatus?: "not_started" | "abandoned" | "completed"
  selectedPlan?: "free" | "starter" | "pro" | "agency"
  selectedBilling?: "monthly" | "annual"
  subscriptionPlan?: "free" | "starter" | "pro" | "agency"
  subscriptionBilling?: "monthly" | "annual"
  subscriptionStatus?: "inactive" | "trialing" | "active" | "past_due" | "canceled"
  subscriptionCurrentPeriodEnd?: Date | null
  createdAt: Date
}

type SerializedUserRow = {
  _id: string
  name: string
  email: string
  role?: "user" | "admin"
  accountStatus?: "active" | "suspended"
  suspendedAt?: string | null
  suspensionReason?: string | null
  emailVerified?: string | null
  googleId?: string | null
  checkoutStatus?: "not_started" | "abandoned" | "completed"
  selectedPlan?: "free" | "starter" | "pro" | "agency"
  selectedBilling?: "monthly" | "annual"
  subscriptionPlan?: "free" | "starter" | "pro" | "agency"
  subscriptionBilling?: "monthly" | "annual"
  subscriptionStatus?: "inactive" | "trialing" | "active" | "past_due" | "canceled"
  subscriptionCurrentPeriodEnd?: string | null
  createdAt: string
}

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/auth/signin?callbackUrl=/admin/users")
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard?denied=admin")
  }

  await connectDB()

  const users = await User.find({})
    .sort({ createdAt: -1 })
    .limit(100)
    .select(
      "name email role accountStatus suspendedAt suspensionReason emailVerified googleId checkoutStatus selectedPlan selectedBilling subscriptionPlan subscriptionBilling subscriptionStatus subscriptionCurrentPeriodEnd createdAt",
    )
    .lean()
    .then((rows) => rows as unknown as UserRow[])

  const serializedUsers: SerializedUserRow[] = users.map((user) => ({
    _id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role ?? "user",
    accountStatus: user.accountStatus ?? "active",
    suspendedAt: user.suspendedAt ? new Date(user.suspendedAt).toISOString() : null,
    suspensionReason: user.suspensionReason ?? null,
    emailVerified: user.emailVerified ? new Date(user.emailVerified).toISOString() : null,
    googleId: user.googleId ?? null,
    checkoutStatus: user.checkoutStatus,
    selectedPlan: user.selectedPlan ?? "free",
    selectedBilling: user.selectedBilling ?? "monthly",
    subscriptionPlan: user.subscriptionPlan ?? "free",
    subscriptionBilling: user.subscriptionBilling ?? "monthly",
    subscriptionStatus: user.subscriptionStatus ?? "inactive",
    subscriptionCurrentPeriodEnd: user.subscriptionCurrentPeriodEnd
      ? new Date(user.subscriptionCurrentPeriodEnd).toISOString()
      : null,
    createdAt: new Date(user.createdAt).toISOString(),
  }))

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />

      <main className="ml-72 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <section className="mb-8 rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-primary/80">Admin Users</p>
                <h1 className="mt-2 text-3xl font-semibold text-foreground">User management</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Promote, demote, suspend, and reactivate users.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/admin"
                  className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-medium hover:bg-muted/40"
                >
                  Back to admin overview
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Go to user dashboard
                </Link>
              </div>
            </div>
          </section>

          <UserManagementTable
            users={serializedUsers}
            currentAdminEmail={session.user.email}
          />
        </div>
      </main>
    </div>
  )
}
