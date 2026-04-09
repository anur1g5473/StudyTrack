-- ============================================================
-- StudyTrack - Supabase Schema
-- Copy and paste this entire file into your Supabase SQL Editor
-- and click "Run".
-- ============================================================

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- Stores user profile info linked to Supabase Auth
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  reg_no TEXT NOT NULL UNIQUE,
  total_study_minutes INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_study_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUBJECTS TABLE
-- Each user can have multiple subjects
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  icon TEXT DEFAULT '📘',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MODULES TABLE
-- Each subject has multiple modules
-- ============================================================
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TOPICS TABLE
-- Each module has multiple topics
-- ============================================================
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

-- ============================================================
-- STUDY SESSIONS TABLE
-- Tracks each focus/study session (Pomodoro timer logs)
-- ============================================================
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

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Ensures users can only access their own data
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Subjects policies
CREATE POLICY "Users can manage own subjects"
  ON public.subjects FOR ALL
  USING (auth.uid() = user_id);

-- Modules policies
CREATE POLICY "Users can manage own modules"
  ON public.modules FOR ALL
  USING (auth.uid() = user_id);

-- Topics policies
CREATE POLICY "Users can manage own topics"
  ON public.topics FOR ALL
  USING (auth.uid() = user_id);

-- Study sessions policies
CREATE POLICY "Users can manage own sessions"
  ON public.study_sessions FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- FUNCTION: Auto-create profile on signup
-- This trigger fires when a new user signs up via Supabase Auth
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, reg_no)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'reg_no', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- FUNCTION: Update streak on study session insert
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_streak_on_session()
RETURNS TRIGGER AS $$
DECLARE
  v_last_date DATE;
  v_streak INTEGER;
BEGIN
  SELECT last_study_date, streak_days
    INTO v_last_date, v_streak
    FROM public.profiles
   WHERE id = NEW.user_id;

  IF v_last_date IS NULL THEN
    -- First session ever
    UPDATE public.profiles
       SET streak_days = 1,
           last_study_date = CURRENT_DATE,
           total_study_minutes = total_study_minutes + NEW.duration_minutes
     WHERE id = NEW.user_id;

  ELSIF v_last_date = CURRENT_DATE THEN
    -- Already studied today, just add minutes
    UPDATE public.profiles
       SET total_study_minutes = total_study_minutes + NEW.duration_minutes
     WHERE id = NEW.user_id;

  ELSIF v_last_date = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Consecutive day - extend streak
    UPDATE public.profiles
       SET streak_days = v_streak + 1,
           last_study_date = CURRENT_DATE,
           total_study_minutes = total_study_minutes + NEW.duration_minutes
     WHERE id = NEW.user_id;

  ELSE
    -- Streak broken
    UPDATE public.profiles
       SET streak_days = 1,
           last_study_date = CURRENT_DATE,
           total_study_minutes = total_study_minutes + NEW.duration_minutes
     WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_session_created ON public.study_sessions;
CREATE TRIGGER on_session_created
  AFTER INSERT ON public.study_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_streak_on_session();

-- ============================================================
-- DONE! Your StudyTrack database is ready.
-- ============================================================
