import { NextResponse } from "next/server"

// This route handles the Spotify OAuth callback if you need user authentication
// For the song search feature, we're using Client Credentials flow which doesn't require this
// But this is useful if you want to expand functionality later

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    console.error("Spotify auth error:", error)
    return NextResponse.redirect(new URL("/?auth_error=spotify", request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?auth_error=no_code", request.url))
  }

  try {
    // Here you would exchange the code for an access token
    // For the current implementation, we don't need this

    // Redirect back to the playlist section
    return NextResponse.redirect(new URL("/#playlist", request.url))
  } catch (error) {
    console.error("Error in Spotify callback:", error)
    return NextResponse.redirect(new URL("/?auth_error=exchange", request.url))
  }
}
