"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Bell,
  Check,
  ExternalLink,
  Lock,
  Loader2,
  Settings,
  Shield,
  Trash2,
  User,
} from "lucide-react"
import { toast } from "sonner"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type NotifKey = "emailNotifications" | "productUpdates"
type Notifs = Record<NotifKey, boolean>

const DEFAULT_NOTIFS: Notifs = {
  emailNotifications: true,
  productUpdates: true,
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<{ hasPassword: boolean; email: string; name: string } | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  // Password form
  const [currentPwd, setCurrentPwd] = useState("")
  const [newPwd, setNewPwd] = useState("")
  const [savingPwd, setSavingPwd] = useState(false)
  const [showPwdForm, setShowPwdForm] = useState(false)

  // Notification toggles — loaded from and saved to DB
  const [notifs, setNotifs] = useState<Notifs>(DEFAULT_NOTIFS)
  const [loadingNotifs, setLoadingNotifs] = useState(true)
  const [savingNotif, setSavingNotif] = useState<NotifKey | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, notifRes] = await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/user/notifications"),
        ])

        if (profileRes.ok) {
          const d = await profileRes.json()
          setProfile({ hasPassword: d.user.hasPassword, email: d.user.email, name: d.user.name })
        } else {
          toast.error("Could not load settings")
        }

        if (notifRes.ok) {
          const d = await notifRes.json()
          setNotifs({ ...DEFAULT_NOTIFS, ...d.prefs })
        }
      } catch {
        toast.error("Could not load settings")
      } finally {
        setLoadingProfile(false)
        setLoadingNotifs(false)
      }
    }
    load()
  }, [])

  async function toggleNotif(key: NotifKey) {
    const newValue = !notifs[key]
    // Optimistic update
    setNotifs((prev) => ({ ...prev, [key]: newValue }))
    setSavingNotif(key)
    try {
      const res = await fetch("/api/user/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: newValue }),
      })
      if (!res.ok) throw new Error()
    } catch {
      // Revert on failure
      setNotifs((prev) => ({ ...prev, [key]: !newValue }))
      toast.error("Failed to save preference")
    } finally {
      setSavingNotif(null)
    }
  }

  async function handleChangePassword() {
    if (!currentPwd || !newPwd) return
    setSavingPwd(true)
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success("Password changed")
      setCurrentPwd(""); setNewPwd(""); setShowPwdForm(false)
    } catch (e: any) {
      toast.error(e.message || "Failed to update password")
    } finally {
      setSavingPwd(false)
    }
  }

  const notifItems: { key: NotifKey; label: string; description: string }[] = [
    { key: "emailNotifications", label: "Email notifications", description: "Receive important account updates via email" },
    { key: "productUpdates", label: "Product updates", description: "New features and improvements from InstaAudit" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />

      <main className="ml-72 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">

          {/* Page header */}
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Settings className="h-4 w-4 text-primary" />
              Settings
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your preferences and account security.
            </p>
          </div>

          <div className="space-y-5">

            {/* ── Account info ─────────────────────────────────────── */}
            <div className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Account</h2>
                  <p className="text-xs text-muted-foreground">Your identity and login method</p>
                </div>
              </div>

              {loadingProfile ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/50 px-4 py-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="text-sm font-medium text-foreground">{profile?.name}</p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs">
                      <Link href="/dashboard/profile">
                        Edit <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/50 px-4 py-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Email address</p>
                      <p className="text-sm font-medium text-foreground">{profile?.email}</p>
                    </div>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                      Verified
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/50 px-4 py-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Sign-in method</p>
                      <p className="text-sm font-medium text-foreground">
                        {profile?.hasPassword ? "Email & password" : "Google"}
                      </p>
                    </div>
                    <span className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground">
                      {profile?.hasPassword ? "Credentials" : "OAuth"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ── Security ─────────────────────────────────────────── */}
            <div className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Security</h2>
                  <p className="text-xs text-muted-foreground">Password and login protection</p>
                </div>
              </div>

              {loadingProfile ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                </div>
              ) : profile?.hasPassword ? (
                <>
                  {!showPwdForm ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl gap-2"
                      onClick={() => setShowPwdForm(true)}
                    >
                      <Lock className="h-3.5 w-3.5" />
                      Change password
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Current password</label>
                        <input
                          type="password"
                          value={currentPwd}
                          onChange={(e) => setCurrentPwd(e.target.value)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">New password</label>
                        <input
                          type="password"
                          value={newPwd}
                          onChange={(e) => setNewPwd(e.target.value)}
                          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="Min. 8 characters"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="rounded-xl" onClick={handleChangePassword} disabled={savingPwd || !currentPwd || !newPwd}>
                          {savingPwd ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save password"}
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl" onClick={() => { setShowPwdForm(false); setCurrentPwd(""); setNewPwd("") }}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-2xl border border-border/50 bg-background/40 px-4 py-3 text-sm text-muted-foreground">
                  Your account uses Google sign-in. Password management is handled by Google.
                </div>
              )}
            </div>

            {/* ── Notifications ────────────────────────────────────── */}
            <div className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Notifications</h2>
                    <p className="text-xs text-muted-foreground">Saved to your account across all devices</p>
                  </div>
                </div>
                {loadingNotifs && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              </div>

              <div className="divide-y divide-border/40">
                {notifItems.map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                    <button
                      onClick={() => toggleNotif(key)}
                      disabled={loadingNotifs || savingNotif === key}
                      className={cn(
                        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none disabled:opacity-60",
                        notifs[key] ? "bg-primary" : "bg-muted"
                      )}
                    >
                      {savingNotif === key ? (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="h-3 w-3 animate-spin text-white" />
                        </span>
                      ) : (
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg transition-transform",
                            notifs[key] ? "translate-x-4" : "translate-x-0"
                          )}
                        />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Danger zone ──────────────────────────────────────── */}
            <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                  <Trash2 className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Danger zone</h2>
                  <p className="text-xs text-muted-foreground">Irreversible actions</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                onClick={() => toast.error("Please contact support to delete your account.")}
              >
                Delete account
              </Button>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
