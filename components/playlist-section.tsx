"use client"

import type React from "react"

import { useState } from "react"
import { SectionTitle } from "@/components/section-title"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SongSearchInput } from "@/components/song-search-input"
import { Music, CheckCircle, AlertCircle, Trash2, Loader2 } from "lucide-react"

interface SongRequest {
  id: string
  songTitle: string
  artist: string
}

export function PlaylistSection() {
  const [addedSongs, setAddedSongs] = useState<SongRequest[]>([])
  const [currentSongTitle, setCurrentSongTitle] = useState("")
  const [currentArtist, setCurrentArtist] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [useSearch, setUseSearch] = useState(true) // Spotify search enabled
  const [submittedCount, setSubmittedCount] = useState(0)
  const [searchResetTrigger, setSearchResetTrigger] = useState(0) // Add reset trigger

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (addedSongs.length === 0) {
      setError("Please add at least one song to your playlist")
      return
    }

    setIsSubmitting(true)

    try {
      const songRequestsData = addedSongs.map((song) => ({
        song_title: song.songTitle,
        artist: song.artist,
        guest_name: "", // Could be enhanced to collect guest name
        email: "", // Could be enhanced to collect email
      }))

      const response = await fetch("/api/song-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          songRequests: songRequestsData,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit song requests")
      }

      // Store the count before resetting
      const validCount = addedSongs.length
      setSubmittedCount(validCount)

      console.log("Song requests saved successfully:", result)
      setIsSubmitted(true)

      // Reset form after successful submission
      setAddedSongs([])
      setCurrentSongTitle("")
      setCurrentArtist("")
    } catch (err) {
      console.error("Error submitting song requests:", err)
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddSong = () => {
    if (!currentSongTitle.trim() || !currentArtist.trim()) {
      setError("Please enter both song title and artist")
      return
    }

    const newSong: SongRequest = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      songTitle: currentSongTitle,
      artist: currentArtist,
    }

    console.log("Adding song:", newSong)
    console.log("Current addedSongs before:", addedSongs)
    
    setAddedSongs((prev) => {
      const updated = [...prev, newSong]
      console.log("Updated addedSongs:", updated)
      return updated
    })
    
    setCurrentSongTitle("")
    setCurrentArtist("")
    setError("")
    setSearchResetTrigger((prev) => prev + 1) // Trigger reset of search component
  }

  const handleSongSelect = (songTitle: string, artist: string) => {
    setCurrentSongTitle(songTitle)
    setCurrentArtist(artist)
    if (error) setError("")
  }

  const removeSong = (id: string) => {
    setAddedSongs((prev) => prev.filter((song) => song.id !== id))
  }

  if (isSubmitted) {
    return (
      <section className="py-20 bg-sky-blue/5 relative">
        <div className="container mx-auto px-4">
          <SectionTitle id="playlist">Wedding Playlist</SectionTitle>

          <Card className="max-w-2xl mx-auto mt-12 border-sage/20 overflow-hidden shadow-lg">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-sage mx-auto mb-6" />
              <h3 className="text-3xl font-cormorant text-navy mb-4 font-light">Thank You!</h3>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                {submittedCount === 1
                  ? "Your song request has been added to our wedding playlist."
                  : `Your ${submittedCount} song requests have been added to our wedding playlist.`}{" "}
                We can't wait to dance with you!
              </p>
              <Button
                onClick={() => {
                  setIsSubmitted(false)
                  setSubmittedCount(0)
                }}
                variant="outline"
                className="border-sage text-sage hover:bg-sage/5"
              >
                Submit More Songs
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-sky-blue/5 relative">
      <div className="container mx-auto px-4">
        <SectionTitle id="playlist">Wedding Playlist</SectionTitle>

        <Card className="max-w-3xl mx-auto mt-12 border-sage/20 overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="bg-sage/10 p-6 text-center border-b border-sage/10">
              <div className="flex items-center justify-center mb-4">
                <Music className="w-8 h-8 text-sage mr-3" />
                <h3 className="text-2xl md:text-3xl font-cormorant text-navy font-light">
                  Help Us Create the Perfect Playlist
                </h3>
              </div>
              <p className="text-lg text-slate-700 leading-relaxed">
                Share your favorite songs to help make our reception unforgettable! Add multiple songs at once.
              </p>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50/80 border border-red-200/50 rounded-md">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* Toggle between search and manual input */}
                <div className="flex justify-center mb-6">
                  <div className="flex bg-sage/10 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setUseSearch(true)}
                      className={`px-4 py-2 rounded-md text-sm font-cormorant transition-colors ${
                        useSearch ? "bg-sage text-white" : "text-sage hover:bg-sage/20"
                      }`}
                    >
                      Search Songs
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseSearch(false)}
                      className={`px-4 py-2 rounded-md text-sm font-cormorant transition-colors ${
                        !useSearch ? "bg-sage text-white" : "text-sage hover:bg-sage/20"
                      }`}
                    >
                      Manual Entry
                    </button>
                  </div>
                </div>

                {/* Song Input Form */}
                <div className="space-y-4">
                  {useSearch ? (
                    <SongSearchInput
                      onSongSelect={(songTitle, artist) => handleSongSelect(songTitle, artist)}
                      placeholder="Search for a song..."
                      label="Song *"
                      className="mb-4"
                      resetTrigger={searchResetTrigger}
                    />
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="songTitle" className="text-lg font-cormorant text-slate-700 mb-2 block font-medium">
                          Song Title *
                        </Label>
                        <Input
                          id="songTitle"
                          value={currentSongTitle}
                          onChange={(e) => {
                            setCurrentSongTitle(e.target.value)
                            if (error) setError("")
                          }}
                          placeholder="Enter song title"
                          className="border-sage/20 focus:border-sage bg-white/80 font-cormorant text-lg"
                        />
                      </div>

                      <div>
                        <Label htmlFor="artist" className="text-lg font-cormorant text-slate-700 mb-2 block font-medium">
                          Artist *
                        </Label>
                        <Input
                          id="artist"
                          value={currentArtist}
                          onChange={(e) => {
                            setCurrentArtist(e.target.value)
                            if (error) setError("")
                          }}
                          placeholder="Enter artist name"
                          className="border-sage/20 focus:border-sage bg-white/80 font-cormorant text-lg"
                        />
                      </div>
                    </div>
                  )}

                  {/* Show selected song when using search */}
                  {useSearch && (currentSongTitle || currentArtist) && (
                    <div className="p-3 bg-sage/5 rounded-lg border border-sage/20">
                      <p className="text-sm text-slate-600 mb-1 font-cormorant">Selected Song:</p>
                      <p className="font-medium text-slate-900 font-cormorant">
                        {currentSongTitle} {currentArtist && `- ${currentArtist}`}
                      </p>
                    </div>
                  )}

                  {/* Add to List Button */}
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      onClick={handleAddSong}
                      className="bg-sage hover:bg-sage/90 text-white px-6 py-2 text-base font-cormorant"
                    >
                      Add to List
                    </Button>
                  </div>
                </div>

                {/* Added Songs List */}
                {addedSongs.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-sage/10">
                    <h4 className="text-xl font-cormorant text-navy mb-4 font-medium">
                      Your Playlist ({addedSongs.length} {addedSongs.length === 1 ? "song" : "songs"})
                    </h4>
                    <div className="space-y-3">
                      {addedSongs.map((song, index) => (
                        <div
                          key={song.id}
                          className="flex items-center justify-between p-4 bg-sage/5 rounded-lg border border-sage/20"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex-shrink-0 w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-sage">{index + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 font-cormorant truncate">{song.songTitle}</p>
                              <p className="text-sm text-slate-600 truncate">{song.artist}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSong(song.id)}
                            className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="text-center pt-6 border-t border-sage/10">
                  <div className="mb-4">
                    <p className="text-sm text-slate-600 font-cormorant">
                      {addedSongs.length === 0
                        ? "Add at least one song to submit"
                        : addedSongs.length === 1
                          ? "1 song ready to submit"
                          : `${addedSongs.length} songs ready to submit`}
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting || addedSongs.length === 0}
                    className="bg-sage hover:bg-sage/90 text-white px-8 py-3 text-lg font-cormorant font-light tracking-wide flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isSubmitting
                      ? "Adding Songs..."
                      : addedSongs.length === 1
                        ? "Add Song to Playlist"
                        : `Add ${addedSongs.length} Songs to Playlist`}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
