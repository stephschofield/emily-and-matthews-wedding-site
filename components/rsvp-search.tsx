"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, Search } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase"
import { cn } from "@/lib/utils"

// Type for party result from lookup_party_by_name RPC
export interface PartyMember {
  member_id: string
  full_name: string
  is_plus_one_placeholder: boolean
  allow_attend: boolean
  sort_order: number
  rsvp_status: 'unknown' | 'yes' | 'no'
  meal_choice: string | null
  allergies: string | null
  notes: string | null
}

export interface PartyResult {
  party_id: string
  household_label: string
  members: PartyMember[]
}

interface RsvpSearchProps {
  onFound: (party: PartyResult) => void
}

export function RsvpSearch({ onFound }: RsvpSearchProps) {
  const [searchName, setSearchName] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!searchName.trim()) return

    setIsSearching(true)
    setNotFound(false)
    setError(null)

    try {
      const supabase = getSupabaseClient()

      // Call the lookup_party_by_name RPC
      const { data, error: rpcError } = await supabase.rpc('lookup_party_by_name', {
        q: searchName.trim()
      }) as { data: any[] | null, error: any }

      if (rpcError) {
        throw new Error(rpcError.message)
      }

      // Check if we got results
      if (!data || data.length === 0) {
        setNotFound(true)
        return
      }

      // Map the flat rows into a PartyResult structure
      const partyId = data[0].party_id
      const householdLabel = data[0].household_label

      const members: PartyMember[] = data.map((row: any) => ({
        member_id: row.member_id,
        full_name: row.full_name,
        is_plus_one_placeholder: row.is_plus_one_placeholder,
        allow_attend: row.allow_attend,
        sort_order: row.sort_order,
        rsvp_status: row.rsvp_status || 'unknown',
        meal_choice: row.meal_choice,
        allergies: row.allergies,
        notes: row.notes
      }))

      // Sort members by sort_order
      members.sort((a, b) => a.sort_order - b.sort_order)

      // Pass the party result to parent
      onFound({
        party_id: partyId,
        household_label: householdLabel,
        members
      })

    } catch (err) {
      console.error('Error searching for party:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while searching. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchName.trim()) {
      handleSearch()
    }
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-sage/10 overflow-hidden">
      <div className="bg-sage/5 p-6 text-center border-b border-sage/10">
        <h2 className="text-3xl font-cormorant font-medium text-slate-800 tracking-wide">
          Find Your Invitation
        </h2>
        <p className="text-slate-600 mt-2 font-light">
          Enter your name to view your RSVP
        </p>
      </div>

      <div className="p-8">
        <div className="space-y-6">
          {/* Search Input */}
          <div className="text-center">
            <Label
              htmlFor="searchName"
              className="text-xl font-cormorant text-slate-700 mb-4 block font-medium"
            >
              Please enter your name
            </Label>
            <div className="relative">
              <Input
                id="searchName"
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value)
                  setNotFound(false)
                  setError(null)
                }}
                onKeyPress={handleKeyPress}
                placeholder="Full Name"
                disabled={isSearching}
                className={cn(
                  "text-xl p-4 text-center border-sage/20 focus:border-sage bg-white/80 font-cormorant",
                  notFound && "border-red-300 focus:border-red-500"
                )}
              />
            </div>
          </div>

          {/* Error Messages */}
          {notFound && (
            <div className="p-4 bg-red-50/80 border border-red-200/50 rounded-md">
              <div className="flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-red-700 text-sm font-light">
                  We could not locate your invitation. Please verify the spelling or contact us at{" "}
                  <a href="mailto:eebueche@gmail.com" className="underline">
                    eebueche@gmail.com
                  </a>
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50/80 border border-red-200/50 rounded-md">
              <div className="flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-red-700 text-sm font-light">{error}</p>
              </div>
            </div>
          )}

          {/* Search Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSearch}
              disabled={!searchName.trim() || isSearching}
              className="bg-sage hover:bg-sage/90 text-white px-12 py-3 rounded-full font-cormorant text-lg font-light tracking-wide flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
