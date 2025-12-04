"use client"

import type React from "react"

import { useState } from "react"
import { SectionTitle } from "@/components/section-title"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SongSearchInput } from "@/components/song-search-input"
import { Music, CheckCircle, AlertCircle, Plus, Trash2, Loader2 } from "lucide-react"

interface SongRequest {
  id: string
  songTitle: string
  artist: string
}

export function PlaylistSection() {
  const [songRequests, setSongRequests] = useState<SongRequest[]>([{ id: "1", songTitle: "", artist: "" }])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [useSearch, setUseSearch] = useState(true) // Spotify search enabled
  const [submittedCount, setSubmittedCount] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Filter out empty requests and validate
    const validRequests = songRequests.filter((request) => request.songTitle.trim() && request.artist.trim())

    if (validRequests.length === 0) {
      setError("Please add at least one song with both title and artist")
      return
    }

    setIsSubmitting(true)

    try {
      const songRequestsData = validRequests.map((request) => ({
        song_title: request.songTitle,
        artist: request.artist,
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
      const validCount = validRequests.length
      setSubmittedCount(validCount)

      console.log("Song requests saved successfully:", result)
      setIsSubmitted(true)

      // Reset form after successful submission
      setSongRequests([{ id: "1", songTitle: "", artist: "" }])
    } catch (err) {
      console.error("Error submitting song requests:", err)
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (id: string, field: keyof Omit<SongRequest, "id">, value: string) => {
    setSongRequests((prev) => prev.map((request) => (request.id === id ? { ...request, [field]: value } : request)))
    if (error) setError("") // Clear error when user starts typing
  }

  const handleSongSelect = (id: string, songTitle: string, artist: string) => {
    setSongRequests((prev) => prev.map((request) => (request.id === id ? { ...request, songTitle, artist } : request)))
    if (error) setError("")
  }

  const addSongRequest = () => {
    const newId = Date.now().toString()
    setSongRequests((prev) => [...prev, { id: newId, songTitle: "", artist: "" }])
  }

  const removeSongRequest = (id: string) => {
    if (songRequests.length > 1) {
      setSongRequests((prev) => prev.filter((request) => request.id !== id))
    }
  }

  const getValidRequestsCount = () => {
    return songRequests.filter((request) => request.songTitle.trim() && request.artist.trim()).length
  }

  if (isSubmitted) {
    return (
      <section id="playlist" className="py-20 bg-sky-blue/5 relative">
        <div className="container mx-auto px-4">
          <SectionTitle>Wedding Playlist</SectionTitle>

          <Card className="max-w-2xl mx-auto mt-12 border-sage/20 overflow-hidden shadow-lg">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-sage mx-auto mb-6" />
              <h3 className="text-3xl font-cormorant text-navy mb-4 font-light">Thank You!</h3>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                {submittedCount === 1
                  ? "Your song request has been added to our wedding playlist."
                  : `Your ${submittedCount} song requests have been added to our wedding playlist.`}{" "}
                We can't wait to dance to your suggestions!
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
    <section id="playlist" className="py-20 bg-sky-blue/5 relative">
      <div className="container mx-auto px-4">
        <SectionTitle>Wedding Playlist</SectionTitle>

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

                {/* Song Requests List */}
                <div className="space-y-6">
                  {songRequests.map((request, index) => (
                    <div key={request.id} className="relative">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center mt-8">
                          <span className="text-sm font-medium text-sage">{index + 1}</span>
                        </div>

                        <div className="flex-1">
                          {useSearch ? (
                            <SongSearchInput
                              onSongSelect={(songTitle, artist) => handleSongSelect(request.id, songTitle, artist)}
                              placeholder={`Search for song ${index + 1}...`}
                              label={`Song ${index + 1} *`}
                              className="mb-4"
                            />
                          ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label
                                  htmlFor={`songTitle-${request.id}`}
                                  className="text-lg font-cormorant text-slate-700 mb-2 block font-medium"
                                >
                                  Song Title *
                                </Label>
                                <Input
                                  id={`songTitle-${request.id}`}
                                  value={request.songTitle}
                                  onChange={(e) => handleInputChange(request.id, "songTitle", e.target.value)}
                                  placeholder="Enter song title"
                                  className="border-sage/20 focus:border-sage bg-white/80 font-cormorant text-lg"
                                />
                              </div>

                              <div>
                                <Label
                                  htmlFor={`artist-${request.id}`}
                                  className="text-lg font-cormorant text-slate-700 mb-2 block font-medium"
                                >
                                  Artist *
                                </Label>
                                <Input
                                  id={`artist-${request.id}`}
                                  value={request.artist}
                                  onChange={(e) => handleInputChange(request.id, "artist", e.target.value)}
                                  placeholder="Enter artist name"
                                  className="border-sage/20 focus:border-sage bg-white/80 font-cormorant text-lg"
                                />
                              </div>
                            </div>
                          )}

                          {/* Show selected song when using search */}
                          {useSearch && (request.songTitle || request.artist) && (
                            <div className="mt-3 p-3 bg-sage/5 rounded-lg border border-sage/20">
                              <p className="text-sm text-slate-600 mb-1 font-cormorant">Selected Song:</p>
                              <p className="font-medium text-slate-900 font-cormorant">
                                {request.songTitle} {request.artist && `- ${request.artist}`}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Remove button (only show if more than 1 song) */}
                        {songRequests.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSongRequest(request.id)}
                            className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 mt-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Another Song Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSongRequest}
                    className="border-sage/30 text-sage hover:bg-sage/5 flex items-center gap-2 bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                    Add Another Song
                  </Button>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6 border-t border-sage/10">
                  <div className="mb-4">
                    <p className="text-sm text-slate-600 font-cormorant">
                      {getValidRequestsCount() === 0
                        ? "Add at least one song to submit"
                        : getValidRequestsCount() === 1
                          ? "1 song ready to submit"
                          : `${getValidRequestsCount()} songs ready to submit`}
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting || getValidRequestsCount() === 0}
                    className="bg-sage hover:bg-sage/90 text-white px-8 py-3 text-lg font-cormorant font-light tracking-wide flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isSubmitting
                      ? "Adding Songs..."
                      : getValidRequestsCount() === 1
                        ? "Add Song to Playlist"
                        : `Add ${getValidRequestsCount()} Songs to Playlist`}
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
