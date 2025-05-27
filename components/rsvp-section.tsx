"use client"

import { SectionTitle } from "@/components/section-title"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Users, Utensils } from "lucide-react"

export function RsvpSection() {
  return (
    <section id="rsvp" className="py-20 bg-cream relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <SectionTitle>RSVP</SectionTitle>

        <Card className="max-w-2xl mx-auto mt-12 border-sage/20 overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="bg-navy text-white p-6 text-center relative">
              <h3 className="text-2xl md:text-3xl font-cormorant font-light relative z-10">
                Please respond by April 9, 2026
              </h3>
            </div>

            <div className="p-8 text-center">
              <h3 className="text-2xl font-cormorant text-navy mb-6 font-light">Complete Your RSVP Online</h3>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="flex flex-col items-center p-4">
                  <Calendar className="w-8 h-8 text-sage mb-2" />
                  <h4 className="font-medium text-navy mb-1">Select Events</h4>
                  <p className="text-sm text-slate-600 text-center">Choose which events you'll attend</p>
                </div>
                <div className="flex flex-col items-center p-4">
                  <Users className="w-8 h-8 text-sage mb-2" />
                  <h4 className="font-medium text-navy mb-1">Party Size</h4>
                  <p className="text-sm text-slate-600 text-center">Let us know how many will join you</p>
                </div>
                <div className="flex flex-col items-center p-4">
                  <Utensils className="w-8 h-8 text-sage mb-2" />
                  <h4 className="font-medium text-navy mb-1">Meal Preferences</h4>
                  <p className="text-sm text-slate-600 text-center">Share dietary needs and preferences</p>
                </div>
              </div>

              <Button asChild className="bg-sage hover:bg-sage/90 text-white flex items-center gap-2 text-lg px-8 py-4">
                <a href="/rsvp">
                  Complete Your RSVP
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>

              <p className="mt-6 text-sm text-slate-500">
                Having trouble with your RSVP? Contact us directly at
                <a href="mailto:emilyplusmatthew@example.com" className="text-navy hover:text-sage ml-1">
                  emilyplusmatthew@example.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
