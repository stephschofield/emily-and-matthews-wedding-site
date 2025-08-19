import { Cormorant_Garamond } from "next/font/google"
import { cn } from "@/lib/utils"
import { NavBar } from "@/components/nav-bar"
import { FooterSection } from "@/components/footer-section"
import { SectionTitle } from "@/components/section-title"
import { Card, CardContent } from "@/components/ui/card"
import { FloralDivider } from "@/components/floral-divider"
import { Heart, Users } from "lucide-react"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})

interface WeddingPartyMember {
  name: string
  role: string
  side: "bride" | "groom"
}

const weddingParty: WeddingPartyMember[] = [
  // Bride's side
  { name: "Caroline Woolf", role: "Maid of Honor", side: "bride" },
  { name: "Chloe Hendrix", role: "Maid of Honor", side: "bride" },
  { name: "Taylor Lachney", role: "Bridesmaid", side: "bride" },
  { name: "Helen Dyer", role: "Bridesmaid", side: "bride" },
  { name: "Kathryn McKowen", role: "Bridesmaid", side: "bride" },
  { name: "Kaily Belleau", role: "Bridesmaid", side: "bride" },
  { name: "Rileigh Fontenot", role: "Bridesmaid", side: "bride" },

  // Groom's side
  { name: "Michael Adams", role: "Best Man", side: "groom" },
  { name: "Joshua Giacone", role: "Groomsman", side: "groom" },
  { name: "Rolland Wallace", role: "Groomsman", side: "groom" },
  { name: "Nicholas Jones", role: "Groomsman", side: "groom" },
  { name: "James Avault", role: "Groomsman", side: "groom" },
  { name: "Taron Jones", role: "Groomsman", side: "groom" },
  { name: "Jacob Sicard", role: "Groomsman", side: "groom" },
]

const brideParty = weddingParty.filter((member) => member.side === "bride")
const groomParty = weddingParty.filter((member) => member.side === "groom")

export default function WeddingPartyPage() {
  return (
    <main className={cn("min-h-screen bg-gradient-to-b from-cream to-white text-slate-900", cormorant.variable)}>
      <NavBar />
      <div className="pt-20 pb-20">
        <div className="container mx-auto px-4">
          <SectionTitle>Our Wedding Party</SectionTitle>

          {/* Introduction */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-sage mr-3" />
              <Users className="w-8 h-8 text-sage ml-3" />
            </div>
            <p className="text-xl text-slate-700 leading-relaxed font-light">
              We are so grateful to have these amazing people standing by our side on our special day. Each one holds a
              special place in our hearts and has been part of our journey in their own unique way.
            </p>
          </div>

          <FloralDivider className="text-sage/70 h-8 w-auto mx-auto mb-16" />

          {/* Wedding Party Grid */}
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Bride's Side */}
            <div>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-cormorant text-navy mb-4 font-light tracking-wide">
                  Emily's Wedding Party
                </h2>
                <div className="w-16 h-px bg-sage/40 mx-auto" />
              </div>

              <div className="space-y-6">
                {brideParty.map((member, index) => (
                  <Card key={index} className="border-sage/20 overflow-hidden shadow-lg bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-2xl font-cormorant text-navy mb-2 font-medium tracking-wide">
                          {member.name}
                        </h3>
                        <p className="text-lg text-sage font-light italic">{member.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Groom's Side */}
            <div>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-cormorant text-navy mb-4 font-light tracking-wide">
                  Matthew's Wedding Party
                </h2>
                <div className="w-16 h-px bg-sage/40 mx-auto" />
              </div>

              <div className="space-y-6">
                {groomParty.map((member, index) => (
                  <Card key={index} className="border-sage/20 overflow-hidden shadow-lg bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-2xl font-cormorant text-navy mb-2 font-medium tracking-wide">
                          {member.name}
                        </h3>
                        <p className="text-lg text-sage font-light italic">{member.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Closing Message */}
          <div className="mt-20 text-center">
            <FloralDivider className="text-sage/70 h-8 w-auto mx-auto mb-8" />
            <div className="max-w-2xl mx-auto">
              <p className="text-xl font-cormorant text-navy font-light italic mb-6">
                "Friendship is the only cement that will ever hold the world together."
              </p>
              <p className="text-lg text-slate-600 font-light">
                Thank you to our wedding party for being the best friends we could ask for. We can't wait to celebrate
                with you on May 9, 2026!
              </p>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </main>
  )
}
