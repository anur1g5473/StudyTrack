-- ============================================================
-- StudyTrack - MASTER SCHEMA 
-- This file contains EVERYTHING (Schemas 1 through 7) combining all fixes.
-- It is completely safe to run and re-run.
-- If you reset your database, run this ONE file to get everything back.
-- ============================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the SAFE admin function (no recursion, no table lookups)
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT (auth.jwt() ->> 'email') = '25byb0101@studytrack.app';
$$;

-- ============================================================
-- 3. CREATE ALL TABLES (IF NOT EXISTS)
-- ============================================================

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  reg_no TEXT UNIQUE,
  total_study_minutes INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_study_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure schema3 columns are there if table already existed
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS branch TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS college_year TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS college_name TEXT DEFAULT '';

-- CORE STUDY TRACKING
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  icon TEXT DEFAULT '📘',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  study_minutes INTEGER DEFAULT 0,
  notes TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  module_id UUID REFERENCES public.modules(id) ON DELETE SET NULL,
  topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  session_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SYSTEM CONFIG & TEMPLATES (Schema 5)
CREATE TABLE IF NOT EXISTS public.universities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  location TEXT NOT NULL,
  emoji TEXT DEFAULT '🎓',
  color TEXT DEFAULT '#6366f1',
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.university_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id TEXT NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📘',
  color TEXT DEFAULT '#6366f1',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.university_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_subject_id UUID NOT NULL REFERENCES public.university_subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.university_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_module_id UUID NOT NULL REFERENCES public.university_modules(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  code TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.colleges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  location TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.academic_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  emoji TEXT NOT NULL,
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.developers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  github_profile VARCHAR(255),
  linkedin_profile VARCHAR(255),
  bio TEXT,
  image_url TEXT,
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  contributions TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. ENABLE RLS (Row Level Security)
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.university_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.university_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.university_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 5. RECREATE ALL POLICIES CLEANLY
-- ============================================================
-- Function to safely drop all policies for a table so we start fresh
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

-- PROFILES (Users can read/update their own, Admins can read/update/delete all)
CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users and Admins view profiles" 
  ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin_user());

CREATE POLICY "Users and Admins update profiles" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin_user());

CREATE POLICY "Admins can delete profiles" 
  ON public.profiles FOR DELETE USING (public.is_admin_user());

-- CORE STUDY DATA (User access only)
CREATE POLICY "Users manage own subjects" 
  ON public.subjects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own modules" 
  ON public.modules FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own topics" 
  ON public.topics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own sessions" 
  ON public.study_sessions FOR ALL USING (auth.uid() = user_id);

-- SYSTEM DATA (Public read, Admin all)
CREATE POLICY "Public read universities" ON public.universities FOR SELECT USING (true);
CREATE POLICY "Admin manage universities" ON public.universities FOR ALL USING (public.is_admin_user());

CREATE POLICY "Public read univ_subjects" ON public.university_subjects FOR SELECT USING (true);
CREATE POLICY "Admin manage univ_subjects" ON public.university_subjects FOR ALL USING (public.is_admin_user());

CREATE POLICY "Public read univ_modules" ON public.university_modules FOR SELECT USING (true);
CREATE POLICY "Admin manage univ_modules" ON public.university_modules FOR ALL USING (public.is_admin_user());

CREATE POLICY "Public read univ_topics" ON public.university_topics FOR SELECT USING (true);
CREATE POLICY "Admin manage univ_topics" ON public.university_topics FOR ALL USING (public.is_admin_user());

CREATE POLICY "Public read branches" ON public.branches FOR SELECT USING (true);
CREATE POLICY "Admin manage branches" ON public.branches FOR ALL USING (public.is_admin_user());

CREATE POLICY "Public read colleges" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Admin manage colleges" ON public.colleges FOR ALL USING (public.is_admin_user());

CREATE POLICY "Public read academic_years" ON public.academic_years FOR SELECT USING (true);
CREATE POLICY "Admin manage academic_years" ON public.academic_years FOR ALL USING (public.is_admin_user());

CREATE POLICY "Public read achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Admin manage achievements" ON public.achievements FOR ALL USING (public.is_admin_user());

CREATE POLICY "Public read developers" ON public.developers FOR SELECT USING (true);
CREATE POLICY "Admin manage developers" ON public.developers FOR ALL USING (public.is_admin_user());

