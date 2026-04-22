import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { AdminFinanceSettings } from "@/models/AdminFinanceSettings"

const NUMBER_FIELDS = [
  "domainYearlyCost",
  "hostingMonthlyCost",
  "scraperMonthlyCost",
  "openAiCostPerCall",
] as const

const FEE_KEYS = [
  "starterMonthly",
  "starterAnnual",
  "proMonthly",
  "proAnnual",
  "agencyMonthly",
  "agencyAnnual",
] as const

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const settings =
      (await AdminFinanceSettings.findOne({ key: "default" }).lean()) ??
      (await AdminFinanceSettings.create({ key: "default" }))

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("[admin/finance-settings GET] Error:", error)
    return NextResponse.json({ error: "Failed to load finance settings" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const update: Record<string, number> = {}

    for (const field of NUMBER_FIELDS) {
      const val = Number(body?.[field])
      if (Number.isFinite(val) && val >= 0) {
        update[field] = val
      }
    }

    for (const key of FEE_KEYS) {
      const paypalVal = Number(body?.paypalFees?.[key])
      if (Number.isFinite(paypalVal) && paypalVal >= 0) {
        update[`paypalFees.${key}`] = paypalVal
      }

      const twoCheckoutVal = Number(body?.twoCheckoutFees?.[key])
      if (Number.isFinite(twoCheckoutVal) && twoCheckoutVal >= 0) {
        update[`twoCheckoutFees.${key}`] = twoCheckoutVal
      }
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
    }

    await connectDB()
    await AdminFinanceSettings.updateOne(
      { key: "default" },
      { $set: update },
      { upsert: true },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[admin/finance-settings PATCH] Error:", error)
    return NextResponse.json({ error: "Failed to update finance settings" }, { status: 500 })
  }
}
