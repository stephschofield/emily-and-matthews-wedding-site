import { NextResponse } from "next/server"
import { createServerClient, updatePartyRSVPs } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { partyId, rsvps } = body

    if (!partyId || !rsvps || !Array.isArray(rsvps)) {
      return NextResponse.json(
        { error: "Invalid request body. Expected partyId and rsvps array." },
        { status: 400 },
      )
    }

    // Update all RSVPs for the party using the RPC function
    await updatePartyRSVPs(partyId, rsvps)

    return NextResponse.json({
      success: true,
      message: "RSVP saved successfully",
      updated: rsvps.length,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Failed to save RSVP", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const supabase = createServerClient()

    // Query all parties with their members and RSVP status
    const { data: parties, error } = await supabase.from("parties").select(`
        id,
        household_label,
        party_members (
          id,
          full_name,
          is_plus_one_placeholder,
          allow_attend,
          sort_order,
          rsvps (
            status,
            meal_choice,
            allergies,
            notes,
            updated_at
          )
        )
      `)

    if (error) {
      return NextResponse.json({ error: "Failed to fetch RSVPs", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ parties })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
