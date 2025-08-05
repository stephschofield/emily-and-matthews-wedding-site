import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import type { RSVP, PartyMember } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      rsvp,
      partyMembers = [],
    }: { rsvp: RSVP; partyMembers: Omit<PartyMember, "rsvp_id" | "id" | "created_at">[] } = body

    const supabase = createServerClient()

    // Insert the main RSVP
    const { data: rsvpData, error: rsvpError } = await supabase
      .from("rsvps")
      .insert([
        {
          guest_name: rsvp.guest_name,
          email: rsvp.email,
          phone: rsvp.phone,
          attending: rsvp.attending,
          party_size: rsvp.party_size,
          events: rsvp.events,
          dietary_restrictions: rsvp.dietary_restrictions,
          message: rsvp.message,
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (rsvpError) {
      console.error("RSVP Error:", rsvpError)
      return NextResponse.json({ error: "Failed to save RSVP", details: rsvpError.message }, { status: 500 })
    }

    // Insert party members if any
    if (partyMembers.length > 0 && rsvpData) {
      const partyMemberData = partyMembers.map((member) => ({
        rsvp_id: rsvpData.id,
        name: member.name,
        dietary_restrictions: member.dietary_restrictions,
      }))

      const { error: partyError } = await supabase.from("party_members").insert(partyMemberData)

      if (partyError) {
        console.error("Party Members Error:", partyError)
        // Don't fail the whole request if party members fail
        console.warn("Failed to save party members, but RSVP was saved")
      }
    }

    return NextResponse.json({
      success: true,
      message: "RSVP saved successfully",
      rsvp: rsvpData,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: rsvps, error } = await supabase
      .from("rsvps")
      .select(`
        *,
        party_members (*)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Failed to fetch RSVPs", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ rsvps })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
