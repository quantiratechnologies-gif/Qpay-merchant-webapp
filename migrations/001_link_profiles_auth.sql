-- ==============================================================================
-- MIGRATION: 001_link_profiles_auth.sql (Production Spec Release)
-- 
-- STEP 0 (MANDATORY PREREQUISITE):
--   Take a full database backup before running this script (via Supabase Dashboard 
--   -> Database -> Backups, or pg_dump). 
-- ==============================================================================

BEGIN;

-- 1. Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- 2. Create private schema for migration metadata and internal helpers
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated, PUBLIC;

-- 3. Dynamic FK Backup: Save current FK definitions before modifying
CREATE TABLE IF NOT EXISTS private.migration_001_fk_backup (
    table_name TEXT NOT NULL,
    constraint_name TEXT NOT NULL,
    definition TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

DELETE FROM private.migration_001_fk_backup;

INSERT INTO private.migration_001_fk_backup (table_name, constraint_name, definition)
SELECT 
    n.nspname || '.' || c.relname AS table_name, 
    pgc.conname, 
    pg_get_constraintdef(pgc.oid)
FROM pg_constraint pgc
JOIN pg_class c ON c.oid = pgc.conrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE pgc.contype = 'f' 
  AND pgc.connamespace = 'public'::regnamespace
  AND (
      pgc.conname IN ('transactions_sender_id_fkey', 'transactions_receiver_id_fkey', 'merchant_settlements_merchant_id_fkey', 'profiles_id_fkey')
      OR pgc.conrelid IN ('public.transactions'::regclass, 'public.merchant_settlements'::regclass, 'public.profiles'::regclass)
  );

-- 4. Clean up mock seed records safely
DELETE FROM public.transactions 
WHERE sender_id IN ('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003')
   OR receiver_id IN ('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003');

DELETE FROM public.bank_accounts 
WHERE user_id IN ('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003');

DELETE FROM public.notifications 
WHERE target_user_id IN ('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003');

DELETE FROM public.merchant_settlements 
WHERE merchant_id IN ('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003');

DELETE FROM public.profiles 
WHERE id IN ('a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003');

-- 5. Pre-flight Check: Ensure all remaining profiles exist in auth.users before applying FK
DO $$
DECLARE
    v_orphan_count INT;
BEGIN
    SELECT COUNT(*) INTO v_orphan_count
    FROM public.profiles p
    LEFT JOIN auth.users u ON u.id = p.id
    WHERE u.id IS NULL;

    IF v_orphan_count > 0 THEN
        RAISE EXCEPTION 'Pre-flight check failed: Found % profile(s) in public.profiles that do not exist in auth.users. Migration aborted.', v_orphan_count;
    END IF;
END $$;

-- 6. Link profiles to auth.users (profiles.id = auth.uid())
ALTER TABLE public.profiles ALTER COLUMN id DROP DEFAULT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_id_fkey' 
          AND table_name = 'profiles'
    ) THEN
        ALTER TABLE public.profiles
        ADD CONSTRAINT profiles_id_fkey
        FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 7. E.164 Format Check & Duplicate Detection (RAISE instead of auto-delete)
DO $$
DECLARE
    v_invalid_count INT;
    v_invalid_mobiles TEXT;
    v_duplicate_count INT;
    v_duplicate_mobiles TEXT;
BEGIN
    -- Check for unrecognized mobile formats
    SELECT COUNT(*), string_agg(DISTINCT mobile, ', ')
    INTO v_invalid_count, v_invalid_mobiles
    FROM public.profiles
    WHERE mobile IS NOT NULL 
      AND mobile !~ '^\+9665[0-9]{8}$'
      AND mobile !~ '^(05|5)[0-9]{8}$';

    IF v_invalid_count > 0 THEN
        RAISE EXCEPTION 'Mobile normalization aborted: Found % profile(s) with invalid mobile formats: [%]. Manual formatting required.', v_invalid_count, v_invalid_mobiles;
    END IF;

    -- Normalize mobile formats in place
    UPDATE public.profiles
    SET mobile = CASE 
        WHEN mobile ~ '^05[0-9]{8}$' THEN '+966' || substring(mobile from 2)
        WHEN mobile ~ '^5[0-9]{8}$' THEN '+966' || mobile
        ELSE mobile
    END
    WHERE mobile IS NOT NULL;

    -- Detect duplicate mobile numbers and RAISE listing duplicates
    SELECT COUNT(*), string_agg(DISTINCT mobile, ', ')
    INTO v_duplicate_count, v_duplicate_mobiles
    FROM (
        SELECT mobile
        FROM public.profiles
        WHERE mobile IS NOT NULL
        GROUP BY mobile
        HAVING COUNT(*) > 1
    ) dupes;

    IF v_duplicate_count > 0 THEN
        RAISE EXCEPTION 'Mobile normalization aborted: Found % duplicate mobile number(s): [%]. Manual deduplication required before applying unique index.', v_duplicate_count, v_duplicate_mobiles;
    END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_mobile_idx ON public.profiles(mobile) WHERE mobile IS NOT NULL;

