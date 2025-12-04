#!/usr/bin/env node
/**
 * Execute SQL migrations using Supabase Management API
 * Uses service role key to run raw SQL
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuration
const SUPABASE_URL = 'https://riciiavqocbojlkewdgs.supabase.co'
const SERVICE_ROLE_KEY = 'sb_secret_iEZ0bUxUpk6fNkpCZe1Zag_XuoLOd_f'

// Map script numbers to files
const scriptFiles = {
  '01': '01-create-party-schema.sql',
  '02': '02-setup-rls.sql',
  '03': '03-create-rpcs.sql',
  '04': '04-import-parties.sql'
}

async function executeSql(sql) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify({ query: sql })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`HTTP ${response.status}: ${error}`)
  }

  return response.json()
}

async function runMigration() {
  const scriptNum = process.argv[2]
  
  if (!scriptNum || !scriptFiles[scriptNum]) {
    console.log('Usage: node scripts/execute-migrations.mjs <script-number>')
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
    const result = await executeSql(sql)
    console.log('✅ SQL executed successfully!')
    console.log('Result:', JSON.stringify(result, null, 2))
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

runMigration()
