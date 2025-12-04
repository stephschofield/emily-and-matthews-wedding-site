# 🎯 Task 3: Complete Backend Migration Implementation Guide

**Status:** In Progress  
**Goal:** Migrate from hardcoded guest list to secure party-based RSVP system in Supabase

## 📊 Summary

- **Current:** 11 hardcoded guests in `lib/guest-list.ts`
- **Target:** 103 households with 196 guests in Supabase with validated RPC access
- **Database:** New tables `parties`, `party_members`, `rsvps` with RLS + secure RPCs

---

## 🗂️ Generated Files

All SQL scripts are in the `scripts/` directory:

| File | Purpose | Run Order |
|------|---------|-----------|
| `01-create-party-schema.sql` | Create tables, triggers, indexes | **1st** |
| `02-setup-rls.sql` | Enable RLS and block direct access | **2nd** |
| `03-create-rpcs.sql` | Create secure lookup/update functions | **3rd** |
| `04-import-parties.sql` | Import 103 households + 196 guests | **4th** |

---

## 📋 Step-by-Step Execution Plan

### **STEP 1: Create Core Schema** ✅ Ready to Run

**File:** `scripts/01-create-party-schema.sql`

**What it does:**
- Creates `parties` table (household groupings)
- Creates `party_members` table (individual guests) 
- Creates `rsvp_status` enum type ('unknown', 'yes', 'no')
- Creates `rsvps` table
- Sets up trigger to auto-create RSVP rows for each new member
- Adds indexes for performance

