"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type AdminUserRow = {
  _id: string;
  name: string;
  email: string;
  role?: "user" | "admin";
  accountStatus?: "active" | "suspended";
  suspendedAt?: string | null;
  suspensionReason?: string | null;
  emailVerified?: string | null;
  googleId?: string | null;
  checkoutStatus?: "not_started" | "abandoned" | "completed";
  selectedPlan?: "free" | "starter" | "pro" | "agency";
  selectedBilling?: "monthly" | "annual";
  subscriptionPlan?: "free" | "starter" | "pro" | "agency";
  subscriptionBilling?: "monthly" | "annual";
  subscriptionStatus?:
    | "inactive"
    | "trialing"
    | "active"
    | "past_due"
    | "canceled";
  subscriptionCurrentPeriodEnd?: string | null;
  createdAt: string;
};

type Props = {
  users: AdminUserRow[];
  currentAdminEmail: string;
};

function formatDateOnly(date: string | Date) {
  return new Date(date).toLocaleDateString();
}

function toReadableStatus(status: string | undefined) {
  return (status ?? "-").replace("_", " ");
}

function badgeClass(
  value: string | undefined,
  map: Record<string, string>,
  fallback = "border-border/60 bg-muted/40 text-foreground",
) {
  return map[value ?? ""] ?? fallback;
}

function getEffectiveCheckoutStatus(user: AdminUserRow) {
  const selectedPlan = user.selectedPlan ?? "free";
  const subscriptionPlan = user.subscriptionPlan ?? "free";
  const subscriptionStatus = user.subscriptionStatus ?? "inactive";
  const rawCheckout = user.checkoutStatus ?? "not_started";

  if (selectedPlan === "free") return "completed";
  if (subscriptionPlan !== "free" && subscriptionStatus === "active")
    return "completed";
  return rawCheckout;
}

