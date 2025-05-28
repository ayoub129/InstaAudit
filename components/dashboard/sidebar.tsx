"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CreditCard, Home, Instagram, LogOut, PieChart, Settings, User } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const routes = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "New Audit",
      href: "/dashboard/audit",
      icon: Instagram,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: PieChart,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: CreditCard,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen min-w-full bg-slate-50">
        <Sidebar className="w-64 bg-white border-r shadow-sm flex flex-col justify-between">
          <SidebarHeader className="flex items-center gap-2 px-6 py-6 border-b">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Instagram className="h-7 w-7 text-pink-500" />
              <span className="text-2xl font-bold tracking-tight">InstaAudit</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="flex-1 px-2 py-6">
            <SidebarMenu className="space-y-1">
              {routes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === route.href}
                    className={`group flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      pathname === route.href
                        ? "bg-pink-50 text-pink-600 font-semibold"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Link href={route.href} className="flex items-center gap-3 w-full">
                      <route.icon className={`h-5 w-5 ${pathname === route.href ? "text-pink-500" : "text-slate-500 group-hover:text-pink-500"}`} />
                      <span>{route.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="px-6 py-6 border-t flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="h-5 w-5 text-slate-500" />
              </div>
              <div>
                <div className="font-medium leading-tight">John Doe</div>
                <Link href="/dashboard/profile" className="text-xs text-muted-foreground hover:underline">View Profile</Link>
              </div>
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/logout" className="flex items-center gap-3 text-red-500 hover:text-red-600">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 min-h-screen flex flex-col">
          <div className="flex h-16 items-center gap-4 border-b bg-background px-8">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-4" />
          </div>
          <div className="flex-1 p-8 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}
