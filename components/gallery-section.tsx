"use client"

import { useState } from "react"
import Image from "next/image"
import { SectionTitle } from "@/components/section-title"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloralCornerTopLeft, FloralCornerTopRight } from "@/components/floral-corner"

export function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const photos = [
    {
      src: "/images/proposal.jpeg",
      alt: "Matthew proposing to Emily at the scenic overlook",
      caption: "The moment Matthew proposed at the Sarah and Bob Bigham Scenic Overlook",
    },
    {
      src: "/images/couple-bench.jpeg",
      alt: "Emily and Matthew sitting on a bench",
      caption: "A quiet moment together in the garden",
    },
    {
      src: "/images/couple-kiss.jpeg",
      alt: "Emily and Matthew sharing a kiss",
      caption: "Celebrating our engagement",
    },
    {
      src: "/images/couple-standing.jpeg",
      alt: "Emily and Matthew standing together",
      caption: "Together in the garden",
    },
    {
      src: "/images/couple-foreheads.jpeg",
      alt: "Emily and Matthew with foreheads touching",
      caption: "A moment of connection",
    },
  ]

  const openLightbox = (index: number) => {
    setSelectedImage(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const goToPrevious = () => {
    setSelectedImage((prev) => (prev === null ? null : prev === 0 ? photos.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedImage((prev) => (prev === null ? null : prev === photos.length - 1 ? 0 : prev + 1))
  }

  return (
    <section id="gallery" className="py-20 bg-sky-blue/5 relative">
      <div className="container mx-auto px-4">
        <SectionTitle>Our Gallery</SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src={photo.src || "/placeholder.svg"}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <FloralCornerTopLeft className="absolute top-2 left-2 text-white/70 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
                <FloralCornerTopRight className="absolute top-2 right-2 text-white/70 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
                <p className="text-white font-cormorant text-lg">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={selectedImage !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-5xl p-0 bg-transparent border-none">
          <div className="relative bg-black/95 rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-black/20"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="relative h-[80vh] w-full">
              {selectedImage !== null && (
                <Image
                  src={photos[selectedImage].src || "/placeholder.svg"}
                  alt={photos[selectedImage].alt}
                  fill
                  className="object-contain"
                />
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 text-white">
              {selectedImage !== null && (
                <p className="text-center font-cormorant text-xl">{photos[selectedImage].caption}</p>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-black/20"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-black/20"
              onClick={goToNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
