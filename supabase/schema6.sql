-- ═══════════════════════════════════════════════════════════════
-- Schema Amendment 6: Admin visibility for profiles
-- ═══════════════════════════════════════════════════════════════
-- IMPORTANT: Run this AFTER schema.sql to add admin policies
-- This allows admins to view and manage all user profiles in admin panel

-- ─────────────────────────────────────────────────────────────
-- Add admin SELECT policy to profiles table
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Admin can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE reg_no = '25BYB0101'
    )
  );

-- ─────────────────────────────────────────────────────────────
-- Add admin DELETE policy to profiles table (for user deletion)
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Admin can delete profiles"
  ON public.profiles FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE reg_no = '25BYB0101'
    )
  );

-- ─────────────────────────────────────────────────────────────
-- Add admin UPDATE policy to profiles table
-- ─────────────────────────────────────────────────────────────
CREATE POLICY "Admin can update profiles"
  ON public.profiles FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE reg_no = '25BYB0101'
    )
  );

-- ═══════════════════════════════════════════════════════════════
-- END OF SCHEMA AMENDMENT
-- ═══════════════════════════════════════════════════════════════
