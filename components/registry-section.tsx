import Image from "next/image"
import { SectionTitle } from "@/components/section-title"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Gift, Heart } from "lucide-react"
import { FloralCornerTopLeft, FloralCornerBottomRight } from "@/components/floral-corner"

export function RegistrySection() {
  const registryUrl = "https://www.zola.com/registry/stephanieandmr2026"

  return (
    <section id="registry" className="py-20 bg-sky-blue/5 relative">
      <div className="container mx-auto px-4">
        <SectionTitle>Registry</SectionTitle>

        {/* Registry Header Link */}
        <div className="text-center mb-8">
          <Button
            asChild
            size="lg"
            className="bg-sage hover:bg-sage/90 text-white text-xl px-8 py-4 rounded-lg shadow-lg"
          >
            <a href={registryUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
              <Gift className="h-6 w-6" />
              View Our Zola Registry
              <ExternalLink className="h-5 w-5" />
            </a>
          </Button>
          <p className="mt-3 text-sm text-slate-600">Opens in a new tab</p>
        </div>

        <div className="max-w-3xl mx-auto mt-8 text-center">
          <p className="text-lg text-slate-700 mb-12 leading-relaxed">
            Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift,
            we've registered at Zola where you can find items from multiple stores in one place.
          </p>

          <Card className="border-sage/20 overflow-hidden shadow-lg relative">
            <CardContent className="p-0">
              <div className="bg-white p-8 relative">
                <FloralCornerTopLeft className="absolute top-0 left-0 text-sage/30 w-16 h-16" />
                <FloralCornerBottomRight className="absolute bottom-0 right-0 text-sage/30 w-16 h-16" />

                <div className="relative z-10">
                  <div className="relative w-full max-w-2xl mx-auto mb-6">
                    <Image
                      src="/images/zola-registry-thumbnail.png"
                      alt="Emily & Matthew's Zola Registry"
                      width={800}
                      height={400}
                      className="object-cover rounded-lg shadow-md"
                    />
                  </div>

                  <h4 className="text-2xl font-cormorant text-navy mb-4 font-light">Our Zola Registry</h4>

                  <p className="text-slate-700 mb-6 leading-relaxed">
                    We've curated a selection of items that will help us build our home together. Zola also offers group
                    gifting and cash funds for our honeymoon and future plans.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-sage/5 border-t border-sage/20">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-lg font-medium text-navy mb-2 flex items-center gap-2">
                      <Gift className="h-5 w-5 text-sage" />
                      Registry Highlights
                    </h5>
                    <ul className="text-left text-slate-700 space-y-2">
                      <li>• Home essentials for our new life together</li>
                      <li>• Kitchen appliances for cooking adventures</li>
                      <li>• Honeymoon fund contributions</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-lg font-medium text-navy mb-2 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-sage" />
                      Registry Benefits
                    </h5>
                    <ul className="text-left text-slate-700 space-y-2">
                      <li>• Free shipping and returns</li>
                      <li>• Group gifting available</li>
                      <li>• Ships directly to our home</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional registry information */}
          <div className="mt-8 p-6 bg-white rounded-lg border border-sage/20 shadow-sm">
            <h4 className="text-xl font-cormorant text-navy mb-4 font-light">Gift Options</h4>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <Gift className="h-8 w-8 text-sage mx-auto mb-2" />
                <h5 className="font-medium text-navy mb-1">Physical Gifts</h5>
                <p className="text-sm text-slate-600">Browse our curated registry on Zola</p>
              </div>
              <div className="p-4">
                <Heart className="h-8 w-8 text-sage mx-auto mb-2" />
                <h5 className="font-medium text-navy mb-1">Honeymoon Fund</h5>
                <p className="text-sm text-slate-600">Contribute to our romantic getaway</p>
              </div>
              <div className="p-4">
                <ExternalLink className="h-8 w-8 text-sage mx-auto mb-2" />
                <h5 className="font-medium text-navy mb-1">Cash Gifts</h5>
                <p className="text-sm text-slate-600">Help us start our new chapter</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
