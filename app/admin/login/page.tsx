"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Cormorant_Garamond } from "next/font/google"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, Lock } from "lucide-react"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed")
      }

      // Store token in sessionStorage
      if (data.token) {
        sessionStorage.setItem('admin-token', data.token)
      }

      // Get redirect URL from query params or default to /admin
      const searchParams = new URLSearchParams(window.location.search)
      const redirectTo = searchParams.get("redirect") || "/admin"
      
      // Navigate to admin page
      window.location.href = redirectTo
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("min-h-screen bg-gradient-to-b from-cream to-white flex items-center justify-center p-4", cormorant.variable)}>
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-sage/10 overflow-hidden">
          <div className="bg-sage/5 p-6 text-center border-b border-sage/10">
            <Lock className="w-12 h-12 text-sage mx-auto mb-4" />
            <h1 className="text-3xl font-cormorant font-medium text-slate-800 tracking-wide">
              Admin Login
            </h1>
            <p className="text-slate-600 mt-2 font-light">
              Emily & Matthew's Wedding
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50/80 border border-red-200/50 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="border-sage/20 focus:border-sage"
                  disabled={isLoading}
                  required
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !password}
                className="w-full bg-sage hover:bg-sage/90 text-white py-3 font-cormorant text-lg font-light tracking-wide"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Authenticating...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-sm text-sage hover:text-sage/80 font-light"
              >
                ← Back to wedding website
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6 font-light">
          Authorized access only
        </p>
      </div>
    </div>
  )
}
