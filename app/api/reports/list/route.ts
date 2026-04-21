import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ensureCurrentMonthlyReport, listUserReports } from "@/lib/reports/user-reports"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await ensureCurrentMonthlyReport(session.user.id)
    const reports = await listUserReports(session.user.id)
    return NextResponse.json({ reports })
  } catch (error) {
    console.error("[reports/list] Error:", error)
    return NextResponse.json({ error: "Failed to load reports." }, { status: 500 })
  }
}
