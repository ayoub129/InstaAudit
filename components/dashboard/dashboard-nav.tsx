"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Moon, Sun, UserCircle2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { SidebarNav } from "./sidebar-nav"

export function DashboardNav() {
  const { data: session } = useSession()
  const firstName = session?.user?.name?.split(" ")[0] || "there"
  const userImage = session?.user?.image ?? null
  const userName = session?.user?.name ?? ""
  const initials = userName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?"

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-pink-500 to-orange-400 shadow-lg">
                <span className="text-base font-bold text-white">I</span>
              </div>

              <div className="leading-none">
                <p className="text-base font-semibold text-foreground">InstaAudit</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Welcome back, {firstName}
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-xl"
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              )}

              {/* Profile avatar / icon */}
              <Link
                href="/dashboard/profile"
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-muted/40 transition-colors hover:border-primary/40 hover:bg-primary/10"
              >
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    className="h-full w-full object-cover"
                  />
                ) : initials !== "?" ? (
                  <span className="text-xs font-bold text-primary">{initials}</span>
                ) : (
                  <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                )}
              </Link>

              <Button
                asChild
                className="rounded-xl bg-gradient-to-r from-primary via-pink-500 to-orange-400 text-white hover:opacity-95"
              >
                <Link href="/pricing">Upgrade</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <SidebarNav />
    </>
  )
}