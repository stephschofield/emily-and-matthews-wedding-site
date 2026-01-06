import Image from "next/image"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/images/proposal.jpeg" alt="Our Proposal" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-navy/40 backdrop-blur-[1px]" />
      </div>

      <div className="container mx-auto px-4 z-10 text-center text-white">
        <div className="max-w-4xl mx-auto relative p-8 md:p-12">
          {/* Content */}
          <p className="text-xl md:text-2xl mb-4 font-cormorant italic">Together with our families</p>

          <h1 className="font-cormorant text-5xl md:text-7xl font-light tracking-wide mb-4">
            Emily <span className="text-gold">&</span> Matthew
          </h1>

          <div className="w-24 h-0.5 bg-gold mx-auto my-6" />

          <p className="text-xl md:text-2xl mb-4 font-cormorant">Request the honor of your presence</p>

          <h2 className="text-3xl md:text-4xl font-cormorant mb-8 font-light tracking-wide">May 9, 2026</h2>

          <p className="text-xl md:text-2xl mb-8 font-cormorant">
            Old Louisiana State Capitol • Baton Rouge, Louisiana
          </p>

          <Button
            asChild
            size="lg"
            className="bg-sage hover:bg-sage/90 text-white border border-white/20 rounded-none px-8 py-6 text-lg"
          >
            <a href="/rsvp">RSVP</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
