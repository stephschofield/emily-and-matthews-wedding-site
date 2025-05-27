"use client"

import { useState, useEffect } from "react"
import { Cormorant_Garamond } from "next/font/google"
import { cn } from "@/lib/utils"
import { NavBar } from "@/components/nav-bar"
import { FooterSection } from "@/components/footer-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, AlertCircle } from "lucide-react"
import { findGuestByName } from "@/lib/guest-list"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})

interface EventRSVP {
  eventName: string
  attending: string
  partySize: number
}

interface FormData {
  guestName: string
  events: EventRSVP[]
  mealPreference: string
  dietaryRestrictions: string
  additionalNotes: string
}

// Elegant monogram component inspired by the invitation
function MonogramRSVP() {
  return (
    <div className="flex flex-col items-center mb-12">
      <div className="relative mb-6">
        <div className="w-32 h-20 border-2 border-sage/40 rounded-full flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-3xl font-cormorant text-sage font-light tracking-wider">R</div>
          <div className="w-8 h-px bg-sage/40 my-1"></div>
          <div className="text-3xl font-cormorant text-sage font-light tracking-wider">S</div>
        </div>
        {/* Botanical elements */}
        <div className="absolute -top-2 -right-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-sage/60">
            <path
              d="M12 2L14 8L20 6L16 12L22 14L16 16L20 18L14 16L12 22L10 16L4 18L8 12L2 10L8 8L4 6L10 8L12 2Z"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>
        <div className="absolute -bottom-2 -left-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-sage/60">
            <path
              d="M10 2L11 6L15 5L13 10L18 11L13 12L15 15L11 14L10 18L9 14L5 15L7 10L2 9L7 8L5 5L9 6L10 2Z"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm text-slate-500 font-light tracking-wide mb-2">Kindly respond by</p>
        <p className="text-sm text-slate-500 font-light tracking-wide mb-4">April ninth, twenty twenty-six</p>
        <h1 className="text-4xl font-cormorant text-slate-700 font-light tracking-wide mb-2">RSVP</h1>
        <p className="text-lg font-cormorant text-slate-600 italic">for the wedding of</p>
        <div className="mt-4">
          <p className="text-2xl font-cormorant text-slate-700 font-light tracking-widest">EMILY BUECHE</p>
          <p className="text-xl font-cormorant text-slate-600 italic my-2">and</p>
          <p className="text-2xl font-cormorant text-slate-700 font-light tracking-widest">MATTHEW ADAMS</p>
        </div>
        <div className="mt-6">
          <p className="text-sm text-slate-500 font-light tracking-wide">Saturday, the ninth of May</p>
          <p className="text-sm text-slate-500 font-light tracking-wide">Twenty twenty-six</p>
          <p className="text-sm text-slate-500 font-light tracking-wide mt-2">BATON ROUGE, LOUISIANA</p>
        </div>
      </div>
    </div>
  )
}

