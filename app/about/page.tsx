import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/landing/navigation"
import { Footer } from "@/components/landing/footer"

export default function AboutPage() {
  const team = [
    { name: "Sarah Johnson", role: "Founder & CEO", image: "👩‍💼" },
    { name: "Mike Chen", role: "CTO", image: "👨‍💻" },
    { name: "Emma Davis", role: "Head of Product", image: "👩‍💼" },
    { name: "Alex Rodriguez", role: "Lead Designer", image: "👨‍🎨" },
  ]

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl mb-4">
              About{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">InstaAudit</span>
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              We're on a mission to help creators and brands unlock their Instagram potential with AI-powered insights.
            </p>
          </div>

          {/* Story Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Story</h2>
              <p className="text-foreground/70 mb-4">
                InstaAudit was founded in 2024 by Sarah Johnson, a former Instagram marketing manager who saw a gap in
                the market. Creating engaging content is hard enough—analyzing what works shouldn't be.
              </p>
              <p className="text-foreground/70 mb-4">
                We built InstaAudit to democratize professional Instagram auditing. What used to cost thousands in
                consulting is now accessible to every creator, small business, and brand.
              </p>
              <p className="text-foreground/70">
                Today, InstaAudit helps thousands of creators grow their audience and engagement with data-driven
                recommendations.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 h-64 flex items-center justify-center">
              <div className="text-6xl">📊</div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Transparency", description: "We believe in honest, clear communication with our users." },
                { title: "Innovation", description: "We continuously improve our AI to deliver better insights." },
                { title: "Empowerment", description: "We help creators take control of their Instagram growth." },
              ].map((value) => (
                <Card key={value.title} className="border-border/50 bg-background/50">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-foreground mb-2 text-lg">{value.title}</h3>
                    <p className="text-foreground/70">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Meet Our Team</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {team.map((member) => (
                <Card key={member.name} className="border-border/50 bg-background/50 text-center">
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-4">{member.image}</div>
                    <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
                    <p className="text-sm text-foreground/60">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12 text-center border border-border/50">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Audit Your Instagram?</h2>
            <p className="text-foreground/70 mb-6">Join thousands of creators using InstaAudit to grow.</p>
            <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 h-12 px-8">
              Get Started Free
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