-- ============================================================
-- 6. DATABASE TRIGGERS
-- ============================================================

-- A. Auto-create Profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, reg_no)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'reg_no', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- B. Update Streak Tracked
CREATE OR REPLACE FUNCTION public.update_streak_on_session()
RETURNS TRIGGER AS $$
DECLARE
  v_last_date DATE;
  v_streak INTEGER;
BEGIN
  SELECT last_study_date, streak_days INTO v_last_date, v_streak FROM public.profiles WHERE id = NEW.user_id;

  IF v_last_date IS NULL THEN
    UPDATE public.profiles SET streak_days = 1, last_study_date = CURRENT_DATE, total_study_minutes = total_study_minutes + NEW.duration_minutes WHERE id = NEW.user_id;
  ELSIF v_last_date = CURRENT_DATE THEN
    UPDATE public.profiles SET total_study_minutes = total_study_minutes + NEW.duration_minutes WHERE id = NEW.user_id;
  ELSIF v_last_date = CURRENT_DATE - INTERVAL '1 day' THEN
    UPDATE public.profiles SET streak_days = v_streak + 1, last_study_date = CURRENT_DATE, total_study_minutes = total_study_minutes + NEW.duration_minutes WHERE id = NEW.user_id;
  ELSE
    UPDATE public.profiles SET streak_days = 1, last_study_date = CURRENT_DATE, total_study_minutes = total_study_minutes + NEW.duration_minutes WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_session_created ON public.study_sessions;
CREATE TRIGGER on_session_created
  AFTER INSERT ON public.study_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_streak_on_session();

-- ============================================================
-- 7. SEED INITIAL DATA (Idempotent - Ignores if exists)
-- ============================================================

INSERT INTO public.branches (name, code, order_index) VALUES
  ('Computer Science Engineering', 'CSE', 1), ('Electronics & Communication', 'ECE', 2),
  ('Electrical & Electronics', 'EEE', 3), ('Information Technology', 'IT', 4),
  ('Mechanical Engineering', 'ME', 5), ('Civil Engineering', 'CE', 6),
  ('Chemical Engineering', 'CHE', 7) ON CONFLICT DO NOTHING;

INSERT INTO public.colleges (name, location, state) VALUES
  ('VIT Vellore', 'Vellore', 'Tamil Nadu'), ('VIT Chennai', 'Chennai', 'Tamil Nadu'),
  ('VIT AP', 'Andhra Pradesh', 'Andhra Pradesh'), ('VIT Bhopal', 'Bhopal', 'Madhya Pradesh'),
  ('BITS Pilani', 'Pilani', 'Rajasthan'), ('IIT Madras', 'Chennai', 'Tamil Nadu') ON CONFLICT DO NOTHING;

INSERT INTO public.academic_years (name, display_name, order_index) VALUES
  ('1st-year', '1st Year', 1), ('2nd-year', '2nd Year', 2),
  ('3rd-year', '3rd Year', 3), ('4th-year', '4th Year', 4) ON CONFLICT DO NOTHING;

INSERT INTO public.achievements (title, description, emoji, condition_type, condition_value, display_order) VALUES
  ('First Step', 'Add your first subject', '📘', 'subjects_count', 1, 1),
  ('Getting Serious', 'Complete 5 topics', '⭐', 'topics_completed', 5, 2),
  ('Week Warrior', 'Maintain a 7-day streak', '🔥', 'streak_days', 7, 3),
  ('Study Marathon', 'Log 10+ hours total (600 minutes)', '⏱', 'total_minutes', 600, 4),
  ('Half Way There', 'Reach 50% overall progress', '🎯', 'progress_percent', 50, 5),
  ('Exam Ready', 'Complete all topics in a subject', '🏆', 'subject_completion', 1, 6) ON CONFLICT DO NOTHING;

-- ============================================================
-- 8. FIX EMAIL VERIFICATION FOR EXISTING USERS
-- ============================================================
UPDATE auth.users SET email_confirmed_at = NOW(), updated_at = NOW()
WHERE email LIKE '%@studytrack.app' AND email_confirmed_at IS NULL;

-- ============================================================
-- DONE! System is completely fully configured and ready.
-- ============================================================
