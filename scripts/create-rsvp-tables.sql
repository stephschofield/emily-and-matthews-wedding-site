-- Create RSVPs table
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  attending BOOLEAN NOT NULL DEFAULT false,
  party_size INTEGER DEFAULT 1,
  events TEXT[] DEFAULT '{}', -- Array of events they're attending
  dietary_restrictions TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create party members table (for guests bringing additional people)
CREATE TABLE IF NOT EXISTS party_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rsvp_id UUID REFERENCES rsvps(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dietary_restrictions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create song requests table
CREATE TABLE IF NOT EXISTS song_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT,
  email TEXT,
  song_title TEXT NOT NULL,
  artist TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rsvps_guest_name ON rsvps(guest_name);
CREATE INDEX IF NOT EXISTS idx_rsvps_attending ON rsvps(attending);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps(created_at);
CREATE INDEX IF NOT EXISTS idx_party_members_rsvp_id ON party_members(rsvp_id);
CREATE INDEX IF NOT EXISTS idx_song_requests_created_at ON song_requests(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_requests ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since this is a wedding website)
-- In production, you might want more restrictive policies
CREATE POLICY "Allow public read access on rsvps" ON rsvps FOR SELECT USING (true);
CREATE POLICY "Allow public insert on rsvps" ON rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on rsvps" ON rsvps FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on party_members" ON party_members FOR SELECT USING (true);
CREATE POLICY "Allow public insert on party_members" ON party_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on party_members" ON party_members FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on song_requests" ON song_requests FOR SELECT USING (true);
CREATE POLICY "Allow public insert on song_requests" ON song_requests FOR INSERT WITH CHECK (true);
