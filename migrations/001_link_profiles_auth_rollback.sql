-- ==============================================================================
-- ROLLBACK: 001_link_profiles_auth_rollback.sql (Self-Verifying Production Release)
-- Description: Reverts schema changes introduced by 001_link_profiles_auth.sql
--
-- IMPORTANT NOTICES:
--   1. Schema-only rollback. Deleted seed data and data modifications require restore 
--      from backup taken prior to migration execution.
--   2. Dropping merchant_security permanently removes all configured MPIN hashes;
--      merchants will need to re-create their MPINs upon restoration.
--   3. Foreign Key restoration is executed dynamically from private.migration_001_fk_backup
--      to guarantee exact restoration of pre-migration constraint definitions.
-- ==============================================================================

BEGIN;

-- 1. Drop MPIN RPC functions
DROP FUNCTION IF EXISTS public.mpin_status();
DROP FUNCTION IF EXISTS public.reset_mpin(TEXT);
DROP FUNCTION IF EXISTS public.verify_mpin(TEXT);
DROP FUNCTION IF EXISTS public.change_mpin(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.set_mpin(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.set_mpin(TEXT);
DROP FUNCTION IF EXISTS private._internal_verify_and_track_mpin(UUID, TEXT);

-- 2. Drop merchant_secrets table
DROP TABLE IF EXISTS public.merchant_secrets;

-- 3. Explicitly drop the 4 constraints created by this migration before restoring originals
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_sender_id_fkey;
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_receiver_id_fkey;
ALTER TABLE public.merchant_settlements DROP CONSTRAINT IF EXISTS merchant_settlements_merchant_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 4. Restore Foreign Key constraints dynamically from backup table
DO $$
DECLARE
    r RECORD;
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'private' AND table_name = 'migration_001_fk_backup') THEN
        FOR r IN SELECT table_name, constraint_name, definition FROM private.migration_001_fk_backup LOOP
            EXECUTE format('ALTER TABLE %s DROP CONSTRAINT IF EXISTS %I;', r.table_name, r.constraint_name);
            EXECUTE format('ALTER TABLE %s ADD CONSTRAINT %I %s;', r.table_name, r.constraint_name, r.definition);
        END LOOP;
    END IF;
END $$;

-- 5. Restore default UUID generation on profiles.id
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 6. Clean up migration objects from private schema (drop only 001 objects, no CASCADE)
DROP TABLE IF EXISTS private.migration_001_fk_backup;
DROP SCHEMA IF EXISTS private;

COMMIT;
