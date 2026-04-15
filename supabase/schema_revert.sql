-- ============================================================
-- SCHEMA REVERT SCRIPT (FIXED)
-- Run this in the WRONG database to undo the StudyTrack tables
-- ============================================================

-- 1. Drop tables (Cascade handles foreign keys and policies attached to them)
DROP TABLE IF EXISTS public.site_stats CASCADE;
DROP TABLE IF EXISTS public.developers CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.academic_years CASCADE;
DROP TABLE IF EXISTS public.colleges CASCADE;
DROP TABLE IF EXISTS public.branches CASCADE;
DROP TABLE IF EXISTS public.study_sessions CASCADE;
DROP TABLE IF EXISTS public.topics CASCADE;
DROP TABLE IF EXISTS public.modules CASCADE;
DROP TABLE IF EXISTS public.subjects CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop university template tables
DROP TABLE IF EXISTS public.university_topics CASCADE;
DROP TABLE IF EXISTS public.university_modules CASCADE;
DROP TABLE IF EXISTS public.university_subjects CASCADE;
DROP TABLE IF EXISTS public.universities CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;

-- 2. Drop triggers and functions using CASCADE
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin_user() CASCADE;

-- 3. Clean up any residual policies that belonged to StudyTrack tables
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN (SELECT pol.polname, cl.relname 
              FROM pg_policy pol 
              JOIN pg_class cl ON pol.polrelid = cl.oid 
              JOIN pg_namespace ns ON cl.relnamespace = ns.oid 
              WHERE ns.nspname = 'public') 
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', rec.polname, rec.relname);
  END LOOP;
END;
$$;
