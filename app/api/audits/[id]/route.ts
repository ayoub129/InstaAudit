import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { Audit } from "@/models/Audit"

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const audit = await Audit.findOne({
      _id: params.id,
      userId: session.user.id,
    }).lean()

    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 })
    }

    const a = audit as any
    return NextResponse.json({
      audit: {
        id: a._id.toString(),
        handle: a.handle,
        planAtRun: a.planAtRun,
        auditType: a.auditType,
        result: a.result,
        createdAt: a.createdAt,
      },
    })
  } catch (error) {
    console.error("[audits/[id]] Error:", error)
    return NextResponse.json({ error: "Failed to fetch audit" }, { status: 500 })
  }
}
