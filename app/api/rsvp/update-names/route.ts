import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { updates } = body

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json({ error: "Invalid request body. Expected updates array." }, { status: 400 })
    }

    const supabase = createServerClient()

    // Update each plus-one member's full_name
    const updatePromises = updates.map(({ member_id, full_name }: { member_id: string; full_name: string }) =>
      supabase
        .from("party_members")
        .update({ full_name, updated_at: new Date().toISOString() })
        .eq("id", member_id)
        .eq("is_plus_one_placeholder", true), // Safety check: only update plus-one placeholders
    )

    const results = await Promise.all(updatePromises)

    // Check for errors
    const errors = results.filter((r) => r.error)
    if (errors.length > 0) {
      console.error("Errors updating plus-one names:", errors)
      return NextResponse.json(
        { error: "Failed to update some plus-one names", details: errors.map((e) => e.error?.message) },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Plus-one names updated successfully",
      updated: updates.length,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Failed to update plus-one names", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
