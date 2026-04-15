-- ═══════════════════════════════════════════════════════════════
-- Schema 7 (v3): Admin Security Fix — Zero Table Dependencies
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────
-- Step 1: Create admin-check function using JWT token directly.
-- auth.jwt() reads the logged-in user's token — NO table queries,
-- NO recursion risk, works 100% of the time.
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT (auth.jwt() ->> 'email') = '25byb0101@studytrack.app';
$$;

-- ─────────────────────────────────────────────────────────────
-- Step 2: Fix profiles policies (profiles table always exists)
-- Drop old recursive policies from schema6.sql and re-create
-- using the safe function above.
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admin can view all profiles"    ON public.profiles;
DROP POLICY IF EXISTS "Admin can update all profiles"  ON public.profiles;
DROP POLICY IF EXISTS "Admin can delete profiles"      ON public.profiles;
DROP POLICY IF EXISTS "Admin can update profiles"      ON public.profiles;

CREATE POLICY "Admin can view all profiles"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin_user());

CREATE POLICY "Admin can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admin can delete profiles"
  ON public.profiles FOR DELETE
  USING (public.is_admin_user());

-- ─────────────────────────────────────────────────────────────
-- Step 3: Fix policies for optional tables (schema5/schema4).
-- Each block is wrapped so it skips silently if the table
-- does not exist yet — safe to run even if schema5 wasn't run.
-- ─────────────────────────────────────────────────────────────
DO $$
BEGIN
  -- developers (schema4)
  BEGIN
    DROP POLICY IF EXISTS "Admins can manage developers" ON public.developers;
    EXECUTE $p$
      CREATE POLICY "Admins can manage developers"
        ON public.developers FOR ALL
        USING (public.is_admin_user());
    $p$;
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'developers table not found — skipping.';
  END;

  -- universities (schema5)
  BEGIN
    DROP POLICY IF EXISTS "Admins can manage universities" ON public.universities;
    EXECUTE $p$
      CREATE POLICY "Admins can manage universities"
        ON public.universities FOR ALL
        USING (public.is_admin_user())
        WITH CHECK (public.is_admin_user());
    $p$;
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'universities table not found — skipping.';
  END;

  -- university_subjects (schema5)
  BEGIN
    DROP POLICY IF EXISTS "Admins can manage university subjects" ON public.university_subjects;
    EXECUTE $p$
      CREATE POLICY "Admins can manage university subjects"
        ON public.university_subjects FOR ALL
        USING (public.is_admin_user())
        WITH CHECK (public.is_admin_user());
    $p$;
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'university_subjects table not found — skipping.';
  END;

  -- university_modules (schema5)
  BEGIN
    DROP POLICY IF EXISTS "Admins can manage university modules" ON public.university_modules;
    EXECUTE $p$
      CREATE POLICY "Admins can manage university modules"
        ON public.university_modules FOR ALL
        USING (public.is_admin_user())
        WITH CHECK (public.is_admin_user());
    $p$;
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'university_modules table not found — skipping.';
  END;

  -- university_topics (schema5)
  BEGIN
    DROP POLICY IF EXISTS "Admins can manage university topics" ON public.university_topics;
    EXECUTE $p$
      CREATE POLICY "Admins can manage university topics"
        ON public.university_topics FOR ALL
        USING (public.is_admin_user())
        WITH CHECK (public.is_admin_user());
    $p$;
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'university_topics table not found — skipping.';
  END;

  -- branches (schema5)
  BEGIN
    DROP POLICY IF EXISTS "Admins can manage branches" ON public.branches;
    EXECUTE $p$
      CREATE POLICY "Admins can manage branches"
        ON public.branches FOR ALL
        USING (public.is_admin_user())
        WITH CHECK (public.is_admin_user());
    $p$;
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'branches table not found — skipping.';
  END;

  -- colleges (schema5)
  BEGIN
    DROP POLICY IF EXISTS "Admins can manage colleges" ON public.colleges;
    EXECUTE $p$
      CREATE POLICY "Admins can manage colleges"
        ON public.colleges FOR ALL
        USING (public.is_admin_user())
        WITH CHECK (public.is_admin_user());
    $p$;
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'colleges table not found — skipping.';
  END;

  -- academic_years (schema5)
  BEGIN
    DROP POLICY IF EXISTS "Admins can manage academic years" ON public.academic_years;
    EXECUTE $p$
      CREATE POLICY "Admins can manage academic years"
        ON public.academic_years FOR ALL
        USING (public.is_admin_user())
        WITH CHECK (public.is_admin_user());
    $p$;
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'academic_years table not found — skipping.';
  END;

  -- achievements (schema5)
  BEGIN
    DROP POLICY IF EXISTS "Admins can manage achievements" ON public.achievements;
    EXECUTE $p$
      CREATE POLICY "Admins can manage achievements"
        ON public.achievements FOR ALL
        USING (public.is_admin_user())
        WITH CHECK (public.is_admin_user());
    $p$;
  EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'achievements table not found — skipping.';
  END;
END;
$$;

-- ─────────────────────────────────────────────────────────────
-- Step 4: Ensure profile info columns exist (schema3 re-guard)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name    TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS branch       TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS college_year TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS college_name TEXT DEFAULT '';

-- ═══════════════════════════════════════════════════════════════
-- DONE! Admin security is now JWT-based — no table recursion.
-- ═══════════════════════════════════════════════════════════════
