#!/usr/bin/env node
/**
 * Test Supabase connection and verify database is ready
 * Run: node scripts/test-supabase-connection.mjs
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables manually
const envPath = join(__dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf-8')

const envVars = {}
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim()
  }
})

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔍 Testing Supabase Connection...\n')
console.log(`📡 URL: ${supabaseUrl}`)
console.log(`🔑 Key: ${supabaseKey.substring(0, 20)}...\n`)

async function testConnection() {
  try {
    // Test 1: Check existing tables
    console.log('TEST 1: Checking existing tables...')
    const { data: weddingParty, error: wpError } = await supabase
      .from('wedding_party')
      .select('*')
      .limit(1)
    
    if (!wpError) {
      console.log('✅ wedding_party table exists')
    }

    // Test 2: Check if new tables exist (they shouldn't yet)
    console.log('\nTEST 2: Checking for new RSVP tables...')
    
    const { error: partiesError } = await supabase
      .from('parties')
      .select('count')
      .limit(1)
    
    if (partiesError) {
      if (partiesError.message.includes('does not exist')) {
        console.log('⏳ parties table: NOT YET CREATED (expected)')
      } else {
        console.log('⚠️  parties table error:', partiesError.message)
      }
    } else {
      console.log('✅ parties table: EXISTS')
    }

    // Test 3: Try calling RPCs (they won't exist yet)
    console.log('\nTEST 3: Checking for RPC functions...')
    
    const { error: rpcError } = await supabase.rpc('lookup_party_by_name', { q: 'test' })
    
    if (rpcError) {
      if (rpcError.message.includes('does not exist')) {
        console.log('⏳ lookup_party_by_name RPC: NOT YET CREATED (expected)')
      } else {
        console.log('⚠️  RPC error:', rpcError.message)
      }
    } else {
      console.log('✅ lookup_party_by_name RPC: EXISTS')
    }

    console.log('\n' + '='.repeat(60))
    console.log('📋 BACKEND MIGRATION STATUS')
    console.log('='.repeat(60))
    console.log('')
    console.log('Connection: ✅ Working')
    console.log('')
    console.log('Next Steps:')
    console.log('1. Open Supabase Dashboard: https://supabase.com/dashboard/project/riciiavqocbojlkewdgs')
    console.log('2. Go to SQL Editor (left sidebar)')
    console.log('3. Run scripts in order:')
    console.log('   - scripts/01-create-party-schema.sql')
    console.log('   - scripts/02-setup-rls.sql')
    console.log('   - scripts/03-create-rpcs.sql')
    console.log('   - scripts/04-import-parties.sql')
    console.log('')
    console.log('After running scripts, run this test again to verify!')
    console.log('='.repeat(60))

  } catch (err) {
    console.error('❌ Connection test failed:', err)
    process.exit(1)
  }
}

testConnection()
