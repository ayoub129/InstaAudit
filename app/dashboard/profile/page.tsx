"use client"

import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import {
  Camera,
  Check,
  Crown,
  FileSearch,
  Instagram,
  Loader2,
  Lock,
  Pencil,
  Shield,
  Sparkles,
  User,
  UserCircle2,
  X,
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PlanKey = "free" | "starter" | "pro" | "agency"

const PLAN_COLORS: Record<PlanKey, string> = {
  free: "border-border/60 bg-muted/40 text-muted-foreground",
  starter: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  pro: "border-primary/20 bg-primary/10 text-primary",
  agency: "border-amber-500/20 bg-amber-500/10 text-amber-400",
}

interface ProfileData {
  name: string
  email: string
  image: string | null
  createdAt: string
  hasPassword: boolean
  subscriptionPlan: PlanKey
  subscriptionStatus: string
}

interface InstagramData {
  username: string
  accountType: string
  instagramUserId: string
  tokenExpiresAt: string | null
  connectedAt: string
}

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession()
  const fileRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [instagram, setInstagram] = useState<InstagramData | null>(null)
  const [auditCount, setAuditCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Edit state
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState("")
  const [savingName, setSavingName] = useState(false)

  // Image
  const [uploadingImage, setUploadingImage] = useState(false)

  // Password
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPwd, setCurrentPwd] = useState("")
  const [newPwd, setNewPwd] = useState("")
  const [savingPwd, setSavingPwd] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/user/profile")
        if (!res.ok) throw new Error()
        const data = await res.json()
        setProfile(data.user)
        setInstagram(data.instagram)
        setAuditCount(data.auditCount)
        setNameValue(data.user.name)
      } catch {
        toast.error("Could not load profile")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleSaveName() {
    if (!nameValue.trim()) return
    setSavingName(true)
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameValue }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setProfile((p) => p ? { ...p, name: nameValue.trim() } : p)
      await updateSession({ name: nameValue.trim() })
      setEditingName(false)
      toast.success("Name updated")
    } catch (e: any) {
      toast.error(e.message || "Failed to update name")
    } finally {
      setSavingName(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2 MB")
      return
    }

    setUploadingImage(true)
    try {
      const dataUrl = await fileToDataUrl(file)
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setProfile((p) => p ? { ...p, image: dataUrl } : p)
      await updateSession({ picture: dataUrl })
      toast.success("Profile photo updated")
    } catch (e: any) {
      toast.error(e.message || "Failed to upload image")
    } finally {
      setUploadingImage(false)
      e.target.value = ""
    }
  }

  async function handleRemoveImage() {
    setUploadingImage(true)
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: null }),
      })
      if (!res.ok) throw new Error()
      setProfile((p) => p ? { ...p, image: null } : p)
      await updateSession({ picture: null })
      toast.success("Photo removed")
    } catch {
      toast.error("Failed to remove photo")
    } finally {
      setUploadingImage(false)
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
      toast.success("Password changed successfully")
      setCurrentPwd("")
      setNewPwd("")
      setShowPasswordForm(false)
    } catch (e: any) {
      toast.error(e.message || "Failed to change password")
    } finally {
      setSavingPwd(false)
    }
  }

  const plan = profile?.subscriptionPlan ?? "free"
  const initials = profile?.name
    ? profile.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />

      <main className="ml-72 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">

          {/* Page header */}
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4 text-primary" />
              My Profile
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your personal details and account settings.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center rounded-3xl border border-border/50 bg-card/70 py-32">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-5">

              {/* ── Avatar + name card ───────────────────────────────── */}
              <div className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">

                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="group relative h-24 w-24 overflow-hidden rounded-3xl border-2 border-border/60">
                      {profile?.image ? (
                        <img
                          src={profile.image}
                          alt={profile.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-pink-500/15 to-orange-400/20 text-2xl font-bold text-primary">
                          {initials}
                        </div>
                      )}

                      {uploadingImage && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </div>
                      )}
                    </div>

                    {/* Upload button */}
                    <button
                      onClick={() => fileRef.current?.click()}
                      disabled={uploadingImage}
                      className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-background shadow-sm transition-colors hover:bg-muted"
                      title="Upload photo"
                    >
                      <Camera className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {/* Name row */}
                    <div className="flex items-center gap-2">
                      {editingName ? (
                        <div className="flex flex-1 items-center gap-2">
                          <input
                            value={nameValue}
                            onChange={(e) => setNameValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                            autoFocus
                            className="flex-1 rounded-xl border border-primary/40 bg-background px-3 py-1.5 text-lg font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                          <button
                            onClick={handleSaveName}
                            disabled={savingName}
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20"
                          >
                            {savingName ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => { setEditingName(false); setNameValue(profile?.name ?? "") }}
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground hover:bg-muted"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <h2 className="text-xl font-bold text-foreground">{profile?.name}</h2>
                          <button
                            onClick={() => setEditingName(true)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">{profile?.email}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize",
                          PLAN_COLORS[plan as PlanKey]
                        )}
                      >
                        {plan} plan
                      </span>

                      {profile?.createdAt && (
                        <span className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 text-[11px] text-muted-foreground">
                          Member since {format(new Date(profile.createdAt), "MMM yyyy")}
                        </span>
                      )}
                    </div>

                    {profile?.image && (
                      <button
                        onClick={handleRemoveImage}
                        disabled={uploadingImage}
                        className="mt-3 text-xs text-muted-foreground underline-offset-2 hover:text-red-400 hover:underline"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Stats row ─────────────────────────────────────────── */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  { label: "Total audits run", value: auditCount.toString(), icon: FileSearch },
                  {
                    label: "Current plan",
                    value: plan.charAt(0).toUpperCase() + plan.slice(1),
                    icon: Crown,
                  },
                  {
                    label: "Account status",
                    value: profile?.subscriptionStatus ?? "inactive",
                    icon: Sparkles,
                  },
                ].map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-3xl border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-xl"
                  >
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-1 text-base font-bold capitalize text-foreground">{value}</p>
                  </div>
                ))}
              </div>

              {/* ── Connected Instagram ───────────────────────────────── */}
              <div className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-pink-500/15 to-orange-400/20 text-primary">
                    <Instagram className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Instagram Account</h3>
                    <p className="text-xs text-muted-foreground">Connected via Instagram Graph API</p>
                  </div>
                </div>

                {instagram ? (
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">@{instagram.username}</span>
                          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                            Connected
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground capitalize">
                          {instagram.accountType.toLowerCase()} account · ID {instagram.instagramUserId}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Connected {format(new Date(instagram.connectedAt), "MMM d, yyyy")}
                          {instagram.tokenExpiresAt && (
                            <> · Token expires {format(new Date(instagram.tokenExpiresAt), "MMM d, yyyy")}</>
                          )}
                        </p>
                      </div>
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border bg-background/40 px-4 py-5 text-center">
                    <p className="text-sm text-muted-foreground">No Instagram account connected.</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Upgrade to Starter or higher to connect your account for deeper insights.
                    </p>
                    <Button asChild size="sm" className="mt-4 rounded-xl gap-2 bg-gradient-to-r from-primary via-pink-500 to-orange-400 text-white hover:opacity-90">
                      <a href="/pricing">Upgrade to connect</a>
                    </Button>
                  </div>
                )}
              </div>

              {/* ── Security ─────────────────────────────────────────── */}
              <div className="rounded-3xl border border-border/50 bg-card/70 p-6 shadow-sm backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Security</h3>
                    <p className="text-xs text-muted-foreground">Manage your login credentials</p>
                  </div>
                </div>

                {profile?.hasPassword ? (
                  <>
                    {!showPasswordForm ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl gap-2"
                        onClick={() => setShowPasswordForm(true)}
                      >
                        <Lock className="h-3.5 w-3.5" />
                        Change password
                      </Button>
                    ) : (
                      <div className="space-y-3 max-w-sm">
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
                          <Button
                            size="sm"
                            className="rounded-xl"
                            onClick={handleChangePassword}
                            disabled={savingPwd || !currentPwd || !newPwd}
                          >
                            {savingPwd ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save password"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl"
                            onClick={() => { setShowPasswordForm(false); setCurrentPwd(""); setNewPwd("") }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="rounded-2xl border border-border/50 bg-background/40 px-4 py-3 text-sm text-muted-foreground">
                    Your account uses Google sign-in — no password needed.
                  </div>
                )}
              </div>

              {/* ── Profile completeness hint ─────────────────────────── */}
              <div className="rounded-3xl border border-primary/15 bg-primary/5 p-5">
                <div className="flex items-start gap-3">
                  <UserCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Profile tip</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Adding a profile photo and keeping your name up to date helps personalize your InstaAudit experience.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
