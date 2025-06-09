import Image from "next/image"
import { SectionTitle } from "@/components/section-title"
import { FloralDivider } from "@/components/floral-divider"

export function CoupleSection() {
  return (
    <section id="couple" className="py-20 bg-cream relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <SectionTitle>Our Story</SectionTitle>

        {/* Centered photo and text side by side */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative rounded-lg overflow-hidden shadow-xl max-w-md">
                <Image
                  src="/images/couple-story.jpeg"
                  alt="Emily and Matthew together"
                  width={400}
                  height={300}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Text content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="max-w-lg mx-auto lg:mx-0">
                <h3 className="text-3xl font-cormorant text-navy mb-4 font-light">Emily Bueche</h3>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Emily grew up in Louisiana, where she developed a love for the rich culture and traditions of her home
                  state. She enjoys cooking traditional Cajun dishes, exploring the outdoors, and spending time with
                  family and friends.
                </p>
              </div>

              <FloralDivider className="text-sage/50 h-6 w-auto mx-auto lg:mx-0" />

              <div className="max-w-lg mx-auto lg:mx-0">
                <h3 className="text-3xl font-cormorant text-navy mb-4 font-light">Matthew Adams</h3>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Matthew is a Louisiana native with a passion for history and architecture. When not working, he can be
                  found exploring historical sites, trying new restaurants, and cheering for the LSU Tigers.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 max-w-2xl mx-auto text-center">
          <FloralDivider className="text-sage/70 h-8 w-auto mx-auto mb-8" />

          <h3 className="text-3xl font-cormorant text-navy mb-6 font-light">How We Met</h3>

          <p className="text-lg text-slate-700 mb-6 leading-relaxed">
            Emily and Matthew's paths crossed at a mutual friend's crawfish boil in the spring of 2020. They bonded over
            their shared love for Louisiana culture, history, and food. After several months of friendship, they began
            dating and have been inseparable ever since.
          </p>
          <p className="text-lg text-slate-700 mb-8 leading-relaxed">
            Matthew proposed during a romantic stroll through the Dallas Arboretum and Botanical Garden, surrounded by
            beautiful blooms and serene landscapes – a perfect setting that reflects their love for nature and beauty.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
              <Image src="/images/couple-kiss.jpeg" alt="Emily and Matthew kissing" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent"></div>
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
              <Image src="/images/couple-bench.jpeg" alt="Emily and Matthew on bench" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent"></div>
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/couple-standing.jpeg"
                alt="Emily and Matthew standing together"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
