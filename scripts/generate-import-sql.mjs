#!/usr/bin/env node
/**
 * Generate SQL import script from CSV guest list
 * 
 * Reads: Em & Matthew Wedding_RSVP List.xlsx - RSVP List.csv
 * Generates: 04-import-parties.sql with INSERT statements
 * 
 * Run: node scripts/generate-import-sql.mjs
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read CSV file
const csvPath = join(process.env.USERPROFILE || process.env.HOME, 'Downloads', 'Em & Matthew Wedding_RSVP List.xlsx - RSVP List.csv')
console.log(`📄 Reading CSV from: ${csvPath}`)

let csvContent
try {
  csvContent = readFileSync(csvPath, 'utf-8')
} catch (err) {
  console.error('❌ Error reading CSV file:', err.message)
  console.error('\n💡 Make sure the file exists at:')
  console.error(`   ${csvPath}`)
  process.exit(1)
}

// Parse CSV (simple parser for this specific format)
const lines = csvContent.trim().split('\n')
const headers = lines[0].split(',')

console.log(`📊 Found ${lines.length - 1} households in CSV\n`)

// Generate SQL
const parties = []
const members = []
let totalGuests = 0

// Skip header row
for (let i = 1; i < lines.length; i++) {
  const line = lines[i]
  const values = line.split(',')
  
  const partyId = randomUUID()
  const householdLabel = values[0] || `Party ${i}`
  
  // Add party
  parties.push({
    id: partyId,
    household_label: householdLabel
  })
  
  // Add party members (Guest Full Name + Guest Name 1-5)
  const memberNames = []
  
  // First member is always the primary guest (Guest Full Name)
  if (values[0]) memberNames.push(values[0])
  
  // Additional members (Guest Name 1-5)
  for (let j = 1; j <= 5; j++) {
    const name = values[j]?.trim()
    if (name && name !== '') {
      memberNames.push(name)
    }
  }
  
  // Create member records
  memberNames.forEach((name, index) => {
    const memberId = randomUUID()
    const isPlusOne = name.toLowerCase() === 'guest'
    
    members.push({
      id: memberId,
      party_id: partyId,
      full_name: name,
      is_plus_one_placeholder: isPlusOne,
      sort_order: index
    })
    
    totalGuests++
  })
}

console.log(`✅ Parsed data:`)
console.log(`   - ${parties.length} households`)
console.log(`   - ${totalGuests} total guests\n`)

// Generate SQL file
let sql = `-- ============================================================================
-- STEP 4: Import Guest List (102 Households, ${totalGuests} Guests)
-- ============================================================================
-- Generated from: Em & Matthew Wedding_RSVP List.xlsx - RSVP List.csv
-- Generated on: ${new Date().toISOString()}
--
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================================

-- Insert parties (households)
INSERT INTO parties (id, household_label) VALUES\n`

sql += parties.map(p => 
  `  ('${p.id}', ${sqlString(p.household_label)})`
).join(',\n')

sql += ';\n\n-- Insert party members (individual guests)\n'
sql += 'INSERT INTO party_members (id, party_id, full_name, is_plus_one_placeholder, sort_order) VALUES\n'

sql += members.map(m => 
  `  ('${m.id}', '${m.party_id}', ${sqlString(m.full_name)}, ${m.is_plus_one_placeholder}, ${m.sort_order})`
).join(',\n')

sql += ';\n\n'

sql += `-- ============================================================================
-- SUCCESS! Imported ${parties.length} households with ${totalGuests} guests.
-- 
-- Verification queries:
--   SELECT COUNT(*) FROM parties;           -- Should return ${parties.length}
--   SELECT COUNT(*) FROM party_members;     -- Should return ${totalGuests}
--   SELECT COUNT(*) FROM rsvps;             -- Should return ${totalGuests} (auto-created by trigger)
--
-- Test the lookup function:
--   SELECT * FROM lookup_party_by_name('John');
-- ============================================================================
`

// Write SQL file
const outputPath = join(__dirname, '04-import-parties.sql')
writeFileSync(outputPath, sql, 'utf-8')

console.log(`✅ Generated SQL file: ${outputPath}`)
console.log(`\n📝 Next steps:`)
console.log(`   1. Open Supabase Dashboard → SQL Editor`)
console.log(`   2. Copy and paste the contents of 04-import-parties.sql`)
console.log(`   3. Run the query`)
console.log(`   4. Verify with: SELECT COUNT(*) FROM parties;`)

// Helper function to escape SQL strings
function sqlString(str) {
  if (!str) return 'NULL'
  return `'${str.replace(/'/g, "''")}'`
}
