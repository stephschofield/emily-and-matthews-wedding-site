import { SectionTitle } from "@/components/section-title"
import { Card, CardContent } from "@/components/ui/card"
import { FloralDivider } from "@/components/floral-divider"

export function ScheduleSection() {
  const events = [
    {
      time: "4:00 PM",
      title: "Ceremony",
      description: "Join us as we exchange vows in the historic Senate Chamber",
    },
    {
      time: "5:00 PM",
      title: "Cocktail Hour",
      description: "Enjoy cocktails and hors d'oeuvres on the West Lawn",
    },
    {
      time: "6:30 PM",
      title: "Dinner & Reception",
      description: "Celebrate with dinner, dancing, and festivities in the Rotunda",
    },
    {
      time: "10:00 PM",
      title: "Second Line Parade",
      description: "Join our traditional New Orleans-style celebration through downtown",
    },
    {
      time: "10:30 PM",
      title: "After Party",
      description: "Continue the celebration at Tsunami Rooftop (optional)",
    },
  ]

  return (
    <section id="schedule" className="py-20 bg-cream relative overflow-hidden">
      {/* Background floral pattern */}
      <div className="absolute inset-0 bg-floral-pattern opacity-[0.03] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <SectionTitle>Wedding Day Schedule</SectionTitle>

        <div className="max-w-3xl mx-auto mt-12 relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-sage/30 -translate-x-1/2 z-0" />

          {events.map((event, index) => (
            <div key={index} className="relative z-10 mb-12 last:mb-0">
              <div className="flex items-center mb-4">
                <div className="w-24 md:w-32 text-right pr-4 md:pr-8">
                  <span className="text-lg md:text-xl text-navy font-medium">{event.time}</span>
                </div>

                <div className="bg-sage w-4 h-4 rounded-full border-4 border-cream" />

                <div className="flex-1 pl-4 md:pl-8">
                  <h3 className="text-2xl md:text-3xl font-cormorant text-navy font-light">{event.title}</h3>
                </div>
              </div>

              <div className="ml-24 md:ml-32 pl-8 md:pl-12">
                <Card className="border-sage/20 overflow-hidden">
                  <CardContent className="p-4">
                    <p className="text-slate-700">{event.description}</p>
                  </CardContent>
                </Card>
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