-- 8. Establish ON DELETE RESTRICT on financial tables
ALTER TABLE public.transactions 
DROP CONSTRAINT IF EXISTS transactions_sender_id_fkey,
DROP CONSTRAINT IF EXISTS transactions_receiver_id_fkey;

ALTER TABLE public.transactions
ADD CONSTRAINT transactions_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE RESTRICT,
ADD CONSTRAINT transactions_receiver_id_fkey 
FOREIGN KEY (receiver_id) REFERENCES public.profiles(id) ON DELETE RESTRICT;

ALTER TABLE public.merchant_settlements
DROP CONSTRAINT IF EXISTS merchant_settlements_merchant_id_fkey;

ALTER TABLE public.merchant_settlements
ADD CONSTRAINT merchant_settlements_merchant_id_fkey 
FOREIGN KEY (merchant_id) REFERENCES public.profiles(id) ON DELETE RESTRICT;

-- 9. Create dedicated merchant_secrets table with 0 RLS policies
CREATE TABLE IF NOT EXISTS public.merchant_secrets (
    merchant_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    mpin_hash TEXT,
    mpin_failed_attempts INT NOT NULL DEFAULT 0,
    mpin_locked_until TIMESTAMPTZ DEFAULT NULL,
    mpin_updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.merchant_secrets ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.merchant_secrets FROM anon, authenticated, PUBLIC;

-- 10. Internal Helper: private._internal_verify_and_track_mpin
-- Note: mpin_updated_at is NOT updated during verification calls.
CREATE OR REPLACE FUNCTION private._internal_verify_and_track_mpin(p_merchant_id UUID, p_pin TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    v_sec RECORD;
    v_is_valid BOOLEAN;
    v_new_attempts INT;
BEGIN
    SELECT * INTO v_sec
    FROM public.merchant_secrets
    WHERE merchant_id = p_merchant_id
    FOR UPDATE;

    IF NOT FOUND OR v_sec.mpin_hash IS NULL THEN
        RETURN jsonb_build_object('status', 'not_set', 'success', false, 'error', 'PIN_NOT_SET', 'message', 'Please configure your MPIN first');
    END IF;

    -- Check active lockout
    IF v_sec.mpin_locked_until IS NOT NULL AND v_sec.mpin_locked_until > NOW() THEN
        RETURN jsonb_build_object(
            'status', 'locked',
            'success', false, 
            'error', 'LOCKED_OUT', 
            'locked_until', v_sec.mpin_locked_until,
            'message', 'Account locked due to failed attempts. Please try again later.'
        );
    END IF;

    -- Reset expired lockout counter
    IF v_sec.mpin_locked_until IS NOT NULL AND v_sec.mpin_locked_until <= NOW() THEN
        v_sec.mpin_failed_attempts := 0;
    END IF;

    -- Verify bcrypt hash
    v_is_valid := (v_sec.mpin_hash = crypt(p_pin, v_sec.mpin_hash));

    IF v_is_valid THEN
        UPDATE public.merchant_secrets
        SET 
            mpin_failed_attempts = 0,
            mpin_locked_until = NULL
        WHERE merchant_id = p_merchant_id;

        RETURN jsonb_build_object('status', 'ok', 'success', true, 'message', 'PIN verified successfully');
    ELSE
        v_new_attempts := v_sec.mpin_failed_attempts + 1;

        IF v_new_attempts >= 5 THEN
            UPDATE public.merchant_secrets
            SET 
                mpin_failed_attempts = v_new_attempts,
                mpin_locked_until = NOW() + INTERVAL '30 minutes'
            WHERE merchant_id = p_merchant_id;

            RETURN jsonb_build_object(
                'status', 'locked',
                'success', false, 
                'error', 'LOCKED_OUT', 
                'locked_until', NOW() + INTERVAL '30 minutes',
                'message', 'Too many failed attempts. Account locked for 30 minutes.'
            );
        ELSE
            UPDATE public.merchant_secrets
            SET 
                mpin_failed_attempts = v_new_attempts,
                mpin_locked_until = NULL
            WHERE merchant_id = p_merchant_id;

            RETURN jsonb_build_object(
                'status', 'invalid',
                'success', false, 
                'error', 'INVALID_PIN', 
                'remaining_attempts', 5 - v_new_attempts,
                'message', 'Incorrect PIN. Attempts remaining: ' || (5 - v_new_attempts)
            );
        END IF;
    END IF;
END;
$$;

REVOKE ALL ON FUNCTION private._internal_verify_and_track_mpin(UUID, TEXT) FROM anon, authenticated, PUBLIC;

-- 11. RPC: set_mpin (Rejects weak PINs; updates mpin_updated_at)
CREATE OR REPLACE FUNCTION public.set_mpin(p_new_pin TEXT, p_current_pin TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    v_merchant_id UUID;
    v_sec RECORD;
    v_verify_res JSONB;
BEGIN
    v_merchant_id := auth.uid();
    
    IF v_merchant_id IS NULL THEN
        RETURN jsonb_build_object('status', 'invalid', 'success', false, 'error', 'UNAUTHORIZED', 'message', 'Authentication required');
    END IF;

    IF p_new_pin !~ '^[0-9]{4,6}$' THEN
        RETURN jsonb_build_object('status', 'invalid', 'success', false, 'error', 'INVALID_FORMAT', 'message', 'MPIN must be 4 to 6 digits');
    END IF;

    -- Reject weak / trivial PIN patterns
    IF p_new_pin IN (
        '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999',
        '1234', '4321', '0123', '3210', '9876', '6789', '1122', '2211', '1212', '2121'
    ) THEN
        RETURN jsonb_build_object('status', 'invalid', 'success', false, 'error', 'WEAK_PIN', 'message', 'This PIN is too simple. Please choose a stronger 4-digit PIN.');
    END IF;

    SELECT * INTO v_sec
    FROM public.merchant_secrets
    WHERE merchant_id = v_merchant_id;

    IF FOUND AND v_sec.mpin_hash IS NOT NULL THEN
        IF p_current_pin IS NULL THEN
            RETURN jsonb_build_object('status', 'invalid', 'success', false, 'error', 'CURRENT_PIN_REQUIRED', 'message', 'Current MPIN is required to change PIN');
        END IF;

        v_verify_res := private._internal_verify_and_track_mpin(v_merchant_id, p_current_pin);
        IF (v_verify_res->>'success')::boolean IS NOT TRUE THEN
            RETURN v_verify_res;
        END IF;
    END IF;

    INSERT INTO public.merchant_secrets (merchant_id, mpin_hash, mpin_failed_attempts, mpin_locked_until, mpin_updated_at)
    VALUES (v_merchant_id, crypt(p_new_pin, gen_salt('bf', 10)), 0, NULL, NOW())
    ON CONFLICT (merchant_id) DO UPDATE
    SET 
        mpin_hash = crypt(p_new_pin, gen_salt('bf', 10)),
        mpin_failed_attempts = 0,
        mpin_locked_until = NULL,
        mpin_updated_at = NOW();

    RETURN jsonb_build_object('status', 'ok', 'success', true, 'message', 'MPIN configured successfully');
END;
$$;

-- 12. RPC: verify_mpin
CREATE OR REPLACE FUNCTION public.verify_mpin(p_pin TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    v_merchant_id UUID;
BEGIN
    v_merchant_id := auth.uid();
    
    IF v_merchant_id IS NULL THEN
        RETURN jsonb_build_object('status', 'invalid', 'success', false, 'error', 'UNAUTHORIZED', 'message', 'Authentication required');
    END IF;

    RETURN private._internal_verify_and_track_mpin(v_merchant_id, p_pin);
END;
$$;

-- 13. RPC: reset_mpin (Gated on recent OTP authentication via JWT amr claim within 5 minutes)
CREATE OR REPLACE FUNCTION public.reset_mpin(p_new_pin TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    v_merchant_id UUID;
    v_has_recent_otp BOOLEAN := FALSE;
    v_amr_elem JSONB;
    v_current_epoch BIGINT;
BEGIN
    v_merchant_id := auth.uid();
    
    IF v_merchant_id IS NULL THEN
        RETURN jsonb_build_object('status', 'invalid', 'success', false, 'error', 'UNAUTHORIZED', 'message', 'Authentication required');
    END IF;

    v_current_epoch := extract(epoch from NOW())::bigint;

    -- Validate recent OTP in JWT amr (Authentication Method Reference) claim within 300 seconds
    IF auth.jwt() ? 'amr' AND jsonb_typeof(auth.jwt()->'amr') = 'array' THEN
        FOR v_amr_elem IN SELECT * FROM jsonb_array_elements(auth.jwt()->'amr')
        LOOP
            IF jsonb_typeof(v_amr_elem) = 'object' THEN
                IF (v_amr_elem->>'method' IN ('otp', 'sms'))
                   AND (
                       (v_amr_elem->>'timestamp' IS NOT NULL AND (v_current_epoch - (v_amr_elem->>'timestamp')::bigint) <= 300)
                       OR (auth.jwt()->>'auth_time' IS NOT NULL AND (v_current_epoch - (auth.jwt()->>'auth_time')::bigint) <= 300)
                   ) THEN
                    v_has_recent_otp := TRUE;
                    EXIT;
                END IF;
            ELSIF jsonb_typeof(v_amr_elem) = 'string' THEN
                IF v_amr_elem#>>'{}' IN ('otp', 'sms') THEN
                    IF (auth.jwt()->>'auth_time' IS NOT NULL AND (v_current_epoch - (auth.jwt()->>'auth_time')::bigint) <= 300) THEN
                        v_has_recent_otp := TRUE;
                        EXIT;
                    END IF;
                END IF;
            END IF;
        END LOOP;
    END IF;

    IF NOT v_has_recent_otp THEN
        RETURN jsonb_build_object(
            'status', 'invalid',
            'success', false,
            'error', 'STALE_SESSION',
            'message', 'Recent OTP authentication required to reset MPIN. Please re-authenticate via SMS OTP.'
        );
    END IF;

    -- Reject weak PINs
    IF p_new_pin !~ '^[0-9]{4,6}$' OR p_new_pin IN (
        '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999',
        '1234', '4321', '0123', '3210', '9876', '6789', '1122', '2211', '1212', '2121'
    ) THEN
        RETURN jsonb_build_object('status', 'invalid', 'success', false, 'error', 'WEAK_PIN', 'message', 'New PIN is invalid or too simple.');
    END IF;

    INSERT INTO public.merchant_secrets (merchant_id, mpin_hash, mpin_failed_attempts, mpin_locked_until, mpin_updated_at)
    VALUES (v_merchant_id, crypt(p_new_pin, gen_salt('bf', 10)), 0, NULL, NOW())
    ON CONFLICT (merchant_id) DO UPDATE
    SET 
        mpin_hash = crypt(p_new_pin, gen_salt('bf', 10)),
        mpin_failed_attempts = 0,
        mpin_locked_until = NULL,
        mpin_updated_at = NOW();

    RETURN jsonb_build_object('status', 'ok', 'success', true, 'message', 'MPIN reset successfully');
END;
$$;

-- 14. RPC: mpin_status (Returns 'set' or 'not_set' for current authenticated user)
CREATE OR REPLACE FUNCTION public.mpin_status()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    v_merchant_id UUID;
    v_hash TEXT;
BEGIN
    v_merchant_id := auth.uid();
    
    IF v_merchant_id IS NULL THEN
        RETURN 'not_set';
    END IF;

    SELECT mpin_hash INTO v_hash
    FROM public.merchant_secrets
    WHERE merchant_id = v_merchant_id;

    IF v_hash IS NOT NULL THEN
        RETURN 'set';
    ELSE
        RETURN 'not_set';
    END IF;
END;
$$;

-- Grant execution permissions
REVOKE EXECUTE ON FUNCTION public.set_mpin(TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_mpin(TEXT, TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.verify_mpin(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.verify_mpin(TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.reset_mpin(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reset_mpin(TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.mpin_status() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mpin_status() TO authenticated;

COMMIT;
