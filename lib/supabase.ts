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

// Types for our database tables
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
