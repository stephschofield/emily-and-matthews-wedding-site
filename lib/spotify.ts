// Spotify Web API integration for song search
// Note: This uses the client credentials flow which doesn't require user authentication

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

let accessToken: string | null = null
let tokenExpiry = 0

async function getSpotifyAccessToken(): Promise<string> {
  // Check if we have a valid token
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken
  }

  // For demo purposes, we'll use a mock token
  // In production, you'd need to implement proper Spotify OAuth
  // or use your app's client credentials

  // Mock implementation - replace with actual Spotify API call
  accessToken = "mock_token_" + Date.now()
  tokenExpiry = Date.now() + 3600000 // 1 hour from now

  return accessToken
}

export async function searchSpotifyTracks(query: string): Promise<SpotifyTrack[]> {
  if (!query.trim() || query.length < 2) {
    return []
  }

  try {
    // For demo purposes, return mock data
    // In production, replace with actual Spotify API call
    const mockTracks: SpotifyTrack[] = [
      {
        id: "1",
        name: "Perfect",
        artists: [{ name: "Ed Sheeran" }],
        album: {
          name: "÷ (Divide)",
          images: [{ url: "/placeholder.svg?height=64&width=64", height: 64, width: 64 }],
        },
        preview_url: null,
      },
      {
        id: "2",
        name: "Perfect Duet",
        artists: [{ name: "Ed Sheeran" }, { name: "Beyoncé" }],
        album: {
          name: "÷ (Divide)",
          images: [{ url: "/placeholder.svg?height=64&width=64", height: 64, width: 64 }],
        },
        preview_url: null,
      },
      {
        id: "3",
        name: "A Thousand Years",
        artists: [{ name: "Christina Perri" }],
        album: {
          name: "The Twilight Saga: Breaking Dawn",
          images: [{ url: "/placeholder.svg?height=64&width=64", height: 64, width: 64 }],
        },
        preview_url: null,
      },
      {
        id: "4",
        name: "All of Me",
        artists: [{ name: "John Legend" }],
        album: {
          name: "Love in the Future",
          images: [{ url: "/placeholder.svg?height=64&width=64", height: 64, width: 64 }],
        },
        preview_url: null,
      },
      {
        id: "5",
        name: "Thinking Out Loud",
        artists: [{ name: "Ed Sheeran" }],
        album: {
          name: "x (Multiply)",
          images: [{ url: "/placeholder.svg?height=64&width=64", height: 64, width: 64 }],
        },
        preview_url: null,
      },
    ]

    // Filter mock tracks based on query
    const filteredTracks = mockTracks.filter(
      (track) =>
        track.name.toLowerCase().includes(query.toLowerCase()) ||
        track.artists.some((artist) => artist.name.toLowerCase().includes(query.toLowerCase())),
    )

    return filteredTracks.slice(0, 5) // Return top 5 results

    /* 
    // Actual Spotify API implementation would look like this:
    
    const token = await getSpotifyAccessToken()
    
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to search Spotify')
    }

    const data: SpotifySearchResponse = await response.json()
    return data.tracks.items
    */
  } catch (error) {
    console.error("Error searching Spotify:", error)
    return []
  }
}

export function formatArtists(artists: { name: string }[]): string {
  return artists.map((artist) => artist.name).join(", ")
}
