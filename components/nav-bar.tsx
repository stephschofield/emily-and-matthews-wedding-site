"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Our Story", href: "/#couple" },
    { name: "Venue", href: "/#venue" },
    { name: "Schedule", href: "/#schedule" },
    { name: "Gallery", href: "/#gallery" },
    { name: "Registry", href: "/#registry" },
    { name: "RSVP", href: "/rsvp" },
  ]

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-cormorant border-b border-slate-200/50",
        isScrolled ? "bg-cream/95 backdrop-blur-sm shadow-sm py-3" : "bg-cream/90 backdrop-blur-sm py-4",
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-3xl font-semibold text-navy">
          E<span className="text-sage">&</span>M
        </Link>

        {isMobile ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-navy hover:bg-navy/10"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </Button>

            {isMenuOpen && (
              <div className="fixed inset-0 top-16 bg-cream/95 backdrop-blur-sm z-40 flex flex-col items-center pt-10 border-t border-slate-200/50">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-2xl py-4 text-navy hover:text-sage transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xl text-navy hover:text-sage transition-colors font-medium tracking-wide"
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
