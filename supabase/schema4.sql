-- Create developers table for StudyTrack
-- This table stores information about app developers and contributors

CREATE TABLE developers (
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

-- Add RLS policies for developers table
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;

-- Public read access to developers
CREATE POLICY "Anyone can view developers"
  ON developers FOR SELECT
  USING (true);

-- Only authenticated users who are admins can insert/update/delete developers
-- Admin check is done via profile.reg_no = '25BYB0101'
CREATE POLICY "Admins can manage developers"
  ON developers FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE reg_no = '25BYB0101'
    )
  );

-- Add index for faster queries
CREATE INDEX idx_developers_email ON developers(email);
CREATE INDEX idx_developers_github ON developers(github_profile);
CREATE INDEX idx_developers_is_active ON developers(is_active);

-- Insert sample developer data
INSERT INTO developers (name, role, email, github_profile, linkedin_profile, bio, skills, contributions, is_active)
VALUES (
  'Anura',
  'Full Stack Developer',
  'anura@studytrack.dev',
  'anur1g5473',
  'https://linkedin.com/in/anur1g5473',
  'Built and maintained StudyTrack platform with focus on user experience and admin features.',
  ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Vite'],
  'Core platform development, admin panel, templates system, authentication',
  true
);
