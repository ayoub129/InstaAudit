import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json({
    success: false,
    message: "Instagram connection flow not implemented yet.",
  })
}