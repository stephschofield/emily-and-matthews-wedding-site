import { SectionTitle } from "@/components/section-title"
import { Card, CardContent } from "@/components/ui/card"
import { FloralDivider } from "@/components/floral-divider"
import { Shirt, Users } from "lucide-react"

export function ScheduleSection() {
  const events = [
    {
      time: "6:00 PM",
      title: "Ceremony",
      description: "Join us as we exchange vows in the historic Senate Chamber. The ceremony starts at 6:15 PM.",
    },
    {
      time: "7:15 PM",
      title: "Cocktail Hour",
      description: "Enjoy cocktails and hors d'oeuvres on the West Lawn",
    },
    {
      time: "8:30 PM",
      title: "Dinner & Reception",
      description: "Celebrate with dinner, dancing, and festivities in the Rotunda",
      dressCode: true,
    },
    {
      time: "11:30 PM",
      title: "After Party",
      description: "Continue the celebration and dance the night away!",
    },
  ]

  return (
    <section id="schedule" className="py-20 bg-cream relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <SectionTitle>Wedding Day Schedule</SectionTitle>

        {/* Important Information Cards */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-sage/20 overflow-hidden shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Shirt className="w-8 h-8 text-sage mr-3" />
                  <h3 className="text-xl font-cormorant text-navy font-medium">Dress Code</h3>
                </div>
                <p className="text-lg text-slate-700 mb-2">Cocktail Attire</p>
                <p className="text-sm text-slate-600">Dressy but not formal - no ties required for gentlemen!</p>
              </CardContent>
            </Card>

            <Card className="border-sage/20 overflow-hidden shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-sage mr-3" />
                  <h3 className="text-xl font-cormorant text-navy font-medium">Guest Ages</h3>
                </div>
                <p className="text-lg text-slate-700 mb-2">Ages 15+ Only</p>
                <p className="text-sm text-slate-600">
                  While we love your little ones, this celebration is for ages 15 and up
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-12 relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-sage/30 -translate-x-1/2 z-0" />

          {events.map((event, index) => (
            <div key={index} className="relative z-10 mb-12 last:mb-0">
              {/* Event title with background to hide the line */}
              <div className="text-center mb-4 relative">
                <h3 className="text-2xl md:text-3xl font-cormorant text-navy font-light bg-cream px-6 py-2 relative z-10 inline-block">
                  {event.title}
                </h3>
              </div>

              {/* Centered timeline with time, dot, and description box */}
              <div className="flex items-center justify-center">
                <div className="text-right pr-3">
                  <span className="text-lg md:text-xl text-navy font-medium">{event.time}</span>
                </div>

                <div className="bg-sage w-4 h-4 rounded-full border-4 border-cream flex-shrink-0 mx-3" />

                <div className="pl-3">
                  <Card className="border-sage/20 overflow-hidden w-80">
                    <CardContent className="p-4">
                      <p className="text-slate-700">{event.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <FloralDivider className="text-sage/70 h-8 w-auto mx-auto" />
        </div>
      </div>
    </section>
  )
}
