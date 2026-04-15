"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Twitter, Instagram, Linkedin, Send, Sparkles } from "lucide-react"

const SOCIAL = [
  { href: "https://twitter.com/instaaudit", icon: Twitter, label: "Twitter" },
  { href: "https://instagram.com/instaaudit", icon: Instagram, label: "Instagram" },
  { href: "https://linkedin.com/company/instaaudit", icon: Linkedin, label: "LinkedIn" },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")
  const [message, setMessage] = useState<string | null>(null)
  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault()
  
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) return
  
    setStatus("loading")
    setMessage(null)
  
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      })
  
      const data = await res.json()
  
      if (!res.ok) {
        setStatus("error")
        setMessage(data.error || "Something went wrong.")
        return
      }
  
      setStatus("done")
      setMessage(data.message || "Thanks for subscribing!")
      setEmail("")
    } catch {
      setStatus("error")
      setMessage("Something went wrong. Please try again.")
    }
  }
  return (
    <footer className="relative overflow-hidden border-t border-border/40 bg-foreground/[0.03] px-5 py-12 sm:px-6 sm:py-14 md:px-8 md:py-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-primary/6 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-accent/6 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-10 sm:mb-12 sm:gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="md:col-span-2 lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-sm">
                <span className="text-sm font-bold text-primary-foreground">I</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-semibold tracking-tight text-foreground">
                  InstaAudit
                </span>
                <span className="text-xs text-foreground/50">
                  AI-powered Instagram insights
                </span>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-6 text-foreground/62">
              InstaAudit helps creators, brands, and marketers understand how their Instagram
              profile comes across and what to improve next.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Free audit. Clear recommendations. Faster growth direction.
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-foreground/75">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-foreground/60">
              <li>
                <a href="/#features" className="transition hover:text-foreground">
                  Features
                </a>
              </li>
              <li>
                <Link href="/pricing" className="transition hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition hover:text-foreground">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-foreground/75">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-foreground/60">
              <li>
                <Link href="/about" className="transition hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/support" className="transition hover:text-foreground">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-foreground/75">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-foreground/60">
              <li>
                <Link href="/legal/privacy" className="transition hover:text-foreground">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="transition hover:text-foreground">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="transition hover:text-foreground">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-10 rounded-[1.5rem] border border-border/50 bg-background/65 p-5 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h4 className="text-lg font-semibold tracking-tight text-foreground">
                Join the newsletter
              </h4>
              <p className="mt-2 text-sm leading-6 text-foreground/60">
                Product updates, Instagram growth tips, and practical ideas to improve your profile.
                No spam.
              </p>
            </div>

            <div className="w-full max-w-md">
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="h-11 rounded-xl border-border/60 bg-background"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 hover:shadow-lg hover:shadow-primary/20"
                  disabled={status === "loading"}
                  aria-label="Subscribe"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>

              {status === "done" && message && (
                <p className="mt-2 text-xs text-primary">{message}</p>
              )}
              {status === "error" && message && (
                <p className="mt-2 text-xs text-destructive">{message}</p>
              )}           
               </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border/40 pt-6 sm:flex-row sm:items-center sm:justify-between sm:pt-8">
          <p className="text-sm text-foreground/60">
            © 2026 InstaAudit. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {SOCIAL.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/50 transition-all duration-200 hover:scale-110 hover:text-primary"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}