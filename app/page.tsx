import { Cormorant_Garamond } from "next/font/google"
import { cn } from "@/lib/utils"
import { NavBar } from "@/components/nav-bar"
import { HeroSection } from "@/components/hero-section"
import { TimelineSection } from "@/components/timeline-section"
import { VenueSection } from "@/components/venue-section"
import { ScheduleSection } from "@/components/schedule-section"
import { FAQSection } from "@/components/faq-section"
import { GallerySection } from "@/components/gallery-section"
import { RegistrySection } from "@/components/registry-section"
import { RsvpSection } from "@/components/rsvp-section"
import { FooterSection } from "@/components/footer-section"
import { FaviconUpdater } from "@/components/favicon-updater"
import { PlaylistSection } from "@/components/playlist-section"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})

export default function Home() {
  return (
    <main className={cn("min-h-screen bg-cream text-slate-900", cormorant.variable)}>
      <FaviconUpdater />
      <NavBar />
      <HeroSection />
      <TimelineSection />
      <VenueSection />
      <ScheduleSection />
      <FAQSection />
      <GallerySection />
      <RegistrySection />
      <PlaylistSection />
      <RsvpSection />
      <FooterSection />
    </main>
  )
}
