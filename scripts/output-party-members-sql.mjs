#!/usr/bin/env node
import { readFileSync } from 'fs'

const sql = readFileSync('/tmp/party-members-insert.sql', 'utf-8')

console.log('Executing party_members INSERT via Supabase MCP...')
console.log(`SQL length: ${sql.length} characters`)
console.log(`Inserting 196 party members...`)
console.log('')

// Output the SQL so it can be piped to the MCP
console.log(sql)
