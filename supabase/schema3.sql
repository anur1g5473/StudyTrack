-- ============================================================
-- StudyTrack - Schema 3: User Profile Info Fields
-- Run this in Supabase SQL Editor
-- ============================================================

-- Add personal info columns to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS branch TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS college_year TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS college_name TEXT DEFAULT '';

-- ============================================================
-- DONE! The profile fields are now available.
-- ============================================================
