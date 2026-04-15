"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Menu, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useActiveSection } from "@/hooks/use-active-section"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/#features", label: "Features", id: "features" },
  { href: "/#how-it-works", label: "How it works", id: "how-it-works" },
  { href: "/#testimonials", label: "Testimonials", id: "testimonials" },
  { href: "/pricing", label: "Pricing", id: "pricing" },
  { href: "/#faq", label: "FAQ", id: "faq" },
  { href: "/blog", label: "Blog", id: "blog" },
] as const

function NavLinks({
  active,
  pathname,
  className,
  onLinkClick,
}: {
  active: string | null
  pathname: string
  className?: string
  onLinkClick?: () => void
}) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-center md:gap-7", className)}>
      {NAV_LINKS.map((link) => {
        const isPricingPage = pathname === "/pricing" && link.id === "pricing"
        const isBlogPage = pathname === "/blog" && link.id === "blog"
        const isHomeSectionActive =
          pathname === "/" &&
          link.href.startsWith("/#") &&
          active === link.id

        const isActive = isPricingPage || isBlogPage || isHomeSectionActive

        return (
          <Link
            key={link.id}
            href={link.href}
            onClick={onLinkClick}
            className={cn(
              "relative text-sm font-medium transition-colors duration-200 hover:text-foreground",
              isActive ? "text-foreground" : "text-foreground/70"
            )}
          >
            <span className="relative inline-block">
              {link.label}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-[2px] rounded-full bg-primary transition-all duration-200",
                  isActive ? "w-full" : "w-0"
                )}
              />
            </span>
          </Link>
        )
      })}
    </div>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-9 w-9 rounded-full border border-transparent hover:border-border/60 hover:bg-primary/10"
      onClick={() => {
        if (!mounted) return
        setTheme(theme === "dark" ? "light" : "dark")
      }}
      aria-label="Toggle theme"
    >
      {mounted ? (
        <>
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </>
      ) : (
        <div className="h-4 w-4" />
      )}
    </Button>
  )
}

export function Navigation() {
  const pathname = usePathname()
  const active = useActiveSection()
  const [sheetOpen, setSheetOpen] = useState(false)

  const isHomePage = useMemo(() => pathname === "/", [pathname])

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-8">
        <div className="flex h-16 min-h-[4rem] items-center justify-between gap-4">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-sm ring-1 ring-white/10 transition-transform duration-200 hover:scale-[1.03]">
              <span className="text-lg font-bold text-primary-foreground">I</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-semibold tracking-tight text-foreground">
                InstaAudit
              </span>
              <span className="hidden text-[11px] text-foreground/50 sm:block">
                AI Instagram insights
              </span>
            </div>
          </Link>

          <div className="hidden md:block">
            <NavLinks active={isHomePage ? active : null} pathname={pathname ?? ""} />
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <Link href="/auth/signin" className="hidden sm:inline-block">
              <Button variant="ghost" size="sm" className="h-9 rounded-full px-4">
                Sign in
              </Button>
            </Link>

            <Link href="/auth/signup" className="hidden sm:inline-block">
              <Button
                size="sm"
                className="h-9 rounded-full bg-gradient-to-r from-primary to-accent px-4 hover:from-primary/90 hover:to-accent/90"
              >
                Get started
              </Button>
            </Link>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-primary/10 md:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[min(85vw,340px)] max-w-[340px] border-l px-0 pt-0"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation menu</SheetTitle>
                </SheetHeader>

                <div className="flex h-full flex-col">
                  <div className="border-b border-border/40 px-6 py-5">
                    <Link
                      href="/"
                      className="flex items-center gap-3"
                      onClick={() => setSheetOpen(false)}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-sm">
                        <span className="text-lg font-bold text-primary-foreground">I</span>
                      </div>
                      <div className="flex flex-col leading-none">
                        <span className="text-lg font-semibold text-foreground">InstaAudit</span>
                        <span className="text-xs text-foreground/50">
                          AI Instagram insights
                        </span>
                      </div>
                    </Link>
                  </div>

                  <div className="flex flex-1 flex-col gap-8 px-6 py-8">
                    <NavLinks
                      active={isHomePage ? active : null}
                      pathname={pathname ?? ""}
                      className="gap-5"
                      onLinkClick={() => setSheetOpen(false)}
                    />

                    <div className="mt-auto flex flex-col gap-3 border-t border-border/40 pt-6">
                      <Link href="/auth/signin" onClick={() => setSheetOpen(false)}>
                        <Button variant="ghost" className="h-11 w-full justify-start rounded-xl">
                          Sign in
                        </Button>
                      </Link>

                      <Link href="/auth/signup" onClick={() => setSheetOpen(false)}>
                        <Button className="h-11 w-full rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                          Get started
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}