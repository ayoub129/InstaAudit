import { BarChart3, Sparkles, TrendingUp, Users, Clock, Shield } from "lucide-react"

export function LandingFeatures() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-pink-100 px-3 py-1 text-sm text-pink-500">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Everything You Need to Grow on Instagram
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our AI-powered tools analyze your Instagram profile and provide actionable insights to help you grow your
              audience and engagement.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
          <div className="grid gap-4 p-6 bg-white rounded-xl shadow-sm">
            <BarChart3 className="h-10 w-10 text-pink-500" />
            <h3 className="text-xl font-bold">Engagement Analytics</h3>
            <p className="text-muted-foreground">
              Get detailed insights on your post performance, audience engagement, and growth trends.
            </p>
          </div>
          <div className="grid gap-4 p-6 bg-white rounded-xl shadow-sm">
            <Sparkles className="h-10 w-10 text-pink-500" />
            <h3 className="text-xl font-bold">AI Content Recommendations</h3>
            <p className="text-muted-foreground">
              Receive personalized content suggestions based on what resonates with your audience.
            </p>
          </div>
          <div className="grid gap-4 p-6 bg-white rounded-xl shadow-sm">
            <TrendingUp className="h-10 w-10 text-pink-500" />
            <h3 className="text-xl font-bold">Growth Strategy</h3>
            <p className="text-muted-foreground">
              Get a customized growth plan with actionable steps to increase your followers and engagement.
            </p>
          </div>
          <div className="grid gap-4 p-6 bg-white rounded-xl shadow-sm">
            <Users className="h-10 w-10 text-pink-500" />
            <h3 className="text-xl font-bold">Audience Insights</h3>
            <p className="text-muted-foreground">
              Understand your audience demographics, interests, and behavior patterns.
            </p>
          </div>
          <div className="grid gap-4 p-6 bg-white rounded-xl shadow-sm">
            <Clock className="h-10 w-10 text-pink-500" />
            <h3 className="text-xl font-bold">Optimal Posting Times</h3>
            <p className="text-muted-foreground">
              Discover the best times to post for maximum reach and engagement with your audience.
            </p>
          </div>
          <div className="grid gap-4 p-6 bg-white rounded-xl shadow-sm">
            <Shield className="h-10 w-10 text-pink-500" />
            <h3 className="text-xl font-bold">Profile Security Check</h3>
            <p className="text-muted-foreground">
              Identify potential security issues and privacy concerns with your Instagram profile.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
