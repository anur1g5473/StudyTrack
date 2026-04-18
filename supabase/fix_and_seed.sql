-- ============================================================
-- StudyTrack — ALL-IN-ONE FIX + SEED
-- Run this ONCE in: Supabase Dashboard → SQL Editor → New Query
-- This fixes everything:
--   1. Adds missing columns to university tables
--   2. Fixes RLS INSERT policies (user subject add was blocked)
--   3. Seeds VIT Vellore template data
-- ============================================================


-- ============================================================
-- PART 1: ADD MISSING COLUMNS (safe, IF NOT EXISTS)
-- ============================================================

ALTER TABLE public.university_subjects
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.university_modules
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.university_topics
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.universities
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS short_name TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();


-- ============================================================
-- PART 2: FIX RLS — Add WITH CHECK for INSERT on user tables
-- (This is why normal users couldn't add subjects)
-- ============================================================

-- SUBJECTS
DROP POLICY IF EXISTS "Users manage own subjects" ON public.subjects;
DROP POLICY IF EXISTS "Users select own subjects"  ON public.subjects;
DROP POLICY IF EXISTS "Users insert own subjects"  ON public.subjects;
DROP POLICY IF EXISTS "Users update own subjects"  ON public.subjects;
DROP POLICY IF EXISTS "Users delete own subjects"  ON public.subjects;

CREATE POLICY "Users select own subjects" ON public.subjects
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own subjects" ON public.subjects
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own subjects" ON public.subjects
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own subjects" ON public.subjects
  FOR DELETE USING (auth.uid() = user_id);


-- MODULES
DROP POLICY IF EXISTS "Users manage own modules" ON public.modules;
DROP POLICY IF EXISTS "Users select own modules"  ON public.modules;
DROP POLICY IF EXISTS "Users insert own modules"  ON public.modules;
DROP POLICY IF EXISTS "Users update own modules"  ON public.modules;
DROP POLICY IF EXISTS "Users delete own modules"  ON public.modules;

CREATE POLICY "Users select own modules" ON public.modules
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own modules" ON public.modules
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own modules" ON public.modules
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own modules" ON public.modules
  FOR DELETE USING (auth.uid() = user_id);


-- TOPICS
DROP POLICY IF EXISTS "Users manage own topics" ON public.topics;
DROP POLICY IF EXISTS "Users select own topics"  ON public.topics;
DROP POLICY IF EXISTS "Users insert own topics"  ON public.topics;
DROP POLICY IF EXISTS "Users update own topics"  ON public.topics;
DROP POLICY IF EXISTS "Users delete own topics"  ON public.topics;

CREATE POLICY "Users select own topics" ON public.topics
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own topics" ON public.topics
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own topics" ON public.topics
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own topics" ON public.topics
  FOR DELETE USING (auth.uid() = user_id);


-- STUDY SESSIONS
DROP POLICY IF EXISTS "Users manage own sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "Users select own sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "Users insert own sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "Users update own sessions" ON public.study_sessions;
DROP POLICY IF EXISTS "Users delete own sessions" ON public.study_sessions;

CREATE POLICY "Users select own sessions" ON public.study_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own sessions" ON public.study_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own sessions" ON public.study_sessions
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own sessions" ON public.study_sessions
  FOR DELETE USING (auth.uid() = user_id);


-- ============================================================
-- PART 3: SEED VIT VELLORE TEMPLATE
-- ============================================================

-- University
INSERT INTO public.universities (id, name, short_name, location, emoji, color, description, is_active)
VALUES ('vit-vellore', 'VIT Vellore', 'VIT', 'Vellore, TN', '🎓', '#6366f1',
        'Vellore Institute of Technology — B.Tech Curriculum', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();


-- Subjects (stable UUIDs so topics can reference them)
INSERT INTO public.university_subjects (id, university_id, name, icon, color, order_index)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'vit-vellore', 'Applied Chemistry',                     '🔬', '#06b6d4', 1),
  ('a1000000-0000-0000-0000-000000000002', 'vit-vellore', 'Discrete Mathematics & Linear Algebra', '🧮', '#8b5cf6', 2),
  ('a1000000-0000-0000-0000-000000000003', 'vit-vellore', 'Operating Systems',                     '💻', '#f59e0b', 3),
  ('a1000000-0000-0000-0000-000000000004', 'vit-vellore', 'Data Structures & Algorithms',          '📊', '#10b981', 4)
ON CONFLICT (id) DO NOTHING;


-- Modules
INSERT INTO public.university_modules (id, university_subject_id, name, order_index) VALUES
  -- Applied Chemistry
  ('b1000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000001','Module 1: Chemical Thermodynamics & Kinetics',1),
  ('b1000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000001','Module 2: Energy Devices',2),
  ('b1000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000001','Module 3: Functional Materials',3),
  ('b1000000-0000-0000-0000-000000000004','a1000000-0000-0000-0000-000000000001','Module 4: Spectroscopy & Diffraction',4),
  ('b1000000-0000-0000-0000-000000000005','a1000000-0000-0000-0000-000000000001','Module 5: Computational Chemistry',5),
  ('b1000000-0000-0000-0000-000000000006','a1000000-0000-0000-0000-000000000001','Module 6: Contemporary Topics',6),
  -- Discrete Maths
  ('b2000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000002','Module 1: Mathematical Logic',1),
  ('b2000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000002','Module 2: Counting Techniques',2),
  ('b2000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000002','Module 3: Algebraic Structures & Lattices',3),
  ('b2000000-0000-0000-0000-000000000004','a1000000-0000-0000-0000-000000000002','Module 4: Vector Spaces & Linear Transformations',4),
  ('b2000000-0000-0000-0000-000000000005','a1000000-0000-0000-0000-000000000002','Module 5: Inner Product Spaces',5),
  ('b2000000-0000-0000-0000-000000000006','a1000000-0000-0000-0000-000000000002','Module 6: Contemporary Topics',6),
  -- OS
  ('b3000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000003','Module 1: OS Basics & Structure',1),
  ('b3000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000003','Module 2: Processes, Scheduling & Deadlocks',2),
  ('b3000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000003','Module 3: Process Synchronization',3),
  ('b3000000-0000-0000-0000-000000000004','a1000000-0000-0000-0000-000000000003','Module 4: Memory & File Management',4),
  ('b3000000-0000-0000-0000-000000000005','a1000000-0000-0000-0000-000000000003','Module 5: Devices, Security & Virtualization',5),
  ('b3000000-0000-0000-0000-000000000006','a1000000-0000-0000-0000-000000000003','Module 6: Contemporary Issues',6),
  -- DSA
  ('b4000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000004','Module 1: Algorithm Analysis',1),
  ('b4000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000004','Module 2: Data Structures',2),
  ('b4000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000004','Module 3: Divide & Conquer / Backtracking / Branch & Bound',3),
  ('b4000000-0000-0000-0000-000000000004','a1000000-0000-0000-0000-000000000004','Module 4: Greedy & Dynamic Programming',4),
  ('b4000000-0000-0000-0000-000000000005','a1000000-0000-0000-0000-000000000004','Module 5: Complexity & Approximation',5)
ON CONFLICT (id) DO NOTHING;


-- Topics
INSERT INTO public.university_topics (university_module_id, name, order_index) VALUES
  -- Chem M1
  ('b1000000-0000-0000-0000-000000000001','Thermodynamics',1),
  ('b1000000-0000-0000-0000-000000000001','Zeroth, First, Second, Third Laws',2),
  ('b1000000-0000-0000-0000-000000000001','Enthalpy, Heat Capacity',3),
  ('b1000000-0000-0000-0000-000000000001','Carnot Cycle',4),
  ('b1000000-0000-0000-0000-000000000001','Gibbs Helmholtz Equation',5),
  ('b1000000-0000-0000-0000-000000000001','Rate Equation, Order',6),
  ('b1000000-0000-0000-0000-000000000001','Integral Rate Equations',7),
  ('b1000000-0000-0000-0000-000000000001','Half-life, Molecularity',8),
  ('b1000000-0000-0000-0000-000000000001','Collision Theory',9),
  ('b1000000-0000-0000-0000-000000000001','Temperature & Catalyst Effects',10),
  -- Chem M2
  ('b1000000-0000-0000-0000-000000000002','Electrochemical & Electrolytic Cells',1),
  ('b1000000-0000-0000-0000-000000000002','Batteries (Li-ion)',2),
  ('b1000000-0000-0000-0000-000000000002','Fuel Cells (H2-O2, SOFC)',3),
  ('b1000000-0000-0000-0000-000000000002','Solar Cells',4),
  ('b1000000-0000-0000-0000-000000000002','Photovoltaic',5),
  ('b1000000-0000-0000-0000-000000000002','Photoelectrochemical',6),
  ('b1000000-0000-0000-0000-000000000002','Dye-sensitized Solar Cells',7),
  -- Chem M3
  ('b1000000-0000-0000-0000-000000000003','Metals, Semiconductors, Insulators, Superconductors',1),
  ('b1000000-0000-0000-0000-000000000003','Para, Dia, Ferro, Anti-ferro Magnetic Materials',2),
  ('b1000000-0000-0000-0000-000000000003','Liquid Cooling',3),
  ('b1000000-0000-0000-0000-000000000003','Top-down & Bottom-up Nanomaterials',4),
  ('b1000000-0000-0000-0000-000000000003','Quantum Dots',5),
  -- Chem M4
  ('b1000000-0000-0000-0000-000000000004','UV-Visible Spectroscopy',1),
  ('b1000000-0000-0000-0000-000000000004','X-Ray Diffraction (XRD)',2),
  ('b1000000-0000-0000-0000-000000000004','Instrumentation & Applications',3),
  ('b1000000-0000-0000-0000-000000000004','Crystallite Size',4),
  -- Chem M5
  ('b1000000-0000-0000-0000-000000000005','Quantum Calculations',1),
  ('b1000000-0000-0000-0000-000000000005','Molecular Orbital Theory',2),
  ('b1000000-0000-0000-0000-000000000005','Potential Energy Surface',3),
  ('b1000000-0000-0000-0000-000000000005','Geometry Optimization',4),
  ('b1000000-0000-0000-0000-000000000005','Reaction Mechanism',5),
  ('b1000000-0000-0000-0000-000000000005','AI in Material Screening',6),
  -- Chem M6
  ('b1000000-0000-0000-0000-000000000006','Contemporary Topics in Chemistry',1),
  -- DM M1
  ('b2000000-0000-0000-0000-000000000001','Statements, Connectives',1),
  ('b2000000-0000-0000-0000-000000000001','Tautologies, Equivalence',2),
  ('b2000000-0000-0000-0000-000000000001','Implications, Normal Forms',3),
  ('b2000000-0000-0000-0000-000000000001','Predicate Calculus',4),
  ('b2000000-0000-0000-0000-000000000001','Inference Theory',5),
  -- DM M2
  ('b2000000-0000-0000-0000-000000000002','Basic Counting',1),
  ('b2000000-0000-0000-0000-000000000002','Pigeonhole Principle',2),
  ('b2000000-0000-0000-0000-000000000002','Permutations & Combinations',3),
  ('b2000000-0000-0000-0000-000000000002','Inclusion-Exclusion',4),
  ('b2000000-0000-0000-0000-000000000002','Recurrence Relations',5),
  ('b2000000-0000-0000-0000-000000000002','Generating Functions',6),
  -- DM M3
  ('b2000000-0000-0000-0000-000000000003','Groups, Subgroups',1),
  ('b2000000-0000-0000-0000-000000000003','Lagrange Theorem',2),
  ('b2000000-0000-0000-0000-000000000003','Homomorphism',3),
  ('b2000000-0000-0000-0000-000000000003','Posets & Lattices',4),
  ('b2000000-0000-0000-0000-000000000003','Hasse Diagram',5),
  ('b2000000-0000-0000-0000-000000000003','Boolean Algebra',6),
  -- DM M4
  ('b2000000-0000-0000-0000-000000000004','Vector Space, Subspace',1),
  ('b2000000-0000-0000-0000-000000000004','Linear Independence, Basis',2),
  ('b2000000-0000-0000-0000-000000000004','Row, Column, Null Space',3),
  ('b2000000-0000-0000-0000-000000000004','Rank-Nullity Theorem',4),
  ('b2000000-0000-0000-0000-000000000004','Linear Transformations',5),
  ('b2000000-0000-0000-0000-000000000004','Change of Basis',6),
  -- DM M5
  ('b2000000-0000-0000-0000-000000000005','Dot Product, Length, Angle',1),
  ('b2000000-0000-0000-0000-000000000005','Gram-Schmidt Process',2),
  ('b2000000-0000-0000-0000-000000000005','Orthonormal Basis',3),
  ('b2000000-0000-0000-0000-000000000005','Quadratic Forms',4),
  -- DM M6
  ('b2000000-0000-0000-0000-000000000006','Contemporary Topics in Mathematics',1),
  -- OS M1
  ('b3000000-0000-0000-0000-000000000001','OS Concepts & History',1),
  ('b3000000-0000-0000-0000-000000000001','OS Structures (Monolithic, Microkernel)',2),
  ('b3000000-0000-0000-0000-000000000001','System Calls',3),
  ('b3000000-0000-0000-0000-000000000001','Interrupts',4),
  ('b3000000-0000-0000-0000-000000000001','OS Design & Booting',5),
  -- OS M2
  ('b3000000-0000-0000-0000-000000000002','Process States & Operations',1),
  ('b3000000-0000-0000-0000-000000000002','Threads & Multithreading',2),
  ('b3000000-0000-0000-0000-000000000002','FCFS, SJF, Priority Scheduling',3),
  ('b3000000-0000-0000-0000-000000000002','Round Robin, SRTF',4),
  ('b3000000-0000-0000-0000-000000000002','Resource Allocation Graph (RAG)',5),
  ('b3000000-0000-0000-0000-000000000002','Deadlock Prevention & Handling',6),
  -- OS M3
  ('b3000000-0000-0000-0000-000000000003','IPC (Shared Memory, Message Passing)',1),
  ('b3000000-0000-0000-0000-000000000003','Critical Section Problem',2),
  ('b3000000-0000-0000-0000-000000000003','Peterson, Bakery Algorithm',3),
  ('b3000000-0000-0000-0000-000000000003','Mutex, Semaphores',4),
  ('b3000000-0000-0000-0000-000000000003','Dining Philosophers Problem',5),
  ('b3000000-0000-0000-0000-000000000003','Readers-Writers Problem',6),
  -- OS M4
  ('b3000000-0000-0000-0000-000000000004','Memory Allocation',1),
  ('b3000000-0000-0000-0000-000000000004','Paging, Segmentation',2),
  ('b3000000-0000-0000-0000-000000000004','Virtual Memory',3),
  ('b3000000-0000-0000-0000-000000000004','Page Replacement (FIFO, LRU, Optimal)',4),
  ('b3000000-0000-0000-0000-000000000004','File Systems',5),
  ('b3000000-0000-0000-0000-000000000004','Directory Structure',6),
  -- OS M5
  ('b3000000-0000-0000-0000-000000000005','Disk Scheduling (FCFS, SSTF, SCAN)',1),
  ('b3000000-0000-0000-0000-000000000005','RAID',2),
  ('b3000000-0000-0000-0000-000000000005','Cryptography',3),
  ('b3000000-0000-0000-0000-000000000005','Protection Mechanisms',4),
  ('b3000000-0000-0000-0000-000000000005','Virtual Machines & Containers',5),
  -- OS M6
  ('b3000000-0000-0000-0000-000000000006','Contemporary Issues in Operating Systems',1),
  -- DSA M1
  ('b4000000-0000-0000-0000-000000000001','Time & Space Complexity',1),
  ('b4000000-0000-0000-0000-000000000001','Asymptotic Notations',2),
  ('b4000000-0000-0000-0000-000000000001','Best/Worst/Average Case',3),
  ('b4000000-0000-0000-0000-000000000001','Recurrence Relations',4),
  ('b4000000-0000-0000-0000-000000000001','Master Method',5),
  ('b4000000-0000-0000-0000-000000000001','Proof of Correctness',6),
  -- DSA M2
  ('b4000000-0000-0000-0000-000000000002','Arrays (1D, 2D)',1),
  ('b4000000-0000-0000-0000-000000000002','Stack, Queue, Deque',2),
  ('b4000000-0000-0000-0000-000000000002','Linked Lists (SLL, DLL, CLL)',3),
  ('b4000000-0000-0000-0000-000000000002','Binary Tree, BST, AVL',4),
  ('b4000000-0000-0000-0000-000000000002','Graph BFS, DFS',5),
  ('b4000000-0000-0000-0000-000000000002','Hashing',6),
  -- DSA M3
  ('b4000000-0000-0000-0000-000000000003','Quick Sort, Merge Sort',1),
  ('b4000000-0000-0000-0000-000000000003','Karatsuba Algorithm',2),
  ('b4000000-0000-0000-0000-000000000003','N-Queens Problem',3),
  ('b4000000-0000-0000-0000-000000000003','Graph Coloring',4),
  ('b4000000-0000-0000-0000-000000000003','0/1 Knapsack (Backtracking)',5),
  ('b4000000-0000-0000-0000-000000000003','Job Selection (Branch & Bound)',6),
  ('b4000000-0000-0000-0000-000000000003','Subset Sum',7),
  -- DSA M4
  ('b4000000-0000-0000-0000-000000000004','Huffman Coding',1),
  ('b4000000-0000-0000-0000-000000000004','Prim and Kruskal MST',2),
  ('b4000000-0000-0000-0000-000000000004','Dijkstra Algorithm',3),
  ('b4000000-0000-0000-0000-000000000004','Matrix Chain Multiplication',4),
  ('b4000000-0000-0000-0000-000000000004','Longest Common Subsequence (LCS)',5),
  -- DSA M5
  ('b4000000-0000-0000-0000-000000000005','Class P, NP',1),
  ('b4000000-0000-0000-0000-000000000005','NP-Completeness',2),
  ('b4000000-0000-0000-0000-000000000005','SAT, 3SAT',3),
  ('b4000000-0000-0000-0000-000000000005','Clique, Independent Set',4),
  ('b4000000-0000-0000-0000-000000000005','Vertex Cover Approximation',5),
  ('b4000000-0000-0000-0000-000000000005','Set Cover',6),
  ('b4000000-0000-0000-0000-000000000005','TSP Approximation',7)
ON CONFLICT DO NOTHING;

-- ============================================================
-- DONE. All 3 parts applied.
-- Normal users can now add subjects.
-- Templates tab shows VIT Vellore with full syllabus.
-- ============================================================
