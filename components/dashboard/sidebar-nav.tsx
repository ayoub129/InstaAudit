"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  CreditCard,
  History,
  Settings,
  HelpCircle,
  ShieldCheck,
  Users,
  LifeBuoy,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Audit History",
    href: "/dashboard/history",
    icon: History,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
  },
  {
    label: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    label: "Help",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "admin"
  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/")

  const adminItems = [
    {
      label: "Admin",
      href: "/admin",
      icon: ShieldCheck,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Support",
      href: "/admin/support",
      icon: LifeBuoy,
    },
  ]

  const itemsToRender = isAdmin && isAdminArea ? adminItems : navItems

  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-64px)] w-72 border-r border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex h-full flex-col px-4 py-8">
        <nav className="flex-1 space-y-1.5">
          {itemsToRender.map((item) => {
            const Icon = item.icon
            const isActive =
              item.href === "/dashboard" || item.href === "/admin"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(item.href + "/")

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200",
                    isActive
                      ? "border-primary/20 bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <span>{item.label}</span>
              </Link>
            )
          })}

          {isAdmin && !isAdminArea && (
            <Link
              href="/admin"
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                pathname === "/admin" || pathname.startsWith("/admin/")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200",
                  pathname === "/admin" || pathname.startsWith("/admin/")
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground group-hover:text-foreground"
                )}
              >
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span>Admin</span>
            </Link>
          )}
        </nav>

        <div className="my-3 h-px bg-border" />

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted/60 hover:text-red-500"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background">
            <LogOut className="h-4 w-4" />
          </div>
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )
}