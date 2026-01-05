"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication by sending token to check-auth endpoint
    const token = sessionStorage.getItem('admin-token')
    
    if (!token) {
      router.push("/admin/login?redirect=/admin")
      return
    }

    fetch("/api/admin/check-auth", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token })
    })
      .then(res => {
        if (!res.ok) {
          sessionStorage.removeItem('admin-token')
          router.push("/admin/login?redirect=/admin")
        } else {
          setIsLoading(false)
        }
      })
      .catch(() => {
        sessionStorage.removeItem('admin-token')
        router.push("/admin/login?redirect=/admin")
      })
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-sage/10 p-8">
          <h1 className="text-4xl font-cormorant font-medium text-slate-800 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 mb-8">
            Welcome to the wedding management dashboard
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="/admin/rsvps"
              className="p-6 bg-sage/5 border border-sage/20 rounded-lg hover:bg-sage/10 transition-colors"
            >
              <h2 className="text-2xl font-cormorant font-medium text-slate-800 mb-2">
                RSVP Management
              </h2>
              <p className="text-slate-600">
                View and manage guest RSVPs
              </p>
            </a>

            <a
              href="/admin/songs"
              className="p-6 bg-sage/5 border border-sage/20 rounded-lg hover:bg-sage/10 transition-colors"
            >
              <h2 className="text-2xl font-cormorant font-medium text-slate-800 mb-2">
                Song Requests
              </h2>
              <p className="text-slate-600">
                View guest song requests
              </p>
            </a>
          </div>

          <div className="mt-8">
            <button
              onClick={async () => {
                // Remove token from sessionStorage
                sessionStorage.removeItem('admin-token')
                
                // Call logout endpoint (optional cleanup)
                await fetch("/api/admin/auth", { 
                  method: "DELETE"
                })
                
                router.push("/admin/login")
              }}
              className="text-sm text-sage hover:text-sage/80 underline"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
