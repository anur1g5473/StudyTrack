-- ============================================================
-- StudyTrack — SYLLABUS SEED SCRIPT
-- Run this in: Supabase Dashboard → SQL Editor → New Query
--
-- This file lets you:
--   A) Add a University Template (visible to all users in Templates tab)
--   B) Add Subjects → Modules → Topics to that template
--   C) Optionally: Directly assign subjects to a specific user
-- ============================================================


-- ============================================================
-- SECTION A: ADD A UNIVERSITY TEMPLATE
-- Paste your university block and run. Safe to re-run (ON CONFLICT DO NOTHING).
-- ============================================================

INSERT INTO public.universities (id, name, short_name, location, emoji, color, description)
VALUES (
  'vit-vellore',                -- ← Change this ID (no spaces, kebab-case)
  'VIT Vellore',                -- ← Full university name
  'VIT',                        -- ← Short name shown on cards
  'Vellore, Tamil Nadu',        -- ← Location
  '🎓',                         -- ← Emoji icon
  '#6366f1',                    -- ← Brand color (hex)
  'Vellore Institute of Technology — B.Tech CSE Curriculum'
)
ON CONFLICT (id) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at  = NOW();


-- ============================================================
-- SECTION B: ADD SUBJECTS TO THE UNIVERSITY
-- Each subject maps to a "paper" or "course" in the semester.
-- ============================================================

INSERT INTO public.university_subjects (id, university_id, name, icon, color, order_index)
VALUES
  -- Subject 1
  (uuid_generate_v4(), 'vit-vellore', 'Discrete Mathematics & Linear Algebra', '📐', '#8b5cf6', 1),
  -- Subject 2
  (uuid_generate_v4(), 'vit-vellore', 'Data Structures & Algorithms',           '🧠', '#06b6d4', 2),
  -- Subject 3
  (uuid_generate_v4(), 'vit-vellore', 'Computer Networks',                       '🌐', '#10b981', 3),
  -- Subject 4
  (uuid_generate_v4(), 'vit-vellore', 'Database Management Systems',             '🗄️', '#f59e0b', 4),
  -- Subject 5
  (uuid_generate_v4(), 'vit-vellore', 'Operating Systems',                       '⚙️', '#ef4444', 5)
ON CONFLICT DO NOTHING;


-- ============================================================
-- SECTION C: ADD MODULES TO EACH SUBJECT
-- Each module is a "unit" or "chapter group" inside a subject.
-- ============================================================

-- ── Discrete Mathematics ─────────────────────────────────────
WITH subj AS (SELECT id FROM public.university_subjects WHERE name = 'Discrete Mathematics & Linear Algebra' LIMIT 1)
INSERT INTO public.university_modules (university_subject_id, name, order_index)
SELECT subj.id, m.name, m.ord FROM subj,
(VALUES
  ('Set Theory & Logic',               1),
  ('Relations & Functions',            2),
  ('Graph Theory',                     3),
  ('Combinatorics & Probability',      4),
  ('Linear Algebra — Matrices',        5),
  ('Eigen Values & Transformations',   6)
) AS m(name, ord)
ON CONFLICT DO NOTHING;

-- ── Data Structures & Algorithms ─────────────────────────────
WITH subj AS (SELECT id FROM public.university_subjects WHERE name = 'Data Structures & Algorithms' LIMIT 1)
INSERT INTO public.university_modules (university_subject_id, name, order_index)
SELECT subj.id, m.name, m.ord FROM subj,
(VALUES
  ('Arrays & Strings',                 1),
  ('Linked Lists',                     2),
  ('Stacks & Queues',                  3),
  ('Trees & Binary Search Trees',      4),
  ('Heaps & Hashing',                  5),
  ('Graphs — BFS & DFS',               6),
  ('Sorting & Searching',              7),
  ('Dynamic Programming',              8)
) AS m(name, ord)
ON CONFLICT DO NOTHING;

