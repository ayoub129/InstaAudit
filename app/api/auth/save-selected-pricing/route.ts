import { NextResponse } from "next/server"
import { z } from "zod"

const PLAN_VALUES = ["free", "starter", "pro", "agency"] as const
const BILLING_VALUES = ["monthly", "annual"] as const

const schema = z.object({
  selectedPlan: z.enum(PLAN_VALUES),
  selectedBilling: z.enum(BILLING_VALUES),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid selected pricing data." },
        { status: 400 }
      )
    }

    const response = NextResponse.json({ success: true })

    response.cookies.set("instaaudit_selected_plan", parsed.data.selectedPlan, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 30,
    })

    response.cookies.set(
      "instaaudit_selected_billing",
      parsed.data.selectedBilling,
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 30,
      }
    )

    return response
  } catch (error) {
    console.error("save-selected-pricing error:", error)

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}