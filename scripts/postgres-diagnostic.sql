-- Postgres Diagnostic Check Script
-- This script checks for potential issues before upgrading Postgres

-- 0) Print header / version
SELECT 'CHECK 0: Postgres version' AS check_label, version() AS result;

-- 1) Postgres version (dedicated)
SELECT 'CHECK 1: Postgres version (duplicate)' AS check_label, version();

-- 2) Installed and available extensions (focused list)
SELECT 'CHECK 2: Extensions (available & installed)' AS check_label, *
FROM (
  SELECT name, default_version, installed_version
  FROM pg_available_extensions
  WHERE name IN ('plv8','timescaledb','pgjwt','plcoffee','plls','pg_cron')
  UNION ALL
  SELECT extname AS name, '' AS default_version, extversion AS installed_version
  FROM pg_extension
  WHERE extname IN ('plv8','timescaledb','pgjwt','plcoffee','plls','pg_cron')
) t
ORDER BY name;

-- 3) Are pg_cron tables present?
SELECT 'CHECK 3a: pg_cron job_run_details presence' AS check_label,
       to_regclass('cron.job_run_details') IS NOT NULL AS has_job_run_details;

-- 3b) pg_cron job_run_details counts and size (if present)
SELECT 'CHECK 3b: pg_cron job_run_details count & size' AS check_label,
       CASE WHEN to_regclass('cron.job_run_details') IS NOT NULL
         THEN (SELECT COUNT(*) FROM cron.job_run_details)
         ELSE NULL
       END AS job_run_details_count,
       CASE WHEN to_regclass('cron.job_run_details') IS NOT NULL
         THEN pg_size_pretty(pg_total_relation_size('cron.job_run_details'))
         ELSE NULL
       END AS job_run_details_size;

-- 4) Roles using md5 password hashing
SELECT 'CHECK 4: Roles using md5 password hashing' AS check_label,
       array_agg(rolname) FILTER (WHERE rolname IS NOT NULL) AS md5_roles
FROM pg_authid
WHERE rolcanlogin = true
  AND rolpassword LIKE 'md5%';

-- 5) Logical replication slots (non-null plugin)
SELECT 'CHECK 5: Logical replication slots' AS check_label,
       slot_name, plugin, active, restart_lsn
FROM pg_replication_slots
WHERE plugin IS NOT NULL
ORDER BY slot_name;

-- 6) Top 10 largest tables (by total relation size)
SELECT 'CHECK 6: Top-10 largest user tables' AS check_label,
       schemaname, relname AS table_name,
       pg_size_pretty(pg_total_relation_size(relid)) AS total_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 10;

-- 7) Columns using reg* types (objects depending on reg* OIDs)
SELECT 'CHECK 7: Columns using reg* types' AS check_label,
       nspname AS schema, relname AS table, attname AS column,
       format_type(atttypid, atttypmod) AS data_type
FROM pg_attribute
JOIN pg_class ON pg_class.oid = pg_attribute.attrelid
JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
WHERE format_type(atttypid, atttypmod) LIKE 'reg%'
  AND pg_attribute.attnum > 0
  AND NOT pg_attribute.attisdropped
ORDER BY schema, table, column;

-- 8) Installed extensions and versions (global list)
SELECT 'CHECK 8: All installed extensions' AS check_label,
       extname, extversion
FROM pg_extension
ORDER BY extname;

-- 9) Active long-running statements / transactions
SELECT 'CHECK 9: Active queries/transactions (non-idle)' AS check_label,
       pid, usename, application_name, state, query_start,
       now() - query_start AS duration,
       substring(query,1,500) AS query_sample
FROM pg_stat_activity
WHERE state <> 'idle'
ORDER BY query_start;

-- 10) Count of connections / basic activity overview
SELECT 'CHECK 10: Connection and activity summary' AS check_label,
       (SELECT COUNT(*) FROM pg_stat_activity) AS total_connections,
       (SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'active') AS active_connections,
       (SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'idle') AS idle_connections;

-- 11) Simple check for replication subscriptions (if any)
SELECT 'CHECK 11: replication subscriptions (pg_publication & pg_subscription)' AS check_label,
       s.subname AS subscription_name, s.subconninfo, s.subsynccommit, s.subenabled
FROM pg_subscription s
ORDER BY s.subname;
