#!/usr/bin/env node
/**
 * Execute SQL scripts directly against Supabase PostgreSQL database
 * This bypasses the Supabase client and uses direct PostgreSQL connection
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import pkg from 'pg'
const { Client } = pkg

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

// Get the database password from environment or prompt user
const SUPABASE_DB_PASSWORD = envVars.SUPABASE_DB_PASSWORD || envVars.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_DB_PASSWORD) {
  console.error(`
❌ Missing SUPABASE_DB_PASSWORD in .env.local

To get your database password:
1. Go to https://supabase.com/dashboard/project/riciiavqocbojlkewdgs/settings/database
2. Find "Database password" section
3. Copy the password
4. Add to .env.local:
   SUPABASE_DB_PASSWORD=your_password_here

Or use the pooler connection with service role key.
`)
  process.exit(1)
}

// Construct connection string 
// Using direct connection with postgres user and db.supabase.co hostname
const connectionString = `postgresql://postgres:${SUPABASE_DB_PASSWORD}@db.riciiavqocbojlkewdgs.supabase.co:5432/postgres`

console.log('🔗 Connecting to Supabase PostgreSQL...\n')

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
})

async function runMigration() {
  try {
    await client.connect()
    console.log('✅ Connected to Supabase PostgreSQL\n')

    // Get script name from command line argument
    const scriptNum = process.argv[2]
    if (!scriptNum) {
      console.log('Usage: node scripts/run-sql-migration.mjs <script-number>')
      console.log('Example: node scripts/run-sql-migration.mjs 01')
      console.log('\nAvailable scripts:')
      console.log('  01 - Create party schema (tables, triggers)')
      console.log('  02 - Setup RLS (security policies)')
      console.log('  03 - Create RPCs (lookup & update functions)')
      console.log('  04 - Import parties (103 households, 196 guests)')
      process.exit(0)
    }

    const scriptPath = join(__dirname, `${scriptNum}-*.sql`)
    const scriptFiles = {
      '01': '01-create-party-schema.sql',
      '02': '02-setup-rls.sql',
      '03': '03-create-rpcs.sql',
      '04': '04-import-parties.sql'
    }

    const scriptFile = scriptFiles[scriptNum]
    if (!scriptFile) {
      console.error(`❌ Invalid script number: ${scriptNum}`)
      process.exit(1)
    }

    const fullPath = join(__dirname, scriptFile)
    console.log(`📄 Reading ${scriptFile}...\n`)
    
    const sql = readFileSync(fullPath, 'utf-8')
    
    console.log(`⚙️  Executing SQL (${sql.length} characters)...\n`)
    
    const result = await client.query(sql)
    
    console.log('✅ SQL executed successfully!\n')
    console.log('Result:', result.command || 'Multiple commands executed')
    
  } catch (err) {
    console.error('❌ Error:', err.message)
    if (err.stack) {
      console.error('\nStack trace:', err.stack)
    }
    process.exit(1)
  } finally {
    await client.end()
  }
}

runMigration()
