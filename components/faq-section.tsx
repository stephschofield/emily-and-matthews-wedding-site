import { SectionTitle } from "@/components/section-title"
import { Card, CardContent } from "@/components/ui/card"
import { Shirt, Car, Users, MapPin } from "lucide-react"

export function FAQSection() {
  const faqs = [
    {
      icon: <Shirt className="w-6 h-6 text-sage" />,
      question: "What should I wear?",
      answer: "The dress code is cocktail attire. Think dressy but not formal - no ties required for gentlemen!",
    },
    {
      icon: <Car className="w-6 h-6 text-sage" />,
      question: "Where should I park?",
      answer:
        "Parking at the Old State Capitol is limited and restricted to vendors and the wedding party. We advise carpooling and parking in paid lots near the venue or using rideshare apps. If your hotel is located downtown, ask the receptionist if shuttle rides are available.",
    },
    {
      icon: <Users className="w-6 h-6 text-sage" />,
      question: "Are children invited?",
      answer: "While we love your little ones, we have decided to only host guests ages 15+. Thanks for understanding!",
    },
    {
      icon: <MapPin className="w-6 h-6 text-sage" />,
      question: "What time should I arrive?",
      answer:
        "Please plan to arrive by 3:45 PM for the 4:00 PM ceremony. This will give you time to find parking and get seated before we begin.",
    },
  ]

  return (
    <section id="faq" className="py-20 bg-cream relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <SectionTitle>Frequently Asked Questions</SectionTitle>

        <div className="max-w-4xl mx-auto mt-12">
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-sage/20 overflow-hidden shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-sage/10 rounded-full flex items-center justify-center">
                      {faq.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-cormorant text-navy mb-3 font-medium">{faq.question}</h3>
                      <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto border-sage/20 overflow-hidden shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-cormorant text-navy mb-4 font-light">Have More Questions?</h3>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                We're here to help! If you have any other questions about our special day, please don't hesitate to
                reach out.
              </p>
              <p className="text-slate-600">
                Contact us at{" "}
                <a href="mailto:eebueche@gmail.com" className="text-sage hover:text-sage/80 font-medium">
                  eebueche@gmail.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
