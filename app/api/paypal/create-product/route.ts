import { NextResponse } from "next/server"
import { getPayPalAccessToken, PAYPAL_BASE } from "@/lib/paypal"

export async function POST() {
  try {
    const accessToken = await getPayPalAccessToken()

    const res = await fetch(`${PAYPAL_BASE}/v1/catalogs/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "InstaAudit",
        description: "AI-powered Instagram audit platform",
        type: "SERVICE",
        category: "SOFTWARE",
      }),
    })

    const data = await res.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}