**How to run:**
1. Open [Supabase Dashboard](https://supabase.com/dashboard/project/riciiavqocbojlkewdgs)
2. Go to **SQL Editor** (left sidebar)
3. Click **"New Query"**
4. Copy entire contents of `scripts/01-create-party-schema.sql`
5. Paste and click **"Run"**
6. Verify success message appears

**Expected result:**
```
CREATE TABLE
CREATE TABLE  
CREATE TYPE
CREATE TABLE
CREATE FUNCTION
CREATE TRIGGER
```

---

### **STEP 2: Enable Row Level Security** ✅ Ready to Run

**File:** `scripts/02-setup-rls.sql`

**What it does:**
- Enables RLS on all three tables
- Blocks direct SELECT access for anon users
- Forces all reads through the `lookup_party_by_name` RPC
- Blocks direct INSERT/UPDATE on rsvps (must use `update_party_rsvps` RPC)

**How to run:**
1. Same Supabase Dashboard → SQL Editor
2. New Query
3. Copy contents of `scripts/02-setup-rls.sql`
4. Run

**Expected result:**
```
ALTER TABLE
ALTER TABLE
ALTER TABLE
CREATE POLICY (multiple)
REVOKE (multiple)
```

**⚠️ Important:** After this step, you won't be able to query tables directly from the client anymore. This is intentional and secure!

---

### **STEP 3: Create Secure RPC Functions** ✅ Ready to Run

**File:** `scripts/03-create-rpcs.sql`

**What it does:**
- Creates `lookup_party_by_name(q text)` function
  - Searches for parties by member name
  - Returns full party with all members and their RSVP status
- Creates `update_party_rsvps(p_party_id uuid, p_items jsonb)` function
  - Validates that members belong to the specified party
  - Updates RSVP status, meal choices, allergies
  - Prevents cross-party RSVP tampering

**How to run:**
1. SQL Editor → New Query
2. Copy `scripts/03-create-rpcs.sql`
3. Run

**Expected result:**
```
CREATE FUNCTION
GRANT
CREATE FUNCTION
GRANT
```

**Test the functions:**
```sql
-- After importing data (Step 4), test with:
SELECT * FROM lookup_party_by_name('Karen');
```

---

### **STEP 4: Import Guest Data** ✅ Ready to Run

**File:** `scripts/04-import-parties.sql` (auto-generated from CSV)

**What it does:**
- Inserts 103 household parties
- Inserts 196 individual party members
- Auto-triggers creation of 196 RSVP rows (via trigger from Step 1)

**Stats:**
- 103 households (parties)
- 196 total guests (party_members)
- Plus-ones marked with `is_plus_one_placeholder = true` when name is "Guest"

**How to run:**
1. SQL Editor → New Query
2. Copy **entire** contents of `scripts/04-import-parties.sql`
3. Run (may take 5-10 seconds)

**Expected result:**
```
INSERT 0 103
INSERT 0 196
```

**Verification queries:**
```sql
-- Check parties imported
SELECT COUNT(*) FROM parties;  -- Should return 103

-- Check members imported  
SELECT COUNT(*) FROM party_members;  -- Should return 196

-- Check RSVPs auto-created
SELECT COUNT(*) FROM rsvps;  -- Should return 196

-- View a sample party
SELECT * FROM lookup_party_by_name('Stephanie Schofield');
```

---

## 🧪 Testing the Backend

### Test 1: Search for a Party

```javascript
const { data, error } = await supabase.rpc('lookup_party_by_name', {
  q: 'Stephanie Schofield'
})

// Expected result:
// [
//   {
//     party_id: 'uuid...',
//     household_label: 'Stephanie Schofield',
//     member_id: 'uuid...',
//     full_name: 'Stephanie Schofield',
//     is_plus_one_placeholder: false,
//     allow_attend: true,
//     sort_order: 0,
//     rsvp_status: 'unknown',
//     meal_choice: null,
//     allergies: null,
//     notes: null
//   },
//   {
//     party_id: 'uuid...',  // same party_id
//     household_label: 'Stephanie Schofield',
//     member_id: 'uuid...',
//     full_name: 'Christopher Davis',
//     is_plus_one_placeholder: false,
//     allow_attend: true,
//     sort_order: 1,
//     rsvp_status: 'unknown',
//     meal_choice: null,
//     allergies: null,
//     notes: null
//   }
// ]
```

### Test 2: Update RSVPs for a Party

```javascript
const { data, error } = await supabase.rpc('update_party_rsvps', {
  p_party_id: 'party-uuid-from-lookup',
  p_items: [
    {
      member_id: 'member-uuid-1',
      status: 'yes',
      meal_choice: 'Chicken',
      allergies: 'None'
    },
    {
      member_id: 'member-uuid-2',
      status: 'yes',
      meal_choice: 'Vegetarian',
      allergies: 'Gluten-free'
    }
  ]
})

// Expected result:
// {
//   success: true,
//   updated_count: 2,
//   party_id: 'uuid...'
// }
```

### Test 3: Verify Direct Access is Blocked

```javascript
// This should FAIL (blocked by RLS)
const { data, error } = await supabase
  .from('parties')
  .select('*')

// Error: "new row violates row-level security policy"
// ✅ This is correct! It forces use of the secure RPC.
```

---

## 🔄 Migration from Old System

### Current Tables to Keep

**Keep these tables** (they're still used):
- ✅ `wedding_party` - Used by wedding party page (already migrated)
- ✅ `song_requests` - Used by playlist functionality

### Current Tables to Deprecate

**Eventually remove** (after migration complete):
- ❌ `rsvps` (old table) - Will conflict with new `rsvps` table
- ❌ `party_members` (old table) - Will conflict with new table

**Migration strategy:**
1. **Rename old tables temporarily:**
   ```sql
   ALTER TABLE rsvps RENAME TO rsvps_old;
   ALTER TABLE party_members RENAME TO party_members_old;
   ```

2. **Run Steps 1-4 above** to create new schema

3. **Migrate any existing data** (if needed):
   ```sql
   -- Example: Copy old RSVPs if you have test data you want to keep
   -- (You'll need to map old structure to new)
   ```

4. **Drop old tables** once migration verified:
   ```sql
   DROP TABLE IF EXISTS rsvps_old;
   DROP TABLE IF EXISTS party_members_old;
   ```

---

## 📦 What Changes in the Code

### Frontend Changes (Task 4)

**File:** `app/rsvp/page.tsx`

**Before:**
```typescript
import { findGuestByName } from '@/lib/guest-list'  // ❌ Remove

const guest = findGuestByName(name)  // ❌ Old way
```

**After:**
```typescript
// ✅ New way: Use RPC
const { data: party } = await supabase.rpc('lookup_party_by_name', { q: name })
```

### API Changes (Task 5)

**File:** `app/api/rsvp/route.ts`

**Before:**
```typescript
// ❌ Direct insert
await supabase.from('rsvps').insert({ ... })
```

**After:**
```typescript
// ✅ Validated RPC
await supabase.rpc('update_party_rsvps', {
  p_party_id: partyId,
  p_items: rsvpData
})
```

---

## ✅ Success Criteria

After completing all 4 steps, you should be able to:

- [x] Query `SELECT COUNT(*) FROM parties;` → Returns 103
- [x] Query `SELECT COUNT(*) FROM party_members;` → Returns 196  
- [x] Query `SELECT COUNT(*) FROM rsvps;` → Returns 196
- [x] Run `SELECT * FROM lookup_party_by_name('John');` → Returns John's party
- [x] Direct SELECT on parties table → **FAILS** (blocked by RLS) ✅
- [ ] Frontend can search and display parties (Task 4)
- [ ] Frontend can submit RSVPs via RPC (Task 5)

---

## 🚨 Troubleshooting

### Issue: "relation 'parties' already exists"
**Solution:** Tables already created. Skip Step 1 or drop and recreate:
```sql
DROP TABLE IF EXISTS rsvps CASCADE;
DROP TABLE IF EXISTS party_members CASCADE;
DROP TABLE IF EXISTS parties CASCADE;
DROP TYPE IF EXISTS rsvp_status CASCADE;
-- Then re-run Step 1
```

### Issue: "permission denied for function"
**Solution:** Re-run the GRANT statements in Step 3:
```sql
GRANT EXECUTE ON FUNCTION lookup_party_by_name(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_party_rsvps(UUID, JSONB) TO anon, authenticated;
```

### Issue: "new row violates row-level security policy"
**Solution:** This is expected! RLS is working. Use the RPC functions instead of direct table access.

---

## 📞 Next Steps After Backend Complete

1. **Task 4:** Update frontend RSVP flow to use new RPCs
2. **Task 5:** Update API routes to use validated updates
3. **Task 6:** Build admin dashboard to view all RSVPs
4. Test end-to-end flow
5. Deploy to production

---

## 🎉 Ready to Execute!

All files are generated and ready. Start with:

```bash
# Verify files exist
ls -la scripts/01-*.sql scripts/02-*.sql scripts/03-*.sql scripts/04-*.sql

# Then follow steps 1-4 above in Supabase Dashboard SQL Editor
```

**Estimated time:** 15-20 minutes to run all 4 SQL scripts and verify

**Current Status:** ⏳ Ready to begin Step 1
