import { cookies } from "next/headers"

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("admin-session")
    return session?.value === "authenticated"
  } catch (error) {
    console.error("Error checking authentication:", error)
    return false
  }
}

export async function requireAuth() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    throw new Error("Unauthorized")
  }
}
