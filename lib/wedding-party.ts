export interface WeddingPartyMember {
  id?: string
  name: string
  role: string
  side: "bride" | "groom"
  order_position: number
  created_at?: string
}

// Hardcoded wedding party data
const WEDDING_PARTY_DATA: WeddingPartyMember[] = [
  // Bride's Side
  { name: 'Caroline Woolf', role: 'Maid of Honor', side: 'bride', order_position: 1 },
  { name: 'Chloe Hendrix', role: 'Maid of Honor', side: 'bride', order_position: 2 },
  { name: 'Taylor Lachney', role: 'Bridesmaid', side: 'bride', order_position: 3 },
  { name: 'Helen Dyer', role: 'Bridesmaid', side: 'bride', order_position: 4 },
  { name: 'Kathryn McKowen', role: 'Bridesmaid', side: 'bride', order_position: 5 },
  { name: 'Kaily Belleau', role: 'Bridesmaid', side: 'bride', order_position: 6 },
  { name: 'Rileigh Fontenot', role: 'Bridesmaid', side: 'bride', order_position: 7 },
  { name: 'Chelsea Wong', role: 'Bridesmaid', side: 'bride', order_position: 8 },
  
  // Groom's Side
  { name: 'Michael Adams', role: 'Best Man', side: 'groom', order_position: 1 },
  { name: 'Joshua Giacone', role: 'Groomsman', side: 'groom', order_position: 2 },
  { name: 'Rolland Wallace', role: 'Groomsman', side: 'groom', order_position: 3 },
  { name: 'Nicholas Jones', role: 'Groomsman', side: 'groom', order_position: 4 },
  { name: 'James Avault', role: 'Groomsman', side: 'groom', order_position: 5 },
  { name: 'Taron Jones', role: 'Groomsman', side: 'groom', order_position: 6 },
  { name: 'Jacob Sicard', role: 'Groomsman', side: 'groom', order_position: 7 },
]

// Function to get wedding party members (now returns static data)
export async function getWeddingParty() {
  // Return the static data sorted by side and order_position
  return WEDDING_PARTY_DATA
}

// Helper function to group wedding party by side
export function groupWeddingPartyBySide(weddingParty: WeddingPartyMember[]) {
  return {
    bride: weddingParty.filter((member) => member.side === "bride"),
    groom: weddingParty.filter((member) => member.side === "groom"),
  }
}
