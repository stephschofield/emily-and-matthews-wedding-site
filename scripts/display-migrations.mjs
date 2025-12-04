#!/usr/bin/env node
/**
 * Execute SQL migrations using Supabase client with service role key
 * This approach uses the service role to execute DDL statements
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SUPABASE_URL = 'https://riciiavqocbojlkewdgs.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpY2lpYXZxb2Nib2psa2V3ZGdzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDI3MjYxMSwiZXhwIjoyMDY5ODQ4NjExfQ.sb_secret_iEZ0bUxUpk6fNkpCZe1Zag_XuoLOd_f'

const scriptFiles = {
  '01': '01-create-party-schema.sql',
  '02': '02-setup-rls.sql',
  '03': '03-create-rpcs.sql',
  '04': '04-import-parties.sql'
}

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function executeSqlStatements(sql, scriptName) {
  console.log(`\n📄 Executing ${scriptName}...`)
  console.log(`   SQL length: ${sql.length} characters`)
  
  // Split SQL into individual statements (basic approach)
  // Note: This is a simplified splitter - may need adjustment for complex SQL
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))
  
  console.log(`   Statements to execute: ${statements.length}`)
  
  let successCount = 0
  let errorCount = 0
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]
    if (!statement || statement.startsWith('--')) continue
    
    try {
      // Execute using rpc - we need a helper function in the database first
      // For now, let's just log what needs to be executed
      console.log(`   [${i + 1}/${statements.length}] Executing statement...`)
      
      // Note: Supabase client can't execute raw DDL directly
      // We need to use the SQL Editor in dashboard or direct psql connection
      successCount++
    } catch (error) {
      console.error(`   ❌ Error on statement ${i + 1}:`, error.message)
      errorCount++
    }
  }
  
  console.log(`   ✅ ${successCount} statements prepared`)
  if (errorCount > 0) {
    console.log(`   ❌ ${errorCount} statements failed`)
  }
}

async function runMigrations() {
  console.log('🚀 SQL Migration Runner')
  console.log('📍 Project: ' + SUPABASE_URL)
  console.log('\n⚠️  IMPORTANT: The Supabase JavaScript client cannot execute DDL statements.')
  console.log('   You need to run these scripts in the Supabase Dashboard SQL Editor.\n')
  console.log('   Here are the commands to copy and paste:\n')

  const scriptNum = process.argv[2]
  
  if (!scriptNum) {
    console.log('Usage: node scripts/run-migrations-service.mjs <01|02|03|04|all>')
    console.log('\nTo run in Supabase Dashboard:')
    console.log('1. Go to: https://supabase.com/dashboard/project/riciiavqocbojlkewdgs/sql/new')
    console.log('2. Copy the SQL from each script file')
    console.log('3. Paste and click "Run"')
    console.log('\nScripts to run in order:')
    console.log('  ✓ scripts/01-create-party-schema.sql')
    console.log('  ✓ scripts/02-setup-rls.sql')
    console.log('  ✓ scripts/03-create-rpcs.sql')
    console.log('  ✓ scripts/04-import-parties.sql')
    process.exit(0)
  }

  // Display the SQL content for manual execution
  if (scriptNum === 'all') {
    console.log('═'.repeat(80))
    console.log('SCRIPT 1: CREATE SCHEMA')
    console.log('═'.repeat(80))
    console.log(readFileSync(join(__dirname, scriptFiles['01']), 'utf-8'))
    
    console.log('\n' + '═'.repeat(80))
    console.log('SCRIPT 2: SETUP RLS')
    console.log('═'.repeat(80))
    console.log(readFileSync(join(__dirname, scriptFiles['02']), 'utf-8'))
    
    console.log('\n' + '═'.repeat(80))
    console.log('SCRIPT 3: CREATE RPCS')
    console.log('═'.repeat(80))
    console.log(readFileSync(join(__dirname, scriptFiles['03']), 'utf-8'))
    
    console.log('\n' + '═'.repeat(80))
    console.log('SCRIPT 4: IMPORT DATA')
    console.log('═'.repeat(80))
    console.log(readFileSync(join(__dirname, scriptFiles['04']), 'utf-8'))
  } else {
    const scriptFile = scriptFiles[scriptNum]
    if (!scriptFile) {
      console.error(`❌ Invalid script number: ${scriptNum}`)
      process.exit(1)
    }
    
    console.log('═'.repeat(80))
    console.log(readFileSync(join(__dirname, scriptFile), 'utf-8'))
    console.log('═'.repeat(80))
  }
  
  console.log('\n✅ Copy the SQL above and run it in the Supabase Dashboard SQL Editor')
  console.log('   URL: https://supabase.com/dashboard/project/riciiavqocbojlkewdgs/sql/new\n')
}

runMigrations()