-- ── Computer Networks ─────────────────────────────────────────
WITH subj AS (SELECT id FROM public.university_subjects WHERE name = 'Computer Networks' LIMIT 1)
INSERT INTO public.university_modules (university_subject_id, name, order_index)
SELECT subj.id, m.name, m.ord FROM subj,
(VALUES
  ('OSI & TCP/IP Model',               1),
  ('Physical & Data Link Layer',       2),
  ('Network Layer & IP Addressing',    3),
  ('Transport Layer — TCP/UDP',        4),
  ('Application Layer Protocols',      5),
  ('Network Security Basics',          6)
) AS m(name, ord)
ON CONFLICT DO NOTHING;

-- ── DBMS ──────────────────────────────────────────────────────
WITH subj AS (SELECT id FROM public.university_subjects WHERE name = 'Database Management Systems' LIMIT 1)
INSERT INTO public.university_modules (university_subject_id, name, order_index)
SELECT subj.id, m.name, m.ord FROM subj,
(VALUES
  ('ER Model & Schema Design',         1),
  ('Relational Model & Algebra',       2),
  ('SQL — DDL & DML',                  3),
  ('Normalization (1NF to BCNF)',       4),
  ('Transactions & Concurrency',       5),
  ('Indexing & Query Optimization',    6)
) AS m(name, ord)
ON CONFLICT DO NOTHING;

-- ── Operating Systems ─────────────────────────────────────────
WITH subj AS (SELECT id FROM public.university_subjects WHERE name = 'Operating Systems' LIMIT 1)
INSERT INTO public.university_modules (university_subject_id, name, order_index)
SELECT subj.id, m.name, m.ord FROM subj,
(VALUES
  ('OS Structure & System Calls',      1),
  ('Process Management',               2),
  ('CPU Scheduling Algorithms',        3),
  ('Deadlock Detection & Prevention',  4),
  ('Memory Management & Paging',       5),
  ('Virtual Memory & Page Replacement',6),
  ('File Systems',                     7)
) AS m(name, ord)
ON CONFLICT DO NOTHING;


-- ============================================================
-- SECTION D: ADD TOPICS TO EACH MODULE
-- Each topic is an individual lesson/concept to track.
-- ============================================================

-- ── DSA → Arrays & Strings ───────────────────────────────────
WITH mod AS (
  SELECT um.id FROM public.university_modules um
  JOIN public.university_subjects us ON um.university_subject_id = us.id
  WHERE us.name = 'Data Structures & Algorithms' AND um.name = 'Arrays & Strings' LIMIT 1
)
INSERT INTO public.university_topics (university_module_id, name, order_index)
SELECT mod.id, t.name, t.ord FROM mod,
(VALUES
  ('Array declaration & traversal',     1),
  ('Two-pointer technique',             2),
  ('Sliding window',                    3),
  ('Prefix sum',                        4),
  ('String manipulation basics',        5),
  ('KMP / Rabin-Karp',                  6)
) AS t(name, ord)
ON CONFLICT DO NOTHING;

-- ── DSA → Trees ──────────────────────────────────────────────
WITH mod AS (
  SELECT um.id FROM public.university_modules um
  JOIN public.university_subjects us ON um.university_subject_id = us.id
  WHERE us.name = 'Data Structures & Algorithms' AND um.name = 'Trees & Binary Search Trees' LIMIT 1
)
INSERT INTO public.university_topics (university_module_id, name, order_index)
SELECT mod.id, t.name, t.ord FROM mod,
(VALUES
  ('Binary Tree traversal (pre/in/post)', 1),
  ('Level order traversal (BFS)',         2),
  ('Height & diameter of tree',           3),
  ('BST insert & search',                 4),
  ('BST delete',                          5),
  ('AVL Trees & rotations',               6),
  ('Segment Trees',                       7)
) AS t(name, ord)
ON CONFLICT DO NOTHING;

-- ── OS → CPU Scheduling ──────────────────────────────────────
WITH mod AS (
  SELECT um.id FROM public.university_modules um
  JOIN public.university_subjects us ON um.university_subject_id = us.id
  WHERE us.name = 'Operating Systems' AND um.name = 'CPU Scheduling Algorithms' LIMIT 1
)
INSERT INTO public.university_topics (university_module_id, name, order_index)
SELECT mod.id, t.name, t.ord FROM mod,
(VALUES
  ('FCFS',           1),
  ('SJF',            2),
  ('SRTF',           3),
  ('Round Robin',    4),
  ('Priority Scheduling', 5),
  ('Multilevel Queue',    6)
) AS t(name, ord)
ON CONFLICT DO NOTHING;

