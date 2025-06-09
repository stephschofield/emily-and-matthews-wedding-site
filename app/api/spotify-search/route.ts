import { NextResponse } from "next/server"
import { searchSpotifyTracks } from "@/lib/spotify"

// This API route allows you to keep your Spotify client secret secure
// by handling the API calls server-side

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 })
  }

  if (query.length < 2) {
    return NextResponse.json({ tracks: [] })
  }

  try {
    const tracks = await searchSpotifyTracks(query)
    return NextResponse.json({ tracks })
  } catch (error) {
    console.error("Error searching Spotify:", error)

    // Return a more specific error message
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json(
      {
        error: "Failed to search tracks",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}
