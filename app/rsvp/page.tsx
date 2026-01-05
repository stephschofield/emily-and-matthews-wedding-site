"use client"

import { useState } from "react"
import { Cormorant_Garamond } from "next/font/google"
import { cn } from "@/lib/utils"
import { NavBar } from "@/components/nav-bar"
import { FooterSection } from "@/components/footer-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, Heart, Info, Loader2, Users } from "lucide-react"
import type { PartyLookupResult } from "@/lib/supabase"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})

interface FormData {
  guestName: string
  email: string
  message: string
}

interface PartyData {
  partyId: string
  householdLabel: string
  members: PartyLookupResult[]
}

interface MemberRSVP {
  member_id: string
  full_name: string
  is_plus_one_placeholder: boolean
  status: "yes" | "no" | null
  dietary_restrictions: string | null
  plus_one_name: string | null
}

export default function RSVPPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [guestNotFound, setGuestNotFound] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [partyData, setPartyData] = useState<PartyData | null>(null)
  const [attendingStatus, setAttendingStatus] = useState<"attending" | "declining" | null>(null)
  const [memberRSVPs, setMemberRSVPs] = useState<MemberRSVP[]>([])
  const [formData, setFormData] = useState<FormData>({
    guestName: "",
    email: "",
    message: "",
  })

  // Lookup party when user searches
  const handleLookupParty = async () => {
    if (!formData.guestName.trim()) return

    setIsLookingUp(true)
    setGuestNotFound(false)
    setSubmitError("")

    try {
      const response = await fetch(`/api/rsvp/lookup?name=${encodeURIComponent(formData.guestName)}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to lookup guest")
      }

      if (result.members && result.members.length > 0) {
        setPartyData({
          partyId: result.members[0].party_id,
          householdLabel: result.members[0].household_label,
          members: result.members,
        })
        // Initialize member RSVPs
        setMemberRSVPs(
          result.members.map((member: PartyLookupResult) => ({
            member_id: member.member_id,
            full_name: member.full_name,
            is_plus_one_placeholder: member.is_plus_one_placeholder,
            status: null,
            dietary_restrictions: null,
            plus_one_name: null,
          })),
        )
        setGuestNotFound(false)
      } else {
        setGuestNotFound(true)
        setPartyData(null)
      }
    } catch (error) {
      console.error("Error looking up party:", error)
      setSubmitError(error instanceof Error ? error.message : "Failed to lookup guest")
      setGuestNotFound(true)
    } finally {
      setIsLookingUp(false)
    }
  }

  const handleSubmit = async () => {
    if (!partyData) return

    setIsSubmitting(true)
    setSubmitError("")

    try {
      let rsvpUpdates

      if (attendingStatus === "declining") {
        // All members decline
        rsvpUpdates = partyData.members.map((member) => ({
          member_id: member.member_id,
          status: "no" as const,
          notes: formData.message || undefined,
        }))
      } else {
        // Individual member RSVPs
        rsvpUpdates = memberRSVPs.map((rsvp) => ({
          member_id: rsvp.member_id,
          status: rsvp.status,
          meal_choice: null,
          allergies: rsvp.status === "yes" ? rsvp.dietary_restrictions : null,
          notes: formData.message || undefined,
        }))

        // Update plus-one names if provided
        const plusOneUpdates = memberRSVPs
          .filter((rsvp) => rsvp.is_plus_one_placeholder && rsvp.status === "yes" && rsvp.plus_one_name)
          .map((rsvp) => ({
            member_id: rsvp.member_id,
            full_name: rsvp.plus_one_name!,
          }))

        if (plusOneUpdates.length > 0) {
          // Update plus-one names before submitting RSVPs
          const nameUpdateResponse = await fetch("/api/rsvp/update-names", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ updates: plusOneUpdates }),
          })

          if (!nameUpdateResponse.ok) {
            const errorData = await nameUpdateResponse.json()
            throw new Error(errorData.error || "Failed to update plus-one names")
          }
        }
      }

      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          partyId: partyData.partyId,
          email: formData.email, // Send email to API
          rsvps: rsvpUpdates,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit RSVP")
      }

      console.log("RSVP saved successfully:", result)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting RSVP:", error)
      setSubmitError(error instanceof Error ? error.message : "Failed to submit RSVP. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateMemberRSVP = (memberId: string, updates: Partial<MemberRSVP>) => {
    setMemberRSVPs((prev) =>
      prev.map((rsvp) => (rsvp.member_id === memberId ? { ...rsvp, ...updates } : rsvp)),
    )
  }

  const canProceedToStep2 = partyData !== null && !guestNotFound &&
    // Ensure all plus-one names are provided before proceeding
    memberRSVPs.every(rsvp => !rsvp.is_plus_one_placeholder || rsvp.plus_one_name?.trim())
  const canProceedToStep3 =
    attendingStatus === "declining" ||
    (attendingStatus === "attending" && memberRSVPs.every((rsvp) => rsvp.status !== null))
  
  // Validation for final submission
  const isValidEmail = formData.email.trim().length > 0 && formData.email.includes('@')
  const canSubmit =
    isValidEmail && 
    (attendingStatus === "declining" ||
    memberRSVPs.every(
      (rsvp) =>
        rsvp.status === "no" ||
        (rsvp.status === "yes" &&
          (!rsvp.is_plus_one_placeholder || rsvp.plus_one_name)),
    ))

  // Success page
  if (isSubmitted) {
    const attendingCount = memberRSVPs.filter((rsvp) => rsvp.status === "yes").length

    return (
      <main className={cn("min-h-screen bg-gradient-to-b from-cream to-white text-slate-900", cormorant.variable)}>
        <NavBar />
        <div className="pt-20 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-sage/10 p-16">
                <Heart className="w-16 h-16 text-sage mx-auto mb-8" />
                <h1 className="text-5xl font-cormorant text-slate-700 mb-6 font-light tracking-wide">
                  Thank You{formData.guestName ? <>, <span className="capitalize">{formData.guestName}</span></> : ""}
                </h1>
                <div className="w-16 h-px bg-sage/40 mx-auto mb-6"></div>

                {attendingStatus === "declining" ? (
                  <>
                    <p className="text-lg text-slate-600 mb-8 font-light leading-relaxed">
                      {"We're sorry you won't be able to join us on our special day, but we completely understand."}
                      <br />
                      Thank you for letting us know.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-lg text-slate-600 mb-8 font-light leading-relaxed">
                      {attendingCount === 1 && "We're so excited to celebrate with you on May 9, 2026!"}
                      {attendingCount === 2 && "We're so excited to celebrate with both of you on May 9, 2026!"}
                      {attendingCount > 2 && `We can't wait to celebrate with all ${attendingCount} of you on May 9, 2026!`}
                      <br />
                      Your RSVP has been received.
                    </p>
                  </>
                )}

                <p className="text-sm text-slate-500 mb-6">
                  A confirmation email has been sent to {formData.email}
                </p>

                {formData.message && (
                  <div className="bg-sage/5 p-4 rounded-lg mb-6">
                    <p className="text-slate-700 italic font-cormorant">"{formData.message}"</p>
                  </div>
                )}

                <p className="text-sm text-slate-500 font-light tracking-wide">
                  {attendingStatus === "declining"
                    ? "We'll be thinking of you on May 9, 2026."
                    : "Looking forward to seeing you there!"}
                  <br />
                  With love, Emily & Matthew
                </p>
              </div>
            </div>
          </div>
        </div>
        <FooterSection />
      </main>
    )
  }

  return (
    <main className={cn("min-h-screen bg-gradient-to-b from-cream to-white text-slate-900", cormorant.variable)}>
      <NavBar />
      <div className="pt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50/80 border border-red-200/50 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700 text-sm">{submitError}</p>
                </div>
              </div>
            )}

            {/* Progress Indicator */}
            <div className="flex justify-center mb-12">
              <div className="flex items-center space-x-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-light border-2",
                        currentStep >= step ? "bg-sage text-white border-sage" : "bg-white text-sage border-sage/30",
                      )}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={cn("w-12 h-px mx-3", currentStep > step ? "bg-sage" : "bg-sage/20")} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Guest Name */}
            {currentStep === 1 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-sage/10 overflow-hidden">
                <div className="bg-sage/5 p-6 text-center border-b border-sage/10">
                  <h2 className="text-3xl font-cormorant font-medium text-slate-800 tracking-wide">RSVP</h2>
                  <p className="text-slate-600 mt-2 font-light">Find your invitation</p>
                </div>
                <div className="p-8">
                  <div className="space-y-8">
                    <div className="text-center">
                      <Label
                        htmlFor="guestName"
                        className="text-xl font-cormorant text-slate-700 mb-4 block font-medium"
                      >
                        Please enter your name as it appears on your invitation
                      </Label>
                      <div className="flex gap-3">
                        <Input
                          id="guestName"
                          value={formData.guestName}
                          onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleLookupParty()
                            }
                          }}
                          placeholder="Full Name"
                          className={cn(
                            "text-xl p-4 text-center border-sage/20 focus:border-sage bg-white/80 font-cormorant",
                            guestNotFound && "border-red-300 focus:border-red-500",
                            partyData && "border-green-300",
                          )}
                        />
                        <Button
                          onClick={handleLookupParty}
                          disabled={!formData.guestName.trim() || isLookingUp}
                          className="bg-sage hover:bg-sage/90 text-white px-8 py-3 font-cormorant text-lg"
                        >
                          {isLookingUp ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
                        </Button>
                      </div>

                      {guestNotFound && formData.guestName.trim() && (
                        <div className="mt-4 p-4 bg-red-50/80 border border-red-200/50 rounded-md">
                          <div className="flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                            <p className="text-red-700 text-sm font-light">
                              We could not locate your name. Please verify the spelling or contact us at{" "}
                              <a href="mailto:eebueche@gmail.com" className="underline">
                                eebueche@gmail.com
                              </a>
                            </p>
                          </div>
                        </div>
                      )}

                      {partyData && (
                        <div className="mt-4 p-4 bg-green-50/80 border border-green-200/50 rounded-md">
                          <div className="flex items-center justify-center mb-2">
                            <Users className="w-5 h-5 text-green-600 mr-2" />
                            <p className="text-green-700 font-medium">Party Found: {partyData.householdLabel}</p>
                          </div>
                          <div className="text-sm text-slate-600">
                            {partyData.members.length} {partyData.members.length === 1 ? "guest" : "guests"}:
                            <ul className="mt-2 space-y-1">
                              {partyData.members.map((member) => (
                                <li key={member.member_id} className="font-cormorant">
                                  • {member.is_plus_one_placeholder ? "Guest" : member.full_name}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {partyData.members.some(m => m.is_plus_one_placeholder) && (
                            <div className="mt-3 p-3 bg-blue-50/80 border border-blue-200/50 rounded-md">
                              <div className="flex items-start">
                                <Info className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-blue-700">
                                  You're invited to bring a guest! Please provide their name below.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Plus-One Name Entry - Required Before Proceeding */}
                    {partyData && partyData.members.some(m => m.is_plus_one_placeholder) && (
                      <div className="space-y-4">
                        <div className="border-t border-sage/20 pt-6">
                          <h3 className="text-2xl font-cormorant font-medium text-slate-800 text-center mb-6">
                            Guest Information
                          </h3>
                          {memberRSVPs
                            .filter(rsvp => rsvp.is_plus_one_placeholder)
                            .map((rsvp) => (
                              <div key={rsvp.member_id} className="bg-sage/5 p-6 rounded-lg space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Users className="w-5 h-5 text-sage" />
                                  <Label htmlFor={`step1-plus-one-${rsvp.member_id}`} className="text-lg font-cormorant text-slate-700 font-semibold">
                                    Guest's Full Name *
                                  </Label>
                                </div>
                                <p className="text-sm text-slate-600 mb-3">
                                  Please provide the first and last name of the guest you'll be bringing.
                                </p>
                                <Input
                                  id={`step1-plus-one-${rsvp.member_id}`}
                                  value={rsvp.plus_one_name || ""}
                                  onChange={(e) =>
                                    updateMemberRSVP(rsvp.member_id, { plus_one_name: e.target.value })
                                  }
                                  placeholder="e.g., Jane Smith"
                                  className={cn(
                                    "text-lg p-4 border-sage/20 focus:border-sage font-cormorant",
                                    !rsvp.plus_one_name?.trim() && "border-blue-300"
                                  )}
                                />
                                {!rsvp.plus_one_name?.trim() && (
                                  <p className="text-sm text-blue-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    Required to continue
                                  </p>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-center pt-6">
                      <Button
                        onClick={() => setCurrentStep(2)}
                        disabled={!canProceedToStep2}
                        className="bg-sage hover:bg-sage/90 text-white px-12 py-3 rounded-full font-cormorant text-lg font-light tracking-wide"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Attend or Decline */}
            {currentStep === 2 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-sage/10 overflow-hidden">
                <div className="bg-sage/5 p-6 text-center border-b border-sage/10">
                  <h2 className="text-3xl font-cormorant font-medium text-slate-800 tracking-wide">
                    Will You Be Joining Us?
                  </h2>
                  <p className="text-slate-600 mt-2 font-light">{partyData?.householdLabel}</p>
                </div>
                <div className="p-8">
                  <div className="space-y-8">
                    {/* Attend/Decline Selection */}
                    <div className="space-y-6">
                      <Label className="text-xl font-cormorant text-slate-700 block font-medium text-center">
                        Please select one:
                      </Label>

                      <div className="grid grid-cols-2 gap-6">
                        <button
                          onClick={() => {
                            setAttendingStatus("attending")
                            // Initialize all members as attending by default
                            setMemberRSVPs((prev) =>
                              prev.map((rsvp) => ({
                                ...rsvp,
                                status: "yes" as const,
                              })),
                            )
                          }}
                          className={cn(
                            "p-8 rounded-lg border-2 transition-all hover:scale-105",
                            attendingStatus === "attending"
                              ? "bg-sage/10 border-sage text-sage"
                              : "bg-white border-sage/20 text-slate-600 hover:border-sage/40",
                          )}
                        >
                          <Heart className="w-12 h-12 mx-auto mb-4" />
                          <p className="text-2xl font-cormorant font-medium">Joyfully Accept</p>
                          <p className="text-sm mt-2 font-light">{"We'll be there!"}</p>
                        </button>

                        <button
                          onClick={() => {
                            setAttendingStatus("declining")
                            // Set all members to declining
                            setMemberRSVPs((prev) =>
                              prev.map((rsvp) => ({
                                ...rsvp,
                                status: "no" as const,
                              })),
                            )
                          }}
                          className={cn(
                            "p-8 rounded-lg border-2 transition-all hover:scale-105",
                            attendingStatus === "declining"
                              ? "bg-slate-100 border-slate-400 text-slate-700"
                              : "bg-white border-sage/20 text-slate-600 hover:border-sage/40",
                          )}
                        >
                          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                          <p className="text-2xl font-cormorant font-medium">Regretfully Decline</p>
                          <p className="text-sm mt-2 font-light">{"Unable to attend"}</p>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between pt-6">
                      <Button
                        onClick={() => {
                          setCurrentStep(1)
                          setAttendingStatus(null)
                          setMemberRSVPs((prev) =>
                            prev.map((rsvp) => ({
                              ...rsvp,
                              status: null,
                            })),
                          )
                        }}
                        variant="outline"
                        className="border-sage/30 text-sage hover:bg-sage/5 px-8 py-3 rounded-full font-cormorant font-light tracking-wide"
                      >
                        Back
                      </Button>

                      <Button
                        onClick={() => setCurrentStep(3)}
                        disabled={!attendingStatus}
                        className="bg-sage hover:bg-sage/90 text-white px-12 py-3 rounded-full font-cormorant text-lg font-light tracking-wide"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Details and Confirmation */}
            {currentStep === 3 && attendingStatus === "declining" && (
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-sage/10 overflow-hidden">
                <div className="bg-sage/5 p-6 text-center border-b border-sage/10">
                  <h2 className="text-3xl font-cormorant font-medium text-slate-800 tracking-wide">
                    {"We'll Miss You There"}
                  </h2>
                  <p className="text-slate-600 mt-2 font-light">Thank you for letting us know</p>
                </div>
                <div className="p-8">
                  <div className="space-y-8">
                    {/* Confirmation Message */}
                    <div className="text-center bg-sage/5 p-6 rounded-lg">
                      <p className="text-lg font-cormorant text-slate-700 mb-2">
                        <strong>{partyData?.householdLabel}</strong>, we understand you {"won't be able to join us"}
                        on May 9, 2026.
                      </p>
                      {partyData && partyData.members.length > 1 && (
                        <p className="text-sm text-slate-600 mt-2">
                          This RSVP will mark all {partyData.members.length} members of your party as unable to attend.
                        </p>
                      )}
                      <p className="text-slate-600 mt-2">{"We'll miss having you there to celebrate with us."}</p>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-4">
                      <Label
                        htmlFor="email"
                        className="text-lg font-cormorant text-slate-700 block font-medium text-center"
                      >
                        Email Address for Confirmation *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="border-sage/20 focus:border-sage bg-white/80 font-cormorant text-center"
                      />
                    </div>

                    {/* Optional Message Field */}
                    <div className="space-y-4">
                      <Label
                        htmlFor="message"
                        className="text-lg font-cormorant text-slate-700 block font-medium text-center"
                      >
                        Optional Message for Emily & Matthew
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Share a message with the happy couple..."
                        className="border-sage/20 focus:border-sage bg-white/80 font-cormorant text-center"
                        rows={4}
                      />
                      <p className="text-sm text-slate-500 text-center">
                        Feel free to share your well wishes or let us know why {"you'll be missed!"}
                      </p>
                    </div>

                    <div className="flex justify-between pt-6">
                      <Button
                        onClick={() => setCurrentStep(2)}
                        variant="outline"
                        disabled={isSubmitting}
                        className="border-sage/30 text-sage hover:bg-sage/5 px-8 py-3 rounded-full font-cormorant font-light tracking-wide"
                      >
                        Back
                      </Button>

                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !canSubmit}
                        className="bg-sage hover:bg-sage/90 text-white px-12 py-3 rounded-full font-cormorant font-light tracking-wide flex items-center gap-2"
                      >
                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isSubmitting ? "Submitting..." : "Submit RSVP"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Individual Member Details (Attending) */}
            {currentStep === 3 && attendingStatus === "attending" && (
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-sage/10 overflow-hidden">
                <div className="bg-sage/5 p-6 text-center border-b border-sage/10">
                  <h2 className="text-3xl font-cormorant font-medium text-slate-800 tracking-wide">
                    {"We're So Excited!"}
                  </h2>
                  <p className="text-slate-600 mt-2 font-light">Please provide details for each guest</p>
                </div>
                <div className="p-8">
                  <div className="space-y-8">
                    {/* Individual Member RSVPs */}
                    <div className="space-y-6">
                      {memberRSVPs.map((rsvp, index) => (
                        <div key={rsvp.member_id} className="bg-sage/5 p-6 rounded-lg space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-cormorant font-medium text-slate-800">
                              {rsvp.is_plus_one_placeholder ? "Your Guest" : rsvp.full_name}
                              {rsvp.is_plus_one_placeholder && rsvp.plus_one_name && (
                                <span className="text-base text-slate-600 ml-2">({rsvp.plus_one_name})</span>
                              )}
                            </h3>
                            <div className="flex items-center gap-4">
                              <Label className="text-sm text-slate-600">Will attend?</Label>
                              <RadioGroup
                                value={rsvp.status || ""}
                                onValueChange={(value) =>
                                  updateMemberRSVP(rsvp.member_id, { status: value as "yes" | "no" })
                                }
                                className="flex gap-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="yes" id={`${rsvp.member_id}-yes`} />
                                  <Label htmlFor={`${rsvp.member_id}-yes`} className="cursor-pointer">
                                    Yes
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="no" id={`${rsvp.member_id}-no`} />
                                  <Label htmlFor={`${rsvp.member_id}-no`} className="cursor-pointer">
                                    No
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>

                          {rsvp.status === "yes" && (
                            <div className="space-y-4 pt-4 border-t border-sage/20">
                              {/* Guest name is already provided in Step 1, just show it */}
                              {rsvp.is_plus_one_placeholder && rsvp.plus_one_name && (
                                <div className="bg-sage/5 p-3 rounded-md">
                                  <p className="text-sm text-slate-600">
                                    <span className="font-semibold">Guest:</span> {rsvp.plus_one_name}
                                  </p>
                                </div>
                              )}

                              {/* Dietary Restrictions */}
                              <div className="space-y-2">
                                <Label htmlFor={`dietary-${rsvp.member_id}`} className="text-slate-700">
                                  Dietary Restrictions or Allergies {rsvp.is_plus_one_placeholder ? `for ${rsvp.plus_one_name}` : ""}
                                </Label>
                                <Textarea
                                  id={`dietary-${rsvp.member_id}`}
                                  value={rsvp.dietary_restrictions || ""}
                                  onChange={(e) =>
                                    updateMemberRSVP(rsvp.member_id, { dietary_restrictions: e.target.value })
                                  }
                                  placeholder={rsvp.is_plus_one_placeholder 
                                    ? "Please let us know of any dietary restrictions or food allergies for your guest..."
                                    : "Please let us know of any dietary restrictions or food allergies..."}
                                  className="border-sage/20 focus:border-sage"
                                  rows={2}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-4">
                      <Label
                        htmlFor="email"
                        className="text-lg font-cormorant text-slate-700 block font-medium text-center"
                      >
                        Email Address for Confirmation *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="border-sage/20 focus:border-sage bg-white/80 font-cormorant text-center"
                      />
                    </div>

                    {/* Optional Message Field */}
                    <div className="space-y-4">
                      <Label
                        htmlFor="message"
                        className="text-lg font-cormorant text-slate-700 block font-medium text-center"
                      >
                        Optional Message for Emily & Matthew
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Share your excitement or any special messages..."
                        className="border-sage/20 focus:border-sage bg-white/80 font-cormorant text-center"
                        rows={3}
                      />
                    </div>

                    {/* Validation Messages */}
                    {!canSubmit && (
                      <div className="bg-yellow-50/80 border border-yellow-200/50 rounded-md p-4">
                        <div className="flex items-start">
                          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-yellow-800">
                            <p className="font-medium mb-1">Please complete the following:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {!isValidEmail && <li>Enter a valid email address</li>}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between pt-6">
                      <Button
                        onClick={() => setCurrentStep(2)}
                        variant="outline"
                        disabled={isSubmitting}
                        className="border-sage/30 text-sage hover:bg-sage/5 px-8 py-3 rounded-full font-cormorant font-light tracking-wide"
                      >
                        Back
                      </Button>

                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !canSubmit}
                        className="bg-sage hover:bg-sage/90 text-white px-12 py-3 rounded-full font-cormorant font-light tracking-wide flex items-center gap-2"
                      >
                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isSubmitting ? "Submitting..." : "Submit RSVP"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <FooterSection />
    </main>
  )
}