-- (Add more modules/topics following the same pattern above ↑)


-- ============================================================
-- SECTION E: ASSIGN SUBJECTS DIRECTLY TO A SPECIFIC USER
-- Use this to skip "Apply Template" and directly seed a user's
-- personal study list. Find your user_id from auth.users.
-- ============================================================

-- Step 1: Find your user_id
-- SELECT id, email FROM auth.users WHERE email = 'your@email.com';

-- Step 2: Replace the UUID below with your actual user_id
DO $$
DECLARE
  v_user_id   UUID := 'PASTE-YOUR-USER-UUID-HERE';  -- ← replace this
  v_subj_id   UUID;
  v_mod_id    UUID;
BEGIN

  -- ── Add subject: DSA ──────────────────────────────────────
  INSERT INTO public.subjects (id, user_id, name, color, icon)
  VALUES (uuid_generate_v4(), v_user_id, 'Data Structures & Algorithms', '#06b6d4', '🧠')
  RETURNING id INTO v_subj_id;

  -- Module 1: Arrays
  INSERT INTO public.modules (id, subject_id, user_id, name, order_index)
  VALUES (uuid_generate_v4(), v_subj_id, v_user_id, 'Arrays & Strings', 1)
  RETURNING id INTO v_mod_id;

  INSERT INTO public.topics (module_id, user_id, name, order_index) VALUES
    (v_mod_id, v_user_id, 'Array traversal & declaration',  1),
    (v_mod_id, v_user_id, 'Two-pointer technique',          2),
    (v_mod_id, v_user_id, 'Sliding window',                 3),
    (v_mod_id, v_user_id, 'Prefix sum',                     4),
    (v_mod_id, v_user_id, 'String manipulation basics',     5);

  -- Module 2: Trees
  INSERT INTO public.modules (id, subject_id, user_id, name, order_index)
  VALUES (uuid_generate_v4(), v_subj_id, v_user_id, 'Trees & BST', 2)
  RETURNING id INTO v_mod_id;

  INSERT INTO public.topics (module_id, user_id, name, order_index) VALUES
    (v_mod_id, v_user_id, 'Binary Tree traversals',         1),
    (v_mod_id, v_user_id, 'Level order BFS',                2),
    (v_mod_id, v_user_id, 'BST insert / search / delete',   3),
    (v_mod_id, v_user_id, 'AVL Trees & rotations',          4);

  -- ── Add subject: Operating Systems ───────────────────────
  INSERT INTO public.subjects (id, user_id, name, color, icon)
  VALUES (uuid_generate_v4(), v_user_id, 'Operating Systems', '#ef4444', '⚙️')
  RETURNING id INTO v_subj_id;

  INSERT INTO public.modules (id, subject_id, user_id, name, order_index)
  VALUES (uuid_generate_v4(), v_subj_id, v_user_id, 'CPU Scheduling', 1)
  RETURNING id INTO v_mod_id;

  INSERT INTO public.topics (module_id, user_id, name, order_index) VALUES
    (v_mod_id, v_user_id, 'FCFS',               1),
    (v_mod_id, v_user_id, 'SJF / SRTF',         2),
    (v_mod_id, v_user_id, 'Round Robin',         3),
    (v_mod_id, v_user_id, 'Priority Scheduling', 4);

  RAISE NOTICE 'Done — subjects and topics seeded for user %', v_user_id;
END $$;


-- ============================================================
-- QUICK VERIFICATION QUERIES (run after seeding)
-- ============================================================

-- Check university templates
-- SELECT u.name, COUNT(us.id) AS subjects FROM universities u
-- LEFT JOIN university_subjects us ON us.university_id = u.id
-- GROUP BY u.name;

-- Check a user's subjects
-- SELECT s.name, COUNT(t.id) AS topics
-- FROM subjects s
-- LEFT JOIN modules m ON m.subject_id = s.id
-- LEFT JOIN topics t ON t.module_id = m.id
-- WHERE s.user_id = 'PASTE-YOUR-USER-UUID-HERE'
-- GROUP BY s.name;
