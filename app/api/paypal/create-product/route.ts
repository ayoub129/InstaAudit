import { NextResponse } from "next/server"
import { getPayPalAccessToken, PAYPAL_BASE } from "@/lib/paypal"
import { requireAdminApiSession } from "@/lib/auth/admin-guard"

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