"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, CheckCircle2, Loader2, Utensils } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase"
import { PartyMember } from "./rsvp-search"
import { cn } from "@/lib/utils"

interface PartyEditorProps {
  partyId: string
  householdLabel: string
  initialMembers: PartyMember[]
  onSuccess?: () => void
}

interface EditableMember extends PartyMember {
  // Local state for editing
  localStatus: 'unknown' | 'yes' | 'no'
  localMealChoice: string
  localAllergies: string
  localNotes: string
}

const MEAL_OPTIONS = [
  { value: 'beef', label: 'Beef' },
  { value: 'chicken', label: 'Chicken' },
  { value: 'fish', label: 'Fish' },
  { value: 'vegetarian', label: 'Vegetarian' }
]

export function PartyEditor({ partyId, householdLabel, initialMembers, onSuccess }: PartyEditorProps) {
  // Initialize editable state from initial members
  const [members, setMembers] = useState<EditableMember[]>(
    initialMembers.map(m => ({
      ...m,
      localStatus: m.rsvp_status,
      localMealChoice: m.meal_choice || '',
      localAllergies: m.allergies || '',
      localNotes: m.notes || ''
    }))
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const updateMember = (memberId: string, updates: Partial<EditableMember>) => {
    setMembers(prev => prev.map(m =>
      m.member_id === memberId ? { ...m, ...updates } : m
    ))
  }

  const handleStatusChange = (memberId: string, status: 'yes' | 'no') => {
    setMembers(prev => prev.map(m => {
      if (m.member_id === memberId) {
        // Clear meal and allergy data when selecting "no"
        if (status === 'no') {
          return {
            ...m,
            localStatus: status,
            localMealChoice: '',
            localAllergies: '',
            localNotes: ''
          }
        }
        return { ...m, localStatus: status }
      }
      return m
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      const supabase = getSupabaseClient()

      // Build the payload for the RPC
      const payload = members.map(m => ({
        member_id: m.member_id,
        status: m.localStatus,
        meal_choice: m.localStatus === 'yes' ? m.localMealChoice : null,
        allergies: m.localStatus === 'yes' ? m.localAllergies : null,
        notes: m.localStatus === 'yes' ? m.localNotes : null
      }))

      // Call the update_party_rsvps RPC
      const { data, error: rpcError } = await supabase.rpc('update_party_rsvps', {
        p_party_id: partyId,
        p_items: payload
      })

      if (rpcError) {
        throw new Error(rpcError.message)
      }

      console.log('RSVP updated successfully:', data)
      setSubmitSuccess(true)

      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }

    } catch (err) {
      console.error('Error updating RSVPs:', err)
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'An error occurred while saving your RSVP. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if at least one person responded
  const hasAnyResponse = members.some(m => m.localStatus !== 'unknown')
  const allDeclined = members.every(m => m.localStatus === 'no')

  if (submitSuccess) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-sage/10 overflow-hidden">
        <div className="p-16 text-center">
          <CheckCircle2 className="w-16 h-16 text-sage mx-auto mb-6" />
          <h2 className="text-4xl font-cormorant text-slate-800 mb-4 font-light">
            Thank You!
          </h2>
          <div className="w-16 h-px bg-sage/40 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 font-light leading-relaxed mb-6">
            Your RSVP has been saved successfully.
          </p>
          {allDeclined ? (
            <p className="text-slate-600">
              {"We're sorry you won't be able to join us, but we understand."}
              <br />
              {"We'll be thinking of you on May 9, 2026."}
            </p>
          ) : (
            <p className="text-slate-600">
              {"We can't wait to celebrate with you on May 9, 2026!"}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-sage/10 overflow-hidden">
      <div className="bg-sage/5 p-6 text-center border-b border-sage/10">
        <div className="flex items-center justify-center mb-3">
          <Utensils className="w-8 h-8 text-sage mr-3" />
        </div>
        <h2 className="text-3xl font-cormorant font-medium text-slate-800 tracking-wide">
          RSVP for {householdLabel}
        </h2>
        <p className="text-slate-600 mt-2 font-light">
          Please respond for each guest
        </p>
      </div>

      <div className="p-8">
        <div className="space-y-8">
          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50/80 border border-red-200/50 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-red-700 text-sm">{submitError}</p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-sky-blue/10 border border-sky-blue/20 rounded-lg p-6">
            <p className="text-center text-slate-700 leading-relaxed text-sm">
              <strong>Note:</strong> Please indicate whether each person can attend. 
              You cannot add or remove guests from this list.
            </p>
          </div>

          {/* Members List */}
          {members.map((member, index) => (
            <Card key={member.member_id} className="border-sage/20 bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Member Name */}
                  <div className="text-center pb-2 border-b border-sage/10">
                    <h3 className="text-2xl font-cormorant text-navy font-medium">
                      {member.is_plus_one_placeholder ? (
                        <span className="italic text-slate-600">Guest of {members[0]?.full_name}</span>
                      ) : (
                        member.full_name
                      )}
                    </h3>
                  </div>

                  {/* RSVP Status Radio Buttons */}
                  <div className="space-y-3">
                    <Label className="text-base font-cormorant text-slate-700">
                      Will you be attending?
                    </Label>
                    <RadioGroup
                      value={member.localStatus}
                      onValueChange={(value: string) => handleStatusChange(member.member_id, value as 'yes' | 'no')}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`${member.member_id}-yes`} />
                        <Label
                          htmlFor={`${member.member_id}-yes`}
                          className="font-cormorant text-lg cursor-pointer"
                        >
                          Yes, I'll be there
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`${member.member_id}-no`} />
                        <Label
                          htmlFor={`${member.member_id}-no`}
                          className="font-cormorant text-lg cursor-pointer"
                        >
                          {"Sorry, I can't make it"}
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Meal and Allergy Fields (only show when attending) */}
                  {member.localStatus === 'yes' && (
                    <div className="space-y-4 pt-4 border-t border-sage/10">
                      {/* Meal Choice */}
                      <div className="space-y-2">
                        <Label htmlFor={`meal-${member.member_id}`} className="font-cormorant text-base">
                          Meal Preference
                        </Label>
                        <select
                          id={`meal-${member.member_id}`}
                          value={member.localMealChoice}
                          onChange={(e) => updateMember(member.member_id, { localMealChoice: e.target.value })}
                          className={cn(
                            "w-full p-3 border border-sage/20 rounded-md",
                            "focus:border-sage focus:ring-1 focus:ring-sage",
                            "bg-white/80 font-cormorant text-base"
                          )}
                        >
                          <option value="">Select a meal...</option>
                          {MEAL_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Dietary Restrictions / Allergies */}
                      <div className="space-y-2">
                        <Label htmlFor={`allergies-${member.member_id}`} className="font-cormorant text-base">
                          Dietary Restrictions or Allergies
                        </Label>
                        <Input
                          id={`allergies-${member.member_id}`}
                          value={member.localAllergies}
                          onChange={(e) => updateMember(member.member_id, { localAllergies: e.target.value })}
                          placeholder="e.g., Gluten-free, Vegetarian, None"
                          className="border-sage/20 focus:border-sage bg-white/80 font-cormorant"
                        />
                      </div>

                      {/* Optional Notes */}
                      <div className="space-y-2">
                        <Label htmlFor={`notes-${member.member_id}`} className="font-cormorant text-base">
                          Special Requests (Optional)
                        </Label>
                        <Textarea
                          id={`notes-${member.member_id}`}
                          value={member.localNotes}
                          onChange={(e) => updateMember(member.member_id, { localNotes: e.target.value })}
                          placeholder="Any special accommodations needed?"
                          className="border-sage/20 focus:border-sage bg-white/80 font-cormorant"
                          rows={2}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleSubmit}
              disabled={!hasAnyResponse || isSubmitting}
              className="bg-sage hover:bg-sage/90 text-white px-16 py-3 rounded-full font-cormorant text-lg font-light tracking-wide flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit RSVP
                </>
              )}
            </Button>
          </div>

          {!hasAnyResponse && (
            <p className="text-center text-sm text-slate-500">
              Please select an attendance response for at least one guest
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
