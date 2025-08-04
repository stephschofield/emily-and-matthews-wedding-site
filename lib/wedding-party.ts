export interface WeddingPartyMember {
  id?: string
  name: string
  role: string
  side: "bride" | "groom"
  order_position: number
  created_at?: string
}

// Function to get wedding party members from Supabase
export async function getWeddingParty() {
  const { createServerClient } = await import("./supabase")
  const supabase = createServerClient()

  const { data, error } = await supabase.from("wedding_party").select("*").order("side").order("order_position")

  if (error) {
    console.error("Error fetching wedding party:", error)
    return []
  }

  return data as WeddingPartyMember[]
}

// Helper function to group wedding party by side
export function groupWeddingPartyBySide(weddingParty: WeddingPartyMember[]) {
  return {
    bride: weddingParty.filter((member) => member.side === "bride"),
    groom: weddingParty.filter((member) => member.side === "groom"),
  }
}
