import { NextResponse } from "next/server"
import { requireAdminApiSession } from "@/lib/auth/admin-guard"
import { getAdminFunnelReport } from "@/lib/analytics/get-admin-reports"

export async function GET(request: Request) {
  const guard = await requireAdminApiSession()
  if (!guard.ok) return guard.response

  try {
    const url = new URL(request.url)
    const daysParam = Number(url.searchParams.get("days") ?? "30")
    const days = Number.isFinite(daysParam) ? Math.min(Math.max(daysParam, 7), 365) : 30

    const data = await getAdminFunnelReport(days)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[reports/funnel] Error:", error)
    return NextResponse.json({ error: "Failed to load funnel report." }, { status: 500 })
  }
}
