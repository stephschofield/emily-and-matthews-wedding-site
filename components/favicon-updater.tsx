"use client"

import { useEffect } from "react"

export function FaviconUpdater() {
  useEffect(() => {
    // Force favicon update
    const updateFavicon = () => {
      const links = document.querySelectorAll("link[rel*='icon']")
      links.forEach((link) => {
        const href = link.getAttribute("href")
        if (href) {
          link.setAttribute("href", `${href}?v=${Date.now()}`)
        }
      })
    }

    // Update favicon after component mounts
    setTimeout(updateFavicon, 100)
  }, [])

  return null
}
