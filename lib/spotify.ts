// Spotify Web API integration for song search

interface SpotifyTrack {
  id: string
  name: string
  artists: { name: string }[]
  album: {
    name: string
    images: { url: string; height: number; width: number }[]
  }
  preview_url: string | null
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[]
  }
}

// Store token in memory (in a real app, consider more secure storage)
let accessToken: string | null = null
let tokenExpiry = 0

// Use the actual environment variables
const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!

async function getSpotifyAccessToken(): Promise<string> {
  // Check if we have a valid token
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken
  }

  try {
    // Client Credentials Flow - for server-side API access
    // This doesn't require user authentication
    const authOptions = {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    }

    const response = await fetch("https://accounts.spotify.com/api/token", authOptions)

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Spotify auth error:", response.status, errorData)
      throw new Error("Failed to get Spotify access token")
    }

    const data = await response.json()
    accessToken = data.access_token
    tokenExpiry = Date.now() + data.expires_in * 1000 // Convert seconds to milliseconds

    return accessToken as string
  } catch (error) {
    console.error("Error getting Spotify token:", error)
    throw error
  }
}

export async function searchSpotifyTracks(query: string): Promise<SpotifyTrack[]> {
  if (!query.trim() || query.length < 2) {
    return []
  }

  try {
    const token = await getSpotifyAccessToken()

    // Check if query looks like it might be an artist search (single word or two words without common song words)
    const isLikelyArtist = query.trim().split(/\s+/).length <= 2 && 
                          !query.toLowerCase().match(/\b(love|heart|song|remix|feat|ft|live|version)\b/)
    
    // Use artist: prefix for better artist-focused results
    const searchQuery = isLikelyArtist ? `artist:${query}` : query

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=20&market=US`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      console.error("Spotify API error:", response.status, response.statusText)
      throw new Error("Failed to search Spotify")
    }

    const data: SpotifySearchResponse = await response.json()
    return data.tracks.items
  } catch (error) {
    console.error("Error searching Spotify:", error)
    return []
  }
}

export function formatArtists(artists: { name: string }[]): string {
  return artists.map((artist) => artist.name).join(", ")
}
