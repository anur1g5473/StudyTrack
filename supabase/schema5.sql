-- ============================================================
-- StudyTrack - Schema 5: Dynamic Templates & System Config
-- Run this in Supabase SQL Editor after running schema1-4
-- ============================================================

-- ============================================================
-- UNIVERSITY TEMPLATES TABLE
-- Stores university/institution templates
-- ============================================================
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

-- ============================================================
-- UNIVERSITY SUBJECTS TABLE
-- Subjects in a university template
-- ============================================================
CREATE TABLE IF NOT EXISTS public.university_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id TEXT NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📘',
  color TEXT DEFAULT '#6366f1',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- UNIVERSITY MODULES TABLE
-- Modules within university subjects
-- ============================================================
CREATE TABLE IF NOT EXISTS public.university_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_subject_id UUID NOT NULL REFERENCES public.university_subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- UNIVERSITY TOPICS TABLE
-- Topics within university modules
-- ============================================================
CREATE TABLE IF NOT EXISTS public.university_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_module_id UUID NOT NULL REFERENCES public.university_modules(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BRANCHES TABLE
-- Engineering/course branches
-- ============================================================
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

-- ============================================================
-- COLLEGES TABLE
-- Educational institutions
-- ============================================================
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

-- ============================================================
-- ACADEMIC YEARS TABLE
-- Year/semester options
-- ============================================================
CREATE TABLE IF NOT EXISTS public.academic_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ACHIEVEMENTS TABLE
-- Achievement definitions & badges
-- ============================================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  emoji TEXT NOT NULL,
  condition_type TEXT NOT NULL,
  -- condition_type values: 'subjects_count', 'topics_completed', 'streak_days', 'total_minutes', 'progress_percent', 'subject_completion'
  condition_value INTEGER NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.university_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.university_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.university_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Everyone can read universities and their data
CREATE POLICY "Anyone can view universities"
  ON public.universities FOR SELECT USING (true);

CREATE POLICY "Anyone can view university subjects"
  ON public.university_subjects FOR SELECT USING (true);

CREATE POLICY "Anyone can view university modules"
  ON public.university_modules FOR SELECT USING (true);

CREATE POLICY "Anyone can view university topics"
  ON public.university_topics FOR SELECT USING (true);

CREATE POLICY "Anyone can view branches"
  ON public.branches FOR SELECT USING (true);

CREATE POLICY "Anyone can view colleges"
  ON public.colleges FOR SELECT USING (true);

CREATE POLICY "Anyone can view academic years"
  ON public.academic_years FOR SELECT USING (true);

CREATE POLICY "Anyone can view achievements"
  ON public.achievements FOR SELECT USING (true);

-- Only admins can modify system config
CREATE POLICY "Admins can manage universities"
  ON public.universities FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE reg_no = '25BYB0101'))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE reg_no = '25BYB0101'));

CREATE POLICY "Admins can manage university subjects"
  ON public.university_subjects FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE reg_no = '25BYB0101'))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE reg_no = '25BYB0101'));

CREATE POLICY "Admins can manage university modules"
  ON public.university_modules FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE reg_no = '25BYB0101'))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE reg_no = '25BYB0101'));

CREATE POLICY "Admins can manage university topics"
  ON public.university_topics FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE reg_no = '25BYB0101'))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE reg_no = '25BYB0101'));

CREATE POLICY "Admins can manage branches"
  ON public.branches FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE reg_no = '25BYB0101'))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE reg_no = '25BYB0101'));

CREATE POLICY "Admins can manage colleges"
  ON public.colleges FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE reg_no = '25BYB0101'))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE reg_no = '25BYB0101'));

CREATE POLICY "Admins can manage academic years"
  ON public.academic_years FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE reg_no = '25BYB0101'))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE reg_no = '25BYB0101'));

CREATE POLICY "Admins can manage achievements"
  ON public.achievements FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE reg_no = '25BYB0101'))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE reg_no = '25BYB0101'));

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_universities_active ON universities(is_active);
CREATE INDEX IF NOT EXISTS idx_university_subjects_university ON university_subjects(university_id);
CREATE INDEX IF NOT EXISTS idx_university_modules_subject ON university_modules(university_subject_id);
CREATE INDEX IF NOT EXISTS idx_university_topics_module ON university_topics(university_module_id);
CREATE INDEX IF NOT EXISTS idx_branches_active ON branches(is_active);
CREATE INDEX IF NOT EXISTS idx_colleges_active ON colleges(is_active);
CREATE INDEX IF NOT EXISTS idx_academic_years_active ON academic_years(is_active);
CREATE INDEX IF NOT EXISTS idx_achievements_active ON achievements(is_active);

