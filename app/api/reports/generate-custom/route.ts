import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { createCustomRangeReport } from "@/lib/reports/user-reports"

const schema = z.object({
  startDate: z.string().min(1),
  endDate: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid date range." }, { status: 400 })
    }

    const startDate = new Date(parsed.data.startDate)
    const endDate = new Date(parsed.data.endDate)
    if (!Number.isFinite(startDate.getTime()) || !Number.isFinite(endDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format." }, { status: 400 })
    }
    if (startDate > endDate) {
      return NextResponse.json({ error: "Start date must be before end date." }, { status: 400 })
    }

    const rangeDays = Math.floor((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1
    if (rangeDays < 1 || rangeDays > 365) {
      return NextResponse.json({ error: "Date range must be between 1 and 365 days." }, { status: 400 })
    }

    const reportId = await createCustomRangeReport(session.user.id, startDate, endDate)
    return NextResponse.json({ success: true, reportId })
  } catch (error) {
    console.error("[reports/generate-custom] Error:", error)
    return NextResponse.json({ error: "Failed to generate custom report." }, { status: 500 })
  }
}
