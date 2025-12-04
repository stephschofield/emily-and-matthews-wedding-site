-- ============================================================================
-- STEP 1: Create Core Party-Based RSVP Schema
-- ============================================================================
-- This script creates the new party-based RSVP system that replaces the old
-- guest-list approach with a proper relational structure supporting households.
--
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================================

-- 1. Create parties table (household groupings)
CREATE TABLE IF NOT EXISTS parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_label TEXT NOT NULL,
  invite_code TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create party_members table (individual guests)
CREATE TABLE IF NOT EXISTS party_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id UUID NOT NULL REFERENCES parties(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  is_child BOOLEAN NOT NULL DEFAULT false,
  plus_one_slot BOOLEAN NOT NULL DEFAULT false,
  is_plus_one_placeholder BOOLEAN NOT NULL DEFAULT false,
  email TEXT,
  allow_attend BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_party_members_party_id ON party_members(party_id);
CREATE INDEX IF NOT EXISTS idx_party_members_full_name ON party_members(full_name);

-- 3. Create RSVP status enum
DO $$ BEGIN
  CREATE TYPE rsvp_status AS ENUM ('unknown', 'yes', 'no');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 4. Create rsvps table
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES party_members(id) ON DELETE CASCADE,
  status rsvp_status NOT NULL DEFAULT 'unknown',
  meal_choice TEXT,
  allergies TEXT,
  notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(member_id)
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_rsvps_member_id ON rsvps(member_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_status ON rsvps(status);

-- 5. Create trigger function to auto-initialize RSVP rows
CREATE OR REPLACE FUNCTION init_member_rsvp()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.rsvps (member_id, status)
  VALUES (NEW.id, 'unknown')
  ON CONFLICT (member_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_catalog;

-- 6. Create trigger on party_members
DROP TRIGGER IF EXISTS trg_init_member_rsvp ON party_members;
CREATE TRIGGER trg_init_member_rsvp
  AFTER INSERT ON party_members
  FOR EACH ROW
  EXECUTE FUNCTION init_member_rsvp();

-- 7. Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_catalog;

DROP TRIGGER IF EXISTS trg_parties_updated_at ON parties;
CREATE TRIGGER trg_parties_updated_at
  BEFORE UPDATE ON parties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_party_members_updated_at ON party_members;
CREATE TRIGGER trg_party_members_updated_at
  BEFORE UPDATE ON party_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_rsvps_updated_at ON rsvps;
CREATE TRIGGER trg_rsvps_updated_at
  BEFORE UPDATE ON rsvps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SUCCESS! Core schema created.
-- Next step: Run 02-setup-rls.sql to secure the tables
-- ============================================================================
