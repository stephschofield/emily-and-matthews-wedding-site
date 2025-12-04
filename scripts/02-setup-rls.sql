-- ============================================================================
-- STEP 2: Enable Row Level Security (RLS) and Lock Down Access
-- ============================================================================
-- This prevents direct client access to tables and forces all data access
-- through validated RPC functions.
--
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================================

-- 1. Enable RLS on all tables
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- 2. Block direct SELECT access for anon users
-- UI will read data only via the lookup_party_by_name RPC

-- Drop existing policies if any
DROP POLICY IF EXISTS "Block direct party access" ON parties;
DROP POLICY IF EXISTS "Block direct party_members access" ON party_members;
DROP POLICY IF EXISTS "Block direct rsvps access" ON rsvps;

-- Create blocking policies for SELECT
CREATE POLICY "Block direct party access"
  ON parties FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "Block direct party_members access"
  ON party_members FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "Block direct rsvps access"
  ON rsvps FOR SELECT
  TO anon, authenticated
  USING (false);

-- 3. Block direct INSERT and UPDATE on rsvps from clients
-- All modifications must go through update_party_rsvps RPC
REVOKE INSERT, UPDATE ON rsvps FROM anon;
REVOKE INSERT, UPDATE ON rsvps FROM authenticated;

-- 4. Block direct INSERT/UPDATE/DELETE on parties and party_members
REVOKE INSERT, UPDATE, DELETE ON parties FROM anon;
REVOKE INSERT, UPDATE, DELETE ON parties FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON party_members FROM anon;
REVOKE INSERT, UPDATE, DELETE ON party_members FROM authenticated;

-- ============================================================================
-- SUCCESS! RLS enabled and direct access blocked.
-- Next step: Run 03-create-rpcs.sql to create the secure lookup/update functions
-- ============================================================================
