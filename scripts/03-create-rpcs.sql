-- ============================================================================
-- STEP 3: Create Secure RPC Functions for Party Lookup and RSVP Updates
-- ============================================================================
-- These functions provide validated access to party data and RSVP updates.
--
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================================

-- ============================================================================
-- RPC 1: lookup_party_by_name
-- ============================================================================
-- Searches for a party by any member's name and returns the full party details
-- including all members and their current RSVP status.
--
-- Usage from client:
--   const { data } = await supabase.rpc('lookup_party_by_name', { q: 'John Smith' })
-- ============================================================================

CREATE OR REPLACE FUNCTION lookup_party_by_name(q TEXT)
RETURNS TABLE(
  party_id UUID,
  household_label TEXT,
  member_id UUID,
  full_name TEXT,
  is_plus_one_placeholder BOOLEAN,
  allow_attend BOOLEAN,
  sort_order INTEGER,
  rsvp_status rsvp_status,
  meal_choice TEXT,
  allergies TEXT,
  notes TEXT
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  found_party_id UUID;
BEGIN
  -- Find the party ID by searching member names (case-insensitive, partial match)
  SELECT pm.party_id INTO found_party_id
  FROM party_members pm
  WHERE LOWER(pm.full_name) LIKE LOWER('%' || q || '%')
  LIMIT 1;

  -- If no party found, return empty
  IF found_party_id IS NULL THEN
    RETURN;
  END IF;

  -- Return all members of the found party with their RSVP data
  RETURN QUERY
  SELECT 
    p.id AS party_id,
    p.household_label,
    pm.id AS member_id,
    pm.full_name,
    pm.is_plus_one_placeholder,
    pm.allow_attend,
    pm.sort_order,
    r.status AS rsvp_status,
    r.meal_choice,
    r.allergies,
    r.notes
  FROM parties p
  INNER JOIN party_members pm ON pm.party_id = p.id
  LEFT JOIN rsvps r ON r.member_id = pm.id
  WHERE p.id = found_party_id
  ORDER BY pm.sort_order, pm.full_name;
END;
$$;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION lookup_party_by_name(TEXT) TO anon, authenticated;

-- ============================================================================
-- RPC 2: update_party_rsvps
-- ============================================================================
-- Updates RSVP data for members of a specific party with validation.
-- Ensures clients can only update members that belong to the specified party.
--
-- Usage from client:
--   const { data, error } = await supabase.rpc('update_party_rsvps', {
--     p_party_id: 'uuid-of-party',
--     p_items: [
--       {
--         member_id: 'uuid-of-member',
--         status: 'yes',
--         meal_choice: 'Chicken',
--         allergies: 'None',
--         notes: 'Vegetarian option preferred'
--       }
--     ]
--   })
-- ============================================================================

CREATE OR REPLACE FUNCTION update_party_rsvps(
  p_party_id UUID,
  p_items JSONB
)
RETURNS JSONB
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  item JSONB;
  v_member_id UUID;
  v_member_party_id UUID;
  v_status TEXT;
  v_meal_choice TEXT;
  v_allergies TEXT;
  v_notes TEXT;
  updated_count INTEGER := 0;
BEGIN
  -- Validate that party exists
  IF NOT EXISTS (SELECT 1 FROM parties WHERE id = p_party_id) THEN
    RAISE EXCEPTION 'Party not found: %', p_party_id;
  END IF;

  -- Loop through each item in the JSON array
  FOR item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    -- Extract member_id from the JSON object
    v_member_id := (item->>'member_id')::UUID;
    
    -- Look up the party_id for this member
    SELECT party_id INTO v_member_party_id
    FROM party_members
    WHERE id = v_member_id;
    
    -- Validate: member must exist and belong to the specified party
    IF v_member_party_id IS NULL THEN
      RAISE EXCEPTION 'Member not found: %', v_member_id;
    END IF;
    
    IF v_member_party_id != p_party_id THEN
      RAISE EXCEPTION 'Member % does not belong to party %', v_member_id, p_party_id;
    END IF;
    
    -- Extract RSVP data
    v_status := item->>'status';
    v_meal_choice := item->>'meal_choice';
    v_allergies := item->>'allergies';
    v_notes := item->>'notes';
    
    -- Validate status enum
    IF v_status NOT IN ('unknown', 'yes', 'no') THEN
      RAISE EXCEPTION 'Invalid status: %. Must be unknown, yes, or no', v_status;
    END IF;
    
    -- Insert or update the RSVP
    INSERT INTO rsvps (member_id, status, meal_choice, allergies, notes, updated_at)
    VALUES (
      v_member_id,
      v_status::rsvp_status,
      v_meal_choice,
      v_allergies,
      v_notes,
      now()
    )
    ON CONFLICT (member_id) DO UPDATE SET
      status = EXCLUDED.status,
      meal_choice = EXCLUDED.meal_choice,
      allergies = EXCLUDED.allergies,
      notes = EXCLUDED.notes,
      updated_at = now();
    
    updated_count := updated_count + 1;
  END LOOP;
  
  -- Return success message
  RETURN jsonb_build_object(
    'success', true,
    'updated_count', updated_count,
    'party_id', p_party_id
  );
END;
$$;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION update_party_rsvps(UUID, JSONB) TO anon, authenticated;

-- ============================================================================
-- SUCCESS! RPC functions created and secured.
-- Next step: Generate import data from CSV and run 04-import-parties.sql
-- ============================================================================
