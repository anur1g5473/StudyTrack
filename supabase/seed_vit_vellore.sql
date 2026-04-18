-- ============================================================
-- StudyTrack — VIT Vellore Seed (mirrors the existing template data)
-- Run AFTER fix_rls_policies.sql
-- Supabase Dashboard → SQL Editor → New Query → Run
-- Safe to re-run (ON CONFLICT DO NOTHING / DO UPDATE)
-- ============================================================

-- 1. UNIVERSITY
INSERT INTO public.universities (id, name, short_name, location, emoji, color, description, is_active)
VALUES (
  'vit-vellore',
  'VIT Vellore',
  'VIT',
  'Vellore, TN',
  '🎓',
  '#6366f1',
  'Vellore Institute of Technology — B.Tech Curriculum',
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, updated_at = NOW();


-- ============================================================
-- 2. SUBJECTS (with stable UUIDs so we can reference them below)
-- ============================================================

INSERT INTO public.university_subjects (id, university_id, name, icon, color, order_index, is_active) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'vit-vellore', 'Applied Chemistry',                    '🔬', '#06b6d4', 1, true),
  ('a1000000-0000-0000-0000-000000000002', 'vit-vellore', 'Discrete Mathematics & Linear Algebra','🧮', '#8b5cf6', 2, true),
  ('a1000000-0000-0000-0000-000000000003', 'vit-vellore', 'Operating Systems',                    '💻', '#f59e0b', 3, true),
  ('a1000000-0000-0000-0000-000000000004', 'vit-vellore', 'Data Structures & Algorithms',         '📊', '#10b981', 4, true)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 3. MODULES
-- ============================================================

-- ── Applied Chemistry ────────────────────────────────────────
INSERT INTO public.university_modules (id, university_subject_id, name, order_index, is_active) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Module 1: Chemical Thermodynamics & Kinetics', 1, true),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Module 2: Energy Devices',                     2, true),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Module 3: Functional Materials',               3, true),
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'Module 4: Spectroscopy & Diffraction',         4, true),
  ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', 'Module 5: Computational Chemistry',            5, true),
  ('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001', 'Module 6: Contemporary Topics',                6, true)
ON CONFLICT (id) DO NOTHING;

