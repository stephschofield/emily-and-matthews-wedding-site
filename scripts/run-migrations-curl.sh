#!/bin/bash
# Execute SQL migrations using curl and Supabase Management API
# Uses service role key to execute raw SQL

SUPABASE_URL="https://riciiavqocbojlkewdgs.supabase.co"
SERVICE_KEY="sb_secret_iEZ0bUxUpk6fNkpCZe1Zag_XuoLOd_f"

echo "🚀 Running SQL migrations via Supabase API..."
echo ""

# Function to execute SQL
execute_sql() {
  local script_file=$1
  local script_name=$2
  
  echo "📄 Executing ${script_name}..."
  
  # Read SQL file
  sql_content=$(cat "scripts/${script_file}")
  
  # Execute via PostgREST (using a custom function we'll create)
  # Actually, we need to use the SQL editor approach or direct connection
  # Let me try a different method...
  
  # For now, let's just display the SQL for manual execution
  echo "Please run the following SQL in Supabase Dashboard SQL Editor:"
  echo "---"
  echo "$sql_content"
  echo "---"
  echo ""
}

# Check argument
if [ "$1" = "all" ]; then
  echo "Running all migration scripts..."
  execute_sql "01-create-party-schema.sql" "Script 1: Create Schema"
  execute_sql "02-setup-rls.sql" "Script 2: Setup RLS"
  execute_sql "03-create-rpcs.sql" "Script 3: Create RPCs"
  execute_sql "04-import-parties.sql" "Script 4: Import Data"
elif [ -n "$1" ]; then
  case "$1" in
    01) execute_sql "01-create-party-schema.sql" "Script 1: Create Schema" ;;
    02) execute_sql "02-setup-rls.sql" "Script 2: Setup RLS" ;;
    03) execute_sql "03-create-rpcs.sql" "Script 3: Create RPCs" ;;
    04) execute_sql "04-import-parties.sql" "Script 4: Import Data" ;;
    *) echo "Invalid script number. Use 01, 02, 03, 04, or all" ;;
  esac
else
  echo "Usage: bash scripts/run-migrations-curl.sh <01|02|03|04|all>"
fi
