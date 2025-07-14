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
import { AlertCircle, Heart, Info } from "lucide-react"
import { findGuestByName } from "@/lib/guest-list"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})

interface FormData {
  guestName: string
  message: string
}

export default function RSVPPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [guestNotFound, setGuestNotFound] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    guestName: "",
    message: "",
  })

  // Check guest when name changes
  const handleNameChange = (name: string) => {
    setFormData({ ...formData, guestName: name })

    if (name.trim()) {
      const guest = findGuestByName(name)
      setGuestNotFound(!guest)
    } else {
      setGuestNotFound(false)
    }
  }

  const handleSubmit = async () => {
    try {
      // Here you would typically send the data to your backend
      console.log("RSVP Decline Data:", { ...formData, attending: "no" })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting RSVP:", error)
    }
  }

  const canProceedToStep2 = formData.guestName.trim() !== "" && !guestNotFound

  // Success page for declined RSVPs
  if (isSubmitted) {
    return (
      <main className={cn("min-h-screen bg-gradient-to-b from-cream to-white text-slate-900", cormorant.variable)}>
        <NavBar />
        <div className="pt-20 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-sage/10 p-16">
                <Heart className="w-16 h-16 text-sage mx-auto mb-8" />
                <h1 className="text-5xl font-cormorant text-slate-700 mb-6 font-light tracking-wide">Thank You</h1>
                <div className="w-16 h-px bg-sage/40 mx-auto mb-6"></div>
                <p className="text-lg text-slate-600 mb-8 font-light leading-relaxed">
                  We're sorry you won't be able to join us on our special day, but we completely understand.
                  <br />
                  Thank you for letting us know.
                </p>
                {formData.message && (
                  <div className="bg-sage/5 p-4 rounded-lg mb-6">
                    <p className="text-slate-700 italic font-cormorant">"{formData.message}"</p>
                  </div>
                )}
                <p className="text-sm text-slate-500 font-light tracking-wide">
                  We'll be thinking of you on May 9, 2026.
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
            {/* Combined RSVP Information Block */}
            <div className="bg-sky-blue/10 border border-sky-blue/20 rounded-lg p-6 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <Info className="w-6 h-6 text-sky-blue mr-3" />
                  <h3 className="text-xl font-cormorant font-medium text-navy">RSVP Information</h3>
                </div>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Thank you for looking to RSVP in advance! We will let you know when it is time to RSVP closer to the
                  event. For now, if you know that you are unable to attend, please fill in your RSVP below. If you're
                  planning to join us for our special day, we'll send you an email when the full RSVP process opens
                  closer to the wedding date.
                </p>
                <p className="text-sm text-slate-500">
                  Questions? Contact us at{" "}
                  <a href="mailto:emilyplusmatthew@example.com" className="text-sage hover:text-sage/80">
                    emilyplusmatthew@example.com
                  </a>
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center mb-12">
              <div className="flex items-center space-x-6">
                {[1, 2].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-light border-2",
                        currentStep >= step ? "bg-sage text-white border-sage" : "bg-white text-sage border-sage/30",
                      )}
                    >
                      {step}
                    </div>
                    {step < 2 && (
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
                  <h2 className="text-3xl font-cormorant font-medium text-slate-800 tracking-wide">
                    Unable to Attend RSVP
                  </h2>
                  <p className="text-slate-600 mt-2 font-light">Only for guests who cannot attend</p>
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
                      <Input
                        id="guestName"
                        value={formData.guestName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="Full Name"
                        className={cn(
                          "text-xl p-4 text-center border-sage/20 focus:border-sage bg-white/80 font-cormorant",
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

            {/* Step 2: Decline Message */}
            {currentStep === 2 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-sage/10 overflow-hidden">
                <div className="bg-sage/5 p-6 text-center border-b border-sage/10">
                  <h2 className="text-3xl font-cormorant font-medium text-slate-800 tracking-wide">
                    We'll Miss You There
                  </h2>
                  <p className="text-slate-600 mt-2 font-light">Thank you for letting us know</p>
                </div>
                <div className="p-8">
                  <div className="space-y-8">
                    {/* Confirmation Message */}
                    <div className="text-center bg-sage/5 p-6 rounded-lg">
                      <p className="text-lg font-cormorant text-slate-700 mb-2">
                        <strong>{formData.guestName}</strong>, we understand you won't be able to join us on May 9,
                        2026.
                      </p>
                      <p className="text-slate-600">We'll miss having you there to celebrate with us.</p>
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
                        Feel free to share your well wishes or let us know why you'll be missed!
                      </p>
                    </div>

                    <div className="flex justify-between pt-6">
                      <Button
                        onClick={() => setCurrentStep(1)}
                        variant="outline"
                        className="border-sage/30 text-sage hover:bg-sage/5 px-8 py-3 rounded-full font-cormorant font-light tracking-wide"
                      >
                        Back
                      </Button>

                      <Button
                        onClick={handleSubmit}
                        className="bg-sage hover:bg-sage/90 text-white px-12 py-3 rounded-full font-cormorant font-light tracking-wide"
                      >
                        Submit RSVP
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
