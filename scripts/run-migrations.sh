#!/bin/bash
# Run all SQL migrations using Supabase CLI
# This script executes the 4 migration scripts in order

set -e  # Exit on any error

echo "🔗 Connecting to Supabase project..."
echo ""

# Script 1: Create tables and triggers
echo "📄 Running 01-create-party-schema.sql..."
npx supabase db execute --file scripts/01-create-party-schema.sql --linked
echo "✅ Schema created successfully"
echo ""

# Script 2: Enable RLS
echo "📄 Running 02-setup-rls.sql..."
npx supabase db execute --file scripts/02-setup-rls.sql --linked
echo "✅ RLS policies enabled"
echo ""

# Script 3: Create RPCs
echo "📄 Running 03-create-rpcs.sql..."
npx supabase db execute --file scripts/03-create-rpcs.sql --linked
echo "✅ RPC functions created"
echo ""

# Script 4: Import data
echo "📄 Running 04-import-parties.sql..."
npx supabase db execute --file scripts/04-import-parties.sql --linked
echo "✅ Party data imported (103 households, 196 guests)"
echo ""

echo "🎉 All migrations completed successfully!"
echo ""
echo "Next steps:"
echo "  1. Test the lookup: node scripts/test-party-lookup.mjs"
echo "  2. Wire up RSVP page components"
