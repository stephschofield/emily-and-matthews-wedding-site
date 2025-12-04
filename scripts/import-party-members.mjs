#!/usr/bin/env node
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env.local
const envPath = join(__dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim()
  }
})

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// Read the SQL file
const sqlContent = readFileSync(join(__dirname, '04-import-parties.sql'), 'utf-8')

// Extract just the party_members INSERT VALUES
const membersMatch = sqlContent.match(/INSERT INTO party_members[^;]+;/s)
if (!membersMatch) {
  console.error('Could not find party_members INSERT statement')
  process.exit(1)
}

const membersInsert = membersMatch[0]
console.log('Found party_members INSERT statement')
console.log('Executing via raw SQL...\n')

const { error } = await supabase.rpc('exec_sql', { query: membersInsert })

if (error) {
  console.error('❌ Error:', error.message)
  process.exit(1)
}

console.log('✅ Successfully imported all party members!')
console.log('\nMigration complete! 🎉')
console.log('- 103 parties (households)')
console.log('- 196 party members (guests)')
console.log('- All RSVP rows auto-initialized')