-- ── Discrete Mathematics ─────────────────────────────────────
INSERT INTO public.university_modules (id, university_subject_id, name, order_index, is_active) VALUES
  ('b2000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'Module 1: Mathematical Logic',                                1, true),
  ('b2000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 'Module 2: Counting Techniques',                               2, true),
  ('b2000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'Module 3: Algebraic Structures & Lattices',                   3, true),
  ('b2000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'Module 4: Vector Spaces & Linear Transformations',            4, true),
  ('b2000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'Module 5: Inner Product Spaces',                              5, true),
  ('b2000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', 'Module 6: Contemporary Topics',                               6, true)
ON CONFLICT (id) DO NOTHING;

-- ── Operating Systems ─────────────────────────────────────────
INSERT INTO public.university_modules (id, university_subject_id, name, order_index, is_active) VALUES
  ('b3000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 'Module 1: OS Basics & Structure',                    1, true),
  ('b3000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000003', 'Module 2: Processes, Scheduling & Deadlocks',        2, true),
  ('b3000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', 'Module 3: Process Synchronization',                  3, true),
  ('b3000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000003', 'Module 4: Memory & File Management',                 4, true),
  ('b3000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000003', 'Module 5: Devices, Security & Virtualization',       5, true),
  ('b3000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000003', 'Module 6: Contemporary Issues',                      6, true)
ON CONFLICT (id) DO NOTHING;

-- ── Data Structures & Algorithms ─────────────────────────────
INSERT INTO public.university_modules (id, university_subject_id, name, order_index, is_active) VALUES
  ('b4000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000004', 'Module 1: Algorithm Analysis',                                  1, true),
  ('b4000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000004', 'Module 2: Data Structures',                                     2, true),
  ('b4000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000004', 'Module 3: Divide & Conquer / Backtracking / Branch & Bound',    3, true),
  ('b4000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000004', 'Module 4: Greedy & Dynamic Programming',                        4, true),
  ('b4000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000004', 'Module 5: Complexity & Approximation',                          5, true)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 4. TOPICS
-- ============================================================

-- Applied Chemistry → Module 1
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Thermodynamics',                   1, true),
  ('b1000000-0000-0000-0000-000000000001', 'Zeroth, First, Second, Third Laws', 2, true),
  ('b1000000-0000-0000-0000-000000000001', 'Enthalpy, Heat Capacity',           3, true),
  ('b1000000-0000-0000-0000-000000000001', 'Carnot Cycle',                      4, true),
  ('b1000000-0000-0000-0000-000000000001', 'Gibbs Helmholtz Equation',          5, true),
  ('b1000000-0000-0000-0000-000000000001', 'Rate Equation, Order',              6, true),
  ('b1000000-0000-0000-0000-000000000001', 'Integral Rate Equations',           7, true),
  ('b1000000-0000-0000-0000-000000000001', 'Half-life, Molecularity',           8, true),
  ('b1000000-0000-0000-0000-000000000001', 'Collision Theory',                  9, true),
  ('b1000000-0000-0000-0000-000000000001', 'Temperature & Catalyst Effects',   10, true)
ON CONFLICT DO NOTHING;

-- Applied Chemistry → Module 2
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b1000000-0000-0000-0000-000000000002', 'Electrochemical & Electrolytic Cells', 1, true),
  ('b1000000-0000-0000-0000-000000000002', 'Batteries (Li-ion)',                   2, true),
  ('b1000000-0000-0000-0000-000000000002', 'Fuel Cells (H₂-O₂, SOFC)',            3, true),
  ('b1000000-0000-0000-0000-000000000002', 'Solar Cells',                          4, true),
  ('b1000000-0000-0000-0000-000000000002', 'Photovoltaic',                         5, true),
  ('b1000000-0000-0000-0000-000000000002', 'Photoelectrochemical',                 6, true),
  ('b1000000-0000-0000-0000-000000000002', 'Dye-sensitized Solar Cells',           7, true)
ON CONFLICT DO NOTHING;

-- Applied Chemistry → Module 3
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b1000000-0000-0000-0000-000000000003', 'Metals, Semiconductors, Insulators, Superconductors',   1, true),
  ('b1000000-0000-0000-0000-000000000003', 'Para, Dia, Ferro, Anti-ferro Magnetic Materials',       2, true),
  ('b1000000-0000-0000-0000-000000000003', 'Liquid Cooling',                                        3, true),
  ('b1000000-0000-0000-0000-000000000003', 'Top-down & Bottom-up Nanomaterials',                    4, true),
  ('b1000000-0000-0000-0000-000000000003', 'Quantum Dots',                                          5, true)
ON CONFLICT DO NOTHING;

-- Applied Chemistry → Module 4
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b1000000-0000-0000-0000-000000000004', 'UV-Visible Spectroscopy',          1, true),
  ('b1000000-0000-0000-0000-000000000004', 'X-Ray Diffraction (XRD)',           2, true),
  ('b1000000-0000-0000-0000-000000000004', 'Instrumentation & Applications',   3, true),
  ('b1000000-0000-0000-0000-000000000004', 'Crystallite Size',                  4, true)
ON CONFLICT DO NOTHING;

-- Applied Chemistry → Module 5
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b1000000-0000-0000-0000-000000000005', 'Quantum Calculations',             1, true),
  ('b1000000-0000-0000-0000-000000000005', 'Molecular Orbital Theory',         2, true),
  ('b1000000-0000-0000-0000-000000000005', 'Potential Energy Surface',         3, true),
  ('b1000000-0000-0000-0000-000000000005', 'Geometry Optimization',            4, true),
  ('b1000000-0000-0000-0000-000000000005', 'Reaction Mechanism',               5, true),
  ('b1000000-0000-0000-0000-000000000005', 'AI in Material Screening',         6, true)
ON CONFLICT DO NOTHING;

-- Applied Chemistry → Module 6
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b1000000-0000-0000-0000-000000000006', 'Contemporary Topics in Chemistry', 1, true)
ON CONFLICT DO NOTHING;

-- DM → Module 1
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b2000000-0000-0000-0000-000000000001', 'Statements, Connectives',   1, true),
  ('b2000000-0000-0000-0000-000000000001', 'Tautologies, Equivalence',  2, true),
  ('b2000000-0000-0000-0000-000000000001', 'Implications, Normal Forms', 3, true),
  ('b2000000-0000-0000-0000-000000000001', 'Predicate Calculus',         4, true),
  ('b2000000-0000-0000-0000-000000000001', 'Inference Theory',           5, true)
ON CONFLICT DO NOTHING;

-- DM → Module 2
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b2000000-0000-0000-0000-000000000002', 'Basic Counting',             1, true),
  ('b2000000-0000-0000-0000-000000000002', 'Pigeonhole Principle',       2, true),
  ('b2000000-0000-0000-0000-000000000002', 'Permutations & Combinations',3, true),
  ('b2000000-0000-0000-0000-000000000002', 'Inclusion-Exclusion',        4, true),
  ('b2000000-0000-0000-0000-000000000002', 'Recurrence Relations',       5, true),
  ('b2000000-0000-0000-0000-000000000002', 'Generating Functions',       6, true)
ON CONFLICT DO NOTHING;

-- DM → Module 3
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b2000000-0000-0000-0000-000000000003', 'Groups, Subgroups',          1, true),
  ('b2000000-0000-0000-0000-000000000003', 'Lagrange''s Theorem',        2, true),
  ('b2000000-0000-0000-0000-000000000003', 'Homomorphism',               3, true),
  ('b2000000-0000-0000-0000-000000000003', 'Posets & Lattices',          4, true),
  ('b2000000-0000-0000-0000-000000000003', 'Hasse Diagram',              5, true),
  ('b2000000-0000-0000-0000-000000000003', 'Boolean Algebra',            6, true)
ON CONFLICT DO NOTHING;

-- DM → Module 4
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b2000000-0000-0000-0000-000000000004', 'Vector Space, Subspace',          1, true),
  ('b2000000-0000-0000-0000-000000000004', 'Linear Independence, Basis',      2, true),
  ('b2000000-0000-0000-0000-000000000004', 'Row, Column, Null Space',         3, true),
  ('b2000000-0000-0000-0000-000000000004', 'Rank-Nullity Theorem',            4, true),
  ('b2000000-0000-0000-0000-000000000004', 'Linear Transformations',          5, true),
  ('b2000000-0000-0000-0000-000000000004', 'Change of Basis',                 6, true)
ON CONFLICT DO NOTHING;

-- DM → Module 5
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b2000000-0000-0000-0000-000000000005', 'Dot Product, Length, Angle',  1, true),
  ('b2000000-0000-0000-0000-000000000005', 'Gram-Schmidt Process',        2, true),
  ('b2000000-0000-0000-0000-000000000005', 'Orthonormal Basis',           3, true),
  ('b2000000-0000-0000-0000-000000000005', 'Quadratic Forms',             4, true)
ON CONFLICT DO NOTHING;

-- DM → Module 6
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b2000000-0000-0000-0000-000000000006', 'Contemporary Topics in Mathematics', 1, true)
ON CONFLICT DO NOTHING;

-- OS → Module 1
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b3000000-0000-0000-0000-000000000001', 'OS Concepts & History',                      1, true),
  ('b3000000-0000-0000-0000-000000000001', 'OS Structures (Monolithic, Microkernel)',     2, true),
  ('b3000000-0000-0000-0000-000000000001', 'System Calls',                               3, true),
  ('b3000000-0000-0000-0000-000000000001', 'Interrupts',                                 4, true),
  ('b3000000-0000-0000-0000-000000000001', 'OS Design & Booting',                        5, true)
ON CONFLICT DO NOTHING;

-- OS → Module 2
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b3000000-0000-0000-0000-000000000002', 'Process States & Operations',          1, true),
  ('b3000000-0000-0000-0000-000000000002', 'Threads & Multithreading',             2, true),
  ('b3000000-0000-0000-0000-000000000002', 'FCFS, SJF, Priority Scheduling',       3, true),
  ('b3000000-0000-0000-0000-000000000002', 'Round Robin, SRTF',                    4, true),
  ('b3000000-0000-0000-0000-000000000002', 'Resource Allocation Graph (RAG)',       5, true),
  ('b3000000-0000-0000-0000-000000000002', 'Deadlock Prevention & Handling',       6, true)
ON CONFLICT DO NOTHING;

-- OS → Module 3
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b3000000-0000-0000-0000-000000000003', 'IPC (Shared Memory, Message Passing)', 1, true),
  ('b3000000-0000-0000-0000-000000000003', 'Critical Section Problem',             2, true),
  ('b3000000-0000-0000-0000-000000000003', 'Peterson, Bakery Algorithm',           3, true),
  ('b3000000-0000-0000-0000-000000000003', 'Mutex, Semaphores',                    4, true),
  ('b3000000-0000-0000-0000-000000000003', 'Dining Philosophers Problem',          5, true),
  ('b3000000-0000-0000-0000-000000000003', 'Readers-Writers Problem',              6, true)
ON CONFLICT DO NOTHING;

-- OS → Module 4
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b3000000-0000-0000-0000-000000000004', 'Memory Allocation',                          1, true),
  ('b3000000-0000-0000-0000-000000000004', 'Paging, Segmentation',                       2, true),
  ('b3000000-0000-0000-0000-000000000004', 'Virtual Memory',                             3, true),
  ('b3000000-0000-0000-0000-000000000004', 'Page Replacement (FIFO, LRU, Optimal)',      4, true),
  ('b3000000-0000-0000-0000-000000000004', 'File Systems',                               5, true),
  ('b3000000-0000-0000-0000-000000000004', 'Directory Structure',                        6, true)
ON CONFLICT DO NOTHING;

-- OS → Module 5
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b3000000-0000-0000-0000-000000000005', 'Disk Scheduling (FCFS, SSTF, SCAN)', 1, true),
  ('b3000000-0000-0000-0000-000000000005', 'RAID',                                2, true),
  ('b3000000-0000-0000-0000-000000000005', 'Cryptography',                        3, true),
  ('b3000000-0000-0000-0000-000000000005', 'Protection Mechanisms',               4, true),
  ('b3000000-0000-0000-0000-000000000005', 'Virtual Machines & Containers',       5, true)
ON CONFLICT DO NOTHING;

-- OS → Module 6
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b3000000-0000-0000-0000-000000000006', 'Contemporary Issues in Operating Systems', 1, true)
ON CONFLICT DO NOTHING;

-- DSA → Module 1
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b4000000-0000-0000-0000-000000000001', 'Time & Space Complexity',      1, true),
  ('b4000000-0000-0000-0000-000000000001', 'Asymptotic Notations',         2, true),
  ('b4000000-0000-0000-0000-000000000001', 'Best/Worst/Average Case',      3, true),
  ('b4000000-0000-0000-0000-000000000001', 'Recurrence Relations',         4, true),
  ('b4000000-0000-0000-0000-000000000001', 'Master Method',                5, true),
  ('b4000000-0000-0000-0000-000000000001', 'Proof of Correctness',         6, true)
ON CONFLICT DO NOTHING;

-- DSA → Module 2
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b4000000-0000-0000-0000-000000000002', 'Arrays (1D, 2D)',                    1, true),
  ('b4000000-0000-0000-0000-000000000002', 'Stack, Queue, Deque',               2, true),
  ('b4000000-0000-0000-0000-000000000002', 'Linked Lists (SLL, DLL, CLL)',       3, true),
  ('b4000000-0000-0000-0000-000000000002', 'Binary Tree, BST, AVL',              4, true),
  ('b4000000-0000-0000-0000-000000000002', 'Graph BFS, DFS',                     5, true),
  ('b4000000-0000-0000-0000-000000000002', 'Hashing',                            6, true)
ON CONFLICT DO NOTHING;

-- DSA → Module 3
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b4000000-0000-0000-0000-000000000003', 'Quick Sort, Merge Sort',             1, true),
  ('b4000000-0000-0000-0000-000000000003', 'Karatsuba Algorithm',                2, true),
  ('b4000000-0000-0000-0000-000000000003', 'N-Queens Problem',                   3, true),
  ('b4000000-0000-0000-0000-000000000003', 'Graph Coloring',                     4, true),
  ('b4000000-0000-0000-0000-000000000003', '0/1 Knapsack (Backtracking)',        5, true),
  ('b4000000-0000-0000-0000-000000000003', 'Job Selection (Branch & Bound)',     6, true),
  ('b4000000-0000-0000-0000-000000000003', 'Subset Sum',                         7, true)
ON CONFLICT DO NOTHING;

-- DSA → Module 4
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b4000000-0000-0000-0000-000000000004', 'Huffman Coding',                           1, true),
  ('b4000000-0000-0000-0000-000000000004', 'Prim''s & Kruskal''s MST',               2, true),
  ('b4000000-0000-0000-0000-000000000004', 'Dijkstra''s Algorithm',                   3, true),
  ('b4000000-0000-0000-0000-000000000004', 'Matrix Chain Multiplication',              4, true),
  ('b4000000-0000-0000-0000-000000000004', 'Longest Common Subsequence (LCS)',        5, true)
ON CONFLICT DO NOTHING;

-- DSA → Module 5
INSERT INTO public.university_topics (university_module_id, name, order_index, is_active) VALUES
  ('b4000000-0000-0000-0000-000000000005', 'Class P, NP',                        1, true),
  ('b4000000-0000-0000-0000-000000000005', 'NP-Completeness',                    2, true),
  ('b4000000-0000-0000-0000-000000000005', 'SAT, 3SAT',                          3, true),
  ('b4000000-0000-0000-0000-000000000005', 'Clique, Independent Set',            4, true),
  ('b4000000-0000-0000-0000-000000000005', 'Vertex Cover Approximation',         5, true),
  ('b4000000-0000-0000-0000-000000000005', 'Set Cover',                          6, true),
  ('b4000000-0000-0000-0000-000000000005', 'TSP Approximation',                  7, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- DONE. Open the app → Templates tab → VIT Vellore will appear.
-- ============================================================
