"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { PlanKey } from "@/lib/plans/plan-config"

type PostAuditResult = {
  postUrl: string
  mediaCode: string
  ownerUsername: string | null
  scores: {
    hookScore: number
    captionScore: number
    hashtagFitScore: number
  }
  engagement: {
    likes: number
    comments: number
    engagementVsAccountAveragePct: number
    accountAverageEngagementRate: number
  }
  comments: {
    analyzedCount: number
    sentiment: {
      positiveRate: number
      negativeRate: number
      neutralRate: number
    }
    topThemes: string[]
  }
  rewriteSuggestions: string[]
}

type PostAuditCardProps = {
  plan: PlanKey
}

export function PostAuditCard({ plan }: PostAuditCardProps) {
  const [postUrl, setPostUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PostAuditResult | null>(null)

  const isAllowed = plan === "pro" || plan === "agency"

  async function analyzePost() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch("/api/audits/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postUrl }),
      })
      const json = (await res.json()) as { error?: string; result?: PostAuditResult }
      if (!res.ok) {
        throw new Error(json.error || "Failed to analyze post")
      }
      if (json.result) setResult(json.result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mt-8 border-border/40">
      <CardHeader>
        <CardTitle>Single Post Audit</CardTitle>
        <CardDescription>
          Deep analysis for one Instagram post URL: hook, caption, hashtags, sentiment, and benchmark.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isAllowed ? (
          <div className="rounded-xl border border-border/50 bg-muted/30 p-4 text-sm text-muted-foreground">
            Post-level audits are available on Pro and Agency plans.
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={postUrl}
                onChange={(event) => setPostUrl(event.target.value)}
                placeholder="https://www.instagram.com/p/..."
              />
              <Button onClick={analyzePost} disabled={loading || !postUrl.trim()}>
                {loading ? "Analyzing..." : "Analyze Post"}
              </Button>
            </div>

            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            {result ? (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-border/50 p-3">
                    <p className="text-xs text-muted-foreground">Hook score</p>
                    <p className="text-lg font-semibold">{result.scores.hookScore}/100</p>
                  </div>
                  <div className="rounded-lg border border-border/50 p-3">
                    <p className="text-xs text-muted-foreground">Caption score</p>
                    <p className="text-lg font-semibold">{result.scores.captionScore}/100</p>
                  </div>
                  <div className="rounded-lg border border-border/50 p-3">
                    <p className="text-xs text-muted-foreground">Hashtag fit</p>
                    <p className="text-lg font-semibold">{result.scores.hashtagFitScore}/100</p>
                  </div>
                </div>

                <div className="rounded-lg border border-border/50 p-3 text-sm">
                  <p>
                    Engagement vs account average:{" "}
                    <span className={result.engagement.engagementVsAccountAveragePct >= 0 ? "text-emerald-500" : "text-red-500"}>
                      {result.engagement.engagementVsAccountAveragePct >= 0 ? "+" : ""}
                      {result.engagement.engagementVsAccountAveragePct}%
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    Likes: {result.engagement.likes} | Comments: {result.engagement.comments} | Avg ER:{" "}
                    {result.engagement.accountAverageEngagementRate.toFixed(2)}%
                  </p>
                </div>

                <div className="rounded-lg border border-border/50 p-3 text-sm">
                  <p className="mb-1 font-medium">Top comment themes</p>
                  <div className="flex flex-wrap gap-2">
                    {result.comments.topThemes.length ? (
                      result.comments.topThemes.map((theme) => (
                        <span key={theme} className="rounded-full bg-primary/10 px-2 py-1 text-xs">
                          {theme}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground">No strong themes found.</span>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-border/50 p-3 text-sm">
                  <p className="mb-1 font-medium">Rewrite suggestions</p>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    {result.rewriteSuggestions.map((suggestion) => (
                      <li key={suggestion}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  )
}

