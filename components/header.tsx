import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Instagram } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

function ScrollLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const targetId = href.split('#')[1]
    
    if (pathname !== '/') {
      // If we're not on the home page, navigate to home page with hash
      router.push(`/#${targetId}`)
    } else {
      // If we're already on the home page, just scroll
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Instagram className="h-6 w-6 text-pink-500" />
          <span className="text-xl font-bold">InstaAudit</span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          <ScrollLink href="#features" className="text-sm font-medium transition-colors hover:text-primary">
            Features
          </ScrollLink>
          <ScrollLink href="#testimonials" className="text-sm font-medium transition-colors hover:text-primary">
            Testimonials
          </ScrollLink>
          <ScrollLink href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
            Pricing
          </ScrollLink>
          <ScrollLink href="#faq" className="text-sm font-medium transition-colors hover:text-primary">
            FAQ
          </ScrollLink>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="hidden md:flex">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-pink-500 hover:bg-pink-600">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
