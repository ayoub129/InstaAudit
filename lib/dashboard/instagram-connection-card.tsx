"use client"

import { Button } from "@/components/ui/button"

type Props = {
  connected: boolean
  username?: string | null
}

export function InstagramConnectionCard({ connected, username }: Props) {
  return (
    <div className="rounded-3xl border border-border/50 bg-card/70 p-5 shadow-sm backdrop-blur-xl">
      <p className="text-sm text-muted-foreground">Instagram account</p>

      <h3 className="mt-2 text-lg font-semibold text-foreground">
        {connected ? `Connected as @${username}` : "Not connected"}
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        {connected
          ? "Your account is connected for deeper audit insights."
          : "Connect your Instagram account to unlock better audit data."}
      </p>

      <Button className="mt-4 rounded-xl">
        {connected ? "Manage connection" : "Connect Instagram"}
      </Button>
    </div>
  )
}