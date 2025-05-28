"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Instagram, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AuditPage() {
  const [loading, setLoading] = useState(false)
  const [handle, setHandle] = useState("")
  const [auditType, setAuditType] = useState("full")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      router.push("/dashboard/audit/results")
    }, 3000)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Start a New Audit</h1>
        <p className="text-muted-foreground">
          Enter your Instagram handle and select the type of audit you want to run
        </p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                </div>
                <div className="absolute inset-0 animate-ping rounded-full bg-pink-100 opacity-75" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-medium">Analyzing your Instagram profile</h3>
                <p className="text-sm text-muted-foreground">
                  This may take a few moments. We're gathering insights about your profile.
                </p>
              </div>
              <div className="w-full max-w-xs">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full animate-progress bg-pink-500" style={{ width: "0%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Instagram Profile Details</CardTitle>
              <CardDescription>Enter your Instagram handle without the @ symbol</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="instagram-handle">Instagram Handle</Label>
                <div className="flex items-center rounded-md border px-3">
                  <Instagram className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">@</span>
                  <Input
                    id="instagram-handle"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="yourusername"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Audit Type</Label>
                <RadioGroup
                  defaultValue="full"
                  value={auditType}
                  onValueChange={setAuditType}
                  className="grid grid-cols-1 gap-4 md:grid-cols-3"
                >
                  <div>
                    <RadioGroupItem value="bio" id="bio" className="peer sr-only" />
                    <Label
                      htmlFor="bio"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-muted-foreground peer-data-[state=checked]:border-pink-500 peer-data-[state=checked]:bg-pink-50 [&:has([data-state=checked])]:border-pink-500"
                    >
                      <div className="mb-3 rounded-full bg-pink-100 p-2">
                        <Instagram className="h-6 w-6 text-pink-500" />
                      </div>
                      <div className="font-medium">Bio Audit</div>
                      <div className="text-xs text-muted-foreground">Profile optimization</div>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="content" id="content" className="peer sr-only" />
                    <Label
                      htmlFor="content"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-muted-foreground peer-data-[state=checked]:border-pink-500 peer-data-[state=checked]:bg-pink-50 [&:has([data-state=checked])]:border-pink-500"
                    >
                      <div className="mb-3 rounded-full bg-pink-100 p-2">
                        <Instagram className="h-6 w-6 text-pink-500" />
                      </div>
                      <div className="font-medium">Content Audit</div>
                      <div className="text-xs text-muted-foreground">Post performance</div>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="full" id="full" className="peer sr-only" />
                    <Label
                      htmlFor="full"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-muted-foreground peer-data-[state=checked]:border-pink-500 peer-data-[state=checked]:bg-pink-50 [&:has([data-state=checked])]:border-pink-500"
                    >
                      <div className="mb-3 rounded-full bg-pink-100 p-2">
                        <Instagram className="h-6 w-6 text-pink-500" />
                      </div>
                      <div className="font-medium">Full Audit</div>
                      <div className="text-xs text-muted-foreground">Complete analysis</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={!handle}>
                Start Audit
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  )
}
