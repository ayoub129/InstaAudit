import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { deleteUserReport } from "@/lib/reports/user-reports"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ reportId: string }> },
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { reportId } = await params
    const deleted = await deleteUserReport(session.user.id, reportId)
    if (!deleted) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[reports/delete] Error:", error)
    return NextResponse.json({ error: "Failed to delete report." }, { status: 500 })
  }
}