export default function RSVPPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [guestNotFound, setGuestNotFound] = useState(false)
  const [invitedEvents, setInvitedEvents] = useState<string[]>([])
  const [maxPartySize, setMaxPartySize] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    guestName: "",
    events: [],
    mealPreference: "",
    dietaryRestrictions: "",
    additionalNotes: "",
  })

  // Update events when guest name changes
  useEffect(() => {
    if (formData.guestName.trim()) {
      const guest = findGuestByName(formData.guestName)
      if (guest) {
        setGuestNotFound(false)
        setInvitedEvents(guest.events)
        setMaxPartySize(guest.maxPartySize)
        // Initialize events array with only invited events
        const initialEvents = guest.events.map((eventName) => ({
          eventName,
          attending: "",
          partySize: 1,
        }))
        setFormData((prev) => ({ ...prev, events: initialEvents }))
      } else {
        setGuestNotFound(true)
        setInvitedEvents([])
        setMaxPartySize(1)
        setFormData((prev) => ({ ...prev, events: [] }))
      }
    } else {
      setGuestNotFound(false)
      setInvitedEvents([])
      setMaxPartySize(1)
      setFormData((prev) => ({ ...prev, events: [] }))
    }
  }, [formData.guestName])

  const updateEventRSVP = (index: number, field: keyof EventRSVP, value: string | number) => {
    const updatedEvents = [...formData.events]
    updatedEvents[index] = { ...updatedEvents[index], [field]: value }

    // If attending "yes" and maxPartySize is 1, automatically set partySize to 1
    if (field === "attending" && value === "yes" && maxPartySize === 1) {
      updatedEvents[index].partySize = 1
    }

    setFormData({ ...formData, events: updatedEvents })
  }

  const handleSubmit = async () => {
    // Here you would typically send the data to your backend
    console.log("RSVP Data:", formData)
    setIsSubmitted(true)
  }

  const canProceedToStep2 = formData.guestName.trim() !== "" && !guestNotFound && invitedEvents.length > 0
  const canProceedToStep3 = formData.events.every((event) => event.attending !== "")
  const canSubmit = canProceedToStep3 && formData.mealPreference !== ""

  // Generate party size options based on maxPartySize
  const getPartySizeOptions = () => {
    const options = []
    for (let i = 1; i <= maxPartySize; i++) {
      if (i === 1) {
        options.push({ value: i, label: "Myself" })
      } else {
        options.push({ value: i, label: `${i} people` })
      }
    }
    return options
  }

  if (isSubmitted) {
    return (
      <main className={cn("min-h-screen bg-gradient-to-b from-cream to-white text-slate-900", cormorant.variable)}>
        <NavBar />
        <div className="pt-20 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-sage/10 p-16">
                <CheckCircle className="w-16 h-16 text-sage mx-auto mb-8" />
                <h1 className="text-5xl font-cormorant text-slate-700 mb-6 font-light tracking-wide">Thank You</h1>
                <div className="w-16 h-px bg-sage/40 mx-auto mb-6"></div>
                <p className="text-lg text-slate-600 mb-8 font-light leading-relaxed">
                  Your response has been received.
                  <br />
                  We cannot wait to celebrate with you.
                </p>
                <p className="text-sm text-slate-500 font-light tracking-wide">
                  Should you need to make changes, please contact us at
                  <br />
                  <a
                    href="mailto:emilyplusmatthew@example.com"
                    className="text-sage hover:text-sage/80 transition-colors"
                  >
                    emilyplusmatthew@example.com
                  </a>
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
            <MonogramRSVP />

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
                  <h2 className="text-2xl font-cormorant font-light text-slate-700 tracking-wide">Your Information</h2>
                </div>
                <div className="p-8">
                  <div className="space-y-8">
                    <div className="text-center">
                      <Label
                        htmlFor="guestName"
                        className="text-lg font-cormorant text-slate-600 mb-4 block font-light"
                      >
                        Please enter your name as it appears on your invitation
                      </Label>
                      <Input
                        id="guestName"
                        value={formData.guestName}
                        onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                        placeholder="Full Name"
                        className={cn(
                          "text-lg p-4 text-center border-sage/20 focus:border-sage bg-white/80 font-cormorant",
                          guestNotFound && "border-red-300 focus:border-red-500",
                        )}
                      />

                      {guestNotFound && formData.guestName.trim() && (
                        <div className="mt-4 p-4 bg-red-50/80 border border-red-200/50 rounded-md">
                          <div className="flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                            <p className="text-red-700 text-sm font-light">
                              We could not locate your name. Please verify the spelling or contact us at{" "}
                              <a href="mailto:emilyplusmatthew@example.com" className="underline">
                                emilyplusmatthew@example.com
                              </a>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

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

            {/* Step 2: Event Attendance */}
            {currentStep === 2 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-sage/10 overflow-hidden">
                <div className="bg-sage/5 p-6 text-center border-b border-sage/10">
                  <h2 className="text-2xl font-cormorant font-light text-slate-700 tracking-wide">Event Attendance</h2>
                </div>
                <div className="p-8">
                  <div className="space-y-8">
                    {formData.events.map((event, index) => (
                      <div key={index} className="border border-sage/10 rounded-lg p-6 bg-white/60">
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-cormorant text-slate-700 font-light tracking-wide">
                            {event.eventName}
                          </h3>
                          <div className="w-12 h-px bg-sage/30 mx-auto mt-2"></div>
                        </div>

                        <div className={cn("grid gap-8", maxPartySize > 1 ? "md:grid-cols-2" : "grid-cols-1")}>
                          <div className="text-center">
                            <Label className="text-sm font-cormorant text-slate-600 mb-4 block font-light">
                              Will you attend?
                            </Label>
                            <RadioGroup
                              value={event.attending}
                              onValueChange={(value) => updateEventRSVP(index, "attending", value)}
                              className="flex flex-col space-y-3"
                            >
                              <div className="flex items-center justify-center space-x-3">
                                <RadioGroupItem value="yes" id={`yes-${index}`} className="border-sage text-sage" />
                                <Label htmlFor={`yes-${index}`} className="font-cormorant text-slate-600 font-light">
                                  Joyfully accepts
                                </Label>
                              </div>
                              <div className="flex items-center justify-center space-x-3">
                                <RadioGroupItem value="no" id={`no-${index}`} className="border-sage text-sage" />
                                <Label htmlFor={`no-${index}`} className="font-cormorant text-slate-600 font-light">
                                  Regretfully declines
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {event.attending === "yes" && maxPartySize > 1 && (
                            <div className="text-center">
                              <Label className="text-sm font-cormorant text-slate-600 mb-4 block font-light">
                                Number of guests
                              </Label>
                              <Select
                                value={event.partySize.toString()}
                                onValueChange={(value) => updateEventRSVP(index, "partySize", Number.parseInt(value))}
                              >
                                <SelectTrigger className="border-sage/20 focus:border-sage bg-white/80 font-cormorant">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {getPartySizeOptions().map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value.toString()}
                                      className="font-cormorant"
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-between pt-6">
                      <Button
                        onClick={() => setCurrentStep(1)}
                        variant="outline"
                        className="border-sage/30 text-sage hover:bg-sage/5 px-8 py-3 rounded-full font-cormorant font-light tracking-wide"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={() => setCurrentStep(3)}
                        disabled={!canProceedToStep3}
                        className="bg-sage hover:bg-sage/90 text-white px-12 py-3 rounded-full font-cormorant font-light tracking-wide"
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Additional Questions */}
            {currentStep === 3 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-sage/10 overflow-hidden">
                <div className="bg-sage/5 p-6 text-center border-b border-sage/10">
                  <h2 className="text-2xl font-cormorant font-light text-slate-700 tracking-wide">
                    Additional Details
                  </h2>
                </div>
                <div className="p-8">
                  <div className="space-y-8">
                    <div className="text-center">
                      <Label className="text-lg font-cormorant text-slate-600 mb-6 block font-light">
                        Meal Selection
                      </Label>
                      <RadioGroup
                        value={formData.mealPreference}
                        onValueChange={(value) => setFormData({ ...formData, mealPreference: value })}
                        className="flex flex-col space-y-4"
                      >
                        <div className="flex items-center justify-center space-x-3">
                          <RadioGroupItem value="chicken" id="chicken" className="border-sage text-sage" />
                          <Label htmlFor="chicken" className="font-cormorant text-slate-600 font-light">
                            Herb-Crusted Chicken
                          </Label>
                        </div>
                        <div className="flex items-center justify-center space-x-3">
                          <RadioGroupItem value="fish" id="fish" className="border-sage text-sage" />
                          <Label htmlFor="fish" className="font-cormorant text-slate-600 font-light">
                            Blackened Red Fish
                          </Label>
                        </div>
                        <div className="flex items-center justify-center space-x-3">
                          <RadioGroupItem value="vegetarian" id="vegetarian" className="border-sage text-sage" />
                          <Label htmlFor="vegetarian" className="font-cormorant text-slate-600 font-light">
                            Vegetarian Selection
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label
                        htmlFor="dietary"
                        className="text-lg font-cormorant text-slate-600 mb-4 block font-light text-center"
                      >
                        Dietary Considerations
                      </Label>
                      <Textarea
                        id="dietary"
                        value={formData.dietaryRestrictions}
                        onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                        placeholder="Please share any dietary restrictions or allergies"
                        className="border-sage/20 focus:border-sage bg-white/80 font-cormorant text-center"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="notes"
                        className="text-lg font-cormorant text-slate-600 mb-4 block font-light text-center"
                      >
                        Special Notes
                      </Label>
                      <Textarea
                        id="notes"
                        value={formData.additionalNotes}
                        onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                        placeholder="Any special requests or messages for Emily and Matthew"
                        className="border-sage/20 focus:border-sage bg-white/80 font-cormorant text-center"
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-between pt-6">
                      <Button
                        onClick={() => setCurrentStep(2)}
                        variant="outline"
                        className="border-sage/30 text-sage hover:bg-sage/5 px-8 py-3 rounded-full font-cormorant font-light tracking-wide"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="bg-sage hover:bg-sage/90 text-white px-12 py-3 rounded-full font-cormorant font-light tracking-wide"
                      >
                        Submit Response
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
