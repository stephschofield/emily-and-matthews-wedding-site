import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default function proxy(request: NextRequest) {
  // Allow all admin routes through - auth will be checked in server components
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
