#!/usr/bin/env node

/**
 * Test script to verify RSVP functionality
 */

const BASE_URL = 'http://localhost:3001'

async function testLookup() {
  console.log('\n🔍 Testing guest lookup...')
  
  const response = await fetch(`${BASE_URL}/api/rsvp/lookup?name=Stephanie`)
  const result = await response.json()
  
  if (response.ok && result.members && result.members.length > 0) {
    console.log('✅ Lookup successful!')
    console.log(`   Found ${result.count} members in party:`)
    result.members.forEach(member => {
      console.log(`   - ${member.full_name} (${member.member_id})`)
    })
    return result
  } else {
    console.log('❌ Lookup failed:', result.error || 'No members found')
    return null
  }
}

async function testDeclineRSVP(partyData) {
  console.log('\n📝 Testing "not attending" RSVP submission...')
  
  const rsvps = partyData.members.map(member => ({
    member_id: member.member_id,
    status: 'no',
    notes: 'Test RSVP - automated testing'
  }))
  
  const response = await fetch(`${BASE_URL}/api/rsvp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      partyId: partyData.members[0].party_id,
      rsvps: rsvps
    })
  })
  
  const result = await response.json()
  
  if (response.ok && result.success) {
    console.log('✅ RSVP submission successful!')
    console.log(`   Updated ${result.updated} RSVP records`)
    return true
  } else {
    console.log('❌ RSVP submission failed:', result.error || 'Unknown error')
    return false
  }
}

async function verifyDatabase() {
  console.log('\n🔍 Checking database status...')
  console.log('   (You can verify manually with SQL: SELECT * FROM rsvps WHERE notes LIKE \'%Test RSVP%\')')
}

async function main() {
  console.log('🧪 Starting RSVP System Tests')
  console.log('=' .repeat(50))
  
  try {
    // Test 1: Lookup
    const partyData = await testLookup()
    if (!partyData) {
      console.log('\n❌ Cannot continue - lookup failed')
      return
    }
    
    // Test 2: Submit decline RSVP
    const submitSuccess = await testDeclineRSVP(partyData)
    if (!submitSuccess) {
      console.log('\n❌ RSVP submission failed')
      return
    }
    
    // Verify
    await verifyDatabase()
    
    console.log('\n' + '=' .repeat(50))
    console.log('✅ All tests completed successfully!')
    console.log('\n💡 Next steps:')
    console.log('   1. Check the database to confirm the RSVP status changed')
    console.log('   2. Test the attending flow with meal choices in the browser')
    console.log('   3. Test plus-one name entry')
    
  } catch (error) {
    console.error('\n❌ Test error:', error.message)
  }
}

main()
