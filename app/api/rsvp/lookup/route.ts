import { NextResponse } from "next/server"
import { lookupPartyByName } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get("name")

    if (!name) {
      return NextResponse.json({ error: "Name parameter is required" }, { status: 400 })
    }

    const members = await lookupPartyByName(name)

    return NextResponse.json({
      success: true,
      members,
      count: members.length,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Failed to lookup party", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
