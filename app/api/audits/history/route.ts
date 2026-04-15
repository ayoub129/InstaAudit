import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { Audit } from "@/models/Audit"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const audits = await Audit.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("_id handle planAtRun auditType result.overallScore createdAt")
      .lean()

    const formatted = audits.map((a: any) => ({
      id: a._id.toString(),
      handle: a.handle,
      planAtRun: a.planAtRun,
      auditType: a.auditType,
      overallScore: a.result?.overallScore ?? 0,
      createdAt: a.createdAt,
    }))

    return NextResponse.json({ audits: formatted })
  } catch (error) {
    console.error("[audits/history] Error:", error)
    return NextResponse.json({ error: "Failed to fetch audit history" }, { status: 500 })
  }
}
