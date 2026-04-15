"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface DemoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DemoModal({ open, onOpenChange }: DemoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0">
        <div className="relative aspect-video w-full bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/10">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
            <div className="rounded-2xl border border-border/60 bg-background/90 p-6 shadow-xl backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent" />
                <div>
                  <p className="font-semibold text-foreground">@sample_creator</p>
                  <p className="text-sm text-muted-foreground">Instagram Audit</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Overall Score</span>
                  <span className="font-bold text-primary">78/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bio</span>
                  <span className="text-foreground">Good</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hashtags</span>
                  <span className="text-foreground">Needs work</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Engagement</span>
                  <span className="text-foreground">Strong</span>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              See your full audit in under 30 seconds. No credit card required.
            </p>
          </div>
        </div>
        <DialogHeader className="space-y-2 p-6 pt-4">
          <DialogTitle>See InstaAudit in action</DialogTitle>
          <p className="text-muted-foreground text-sm">
            Get a free AI-powered audit of your Instagram profile. We analyze your
            bio, captions, hashtags, and engagement to give you actionable
            recommendations.
          </p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="group bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 hover:shadow-lg hover:shadow-primary/30"
            >
              <Link href="/auth/signup">
                Get free audit
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={() => onOpenChange(false)} className="hover:shadow-md">
              Maybe later
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
