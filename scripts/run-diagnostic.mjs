// Run Postgres diagnostic queries via Supabase client
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const queries = [
  {
    name: 'CHECK 0: Postgres version',
    sql: "SELECT 'CHECK 0: Postgres version' AS check_label, version() AS result"
  },
  {
    name: 'CHECK 8: All installed extensions',
    sql: "SELECT 'CHECK 8: All installed extensions' AS check_label, extname, extversion FROM pg_extension ORDER BY extname"
  },
  {
    name: 'CHECK 10: Connection and activity summary',
    sql: `SELECT 'CHECK 10: Connection and activity summary' AS check_label,
       (SELECT COUNT(*) FROM pg_stat_activity) AS total_connections,
       (SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'active') AS active_connections,
       (SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'idle') AS idle_connections`
  }
]

console.log('🔍 Running Postgres Diagnostic Checks...\n')

for (const query of queries) {
  try {
    console.log(`\n📊 ${query.name}`)
    console.log('─'.repeat(80))
    
    const { data, error } = await supabase.rpc('exec_sql', { sql: query.sql })
    
    if (error) {
      // Try direct query if RPC fails
      const result = await supabase.from('pg_stat_activity').select('*').limit(1)
      console.log('⚠️  Direct SQL execution requires elevated permissions')
      console.log('   Please run this query in Supabase Dashboard SQL Editor')
      console.log('')
      continue
    }
    
    console.table(data)
  } catch (err) {
    console.error('❌ Error:', err.message)
  }
}

console.log('\n\n💡 TIP: For full diagnostic results, run the SQL script directly in:')
console.log('   Supabase Dashboard → SQL Editor → scripts/postgres-diagnostic.sql')
