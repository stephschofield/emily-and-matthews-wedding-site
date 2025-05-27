export interface GuestInvitation {
  name: string
  events: string[]
  maxPartySize: number // Maximum number of people allowed in their party
}

// Guest list with events each person is invited to
export const guestList: GuestInvitation[] = [
  {
    name: "John Smith",
    events: ["Wedding Reception"],
    maxPartySize: 2,
  },
  {
    name: "Jane Doe",
    events: ["Wedding Reception"],
    maxPartySize: 1,
  },
  {
    name: "Robert Johnson",
    events: ["Rehearsal Dinner", "Wedding Reception"],
    maxPartySize: 4,
  },
  {
    name: "Emily Davis",
    events: ["Wedding Reception"],
    maxPartySize: 2,
  },
  {
    name: "Michael Brown",
    events: ["Wedding Reception"],
    maxPartySize: 3,
  },
  {
    name: "Sarah Wilson",
    events: ["Rehearsal Dinner", "Wedding Reception"],
    maxPartySize: 2,
  },
  {
    name: "David Miller",
    events: ["Wedding Reception"],
    maxPartySize: 1,
  },
  {
    name: "Lisa Anderson",
    events: ["Wedding Reception"],
    maxPartySize: 2,
  },
  // Add more guests as needed
  {
    name: "Stephanie Schofield",
    events: ["Wedding Reception"],
    maxPartySize: 2,
  },
  {
    name: "Chelsea Wong",
    events: ["Rehearsal Dinner", "Wedding Reception"],
    maxPartySize: 3,
  },
  {
    name: "Taylor Lachney",
    events: ["Rehearsal Dinner", "Wedding Reception"],
    maxPartySize: 1,
  },
]

// All possible events
export const allEvents = ["Rehearsal Dinner", "Wedding Reception"]

// Function to find guest by name (with fuzzy matching)
export function findGuestByName(inputName: string): GuestInvitation | null {
  const normalizedInput = inputName.toLowerCase().trim()

  // First try exact match
  let guest = guestList.find((g) => g.name.toLowerCase() === normalizedInput)
  if (guest) return guest

  // Try partial matches (useful for name variations)
  guest = guestList.find((g) => {
    const guestNameParts = g.name.toLowerCase().split(" ")
    const inputParts = normalizedInput.split(" ")

    // Check if all input parts match some part of the guest name
    return inputParts.every((inputPart) =>
      guestNameParts.some((guestPart) => guestPart.includes(inputPart) || inputPart.includes(guestPart)),
    )
  })

  return guest || null
}

// Function to get events for a guest
export function getEventsForGuest(guestName: string): string[] {
  const guest = findGuestByName(guestName)
  return guest ? guest.events : []
}

// Function to get max party size for a guest
export function getMaxPartySizeForGuest(guestName: string): number {
  const guest = findGuestByName(guestName)
  return guest ? guest.maxPartySize : 1
}
