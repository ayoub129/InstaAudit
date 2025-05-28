import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Download,
  Instagram,
  MessageSquare,
  Share2,
  ThumbsUp,
  Users,
} from "lucide-react"

export default function AuditResultsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Audit Results</h2>
            <Badge className="bg-green-500">Completed</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Instagram className="h-4 w-4 text-pink-500" />
            <p className="text-muted-foreground">@johndoe • May 22, 2025</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bio Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78/100</div>
            <div className="mt-1 flex items-center text-xs text-green-500">
              <ArrowUpRight className="mr-1 h-3 w-3" />5 points improvement
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
              <div className="h-2 w-[78%] rounded-full bg-pink-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6%</div>
            <div className="mt-1 flex items-center text-xs text-green-500">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              0.8% increase
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
              <div className="h-2 w-[46%] rounded-full bg-pink-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Content Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85/100</div>
            <div className="mt-1 flex items-center text-xs text-green-500">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              12 points improvement
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
              <div className="h-2 w-[85%] rounded-full bg-pink-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="bio">Bio Analysis</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>
        <TabsContent value="insights" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>AI-generated insights based on your Instagram profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-green-100 p-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Strong Visual Identity</p>
                    <p className="text-sm text-muted-foreground">
                      Your profile has a consistent color scheme and visual style, which helps with brand recognition.
                      Continue using similar filters and color palettes in your content.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-amber-100 p-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Bio Optimization Needed</p>
                    <p className="text-sm text-muted-foreground">
                      Your bio lacks clear call-to-action and relevant keywords. Consider adding a direct CTA and
                      industry-specific keywords to improve discoverability.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-green-100 p-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Optimal Posting Frequency</p>
                    <p className="text-sm text-muted-foreground">
                      You're posting 3-4 times per week, which is ideal for your audience size. Maintain this
                      consistency to keep engagement levels high.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-amber-100 p-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Low Comment Response Rate</p>
                    <p className="text-sm text-muted-foreground">
                      You're only responding to 23% of comments. Try to respond to at least 80% of comments within 24
                      hours to boost engagement and build community.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Actionable steps to improve your Instagram performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">1. Update Your Bio</h3>
                <p className="text-sm text-muted-foreground">
                  Add a clear call-to-action and relevant keywords to your bio. Include what you do, who you serve, and
                  how to contact you.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">2. Increase Story Engagement</h3>
                <p className="text-sm text-muted-foreground">
                  Use interactive stickers (polls, questions, quizzes) in your Stories to boost engagement. Your Stories
                  currently have a 5% interaction rate, which could be improved.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">3. Optimize Hashtag Strategy</h3>
                <p className="text-sm text-muted-foreground">
                  Your current hashtags are too broad. Use a mix of niche-specific hashtags with 10K-500K posts for
                  better reach. We recommend: #instagramtips #contentcreator #socialmediagrowth
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">4. Create More Carousel Posts</h3>
                <p className="text-sm text-muted-foreground">
                  Your carousel posts receive 34% more engagement than single images. Aim to create at least 2 carousel
                  posts per week with educational content.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-pink-500 hover:bg-pink-600">Generate Detailed Action Plan</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="bio" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bio Analysis</CardTitle>
              <CardDescription>Detailed analysis of your Instagram bio and profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Current Bio</h3>
                <div className="rounded-lg border p-4">
                  <p className="text-sm">
                    📸 Photography & Lifestyle
                    <br />✨ Creating memories
                    <br />🌍 Travel enthusiast
                    <br />📍 New York
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Bio Score Breakdown</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Clarity</p>
                      <p className="text-sm font-medium">7/10</p>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 w-[70%] rounded-full bg-pink-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Keywords</p>
                      <p className="text-sm font-medium">6/10</p>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 w-[60%] rounded-full bg-pink-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Call-to-Action</p>
                      <p className="text-sm font-medium">3/10</p>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 w-[30%] rounded-full bg-pink-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Formatting</p>
                      <p className="text-sm font-medium">9/10</p>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 w-[90%] rounded-full bg-pink-500" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Suggested Bio Improvements</h3>
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="text-sm">
                    📸 NYC Photographer | Lifestyle & Travel
                    <br />✨ Helping brands tell visual stories
                    <br />🌍 Featured in @magazine & @publication
                    <br />👇 Book a session or get my presets
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  This improved bio clearly states what you do, adds credibility with features, and includes a strong
                  call-to-action.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-pink-500 hover:bg-pink-600">Generate More Bio Options</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="content" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Analysis</CardTitle>
              <CardDescription>Insights about your post performance and content strategy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Content Type Performance</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Carousel Posts</p>
                      <Badge className="bg-green-500">Best Performer</Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Average Engagement</p>
                      <p className="font-medium">6.2%</p>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 w-[62%] rounded-full bg-pink-500" />
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Single Images</p>
                      <Badge variant="outline">Average</Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Average Engagement</p>
                      <p className="font-medium">4.1%</p>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 w-[41%] rounded-full bg-pink-500" />
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Reels</p>
                      <Badge variant="outline">Needs Improvement</Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Average Engagement</p>
                      <p className="font-medium">3.5%</p>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 w-[35%] rounded-full bg-pink-500" />
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Stories</p>
                      <Badge variant="outline">Average</Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Completion Rate</p>
                      <p className="font-medium">68%</p>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-2 w-[68%] rounded-full bg-pink-500" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Top Performing Content</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <div className="aspect-square w-full bg-slate-100"></div>
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">342 likes</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">48 comments</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="aspect-square w-full bg-slate-100"></div>
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">287 likes</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">36 comments</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="aspect-square w-full bg-slate-100"></div>
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">256 likes</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">29 comments</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Content Recommendations</h3>
                <div className="rounded-lg border p-4 space-y-3">
                  <div className="space-y-1">
                    <p className="font-medium">Create more educational carousels</p>
                    <p className="text-sm text-muted-foreground">
                      Your educational content receives 42% more saves than other content types. Focus on creating more
                      how-to and tip-based carousel posts.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Improve Reels strategy</p>
                    <p className="text-sm text-muted-foreground">
                      Your Reels have lower engagement than industry average. Try using trending audio, keeping videos
                      under 15 seconds, and adding text overlays.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Optimize posting times</p>
                    <p className="text-sm text-muted-foreground">
                      Based on your audience activity, the best times to post are: Monday 7-8pm, Wednesday 12-1pm, and
                      Saturday 10-11am.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="engagement" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Analysis</CardTitle>
              <CardDescription>Detailed breakdown of your audience engagement metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Engagement Overview</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-5 w-5 text-pink-500" />
                      <p className="font-medium">Like Rate</p>
                    </div>
                    <p className="mt-2 text-2xl font-bold">4.2%</p>
                    <div className="mt-1 flex items-center text-xs text-green-500">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      0.5% increase
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-pink-500" />
                      <p className="font-medium">Comment Rate</p>
                    </div>
                    <p className="mt-2 text-2xl font-bold">0.8%</p>
                    <div className="mt-1 flex items-center text-xs text-green-500">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      0.2% increase
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-pink-500" />
                      <p className="font-medium">Follower Growth</p>
                    </div>
                    <p className="mt-2 text-2xl font-bold">3.8%</p>
                    <div className="mt-1 flex items-center text-xs text-green-500">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      1.2% increase
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Engagement by Content Type</h3>
                <div className="rounded-lg border p-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Carousel Posts</p>
                        <p className="text-sm font-medium">6.2%</p>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                        <div className="h-2 w-[62%] rounded-full bg-pink-500" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Single Images</p>
                        <p className="text-sm font-medium">4.1%</p>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                        <div className="h-2 w-[41%] rounded-full bg-pink-500" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Reels</p>
                        <p className="text-sm font-medium">3.5%</p>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                        <div className="h-2 w-[35%] rounded-full bg-pink-500" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm">IGTV</p>
                        <p className="text-sm font-medium">2.8%</p>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
                        <div className="h-2 w-[28%] rounded-full bg-pink-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Audience Insights</h3>
                <div className="rounded-lg border p-4 space-y-4">
                  <div className="space-y-1">
                    <p className="font-medium">Active Hours</p>
                    <p className="text-sm text-muted-foreground">
                      Your audience is most active between 7-9pm on weekdays and 10am-1pm on weekends.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Demographics</p>
                    <p className="text-sm text-muted-foreground">
                      Your audience is primarily 25-34 years old (42%), followed by 18-24 (28%). 65% female, 35% male.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Top Locations</p>
                    <p className="text-sm text-muted-foreground">
                      United States (45%), United Kingdom (15%), Canada (12%), Australia (8%), Germany (5%)
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Engagement Recommendations</h3>
                <div className="rounded-lg border p-4 space-y-3">
                  <div className="space-y-1">
                    <p className="font-medium">Increase comment responses</p>
                    <p className="text-sm text-muted-foreground">
                      Respond to at least 80% of comments within 24 hours to boost engagement and build community.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Use more interactive Story features</p>
                    <p className="text-sm text-muted-foreground">
                      Incorporate polls, questions, and quizzes in your Stories to increase interaction rates.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Optimize posting schedule</p>
                    <p className="text-sm text-muted-foreground">
                      Adjust your posting schedule to align with your audience's most active hours for maximum reach.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-pink-500 hover:bg-pink-600">Generate Detailed Engagement Report</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
