-- ============================================================
-- StudyTrack - Schema 2: Fix Email Confirmation
-- Run this in Supabase SQL Editor after running schema.sql
-- ============================================================

-- Confirm ALL existing unconfirmed @studytrack.app users
-- so you can log in without email verification
UPDATE auth.users
SET
  email_confirmed_at = NOW(),
  updated_at = NOW()
WHERE
  email LIKE '%@studytrack.app'
  AND email_confirmed_at IS NULL;

-- ============================================================
-- ALSO: Go to Supabase Dashboard → Authentication → Providers
--       → Email → Turn OFF "Confirm email" to prevent this
--       issue for all future signups.
-- ============================================================
