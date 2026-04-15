import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Pricing from "@/models/Pricing"

export async function GET() {
  try {
    await connectDB()

    const plans = await Pricing.find({}).sort({ order: 1 }).lean()

    return NextResponse.json({
      success: true,
      plans,
    })
  } catch (error) {
    console.error("GET /api/pricing error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch pricing plans",
      },
      { status: 500 }
    )
  }
}