-- ============================================================
-- SAMPLE DATA: BRANCHES
-- ============================================================
INSERT INTO public.branches (name, code, description, order_index) VALUES
  ('Computer Science Engineering', 'CSE', 'Computer Science & Engineering', 1),
  ('Electronics & Communication', 'ECE', 'Electronics & Communication Engineering', 2),
  ('Electrical & Electronics', 'EEE', 'Electrical & Electronics Engineering', 3),
  ('Information Technology', 'IT', 'Information Technology', 4),
  ('Mechanical Engineering', 'ME', 'Mechanical Engineering', 5),
  ('Civil Engineering', 'CE', 'Civil Engineering', 6),
  ('Chemical Engineering', 'CHE', 'Chemical Engineering', 7)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SAMPLE DATA: COLLEGES
-- ============================================================
INSERT INTO public.colleges (name, location, state) VALUES
  ('VIT Vellore', 'Vellore', 'Tamil Nadu'),
  ('VIT Chennai', 'Chennai', 'Tamil Nadu'),
  ('VIT AP', 'Andhra Pradesh', 'Andhra Pradesh'),
  ('VIT Bhopal', 'Bhopal', 'Madhya Pradesh'),
  ('BITS Pilani', 'Pilani', 'Rajasthan'),
  ('BITS Goa', 'Goa', 'Goa'),
  ('BITS Hyderabad', 'Hyderabad', 'Telangana'),
  ('IIT Madras', 'Chennai', 'Tamil Nadu'),
  ('IIT Bombay', 'Mumbai', 'Maharashtra'),
  ('IIT Delhi', 'Delhi', 'Delhi'),
  ('NIT Trichy', 'Tiruchirappalli', 'Tamil Nadu'),
  ('NIT Warangal', 'Warangal', 'Telangana'),
  ('NIT Surathkal', 'Surathkal', 'Karnataka'),
  ('Anna University', 'Chennai', 'Tamil Nadu'),
  ('SRM University', 'Chennai', 'Tamil Nadu'),
  ('Amrita Vishwa Vidyapeetham', 'Coimbatore', 'Tamil Nadu')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SAMPLE DATA: ACADEMIC YEARS
-- ============================================================
INSERT INTO public.academic_years (name, display_name, order_index) VALUES
  ('1st-year', '1st Year', 1),
  ('2nd-year', '2nd Year', 2),
  ('3rd-year', '3rd Year', 3),
  ('4th-year', '4th Year', 4)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SAMPLE DATA: ACHIEVEMENTS
-- ============================================================
INSERT INTO public.achievements (title, description, emoji, condition_type, condition_value, display_order) VALUES
  ('First Step', 'Add your first subject', '📘', 'subjects_count', 1, 1),
  ('Getting Serious', 'Complete 5 topics', '⭐', 'topics_completed', 5, 2),
  ('Week Warrior', 'Maintain a 7-day streak', '🔥', 'streak_days', 7, 3),
  ('Study Marathon', 'Log 10+ hours total (600 minutes)', '⏱', 'total_minutes', 600, 4),
  ('Half Way There', 'Reach 50% overall progress', '🎯', 'progress_percent', 50, 5),
  ('Exam Ready', 'Complete all topics in a subject', '🏆', 'subject_completion', 1, 6)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SAMPLE DATA: VIT VELLORE UNIVERSITY TEMPLATE
-- ============================================================

-- Insert university
INSERT INTO public.universities (id, name, short_name, location, emoji, color) VALUES
  ('vit-vellore', 'VIT Vellore', 'VIT', 'Vellore, TN', '🎓', '#6366f1')
ON CONFLICT DO NOTHING;

-- Insert subjects for VIT
INSERT INTO public.university_subjects (university_id, name, icon, color, order_index) VALUES
  ('vit-vellore', 'Applied Chemistry', '🔬', '#06b6d4', 1),
  ('vit-vellore', 'Discrete Mathematics & Linear Algebra', '🧮', '#8b5cf6', 2),
  ('vit-vellore', 'Operating Systems', '💻', '#f59e0b', 3),
  ('vit-vellore', 'Data Structures & Algorithms', '📊', '#10b981', 4)
ON CONFLICT DO NOTHING;

-- Note: Insert modules and topics using separate statements with proper references
-- You can add them manually or via API after getting the subject IDs

-- ============================================================
-- DONE! All configuration tables are ready.
-- ============================================================
