-- ============================================================
-- FIX: RLS INSERT Policies for user-owned tables
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- This fixes "new row violates row-level security policy" error
-- ============================================================

-- Drop the broad FOR ALL policies and replace with explicit ones
-- that include WITH CHECK for INSERT operations.

-- SUBJECTS
DROP POLICY IF EXISTS "Users manage own subjects" ON public.subjects;

CREATE POLICY "Users select own subjects"
  ON public.subjects FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own subjects"
  ON public.subjects FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own subjects"
  ON public.subjects FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own subjects"
  ON public.subjects FOR DELETE USING (auth.uid() = user_id);


-- MODULES
DROP POLICY IF EXISTS "Users manage own modules" ON public.modules;

CREATE POLICY "Users select own modules"
  ON public.modules FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own modules"
  ON public.modules FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own modules"
  ON public.modules FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own modules"
  ON public.modules FOR DELETE USING (auth.uid() = user_id);


-- TOPICS
DROP POLICY IF EXISTS "Users manage own topics" ON public.topics;

CREATE POLICY "Users select own topics"
  ON public.topics FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own topics"
  ON public.topics FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own topics"
  ON public.topics FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own topics"
  ON public.topics FOR DELETE USING (auth.uid() = user_id);


-- STUDY SESSIONS
DROP POLICY IF EXISTS "Users manage own sessions" ON public.study_sessions;

CREATE POLICY "Users select own sessions"
  ON public.study_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own sessions"
  ON public.study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own sessions"
  ON public.study_sessions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own sessions"
  ON public.study_sessions FOR DELETE USING (auth.uid() = user_id);
