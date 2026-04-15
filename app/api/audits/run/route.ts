import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { Audit } from "@/models/Audit"
import { getUserPlan } from "@/lib/plans/get-user-plan"
import { canRunAudit } from "@/lib/audits/can-run-audit"
import { incrementAuditUsage } from "@/lib/audits/increment-audit-usage"
import { runAudit, ProfileFetchError } from "@/lib/audits/run-audit"

function normalizeHandle(input: string) {
  return input.trim().replace(/^@/, "").toLowerCase()
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const username = normalizeHandle(body.username || "")

    if (!username) {
      return NextResponse.json(
        { error: "Instagram handle is required" },
        { status: 400 }
      )
    }

    await connectDB()

    const plan = getUserPlan(session.user)

    const usage = await canRunAudit(session.user.id, plan)

    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: "Audit limit reached",
          code: "AUDIT_LIMIT_REACHED",
          plan,
        },
        { status: 403 }
      )
    }

    console.log(`[audit/run] Starting audit for @${username} | plan=${plan} | userId=${session.user.id}`)

    const result = await runAudit({
      username,
      plan,
      userId: session.user.id,
    })

    console.log(`[audit/run] Audit complete for @${username} | score=${result.overallScore} | source=${result.profileSnapshot?.dataSource}`)

    const auditType =
      plan === "free" ? "basic" : plan === "starter" ? "full" : "advanced"

    const audit = await Audit.create({
      userId: session.user.id,
      handle: username,
      planAtRun: plan,
      auditType,
      result,
    })

    await incrementAuditUsage(session.user.id, plan)

    return NextResponse.json({
      success: true,
      auditId: audit._id,
      result,
    })
  } catch (error) {
    // Known profile-fetch errors — surface them to the user directly
    if (error instanceof ProfileFetchError) {
      console.error(`[audit/run] ProfileFetchError code=${error.code}: ${error.message}`)
      const statusMap: Record<string, number> = {
        NOT_FOUND: 404,
        PRIVATE_ACCOUNT: 422,
        RATE_LIMITED: 429,
        BLOCKED: 503,
        TOKEN_EXPIRED: 401,
        FETCH_FAILED: 502,
      }
      const status = statusMap[error.code] ?? 502
      return NextResponse.json({ error: error.message, code: error.code }, { status })
    }

    console.error("[audit/run] Unexpected error:", error)
    return NextResponse.json(
      { error: "Failed to run audit" },
      { status: 500 }
    )
  }
}
