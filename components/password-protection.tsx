"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Lock, AlertCircle, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

const CORRECT_PASSWORD = "em25"
const AUTH_KEY = "wedding-site-auth"

interface PasswordProtectionProps {
  children: React.ReactNode
}

export function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already authenticated on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem(AUTH_KEY)
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.toLowerCase() === CORRECT_PASSWORD.toLowerCase()) {
      setIsAuthenticated(true)
      sessionStorage.setItem(AUTH_KEY, "true")
    } else {
      setError("Incorrect password. Please try again.")
      setPassword("")
    }
  }

  // Show loading state briefly
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage border-t-transparent" />
      </div>
    )
  }

  // Show password form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-sage/20 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-sage mr-2" />
                <Lock className="w-8 h-8 text-sage" />
              </div>
              <h1 className="text-3xl font-cormorant text-navy mb-2 font-light tracking-wide">
                Emily <span className="text-sage">&</span> Matthew
              </h1>
              <div className="w-16 h-px bg-sage/40 mx-auto mb-4"></div>
              <p className="text-lg text-slate-700 font-cormorant">May 9, 2026</p>
              <p className="text-slate-600 mt-2">Please enter the password to view our wedding website</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="password" className="text-lg font-cormorant text-slate-700 mb-2 block font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className={cn(
                    "text-lg p-4 text-center border-sage/20 focus:border-sage bg-white/80 font-cormorant",
                    error && "border-red-300 focus:border-red-500",
                  )}
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50/80 border border-red-200/50 rounded-md">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-sage hover:bg-sage/90 text-white py-3 text-lg font-cormorant font-light tracking-wide"
              >
                Enter Wedding Site
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Need help? Contact us at{" "}
                <a href="mailto:eebueche@gmail.com" className="text-sage hover:text-sage/80">
                  eebueche@gmail.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show the protected content if authenticated
  return <>{children}</>
}
