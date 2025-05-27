import { Cormorant_Garamond } from "next/font/google"
import { cn } from "@/lib/utils"
import { NavBar } from "@/components/nav-bar"
import { HeroSection } from "@/components/hero-section"
import { CoupleSection } from "@/components/couple-section"
import { VenueSection } from "@/components/venue-section"
import { ScheduleSection } from "@/components/schedule-section"
import { GallerySection } from "@/components/gallery-section"
import { RsvpSection } from "@/components/rsvp-section"
import { RegistrySection } from "@/components/registry-section"
import { FooterSection } from "@/components/footer-section"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})

export default function Home() {
  return (
    <main className={cn("min-h-screen bg-cream text-slate-900", cormorant.variable)}>
      <NavBar />
      <HeroSection />
      <CoupleSection />
      <VenueSection />
      <ScheduleSection />
      <GallerySection />
      <RsvpSection />
      <RegistrySection />
      <FooterSection />
    </main>
  )
}
