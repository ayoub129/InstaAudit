import { getServerSession } from "next-auth"
import type { Session } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"

type AdminGuardResult =
  | { ok: true; session: Session }
  | { ok: false; response: NextResponse }

export async function requireAdminApiSession(): Promise<AdminGuardResult> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized." }, { status: 401 }),
    }
  }

  if (session.user.role !== "admin") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden." }, { status: 403 }),
    }
  }

  return { ok: true, session: session as Session }
}