export function UserManagementTable({ users, currentAdminEmail }: Props) {
  const router = useRouter();
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [accountFilter, setAccountFilter] = useState("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");
  const [checkoutFilter, setCheckoutFilter] = useState("all");
  const [authFilter, setAuthFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [compactMode, setCompactMode] = useState(false);
  const PAGE_SIZE = 10;

  async function runAction(
    userId: string,
    action: "promote" | "demote" | "suspend" | "unsuspend",
  ) {
    setError(null);
    setSuccess(null);
    setBusyUserId(userId);

    try {
      let reason: string | undefined;
      if (action === "suspend") {
        reason = window.prompt("Optional suspension reason:") ?? undefined;
      }

      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action, reason }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to update user.");
        return;
      }

      setSuccess(`User ${action}d successfully.`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusyUserId(null);
    }
  }

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const text = query.trim().toLowerCase();
      if (text) {
        const haystack = `${user.name ?? ""} ${user.email ?? ""}`.toLowerCase();
        if (!haystack.includes(text)) return false;
      }

      const accountStatus = user.accountStatus ?? "active";
      const subscriptionStatus = user.subscriptionStatus ?? "inactive";
      const checkoutStatus = getEffectiveCheckoutStatus(user);
      const authMethod = user.googleId ? "google" : "credentials";

      if (accountFilter !== "all" && accountStatus !== accountFilter)
        return false;
      if (
        subscriptionFilter !== "all" &&
        subscriptionStatus !== subscriptionFilter
      )
        return false;
      if (checkoutFilter !== "all" && checkoutStatus !== checkoutFilter)
        return false;
      if (authFilter !== "all" && authMethod !== authFilter) return false;

      return true;
    });
  }, [
    users,
    query,
    accountFilter,
    subscriptionFilter,
    checkoutFilter,
    authFilter,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function handlePageChange(nextPage: number) {
    setPage(Math.max(1, Math.min(nextPage, totalPages)));
  }

  function resetFilters() {
    setQuery("");
    setAccountFilter("all");
    setSubscriptionFilter("all");
    setCheckoutFilter("all");
    setAuthFilter("all");
    setPage(1);
  }

  return (
    <div className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
      <h2 className="text-2xl font-semibold tracking-tight">User management</h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        Promote, demote, and suspend users from this table. "Checkout" shows
        onboarding purchase flow state, not subscription health.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCompactMode((prev) => !prev)}
          className="inline-flex h-9 items-center rounded-xl border border-border/70 bg-background/70 px-3 text-xs font-medium hover:bg-muted/50"
        >
          {compactMode ? "Normal mode" : "Compact mode"}
        </button>
        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex h-9 items-center rounded-xl border border-border/70 bg-background/70 px-3 text-xs font-medium hover:bg-muted/50"
        >
          Reset filters
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search name or email..."
          className="h-11 rounded-xl border border-border/70 bg-background/80 px-3 text-sm outline-none ring-0 placeholder:text-muted-foreground"
        />

        <select
          value={accountFilter}
          onChange={(e) => {
            setAccountFilter(e.target.value);
            setPage(1);
          }}
          className="h-11 rounded-xl border border-border/70 bg-background/80 px-3 text-sm"
        >
          <option value="all">All account access</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>

        <select
          value={subscriptionFilter}
          onChange={(e) => {
            setSubscriptionFilter(e.target.value);
            setPage(1);
          }}
          className="h-11 rounded-xl border border-border/70 bg-background/80 px-3 text-sm"
        >
          <option value="all">All subscription states</option>
          <option value="active">Active</option>
          <option value="trialing">Trialing</option>
          <option value="past_due">Past due</option>
          <option value="inactive">Inactive</option>
          <option value="canceled">Canceled</option>
        </select>

        <select
          value={checkoutFilter}
          onChange={(e) => {
            setCheckoutFilter(e.target.value);
            setPage(1);
          }}
          className="h-11 rounded-xl border border-border/70 bg-background/80 px-3 text-sm"
        >
          <option value="all">All checkout states</option>
          <option value="completed">Completed</option>
          <option value="not_started">Not started</option>
          <option value="abandoned">Abandoned</option>
        </select>

        <select
          value={authFilter}
          onChange={(e) => {
            setAuthFilter(e.target.value);
            setPage(1);
          }}
          className="h-11 rounded-xl border border-border/70 bg-background/80 px-3 text-sm"
        >
          <option value="all">All auth methods</option>
          <option value="credentials">Email/Password</option>
          <option value="google">Google OAuth</option>
        </select>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-300">
          {success}
        </div>
      )}

      <div className="mt-5 overflow-x-auto">
        <p className="mb-3 text-xs text-muted-foreground/90">
          Showing {paginatedUsers.length} on page {safePage}/{totalPages} (
          {filteredUsers.length} filtered of {users.length})
        </p>
        <div className="overflow-visible ">
          <table className="w-full min-w-[1280px] rounded-2xl border border-border/50 bg-background/40 backdrop-blur-xl text-left text-sm border-separate border-spacing-y-2">
            {/* HEADER */}
            <div className="sticky top-0 z-20 mb-2  border border-border/50 bg-background/80 backdrop-blur-xl px-4 py-3">
              <div className="flex flex-nowrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <div className="min-w-[160px]">User</div>
                <div className="min-w-[220px]">Email</div>
                <div className="min-w-[120px]">Auth</div>
                <div className="min-w-[120px]">Access</div>
                <div className="min-w-[120px]">Plan</div>
                <div className="min-w-[140px]">Subscription</div>
                <div className="min-w-[120px]">Checkout</div>
                <div className="min-w-[120px]">Billing</div>
                <div className="min-w-[120px]">Joined</div>

                <div className="ml-auto min-w-[180px] text-right">Actions</div>
              </div>
            </div>
            {/* BODY */}
            <tbody>
              {paginatedUsers.map((user) => {
                const isBusy = busyUserId === user._id;
                const isSelf =
                  user.email.toLowerCase() === currentAdminEmail.toLowerCase();
                const role = user.role ?? "user";
                const accountStatus = user.accountStatus ?? "active";
                const effectiveCheckout = getEffectiveCheckoutStatus(user);

                const nextBilling =
                  user.subscriptionCurrentPeriodEnd &&
                  (user.subscriptionPlan ?? "free") !== "free" &&
                  (user.subscriptionStatus ?? "inactive") === "active"
                    ? formatDateOnly(user.subscriptionCurrentPeriodEnd)
                    : "-";

                const isAdminRow = role === "admin";

                return (
                  <tr
                    key={user._id}
                    className={`
              group transition-all duration-200
              hover:scale-[1.01] hover:bg-muted/20
              ${isAdminRow ? "bg-violet-500/[0.06]" : "bg-background/60"}
            `}
                  >
                    {/* wrap row content */}
                    <td colSpan={10} className="p-0">
                      <div className="flex flex-nowrap items-center gap-x-6 gap-y-3  border border-border/50 bg-background/70 backdrop-blur-md px-4 py-3 shadow-sm transition-all group-hover:shadow-md">
                        {" "}
                        <div className="min-w-[160px] font-medium">
                          {user.name || "-"}
                        </div>
                        <div className="min-w-[220px] break-all text-muted-foreground">
                          {user.email}
                        </div>
                        {/* AUTH */}
                        <div className="min-w-[120px]">
                          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs">
                            {user.googleId ? "Google" : "Password"}
                          </div>
                        </div>
                        {/* ACCESS */}
                        <div className="min-w-[120px]">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              accountStatus === "active"
                                ? "bg-emerald-500/10 text-emerald-300"
                                : "bg-red-500/10 text-red-300"
                            }`}
                          >
                            {accountStatus}
                          </span>
                        </div>
                        {/* PLAN */}
                        <div className="min-w-[120px] text-xs">
                          <div className="font-medium">
                            {user.selectedPlan ?? "free"}
                          </div>
                          <div className="text-muted-foreground">
                            {user.selectedBilling ?? "monthly"}
                          </div>
                        </div>
                        {/* SUB */}
                        <div className="min-w-[140px] text-xs">
                          <div>{user.subscriptionPlan ?? "free"}</div>
                          <div className="text-muted-foreground">
                            {toReadableStatus(user.subscriptionStatus)}
                          </div>
                        </div>
                        {/* CHECKOUT */}
                        <div className="min-w-[120px]">
                          <span className="text-xs capitalize">
                            {toReadableStatus(effectiveCheckout)}
                          </span>
                        </div>
                        {/* BILLING */}
                        <div className="min-w-[120px] text-xs">
                          {nextBilling}
                        </div>
                        {/* JOINED */}
                        <div className="min-w-[120px] text-xs">
                          {formatDateOnly(user.createdAt)}
                        </div>
                        {/* ACTIONS */}
                        <div className="ml-auto min-w-[180px] flex justify-end">
                          {role === "user" ? (
                            <button
                              disabled={isBusy}
                              onClick={() => runAction(user._id, "promote")}
                              className="rounded-lg bg-sky-500/10 px-3 py-1 text-xs text-sky-300 hover:bg-sky-500/20"
                            >
                              Promote
                            </button>
                          ) : (
                            <button
                              disabled={isBusy || isSelf}
                              onClick={() => runAction(user._id, "demote")}
                              className="rounded-lg bg-violet-500/10 px-3 py-1 text-xs text-violet-300 hover:bg-violet-500/20"
                            >
                              Demote
                            </button>
                          )}

                          {accountStatus === "active" ? (
                            <button
                              disabled={isBusy || isSelf}
                              onClick={() => runAction(user._id, "suspend")}
                              className="rounded-lg bg-amber-500/10 px-3 py-1 text-xs text-amber-300 hover:bg-amber-500/20"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              disabled={isBusy}
                              onClick={() => runAction(user._id, "unsuspend")}
                              className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-500/20"
                            >
                              Unsuspend
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length > 0 && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handlePageChange(safePage - 1)}
            disabled={safePage <= 1}
            className="inline-flex h-9 items-center rounded-xl border border-border/70 bg-background/70 px-3 text-sm hover:bg-muted/50 disabled:opacity-50"
          >
            Previous
          </button>

          <p className="text-xs text-muted-foreground">
            Page {safePage} of {totalPages}
          </p>

          <button
            type="button"
            onClick={() => handlePageChange(safePage + 1)}
            disabled={safePage >= totalPages}
            className="inline-flex h-9 items-center rounded-xl border border-border/70 bg-background/70 px-3 text-sm hover:bg-muted/50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
