"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatArtists } from "@/lib/spotify"
import { Music, Search } from "lucide-react"
import { cn } from "@/lib/utils"

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

interface SongSearchInputProps {
  onSongSelect: (songTitle: string, artist: string) => void
  placeholder?: string
  label?: string
  className?: string
}

export function SongSearchInput({
  onSongSelect,
  placeholder = "Search for a song...",
  label,
  className,
}: SongSearchInputProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SpotifyTrack[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [justSelected, setJustSelected] = useState(false) // Flag to prevent search after selection

  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Debounced search
  useEffect(() => {
    // Don't search if we just selected a song
    if (justSelected) {
      setJustSelected(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true)
        try {
          // Use our API route instead of calling Spotify directly
          const response = await fetch(`/api/spotify-search?q=${encodeURIComponent(query)}`)

          if (!response.ok) {
            throw new Error("Search failed")
          }

          const data = await response.json()

          if (data.error) {
            console.error("Search API error:", data.error)
            setResults([])
          } else {
            setResults(data.tracks || [])
            setShowResults(true)
          }
        } catch (error) {
          console.error("Search error:", error)
          setResults([])
          // Optionally show a user-friendly error message
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, justSelected])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showResults || results.length === 0) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
          break
        case "Enter":
          e.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            handleSongSelect(results[selectedIndex])
          }
          break
        case "Escape":
          setShowResults(false)
          setSelectedIndex(-1)
          break
      }
    }

    if (showResults) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResults, results, selectedIndex])

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSongSelect = (track: SpotifyTrack) => {
    const artistNames = formatArtists(track.artists)

    // Set the flag to prevent search from triggering
    setJustSelected(true)

    // Update the query with the selected song
    setQuery(`${track.name} - ${artistNames}`)

    // Hide the dropdown immediately
    setShowResults(false)
    setSelectedIndex(-1)
    setResults([])

    // Call the parent callback
    onSongSelect(track.name, artistNames)

    // Blur the input to remove focus and prevent any further interactions
    if (inputRef.current) {
      inputRef.current.blur()
    }
  }

  const handleInputChange = (value: string) => {
    setQuery(value)
    setSelectedIndex(-1)
    setJustSelected(false) // Reset the flag when user manually types

    // If user clears the input, hide results
    if (!value.trim()) {
      setShowResults(false)
      setResults([])
    }
  }

  const handleInputFocus = () => {
    // Only show results if we have them, the query is long enough, and we didn't just select
    if (results.length > 0 && query.trim().length >= 2 && !justSelected) {
      setShowResults(true)
    }
  }

  return (
    <div className={cn("relative", className)}>
      {label && (
        <Label htmlFor="song-search" className="text-lg font-cormorant text-slate-700 mb-2 block font-medium">
          {label}
        </Label>
      )}

      <div className="relative">
        <Input
          ref={inputRef}
          id="song-search"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="border-sage/20 focus:border-sage bg-white/80 font-cormorant text-lg pr-10"
          autoComplete="off"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-sage border-t-transparent" />
          ) : (
            <Search className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && !justSelected && (
        <div
          ref={resultsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-sage/20 rounded-md shadow-lg max-h-96 overflow-y-auto pb-2"
        >
          {results.length > 0 ? (
            results.map((track, index) => (
              <div
                key={track.id}
                className={cn(
                  "flex items-center p-3 cursor-pointer hover:bg-sage/5 border-b border-sage/10 last:border-b-0",
                  selectedIndex === index && "bg-sage/10",
                )}
                onClick={() => handleSongSelect(track)}
              >
                <div className="flex-shrink-0 mr-3">
                  {track.album.images[0] ? (
                    <Image
                      src={track.album.images[0].url || "/placeholder.svg"}
                      alt={track.album.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-sage/20 rounded flex items-center justify-center">
                      <Music className="w-5 h-5 text-sage" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate font-cormorant">{track.name}</p>
                  <p className="text-sm text-slate-600 truncate">{formatArtists(track.artists)}</p>
                </div>
              </div>
            ))
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-slate-500">
              <Music className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-cormorant">No songs found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="p-4 text-center text-slate-500">
              <Music className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-cormorant">Start typing to search...</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
