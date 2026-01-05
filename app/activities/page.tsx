"use client"

import Image from "next/image"
import { Cormorant_Garamond } from "next/font/google"
import { cn } from "@/lib/utils"
import { NavBar } from "@/components/nav-bar"
import { FooterSection } from "@/components/footer-section"
import { SectionTitle } from "@/components/section-title"
import { MapPin, ExternalLink, Utensils, Landmark } from "lucide-react"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})

interface Activity {
  title: string
  description: string
  url: string
  icon: "landmark" | "utensils"
  image?: string
}

const activities: Activity[] = [
  {
    title: "LSU Lakes & Mike the Tiger's Habitat",
    description: "Take a stroll around the LSU Lakes and visit Mike the Tiger's Oasis on the way out!",
    url: "https://www.mikethetiger.com/mikes-habitat",
    icon: "landmark",
    image: "/images/tigerhabatat628.png",
  },
  {
    title: "LSU Rural Life Museum",
    description: "Learn about Louisiana history at the LSU Rural Life Museum.",
    url: "https://www.lsu.edu/rurallife/",
    icon: "landmark",
    image: "/images/LSUrurallifemuseum.jpg",
  },
]

const restaurants: Activity[] = [
  {
    title: "The Chimes Restaurant on Highland",
    description: "Visit the Chimes Restaurant on Highland: enjoy classic cajun food and drinks on the rooftop.",
    url: "https://thechimes.com",
    icon: "utensils",
    image: "/images/chimesrestaurant.jpg",
  },
  {
    title: "Tsunami Sushi",
    description: "Enjoy Sushi and a view of the Mississippi River at Tsunami Sushi!",
    url: "https://batonrouge.servingsushi.com",
    icon: "utensils",
  },
  {
    title: "Superior Grill on Highland",
    description: "Enjoy Mexican & Margs at Superior on Highland.",
    url: "https://highland.superiorgrill.com",
    icon: "utensils",
  },
]

export default function ActivitiesPage() {
  return (
    <main className={cn("min-h-screen bg-gradient-to-b from-cream to-white text-slate-900", cormorant.variable)}>
      <NavBar />
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-16">
            <SectionTitle>Things to Do in Baton Rouge</SectionTitle>
            <p className="text-xl text-slate-600 mt-6 font-light max-w-2xl mx-auto leading-relaxed">
              Explore the best of Baton Rouge while you're in town for our special day!
            </p>
          </div>

          {/* Activities Section */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="flex items-center justify-center mb-8">
              <Landmark className="w-8 h-8 text-sage mr-3" />
              <h2 className="text-4xl font-cormorant font-medium text-slate-800">Activities</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-1">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-sage/10 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {activity.image && (
                    <div className="relative w-full h-64 md:h-80">
                      <Image
                        src={activity.image}
                        alt={activity.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center">
                        {activity.icon === "landmark" ? (
                          <Landmark className="w-6 h-6 text-sage" />
                        ) : (
                          <Utensils className="w-6 h-6 text-sage" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-cormorant font-semibold text-slate-800 mb-3">
                          {activity.title}
                        </h3>
                        <p className="text-lg text-slate-600 mb-4 leading-relaxed font-light">
                          {activity.description}
                        </p>
                        <a
                          href={activity.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sage hover:text-sage/80 transition-colors font-medium"
                        >
                          <MapPin className="w-4 h-4" />
                          <span>Learn More</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Restaurants Section - Placeholder for future additions */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <Utensils className="w-8 h-8 text-sage mr-3" />
              <h2 className="text-4xl font-cormorant font-medium text-slate-800">Restaurants</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-1">
              {restaurants.map((restaurant, index) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-sage/10 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {restaurant.image && (
                    <div className="relative w-full h-64 md:h-80">
                      <Image
                        src={restaurant.image}
                        alt={restaurant.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center">
                        <Utensils className="w-6 h-6 text-sage" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-cormorant font-semibold text-slate-800 mb-3">
                          {restaurant.title}
                        </h3>
                        <p className="text-lg text-slate-600 mb-4 leading-relaxed font-light">
                          {restaurant.description}
                        </p>
                        <a
                          href={restaurant.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sage hover:text-sage/80 transition-colors font-medium"
                        >
                          <MapPin className="w-4 h-4" />
                          <span>Visit Website</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </main>
  )
}
