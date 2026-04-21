import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserReportsOverview } from "@/lib/analytics/get-user-reports-overview"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const daysParam = Number(url.searchParams.get("days") ?? "30")
    const days = Number.isFinite(daysParam) ? daysParam : 30
    const handle = url.searchParams.get("handle") ?? undefined

    const data = await getUserReportsOverview(session.user.id, { days, handle })
    return NextResponse.json(data)
  } catch (error) {
    console.error("[reports/overview] Error:", error)
    return NextResponse.json(
      { error: "Failed to load reports overview" },
      { status: 500 },
    )
  }
}
