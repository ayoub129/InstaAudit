"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Instagram, TrendingUp, Users, Heart, MessageCircle, Share2 } from "lucide-react"

export default function AnalyticsPage() {
  // Mock data - replace with real data in production
  const metrics = {
    followers: {
      total: 12500,
      change: 12.5,
      trend: "up"
    },
    engagement: {
      rate: 4.8,
      change: 0.5,
      trend: "up"
    },
    reach: {
      total: 45000,
      change: 8.2,
      trend: "up"
    },
    impressions: {
      total: 78000,
      change: 15.3,
      trend: "up"
    }
  }

  const recentPosts = [
    {
      id: 1,
      image: "https://placehold.co/400x400",
      likes: 1234,
      comments: 89,
      shares: 45,
      date: "2024-03-15"
    },
    {
      id: 2,
      image: "https://placehold.co/400x400",
      likes: 987,
      comments: 67,
      shares: 32,
      date: "2024-03-14"
    },
    {
      id: 3,
      image: "https://placehold.co/400x400",
      likes: 1567,
      comments: 123,
      shares: 78,
      date: "2024-03-13"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Track your Instagram performance and growth</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.followers.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={metrics.followers.trend === "up" ? "text-green-500" : "text-red-500"}>
                +{metrics.followers.change}%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.engagement.rate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className={metrics.engagement.trend === "up" ? "text-green-500" : "text-red-500"}>
                +{metrics.engagement.change}%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.reach.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={metrics.reach.trend === "up" ? "text-green-500" : "text-red-500"}>
                +{metrics.reach.change}%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.impressions.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={metrics.impressions.trend === "up" ? "text-green-500" : "text-red-500"}>
                +{metrics.impressions.change}%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts Performance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Posts Performance</CardTitle>
          <CardDescription>Performance metrics for your latest posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {recentPosts.map((post) => (
              <div key={post.id} className="rounded-lg border p-4">
                <img
                  src={post.image}
                  alt={`Post from ${post.date}`}
                  className="mb-4 aspect-square w-full rounded-lg object-cover"
                />
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <Heart className="h-4 w-4 text-pink-500" />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Likes</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">{post.comments}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Comments</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <Share2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">{post.shares}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Shares</p>
                  </div>
                </div>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Posted on {new Date(post.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audience Demographics */}
      <Card>
        <CardHeader>
          <CardTitle>Audience Demographics</CardTitle>
          <CardDescription>Breakdown of your followers by age and location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-sm font-medium">Age Distribution</h3>
              <div className="space-y-4">
                {[
                  { range: "18-24", percentage: 35 },
                  { range: "25-34", percentage: 45 },
                  { range: "35-44", percentage: 15 },
                  { range: "45+", percentage: 5 }
                ].map((age) => (
                  <div key={age.range} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{age.range}</span>
                      <span className="text-sm font-medium">{age.percentage}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-pink-500"
                        style={{ width: `${age.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium">Top Locations</h3>
              <div className="space-y-4">
                {[
                  { location: "United States", percentage: 40 },
                  { location: "United Kingdom", percentage: 25 },
                  { location: "Canada", percentage: 15 },
                  { location: "Australia", percentage: 10 },
                  { location: "Other", percentage: 10 }
                ].map((loc) => (
                  <div key={loc.location} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{loc.location}</span>
                      <span className="text-sm font-medium">{loc.percentage}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-pink-500"
                        style={{ width: `${loc.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 