import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/landing/navigation"
import { Footer } from "@/components/landing/footer"

export default function SupportPage() {
  const faqs = [
    {
      question: "How does InstaAudit analyze my Instagram account?",
      answer:
        "InstaAudit uses advanced AI to analyze your profile, captions, hashtags, engagement patterns, and content strategy. We compare your performance against industry benchmarks to provide actionable insights.",
    },
    {
      question: "Can I export my audit results?",
      answer:
        "Yes! All audit results can be downloaded as a PDF report from your dashboard. Pro and Agency plans include automated weekly reports.",
    },
    {
      question: "Is my Instagram data secure?",
      answer:
        "Absolutely. We use enterprise-grade encryption and never store your Instagram password. We only access publicly available information from your profile.",
    },
    {
      question: "How often should I audit my account?",
      answer:
        "We recommend auditing your account weekly to track progress. Pro and Agency plans include automated audits on your schedule.",
    },
    {
      question: "Can I use InstaAudit for multiple accounts?",
      answer:
        "Yes! Pro and Agency plans allow you to audit multiple accounts. Each account has its own dashboard and insights.",
    },
    {
      question: "What if I'm not satisfied with the results?",
      answer:
        "We offer a 30-day money-back guarantee. If you're not satisfied, contact our support team for a full refund.",
    },
  ]

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-4">
              Help &{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Support</span>
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Find answers to common questions or reach out to our support team.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="border-border/50 bg-background/50">
              <CardContent className="pt-6">
                <div className="text-3xl mb-3">📖</div>
                <h3 className="font-semibold text-foreground mb-2">Documentation</h3>
                <p className="text-sm text-foreground/70 mb-4">Learn how to get the most out of InstaAudit</p>
                <Button variant="ghost" className="text-primary hover:text-primary/90">
                  Read Docs →
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-background/50">
              <CardContent className="pt-6">
                <div className="text-3xl mb-3">🎓</div>
                <h3 className="font-semibold text-foreground mb-2">Tutorials</h3>
                <p className="text-sm text-foreground/70 mb-4">Video guides to help you get started</p>
                <Button variant="ghost" className="text-primary hover:text-primary/90">
                  Watch Videos →
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-background/50">
              <CardContent className="pt-6">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="font-semibold text-foreground mb-2">Contact Support</h3>
                <p className="text-sm text-foreground/70 mb-4">Reach our support team directly</p>
                <Link href="/contact">
                  <Button variant="ghost" className="text-primary hover:text-primary/90">
                    Get Help →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-border/50 bg-background/50">
                  <CardContent className="pt-6">
                    <details className="group cursor-pointer">
                      <summary className="flex justify-between items-center font-semibold text-foreground">
                        {faq.question}
                        <span className="text-accent group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="mt-4 text-foreground/70 text-sm">{faq.answer}</p>
                    </details>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Status Section */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12 text-center border border-border/50">
            <h2 className="text-2xl font-bold text-foreground mb-4">System Status</h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-foreground">All systems operational</span>
            </div>
            <p className="text-foreground/70 text-sm">Last updated 2 minutes ago</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
