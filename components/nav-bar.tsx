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

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Our Story", href: "/#couple" },
    { name: "Venue", href: "/#venue" },
    { name: "Schedule", href: "/#schedule" },
    { name: "FAQ", href: "/#faq" },
    { name: "Gallery", href: "/#gallery" },
    { name: "Registry", href: "/#registry" },
    { name: "Playlist", href: "/#playlist" },
    { name: "Wedding Party", href: "/wedding-party" },
    { name: "RSVP", href: "/rsvp" },
  ]

  return (
    <>
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-navy hover:bg-navy/10 z-50 relative"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </Button>
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

      {/* Mobile Menu Overlay - Separate from nav for better control */}
      {isMobile && isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{
            backgroundColor: "#F9F6F0",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            width: "100vw",
            height: "100vh",
            position: "fixed",
          }}
        >
          {/* Content container with proper spacing from top */}
          <div className="flex flex-col items-center justify-start pt-24 h-full">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-2xl py-4 text-navy hover:text-sage transition-colors font-medium font-cormorant"
                onClick={() => setIsMenuOpen(false)}
                style={{ color: "#1A3A5F" }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
