import { SectionTitle } from "@/components/section-title"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Gift } from "lucide-react"

export function RegistrySection() {
  return (
    <section className="py-20 bg-sky-blue/5 relative">
      <div className="container mx-auto px-4">
        <SectionTitle id="registry">Registry</SectionTitle>

        <Card className="max-w-2xl mx-auto mt-12 border-sage/20 overflow-hidden shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <Gift className="w-8 h-8 text-sage mr-3" />
              <h3 className="text-2xl font-cormorant text-navy font-light">Our Zola Registry</h3>
            </div>

            <p className="text-lg text-slate-700 mb-8 leading-relaxed">
              Your presence at our wedding is present enough! However, for friends and family who have been asking for
              gift ideas, we've created an online registry!
            </p>

            <Button
              asChild
              className="bg-sage hover:bg-sage/90 text-white flex items-center gap-2 text-lg px-8 py-4 mx-auto"
            >
              <a href="https://www.zola.com" target="_blank" rel="noopener noreferrer">
                View Our Registry
                <ExternalLink className="h-5 w-5" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
