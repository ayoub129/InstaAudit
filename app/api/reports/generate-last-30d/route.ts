import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createLast30DaysReport } from "@/lib/reports/user-reports"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const reportId = await createLast30DaysReport(session.user.id)
    return NextResponse.json({ success: true, reportId })
  } catch (error) {
    console.error("[reports/generate-last-30d] Error:", error)
    return NextResponse.json({ error: "Failed to generate report." }, { status: 500 })
  }
}
