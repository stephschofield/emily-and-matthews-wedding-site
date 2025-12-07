import { SectionTitle } from "@/components/section-title"
import { Card, CardContent } from "@/components/ui/card"
import { FloralDivider } from "@/components/floral-divider"
import { Heart, Users } from "lucide-react"
import { getWeddingParty, groupWeddingPartyBySide } from "@/lib/wedding-party"

export async function WeddingPartySection() {
  // Fetch wedding party data
  const weddingParty = await getWeddingParty()
  const { bride: brideParty, groom: groomParty } = groupWeddingPartyBySide(weddingParty)

  return (
    <section className="py-20 bg-gradient-to-b from-cream to-white relative">
      <div className="container mx-auto px-4">
        <SectionTitle id="wedding-party">Our Wedding Party</SectionTitle>

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

            <div className="grid gap-6">
              {brideParty.map((member) => (
                <Card
                  key={member.name}
                  className="border-sage/20 hover:border-sage/40 transition-colors duration-300 bg-white/50 backdrop-blur-sm"
                >
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-cormorant text-navy font-medium">{member.name}</h3>
                      <p className="text-sage uppercase tracking-widest text-xs mt-1">{member.role}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-sage/30" />
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

            <div className="grid gap-6">
              {groomParty.map((member) => (
                <Card
                  key={member.name}
                  className="border-navy/10 hover:border-navy/30 transition-colors duration-300 bg-white/50 backdrop-blur-sm"
                >
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-cormorant text-navy font-medium">{member.name}</h3>
                      <p className="text-slate-500 uppercase tracking-widest text-xs mt-1">{member.role}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-navy/20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
