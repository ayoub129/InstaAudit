import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { buildReportPdfBuffer, getUserReport } from "@/lib/reports/user-reports"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reportId: string }> },
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { reportId } = await params
    const report = await getUserReport(session.user.id, reportId)
    if (!report) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 })
    }

    const pdfBuffer = await buildReportPdfBuffer(report)
    const safeName = String(report.title ?? "instaaudit-report").replace(/[^\w\-]+/g, "-").toLowerCase()
    const filename = `${safeName}.pdf`

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("[reports/download] Error:", error)
    return NextResponse.json({ error: "Failed to download report." }, { status: 500 })
  }
}
