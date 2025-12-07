import Image from "next/image"
import { SectionTitle } from "@/components/section-title"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, ExternalLink, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VenueSection() {
  return (
    <section className="py-20 bg-sky-blue/5 relative">
      <div className="container mx-auto px-4">
        <SectionTitle id="the-venue">The Venue</SectionTitle>

        <div className="grid md:grid-cols-2 gap-12 mt-12 items-center">
          <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/images/LouisianasOldStateCapitol.jpg"
              alt="Old Louisiana State Capitol"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-navy/20 backdrop-blur-[2px]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 p-6 rounded-lg shadow-lg text-center relative max-w-xs">
                <h4 className="text-xl font-cormorant text-navy font-light">Old Louisiana State Capitol</h4>
                <p className="text-sm text-slate-700">Where we'll celebrate our special day</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-cormorant text-navy mb-6 font-light">Old Louisiana State Capitol</h3>

            <p className="text-lg text-slate-700 mb-8 leading-relaxed">
              Known as the "Castle on the River," the Old Louisiana State Capitol stands as a testament to Gothic
              Revival architecture and the rich history of Louisiana. With its stunning stained glass dome, spiral
              staircase, and ornate details, this National Historic Landmark provides the perfect backdrop for Emily and
              Matthew's elegant celebration.
            </p>

            <div className="space-y-4">
              <Card className="border-sage/20 overflow-hidden">
                <CardContent className="p-4 flex items-center">
                  <MapPin className="text-emerald mr-4" />
                  <p className="text-slate-700">100 North Blvd, Baton Rouge, LA 70801</p>
                </CardContent>
              </Card>

              <Card className="border-sage/20 overflow-hidden">
                <CardContent className="p-4 flex items-center">
                  <Clock className="text-emerald mr-4" />
                  <p className="text-slate-700">Ceremony begins at 6:15 PM - Please arrive by 6:00 PM</p>
                </CardContent>
              </Card>

              <Card className="border-sage/20 overflow-hidden">
                <CardContent className="p-4 flex items-start">
                  <Info className="text-sage mr-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-slate-700 font-medium mb-1">Parking Information</p>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Parking at the Old State Capitol is limited and restricted to vendors and the wedding party. We
                      advise carpooling and parking in paid lots near the venue or using rideshare apps. If your hotel
                      is located downtown, ask the receptionist if shuttle rides are available.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-cormorant text-navy mb-6 font-light">Accommodations</h3>

          <p className="text-lg text-slate-700 mb-8">
            We have reserved a room block for our wedding guests with special group rates.
          </p>

          <Card className="max-w-2xl mx-auto border-sage/20 overflow-hidden shadow-lg">
            <CardContent className="p-8 text-center">
              <h4 className="text-2xl font-cormorant text-navy mb-2 font-light">Hilton Baton Rouge Capitol Center</h4>
              <p className="text-lg text-navy mb-4 font-medium">Bueche-Adams Wedding Block</p>
              <div className="text-slate-700 mb-6 space-y-1">
                <p>May 8, 2026 - May 10, 2026</p>
                <p>201 Lafayette St.</p>
                <p>Baton Rouge, LA 70801</p>
              </div>
              <Button
                asChild
                className="bg-sage hover:bg-sage/90 text-white flex items-center gap-2 text-lg px-8 py-4 mx-auto"
              >
                <a href="https://book.passkey.com/go/BuecheAdamsWedding" target="_blank" rel="noopener noreferrer">
                  Book Hotel Room
                  <ExternalLink className="h-5 w-5" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
