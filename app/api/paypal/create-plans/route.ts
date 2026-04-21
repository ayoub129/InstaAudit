import { NextResponse } from "next/server"
import { getPayPalAccessToken, PAYPAL_BASE } from "@/lib/paypal"
import { requireAdminApiSession } from "@/lib/auth/admin-guard"
import { connectDB } from "@/lib/mongodb"
import Pricing from "@/models/Pricing"

type PlanSeed = {
  slug: "starter" | "pro" | "agency"
  billing: "monthly" | "annual"
  name: string
  price: number
  intervalUnit: "MONTH" | "YEAR"
  intervalCount: string
}

function getAllowedSetupEmails(): string[] {
  return (process.env.PAYPAL_SETUP_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export async function POST() {
  try {
    const guard = await requireAdminApiSession()
    if (!guard.ok) {
      return guard.response
    }

    const sessionEmail = guard.session?.user?.email?.toLowerCase() ?? ""
    const allowedEmails = getAllowedSetupEmails()
    if (allowedEmails.length && !allowedEmails.includes(sessionEmail)) {
      return NextResponse.json({ error: "Forbidden for this admin email." }, { status: 403 })
    }

    await connectDB()

    const paypalProductId = process.env.PAYPAL_PRODUCT_ID

    if (!paypalProductId) {
      return NextResponse.json(
        { error: "Missing PAYPAL_PRODUCT_ID in env." },
        { status: 400 }
      )
    }

    const pricingDocs = await Pricing.find({
      slug: { $in: ["starter", "pro", "agency"] },
    }).lean()

    if (!pricingDocs.length) {
      return NextResponse.json(
        { error: "No pricing docs found for starter/pro/agency." },
        { status: 404 }
      )
    }

    const planSeeds: PlanSeed[] = pricingDocs.flatMap((doc) => {
      const items: PlanSeed[] = []

      if (typeof doc.priceMonthly === "number" && doc.priceMonthly > 0) {
        items.push({
          slug: doc.slug,
          billing: "monthly",
          name: `${doc.name} Monthly`,
          price: doc.priceMonthly,
          intervalUnit: "MONTH",
          intervalCount: "1",
        })
      }

      if (typeof doc.priceAnnual === "number" && doc.priceAnnual > 0) {
        items.push({
          slug: doc.slug,
          billing: "annual",
          name: `${doc.name} Annual`,
          price: doc.priceAnnual,
          intervalUnit: "YEAR",
          intervalCount: "1",
        })
      }

      return items
    })

    const accessToken = await getPayPalAccessToken()
    const results: Array<Record<string, unknown>> = []

    for (const item of planSeeds) {
      const res = await fetch(`${PAYPAL_BASE}/v1/billing/plans`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: paypalProductId,
          name: item.name,
          description: `${item.name} subscription for InstaAudit`,
          status: "ACTIVE",
          billing_cycles: [
            {
              frequency: {
                interval_unit: item.intervalUnit,
                interval_count: Number(item.intervalCount),
              },
              tenure_type: "REGULAR",
              sequence: 1,
              total_cycles: 0,
              pricing_scheme: {
                fixed_price: {
                  value: item.price.toFixed(2),
                  currency_code: "USD",
                },
              },
            },
          ],
          payment_preferences: {
            auto_bill_outstanding: true,
            setup_fee: {
              value: "0",
              currency_code: "USD",
            },
            setup_fee_failure_action: "CONTINUE",
            payment_failure_threshold: 3,
          },
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        results.push({
          slug: item.slug,
          billing: item.billing,
          error: data,
        })
        continue
      }

      if (item.billing === "monthly") {
        await Pricing.updateOne(
          { slug: item.slug },
          {
            $set: {
              paypalProductId,
              paypalPlanIdMonthly: data.id,
            },
          }
        )
      } else {
        await Pricing.updateOne(
          { slug: item.slug },
          {
            $set: {
              paypalProductId,
              paypalPlanIdAnnual: data.id,
            },
          }
        )
      }

      results.push({
        slug: item.slug,
        billing: item.billing,
        paypalPlanId: data.id,
      })
    }

    return NextResponse.json({
      success: true,
      productId: paypalProductId,
      results,
    })
  } catch (error) {
    console.error("create-plans error:", error)
    return NextResponse.json(
      { error: "Failed to create PayPal plans." },
      { status: 500 }
    )
  }
}