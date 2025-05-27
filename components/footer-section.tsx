import Image from "next/image"
import { Heart } from "lucide-react"
import { FloralDivider } from "@/components/floral-divider"
import { FloralCornerTopLeft, FloralCornerTopRight } from "@/components/floral-corner"

export function FooterSection() {
  return (
    <footer className="relative py-12 text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/images/couple-foreheads.jpeg" alt="Emily and Matthew" fill className="object-cover" />
        <div className="absolute inset-0 bg-navy/80" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="relative inline-block">
          <FloralCornerTopLeft className="absolute -top-8 -left-8 text-gold/70 w-16 h-16" />
          <FloralCornerTopRight className="absolute -top-8 -right-8 text-gold/70 w-16 h-16" />
          <h2 className="text-3xl md:text-4xl font-cormorant mb-6 font-light tracking-wide">
            Emily <span className="text-gold">&</span> Matthew
          </h2>
        </div>

        <FloralDivider className="text-gold/70 h-8 w-auto mx-auto my-6" />

        <p className="text-lg mb-8 font-cormorant">May 9, 2026 • Baton Rouge, Louisiana</p>

        <div className="flex justify-center items-center text-sm text-white/70">
          <span>Made with</span>
          <Heart className="w-4 h-4 mx-1 text-gold" />
          <span>for Emily and Matthew</span>
        </div>
      </div>
    </footer>
  )
}
