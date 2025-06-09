"use client"

import type React from "react"

import { useState } from "react"
import { SectionTitle } from "@/components/section-title"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SongSearchInput } from "@/components/song-search-input"
import { Music, CheckCircle, AlertCircle } from "lucide-react"

interface SongRequest {
  songTitle: string
  artist: string
}

export function PlaylistSection() {
  const [formData, setFormData] = useState<SongRequest>({
    songTitle: "",
    artist: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [useSearch, setUseSearch] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!formData.songTitle.trim() || !formData.artist.trim()) {
      setError("Please fill in both song title and artist")
      return
    }

    setIsSubmitting(true)

    try {
      // Here you would typically send the data to your backend
      console.log("Song Request Data:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)

      // Reset form after successful submission
      setFormData({
        songTitle: "",
        artist: "",
      })
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof SongRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("") // Clear error when user starts typing
  }

  const handleSongSelect = (songTitle: string, artist: string) => {
    setFormData({ songTitle, artist })
    if (error) setError("")
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
                Your song request has been added to our wedding playlist. We can't wait to dance to your suggestion!
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="border-sage text-sage hover:bg-sage/5"
              >
                Submit Another Song
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

        <Card className="max-w-2xl mx-auto mt-12 border-sage/20 overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="bg-sage/10 p-6 text-center border-b border-sage/10">
              <div className="flex items-center justify-center mb-4">
                <Music className="w-8 h-8 text-sage mr-3" />
                <h3 className="text-2xl md:text-3xl font-cormorant text-navy font-light">
                  Help Us Create the Perfect Playlist
                </h3>
              </div>
              <p className="text-lg text-slate-700 leading-relaxed">
                Share your favorite songs to help make our reception unforgettable! Search for songs or enter them
                manually.
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

                {useSearch ? (
                  <SongSearchInput
                    onSongSelect={handleSongSelect}
                    placeholder="Search for a song (e.g., 'Perfect Ed Sheeran')"
                    label="Search for Song *"
                    className="mb-4"
                  />
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="songTitle"
                        className="text-lg font-cormorant text-slate-700 mb-2 block font-medium"
                      >
                        Song Title *
                      </Label>
                      <Input
                        id="songTitle"
                        value={formData.songTitle}
                        onChange={(e) => handleInputChange("songTitle", e.target.value)}
                        placeholder="Enter song title"
                        className="border-sage/20 focus:border-sage bg-white/80 font-cormorant text-lg"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="artist" className="text-lg font-cormorant text-slate-700 mb-2 block font-medium">
                        Artist *
                      </Label>
                      <Input
                        id="artist"
                        value={formData.artist}
                        onChange={(e) => handleInputChange("artist", e.target.value)}
                        placeholder="Enter artist name"
                        className="border-sage/20 focus:border-sage bg-white/80 font-cormorant text-lg"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Show selected song when using search */}
                {useSearch && (formData.songTitle || formData.artist) && (
                  <div className="p-4 bg-sage/5 rounded-lg border border-sage/20">
                    <p className="text-sm text-slate-600 mb-1 font-cormorant">Selected Song:</p>
                    <p className="font-medium text-slate-900 font-cormorant">
                      {formData.songTitle} {formData.artist && `- ${formData.artist}`}
                    </p>
                  </div>
                )}

                <div className="text-center pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-sage hover:bg-sage/90 text-white px-8 py-3 text-lg font-cormorant font-light tracking-wide"
                  >
                    {isSubmitting ? "Adding Song..." : "Add to Playlist"}
                  </Button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-sage/10 text-center">
                <p className="text-sm text-slate-500 leading-relaxed">
                  Please keep song requests appropriate for all ages. We'll do our best to include as many requests as
                  possible, but the final playlist will be curated by Emily, Matthew, and their DJ.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
