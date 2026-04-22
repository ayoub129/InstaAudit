import { NextResponse } from "next/server"
import { trackApiCall } from "@/lib/analytics/usage-tracker"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const endpoint = String(body?.endpoint ?? "").trim()
    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 })
    }

    await trackApiCall(endpoint)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[internal/track-api] Error:", error)
    return NextResponse.json({ error: "Failed to track API call" }, { status: 500 })
  }
}
