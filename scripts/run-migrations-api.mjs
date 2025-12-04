#!/usr/bin/env node
/**
 * Execute SQL migrations using Supabase REST API
 * Uses the service role key to execute raw SQL
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SUPABASE_URL = 'https://riciiavqocbojlkewdgs.supabase.co'
const SUPABASE_SERVICE_KEY = 'sb_secret_iEZ0bUxUpk6fNkpCZe1Zag_XuoLOd_f'

const scriptFiles = {
  '01': '01-create-party-schema.sql',
  '02': '02-setup-rls.sql',
  '03': '03-create-rpcs.sql',
  '04': '04-import-parties.sql'
}

async function executeSql(sql, scriptName) {
  console.log(`\n📄 Executing ${scriptName}...`)
  console.log(`   SQL length: ${sql.length} characters`)
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      },
      body: JSON.stringify({ query: sql })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`HTTP ${response.status}: ${error}`)
    }

    const result = await response.json()
    console.log(`✅ ${scriptName} completed successfully!`)
    return result
  } catch (error) {
    console.error(`❌ Error executing ${scriptName}:`, error.message)
    throw error
  }
}

async function runMigrations() {
  console.log('🚀 Starting SQL migrations via Supabase REST API...')
  console.log(`📍 Project: ${SUPABASE_URL}\n`)

  const scriptNum = process.argv[2]
  
  if (!scriptNum) {
    console.log('Usage: node scripts/run-migrations-api.mjs <script-number>')
    console.log('       node scripts/run-migrations-api.mjs all\n')
    console.log('Available scripts:')
    console.log('  01 - Create party schema (tables, triggers)')
    console.log('  02 - Setup RLS (security policies)')
    console.log('  03 - Create RPCs (lookup & update functions)')
    console.log('  04 - Import parties (103 households, 196 guests)')
    console.log('  all - Run all scripts in sequence')
    process.exit(0)
  }

  try {
    if (scriptNum === 'all') {
      // Run all scripts in sequence
      for (const num of ['01', '02', '03', '04']) {
        const scriptFile = scriptFiles[num]
        const scriptPath = join(__dirname, scriptFile)
        const sql = readFileSync(scriptPath, 'utf-8')
        await executeSql(sql, scriptFile)
      }
      console.log('\n🎉 All migrations completed successfully!')
    } else {
      // Run single script
      const scriptFile = scriptFiles[scriptNum]
      if (!scriptFile) {
        console.error(`❌ Invalid script number: ${scriptNum}`)
        process.exit(1)
      }
      
      const scriptPath = join(__dirname, scriptFile)
      const sql = readFileSync(scriptPath, 'utf-8')
      await executeSql(sql, scriptFile)
      console.log('\n✅ Migration completed!')
    }
  } catch (error) {
    console.error('\n💥 Migration failed!')
    process.exit(1)
  }
}

runMigrations()
