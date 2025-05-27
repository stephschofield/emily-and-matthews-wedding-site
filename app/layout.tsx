import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Emily & Matthew - May 9, 2026",
  description: "Join us for our wedding celebration at the Old Louisiana State Capitol in Baton Rouge, Louisiana",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Emily & Matthew - May 9, 2026",
    description: "Join us for our wedding celebration at the Old Louisiana State Capitol in Baton Rouge, Louisiana",
    images: ["/apple-touch-icon.png"],
  },
  twitter: {
    card: "summary",
    title: "Emily & Matthew - May 9, 2026",
    description: "Join us for our wedding celebration at the Old Louisiana State Capitol in Baton Rouge, Louisiana",
    images: ["/apple-touch-icon.png"],
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
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
