import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/landing/navigation"
import { Footer } from "@/components/landing/footer"

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "10 Instagram Caption Mistakes You're Making",
      excerpt: "Learn the most common caption errors that creators make and how to fix them.",
      date: "Jan 8, 2026",
      category: "Tips & Tricks",
      image: "📝",
    },
    {
      id: 2,
      title: "The Science Behind Instagram Engagement",
      excerpt: "Discover what actually drives engagement on Instagram based on data from millions of posts.",
      date: "Jan 5, 2026",
      category: "Strategy",
      image: "📊",
    },
    {
      id: 3,
      title: "How to Create a 30-Day Content Calendar",
      excerpt: "A step-by-step guide to planning your Instagram content for maximum consistency and reach.",
      date: "Jan 1, 2026",
      category: "Planning",
      image: "📅",
    },
    {
      id: 4,
      title: "Hashtag Strategy: What Works in 2026",
      excerpt: "The latest best practices for hashtag research and selection to grow your reach.",
      date: "Dec 28, 2025",
      category: "Growth",
      image: "#️⃣",
    },
    {
      id: 5,
      title: "Instagram Stories vs. Reels: When to Use What",
      excerpt: "Understand the differences and learn which format works best for your goals.",
      date: "Dec 25, 2025",
      category: "Formats",
      image: "🎬",
    },
    {
      id: 6,
      title: "The Psychology of Color in Instagram Posts",
      excerpt: "How color choices impact user engagement and what colors work best in 2026.",
      date: "Dec 22, 2025",
      category: "Design",
      image: "🎨",
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
              InstaAudit{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Blog</span>
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Tips, strategies, and insights to grow your Instagram presence.
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <Card className="border-border/50 bg-background/50 hover:border-primary/50 transition-colors h-full cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-4">{post.image}</div>
                    <span className="inline-block px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full mb-3">
                      {post.category}
                    </span>
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="text-sm text-foreground/70 mb-4 line-clamp-2">{post.excerpt}</p>
                    <p className="text-xs text-foreground/50">{post.date}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-12 text-center border border-border/50">
            <h2 className="text-3xl font-bold text-foreground mb-4">Stay Updated</h2>
            <p className="text-foreground/70 mb-6">
              Get the latest Instagram tips and strategies delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-lg border border-border/50 bg-background/50 px-4 py-2 text-sm text-foreground placeholder:text-foreground/50"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-medium hover:from-primary/90 hover:to-accent/90 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
