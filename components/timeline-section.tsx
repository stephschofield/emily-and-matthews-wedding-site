import Image from "next/image"
import { SectionTitle } from "@/components/section-title"
import { FloralDivider } from "@/components/floral-divider"
import { Card, CardContent } from "@/components/ui/card"

interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  image: string
  imageAlt: string
  side: "left" | "right"
}

// Timeline events with updated graduation story
const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    date: "November 19, 2021",
    title: "First Meeting",
    description:
      "Emily and Matthew met in the fall of his first, and her last, year of grad school at LSU. This is one of their first date events together!",
    image: "/images/timeline-first-date.jpeg",
    imageAlt: "Emily and Matthew at their first date event at LSU",
    side: "left",
  },
  {
    id: "2",
    date: "May 2022",
    title: "Emily's Graduation",
    description: "Emily graduates from the LSU MBA program! Matthew and Doobie hopped into some of the grad pics!",
    image: "/images/timeline-graduation.jpeg",
    imageAlt: "Emily's graduation from LSU MBA program with Matthew and Doobie",
    side: "right",
  },
  {
    id: "3",
    date: "July 2022",
    title: "Long Distance Begins",
    description:
      "Emily leaves Baton Rouge and moves to Dallas, TX, now beginning their long-distance relationship. This was Matthew's first visit after the move!",
    image: "/images/timeline-dallas-visit.jpeg",
    imageAlt: "Emily and Matthew in front of the Dallas sign during Matthew's first visit",
    side: "left",
  },
  {
    id: "4",
    date: "October 2022",
    title: "Geaux Tigers!",
    description:
      "Lots of commuting for Emily and Matthew while dating long distance, but any excuse to watch the Tigers play is well worth the drive!",
    image: "/images/timeline-lsu-game.jpeg",
    imageAlt: "Emily and Matthew at LSU Tiger Stadium during football season",
    side: "right",
  },
  {
    id: "5",
    date: "April 2023",
    title: "Wedding Season Begins",
    description: "The first of many weddings together!",
    image: "/images/timeline-wedding-season.jpeg",
    imageAlt: "Emily and Matthew dressed up for a wedding celebration",
    side: "left",
  },
  {
    id: "6",
    date: "August 2023",
    title: "First Couple's Trip",
    description:
      "The first couple's trip! Emily and Matthew visited his family in Jacksonville, Florida and made a pitstop at Disney World!",
    image: "/images/timeline-disney-trip.jpeg",
    imageAlt: "Emily and Matthew at Disney World in front of Cinderella Castle",
    side: "right",
  },
  {
    id: "7",
    date: "January 2024",
    title: "Matthew Moves to Dallas",
    description:
      "Matthew moves to Dallas! Him and Emily were too busy unpacking to take pictures, but thankfully captured a picture of Doobie sunbathing on his new balcony!",
    image: "/images/timeline-matthew-moves.jpeg",
    imageAlt: "Doobie sunbathing on the balcony of Matthew's new Dallas apartment",
    side: "left",
  },
  {
    id: "8",
    date: "June 2024",
    title: "First House Together",
    description:
      "Emily and Matthew started renting their first house together! This was their first meal - pre-coffee or dining table.",
    image: "/images/timeline-first-house.jpeg",
    imageAlt:
      "Matthew enjoying their first meal in their new house with Doobie, using a side table as their dining surface",
    side: "right",
  },
  {
    id: "9",
    date: "October 2024",
    title: "Football Season Away From Home",
    description:
      "Emily and Matthew's first football season away from home together. Emily showed Matthew all of the go-to watch spots, like Texas Live!, Dodies, and Truckyard!",
    image: "/images/timeline-football-season.jpeg",
    imageAlt: "Emily and Matthew enjoying football season at a Dallas entertainment venue",
    side: "left",
  },
  {
    id: "10",
    date: "February 1, 2025",
    title: "The Proposal",
    description: "Matthew pops the question!",
    image: "/images/timeline-proposal.jpeg",
    imageAlt:
      "Matthew proposing to Emily at the Sarah and Bob Bigham Scenic Overlook with Dallas skyline in background",
    side: "right",
  },
  {
    id: "11",
    date: "May 9, 2026",
    title: "Our Wedding Day",
    description:
      "The beginning of our next chapter as husband and wife, celebrating with all our loved ones at the beautiful Old Louisiana State Capitol.",
    image: "/images/timeline-wedding.jpg",
    imageAlt: "Emily and Matthew's wedding day",
    side: "left",
  },
]

export function TimelineSection() {
  return (
    <section id="couple" className="py-20 bg-cream relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <SectionTitle>Our Love Story</SectionTitle>

        {/* Timeline Container */}
        <div className="max-w-6xl mx-auto mt-16 relative">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-sage/30 via-sage/60 to-sage/30 -translate-x-1/2 hidden lg:block" />

          {/* Timeline Events */}
          <div className="space-y-16 lg:space-y-24">
            {timelineEvents.map((event, index) => (
              <div key={event.id} className="relative">
                {/* Timeline Dot */}
                <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-sage rounded-full border-4 border-cream shadow-lg z-10 hidden lg:block" />

                {/* Event Content */}
                <div className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center`}>
                  {/* Image */}
                  <div
                    className={`relative ${event.side === "right" ? "lg:order-2" : "lg:order-1"} flex justify-center`}
                  >
                    <div className="relative w-full max-w-lg">
                      <div className="relative rounded-lg overflow-hidden shadow-xl">
                        <Image
                          src={event.image || "/placeholder.svg?height=400&width=600"}
                          alt={event.imageAlt}
                          width={600}
                          height={400}
                          className="w-full h-auto object-contain"
                        />
                      </div>

                      {/* Decorative corner elements */}
                      <div className="absolute -top-3 -left-3 w-6 h-6 border-l-2 border-t-2 border-sage/40" />
                      <div className="absolute -top-3 -right-3 w-6 h-6 border-r-2 border-t-2 border-sage/40" />
                      <div className="absolute -bottom-3 -left-3 w-6 h-6 border-l-2 border-b-2 border-sage/40" />
                      <div className="absolute -bottom-3 -right-3 w-6 h-6 border-r-2 border-b-2 border-sage/40" />
                    </div>
                  </div>

                  {/* Content - Always centered text */}
                  <div
                    className={`${event.side === "right" ? "lg:order-1 lg:pr-16" : "lg:order-2 lg:pl-16"} text-center`}
                  >
                    <Card className="border-sage/20 overflow-hidden shadow-lg bg-white/90 backdrop-blur-sm">
                      <CardContent className="p-8">
                        {/* Date Badge */}
                        <div className="inline-flex items-center px-4 py-2 bg-sage/10 rounded-full mb-6">
                          <span className="text-sage font-cormorant font-medium text-lg">{event.date}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-3xl font-cormorant text-navy mb-4 font-light tracking-wide">
                          {event.title}
                        </h3>

                        {/* Decorative divider */}
                        <div className="flex justify-center mb-6">
                          <div className="w-16 h-px bg-sage/40" />
                        </div>

                        {/* Description */}
                        <p className="text-lg text-slate-700 leading-relaxed font-light">{event.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Flourish */}
        <div className="mt-20 text-center">
          <FloralDivider className="text-sage/70 h-8 w-auto mx-auto mb-8" />
          <p className="text-2xl font-cormorant text-navy font-light italic">
            "Every love story is beautiful, but ours is our favorite."
          </p>
        </div>
      </div>
    </section>
  )
}
