import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables manually from .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
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
  console.error('Missing environment variables:')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '✓' : '✗')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('Querying wedding_party table...\n')

const { data, error } = await supabase
  .from('wedding_party')
  .select('*')
  .order('side', { ascending: true })
  .order('role', { ascending: true })

if (error) {
  console.error('Error querying wedding_party:', error)
  process.exit(1)
}

console.log(`Found ${data.length} wedding party members:\n`)
console.log('BRIDE SIDE:')
console.log('───────────')
data.filter(m => m.side === 'bride').forEach(m => {
  console.log(`${m.role}: ${m.name}`)
})

console.log('\nGROOM SIDE:')
console.log('───────────')
data.filter(m => m.side === 'groom').forEach(m => {
  console.log(`${m.role}: ${m.name}`)
})

console.log('\n✓ Query successful!')
