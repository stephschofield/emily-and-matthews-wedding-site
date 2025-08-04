import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import type { SongRequest } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { songRequests }: { songRequests: SongRequest[] } = body

    const supabase = createServerClient()

    // Insert all song requests
    const { data, error } = await supabase
      .from("song_requests")
      .insert(
        songRequests.map((request) => ({
          guest_name: request.guest_name,
          email: request.email,
          song_title: request.song_title,
          artist: request.artist,
        })),
      )
      .select()

    if (error) {
      console.error("Song Requests Error:", error)
      return NextResponse.json({ error: "Failed to save song requests", details: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Song requests saved successfully",
      requests: data,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: songRequests, error } = await supabase
      .from("song_requests")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Failed to fetch song requests", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ songRequests })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
