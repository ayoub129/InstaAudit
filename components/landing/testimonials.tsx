import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export function LandingTestimonials() {
  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-pink-100 px-3 py-1 text-sm text-pink-500">Testimonials</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Loved by Instagram Creators</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              See what our users are saying about how InstaAudit has transformed their Instagram presence.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
              </div>
              <p className="mb-6 text-muted-foreground">
                "InstaAudit completely transformed my Instagram strategy. The AI recommendations were spot on, and I've
                seen a 40% increase in engagement since implementing them."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden">
                  <Image src="/placeholder.svg?height=40&width=40" alt="Sarah Johnson" width={40} height={40} />
                </div>
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Lifestyle Influencer</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
              </div>
              <p className="mb-6 text-muted-foreground">
                "The detailed analytics helped me understand what content my audience actually wants. My follower growth
                has been steady since I started using InstaAudit."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden">
                  <Image src="/placeholder.svg?height=40&width=40" alt="Mark Thompson" width={40} height={40} />
                </div>
                <div>
                  <p className="font-medium">Mark Thompson</p>
                  <p className="text-sm text-muted-foreground">Fitness Coach</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
              </div>
              <p className="mb-6 text-muted-foreground">
                "As a small business owner, I needed to improve our Instagram presence. InstaAudit provided clear,
                actionable steps that even a non-tech person could follow."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden">
                  <Image src="/placeholder.svg?height=40&width=40" alt="Emily Chen" width={40} height={40} />
                </div>
                <div>
                  <p className="font-medium">Emily Chen</p>
                  <p className="text-sm text-muted-foreground">Small Business Owner</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
