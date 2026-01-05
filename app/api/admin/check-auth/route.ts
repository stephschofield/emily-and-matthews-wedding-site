import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    // Simple token validation (in production, verify JWT or check against database)
    if (!token || typeof token !== 'string' || token.length < 10) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    return NextResponse.json({ authenticated: true })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json(
      { error: "Authentication check failed" },
      { status: 500 }
    )
  }
}
