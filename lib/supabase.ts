import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client (singleton pattern)
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

// Server-side Supabase client
export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Admin Supabase client (bypasses RLS)
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined')
  }
  return createClient(supabaseUrl, serviceRoleKey)
}

// Types for our database tables

// New party-based RSVP system types
export interface Party {
  id: string
  household_label: string
  created_at?: string
}

export interface PartyMemberRecord {
  id: string
  party_id: string
  full_name: string
  is_plus_one_placeholder: boolean
  allow_attend: boolean
  sort_order: number
  created_at?: string
}

export interface RSVPRecord {
  member_id: string
  status: 'unknown' | 'yes' | 'no'
  meal_choice?: string
  allergies?: string
  notes?: string
  updated_at?: string
}

export interface PartyLookupResult {
  party_id: string
  household_label: string
  member_id: string
  full_name: string
  is_plus_one_placeholder: boolean
  allow_attend: boolean
  sort_order: number
  status: 'unknown' | 'yes' | 'no'
  meal_choice?: string
  allergies?: string
  notes?: string
}

// Legacy types (keeping for backward compatibility with song requests)
export interface RSVP {
  id?: string
  guest_name: string
  email?: string
  phone?: string
  attending: boolean
  party_size: number
  events: string[]
  dietary_restrictions?: string
  message?: string
  created_at?: string
  updated_at?: string
}

export interface PartyMember {
  id?: string
  rsvp_id: string
  name: string
  dietary_restrictions?: string
  created_at?: string
}

export interface SongRequest {
  id?: string
  guest_name?: string
  email?: string
  song_title: string
  artist: string
  created_at?: string
}

// Helper functions for the new party-based system
export async function lookupPartyByName(name: string): Promise<PartyLookupResult[]> {
  // Use admin client to bypass RLS for lookup
  const supabase = createAdminClient()
  
  const { data, error } = await supabase.rpc('lookup_party_by_name', {
    q: name
  })
  
  if (error) {
    console.error('Error looking up party:', error)
    throw new Error('Failed to lookup party')
  }
  
  return data || []
}

export async function updatePartyRSVPs(
  partyId: string,
  rsvps: Array<{
    member_id: string
    status: 'yes' | 'no'
    meal_choice?: string
    allergies?: string
    notes?: string
  }>
): Promise<void> {
  // Use admin client to bypass RLS for updates
  const supabase = createAdminClient()
  
  const { error } = await supabase.rpc('update_party_rsvps', {
    p_party_id: partyId,
    p_items: rsvps
  })
  
  if (error) {
    console.error('Error updating party RSVPs:', error)
    throw new Error('Failed to update RSVPs')
  }
}
