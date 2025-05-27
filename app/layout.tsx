import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

// Add cache busting with timestamp
const cacheVersion = Date.now()

export const metadata: Metadata = {
  title: "Emily & Matthew - May 9, 2026",
  description: "Join us for our wedding celebration at the Old Louisiana State Capitol in Baton Rouge, Louisiana",
  icons: {
    icon: [
      { url: `/favicon.ico?v=${cacheVersion}`, sizes: "any" },
      { url: `/favicon-16x16.png?v=${cacheVersion}`, sizes: "16x16", type: "image/png" },
      { url: `/favicon-32x32.png?v=${cacheVersion}`, sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: `/apple-touch-icon.png?v=${cacheVersion}`, sizes: "180x180", type: "image/png" }],
    shortcut: `/favicon.ico?v=${cacheVersion}`,
  },
  openGraph: {
    title: "Emily & Matthew - May 9, 2026",
    description: "Join us for our wedding celebration at the Old Louisiana State Capitol in Baton Rouge, Louisiana",
    images: [
      {
        url: `/og-image.png?v=${cacheVersion}`,
        width: 1200,
        height: 630,
        alt: "Emily & Matthew Wedding - May 9, 2026",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emily & Matthew - May 9, 2026",
    description: "Join us for our wedding celebration at the Old Louisiana State Capitol in Baton Rouge, Louisiana",
    images: [`/og-image.png?v=${cacheVersion}`],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={`/favicon.ico?v=${cacheVersion}`} sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href={`/favicon-32x32.png?v=${cacheVersion}`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`/favicon-16x16.png?v=${cacheVersion}`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`/apple-touch-icon.png?v=${cacheVersion}`} />
        <link rel="manifest" href={`/site.webmanifest?v=${cacheVersion}`} />
        <meta property="og:image" content={`/og-image.png?v=${cacheVersion}`} />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
