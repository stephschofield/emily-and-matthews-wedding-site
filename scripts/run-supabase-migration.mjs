#!/usr/bin/env node
/**
 * Execute SQL migrations using Supabase client with service role key
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
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

if (!SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Map script numbers to files
const scriptFiles = {
  '01': '01-create-party-schema.sql',
  '02': '02-setup-rls.sql',
  '03': '03-create-rpcs.sql',
  '04': '04-import-parties.sql'
}

async function runMigration() {
  const scriptNum = process.argv[2]
  
  if (!scriptNum || !scriptFiles[scriptNum]) {
    console.log('Usage: node scripts/run-supabase-migration.mjs <script-number>')
    console.log('\nAvailable scripts:')
    console.log('  01 - Create party schema (tables, triggers)')
    console.log('  02 - Setup RLS (security policies)')
    console.log('  03 - Create RPCs (lookup & update functions)')
    console.log('  04 - Import parties (103 households, 196 guests)')
    process.exit(1)
  }

  const scriptFile = scriptFiles[scriptNum]
  const scriptPath = join(__dirname, scriptFile)
  
  console.log(`📄 Reading ${scriptFile}...`)
  const sql = readFileSync(scriptPath, 'utf-8')
  
  console.log(`⚙️  Executing SQL (${sql.length} characters)...\n`)
  
  try {
    // Split SQL into individual statements (simple split by semicolon)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    
    console.log(`Found ${statements.length} SQL statements to execute\n`)
    
    let successCount = 0
    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', { query: statement })
      
      if (error) {
        console.error(`❌ Error executing statement:`, error.message)
        console.error('Statement:', statement.substring(0, 200) + '...')
        throw error
      }
      successCount++
    }
    
    console.log(`\n✅ Successfully executed ${successCount} statements!`)
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

runMigration()
