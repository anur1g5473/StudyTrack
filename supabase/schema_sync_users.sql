-- ============================================================
-- FIX: RE-LINK EXISTING USERS
-- Run this in Supabase SQL Editor
-- ============================================================

-- If you deleted/reset your tables, your Auth users still exist
-- but their profile rows were lost. This script re-creates
-- profile rows for every existing user so they can log in 
-- and edit their data again.

INSERT INTO public.profiles (id, reg_no, created_at)
SELECT 
  id, 
  UPPER(COALESCE(raw_user_meta_data->>'reg_no', split_part(email, '@', 1))),
  created_at
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Also fix any lowercase admin reg_no just in case
UPDATE public.profiles 
SET reg_no = '25BYB0101' 
WHERE UPPER(reg_no) = '25BYB0101';
