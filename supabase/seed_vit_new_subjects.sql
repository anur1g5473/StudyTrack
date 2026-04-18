-- ============================================================
-- StudyTrack — Add 5 New VIT Vellore Subjects
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- Safe to re-run (ON CONFLICT DO NOTHING)
-- ============================================================

-- ============================================================
-- SUBJECTS (order_index continues from 5)
-- ============================================================
INSERT INTO public.university_subjects (id, university_id, name, icon, color, order_index)
VALUES
  ('a1000000-0000-0000-0000-000000000005', 'vit-vellore', 'Structured and Object-Oriented Programming', '🧩', '#ec4899', 5),
  ('a1000000-0000-0000-0000-000000000006', 'vit-vellore', 'Engineering Physics',                        '⚛️', '#14b8a6', 6),
  ('a1000000-0000-0000-0000-000000000007', 'vit-vellore', 'Probability and Statistics',                 '📈', '#f97316', 7),
  ('a1000000-0000-0000-0000-000000000008', 'vit-vellore', 'Technical English Communication',             '✍️', '#64748b', 8),
  ('a1000000-0000-0000-0000-000000000009', 'vit-vellore', 'Problem Solving using Java',                 '☕', '#eab308', 9)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- MODULES
-- ============================================================
INSERT INTO public.university_modules (id, university_subject_id, name, order_index) VALUES

  -- SOOP
  ('b5000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000005','Module 1: Fundamentals of C Programming',          1),
  ('b5000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000005','Module 2: Pointers, Structures and File Handling',  2),
  ('b5000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000005','Module 3: Introduction to OOP',                    3),
  ('b5000000-0000-0000-0000-000000000004','a1000000-0000-0000-0000-000000000005','Module 4: Inheritance and Polymorphism in C++',     4),
  ('b5000000-0000-0000-0000-000000000005','a1000000-0000-0000-0000-000000000005','Module 5: Exceptions, Templates and STL in C++',    5),

  -- Engineering Physics
  ('b6000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000006','Module 1: Wave-Particle Duality',                              1),
  ('b6000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000006','Module 2: Mathematical Foundations of Quantum Mechanics',      2),
  ('b6000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000006','Module 3: Postulates of Quantum Mechanics',                    3),
  ('b6000000-0000-0000-0000-000000000004','a1000000-0000-0000-0000-000000000006','Module 4: Applications of Quantum Mechanics',                  4),
  ('b6000000-0000-0000-0000-000000000005','a1000000-0000-0000-0000-000000000006','Module 5: Elements of Quantum Computing',                      5),

  -- Probability and Statistics
  ('b7000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000007','Module 1: Probability and Random Variables',   1),
  ('b7000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000007','Module 2: Probability Distributions',          2),
  ('b7000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000007','Module 3: Testing of Hypothesis',              3),
  ('b7000000-0000-0000-0000-000000000004','a1000000-0000-0000-0000-000000000007','Module 4: Correlation and Regression',         4),
  ('b7000000-0000-0000-0000-000000000005','a1000000-0000-0000-0000-000000000007','Module 5: ANOVA and Design of Experiments',    5),

  -- Technical English Communication
  ('b8000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000008','Module 1: Introduction to Technical Communication', 1),
  ('b8000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000008','Module 2: Grammar',                                2),
  ('b8000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000008','Module 3: Reading',                                3),
  ('b8000000-0000-0000-0000-000000000004','a1000000-0000-0000-0000-000000000008','Module 4: Writing',                                4),
  ('b8000000-0000-0000-0000-000000000005','a1000000-0000-0000-0000-000000000008','Module 5: Interpersonal Communication',            5),

  -- Problem Solving using Java
  ('b9000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000009','Module 1: Basic Programming Constructs',   1),
  ('b9000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000009','Module 2: Arrays and Data Handling',       2),
  ('b9000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000009','Module 3: Object-Oriented Programming',    3),
  ('b9000000-0000-0000-0000-000000000004','a1000000-0000-0000-0000-000000000009','Module 4: Advanced Java Concepts',         4),
  ('b9000000-0000-0000-0000-000000000005','a1000000-0000-0000-0000-000000000009','Module 5: Collections and Advanced Features', 5)

ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- TOPICS
-- ============================================================
INSERT INTO public.university_topics (university_module_id, name, order_index) VALUES

  -- ── SOOP M1: Fundamentals of C ──────────────────────────────
  ('b5000000-0000-0000-0000-000000000001','Structure of C program',1),
  ('b5000000-0000-0000-0000-000000000001','Compiler vs Interpreter',2),
  ('b5000000-0000-0000-0000-000000000001','Variables and Reserved words',3),
  ('b5000000-0000-0000-0000-000000000001','Data types',4),
  ('b5000000-0000-0000-0000-000000000001','Operators - precedence and associativity',5),
  ('b5000000-0000-0000-0000-000000000001','Type conversions',6),
  ('b5000000-0000-0000-0000-000000000001','Input/Output statements',7),
  ('b5000000-0000-0000-0000-000000000001','Conditional statements',8),
  ('b5000000-0000-0000-0000-000000000001','Looping statements',9),
  ('b5000000-0000-0000-0000-000000000001','1-D Arrays',10),
  ('b5000000-0000-0000-0000-000000000001','2-D Arrays',11),
  ('b5000000-0000-0000-0000-000000000001','Strings',12),
  ('b5000000-0000-0000-0000-000000000001','User-defined functions',13),
  ('b5000000-0000-0000-0000-000000000001','Call by value',14),
  ('b5000000-0000-0000-0000-000000000001','Call by reference',15),
  ('b5000000-0000-0000-0000-000000000001','Recursion',16),
  ('b5000000-0000-0000-0000-000000000001','Scope, Visibility and Lifetime of variables',17),

  -- ── SOOP M2: Pointers, Structures, Files ─────────────────────
  ('b5000000-0000-0000-0000-000000000002','Pointer arithmetic',1),
  ('b5000000-0000-0000-0000-000000000002','Pointers with arrays',2),
  ('b5000000-0000-0000-0000-000000000002','Pointers with functions',3),
  ('b5000000-0000-0000-0000-000000000002','Function pointers',4),
  ('b5000000-0000-0000-0000-000000000002','Dynamic memory allocation',5),
  ('b5000000-0000-0000-0000-000000000002','Array of structures',6),
  ('b5000000-0000-0000-0000-000000000002','Nested structures',7),
  ('b5000000-0000-0000-0000-000000000002','Structures with functions',8),
  ('b5000000-0000-0000-0000-000000000002','Self-referential structures',9),
  ('b5000000-0000-0000-0000-000000000002','Bit fields',10),
  ('b5000000-0000-0000-0000-000000000002','Pointers to structures',11),
  ('b5000000-0000-0000-0000-000000000002','Unions and comparison with structures',12),
  ('b5000000-0000-0000-0000-000000000002','Text and binary files',13),
  ('b5000000-0000-0000-0000-000000000002','File read, write and seek',14),
  ('b5000000-0000-0000-0000-000000000002','Command-line arguments',15),

  -- ── SOOP M3: Introduction to OOP ────────────────────────────
  ('b5000000-0000-0000-0000-000000000003','Features of OOP',1),
  ('b5000000-0000-0000-0000-000000000003','Classes and Objects',2),
  ('b5000000-0000-0000-0000-000000000003','Access specifiers',3),
  ('b5000000-0000-0000-0000-000000000003','Constructors and Destructors',4),
  ('b5000000-0000-0000-0000-000000000003','this pointer',5),
  ('b5000000-0000-0000-0000-000000000003','Static data members and member functions',6),
  ('b5000000-0000-0000-0000-000000000003','Static objects',7),
  ('b5000000-0000-0000-0000-000000000003','Constant member functions',8),
  ('b5000000-0000-0000-0000-000000000003','Inline functions',9),
  ('b5000000-0000-0000-0000-000000000003','Friend functions and classes',10),
  ('b5000000-0000-0000-0000-000000000003','Scope resolution operator',11),
  ('b5000000-0000-0000-0000-000000000003','Lambda expressions',12),

  -- ── SOOP M4: Inheritance and Polymorphism ───────────────────
  ('b5000000-0000-0000-0000-000000000004','Single inheritance',1),
  ('b5000000-0000-0000-0000-000000000004','Multiple inheritance',2),
  ('b5000000-0000-0000-0000-000000000004','Multilevel inheritance',3),
  ('b5000000-0000-0000-0000-000000000004','Hierarchical inheritance',4),
  ('b5000000-0000-0000-0000-000000000004','Multipath inheritance',5),
  ('b5000000-0000-0000-0000-000000000004','Ambiguity in multipath inheritance',6),
  ('b5000000-0000-0000-0000-000000000004','Constructors in inheritance',7),
  ('b5000000-0000-0000-0000-000000000004','Function overloading',8),
  ('b5000000-0000-0000-0000-000000000004','Operator overloading',9),
  ('b5000000-0000-0000-0000-000000000004','Function overriding (Dynamic polymorphism)',10),
  ('b5000000-0000-0000-0000-000000000004','Virtual functions',11),
  ('b5000000-0000-0000-0000-000000000004','Virtual destructors',12),
  ('b5000000-0000-0000-0000-000000000004','Pure virtual functions (Abstract classes)',13),

  -- ── SOOP M5: Exceptions, Templates, STL ─────────────────────
  ('b5000000-0000-0000-0000-000000000005','try, catch, throw',1),
  ('b5000000-0000-0000-0000-000000000005','Runtime error handling',2),
  ('b5000000-0000-0000-0000-000000000005','Custom exceptions',3),
  ('b5000000-0000-0000-0000-000000000005','Re-throwing exceptions',4),
  ('b5000000-0000-0000-0000-000000000005','Function templates',5),
  ('b5000000-0000-0000-0000-000000000005','Class templates',6),
  ('b5000000-0000-0000-0000-000000000005','Template specialization',7),
  ('b5000000-0000-0000-0000-000000000005','STL Containers: Vector, List, Set, Map',8),
  ('b5000000-0000-0000-0000-000000000005','Iterators',9),
  ('b5000000-0000-0000-0000-000000000005','STL algorithms',10),

  -- ── Physics M1: Wave-Particle Duality ────────────────────────
  ('b6000000-0000-0000-0000-000000000001','Dual nature of radiation',1),
  ('b6000000-0000-0000-0000-000000000001','Young double slit experiment',2),
  ('b6000000-0000-0000-0000-000000000001','Blackbody radiation',3),
  ('b6000000-0000-0000-0000-000000000001','Planck hypothesis',4),
  ('b6000000-0000-0000-0000-000000000001','de Broglie hypothesis',5),
  ('b6000000-0000-0000-0000-000000000001','Wavefunction',6),
  ('b6000000-0000-0000-0000-000000000001','Stern-Gerlach experiment',7),

  -- ── Physics M2: Mathematical Foundations ─────────────────────
  ('b6000000-0000-0000-0000-000000000002','Linear vector space',1),
  ('b6000000-0000-0000-0000-000000000002','Basis vectors',2),
  ('b6000000-0000-0000-0000-000000000002','Orthonormal sets',3),
  ('b6000000-0000-0000-0000-000000000002','Hilbert space',4),
  ('b6000000-0000-0000-0000-000000000002','Dirac notation',5),
  ('b6000000-0000-0000-0000-000000000002','Inner and outer products',6),
  ('b6000000-0000-0000-0000-000000000002','Tensor product of vector spaces',7),
  ('b6000000-0000-0000-0000-000000000002','Linear operators',8),
  ('b6000000-0000-0000-0000-000000000002','Matrix algebra',9),
  ('b6000000-0000-0000-0000-000000000002','Hermitian, Unitary and Projection operators',10),
  ('b6000000-0000-0000-0000-000000000002','Eigenvalues and eigenvectors',11),
  ('b6000000-0000-0000-0000-000000000002','Pauli matrices',12),
  ('b6000000-0000-0000-0000-000000000002','Commutation relations',13),

  -- ── Physics M3: Postulates of QM ─────────────────────────────
  ('b6000000-0000-0000-0000-000000000003','Observables',1),
  ('b6000000-0000-0000-0000-000000000003','Expectation values',2),
  ('b6000000-0000-0000-0000-000000000003','Measurement in quantum mechanics',3),
  ('b6000000-0000-0000-0000-000000000003','Sequential Stern-Gerlach experiment',4),
  ('b6000000-0000-0000-0000-000000000003','Time-dependent Schrodinger equation',5),
  ('b6000000-0000-0000-0000-000000000003','Time-independent Schrodinger equation',6),

  -- ── Physics M4: Applications of QM ──────────────────────────
  ('b6000000-0000-0000-0000-000000000004','Particle in 1D potential well',1),
  ('b6000000-0000-0000-0000-000000000004','Particle in 3D potential well',2),
  ('b6000000-0000-0000-0000-000000000004','Energy eigenvalues and eigenfunctions',3),
  ('b6000000-0000-0000-0000-000000000004','Degeneracy of energy levels',4),
  ('b6000000-0000-0000-0000-000000000004','Quantum tunneling',5),
  ('b6000000-0000-0000-0000-000000000004','Tunneling probability',6),

  -- ── Physics M5: Quantum Computing ────────────────────────────
  ('b6000000-0000-0000-0000-000000000005','Introduction to qubits',1),
  ('b6000000-0000-0000-0000-000000000005','Single qubit states',2),
  ('b6000000-0000-0000-0000-000000000005','Bloch sphere',3),
  ('b6000000-0000-0000-0000-000000000005','Two-qubit systems',4),
  ('b6000000-0000-0000-0000-000000000005','Quantum entanglement',5),
  ('b6000000-0000-0000-0000-000000000005','Bell states',6),
  ('b6000000-0000-0000-0000-000000000005','Pauli gates and Hadamard gate',7),
  ('b6000000-0000-0000-0000-000000000005','CNOT gate',8),

  -- ── Prob & Stats M1: Probability and RVs ─────────────────────
  ('b7000000-0000-0000-0000-000000000001','Axioms of probability',1),
  ('b7000000-0000-0000-0000-000000000001','Probability spaces',2),
  ('b7000000-0000-0000-0000-000000000001','Conditional probability',3),
  ('b7000000-0000-0000-0000-000000000001','Bayes theorem',4),
  ('b7000000-0000-0000-0000-000000000001','Discrete random variables',5),
  ('b7000000-0000-0000-0000-000000000001','Continuous random variables',6),
  ('b7000000-0000-0000-0000-000000000001','PMF and PDF',7),
  ('b7000000-0000-0000-0000-000000000001','Joint, marginal and conditional distributions',8),
  ('b7000000-0000-0000-0000-000000000001','Moments, variance, covariance, correlation',9),
  ('b7000000-0000-0000-0000-000000000001','Independence of random variables',10),
  ('b7000000-0000-0000-0000-000000000001','Functions of random variables',11),

  -- ── Prob & Stats M2: Distributions ───────────────────────────
  ('b7000000-0000-0000-0000-000000000002','Bernoulli and Binomial distribution',1),
  ('b7000000-0000-0000-0000-000000000002','Poisson distribution',2),
  ('b7000000-0000-0000-0000-000000000002','Geometric and Negative binomial',3),
  ('b7000000-0000-0000-0000-000000000002','Uniform and Normal distribution',4),
  ('b7000000-0000-0000-0000-000000000002','Exponential and Gamma distribution',5),
  ('b7000000-0000-0000-0000-000000000002','Weibull distribution',6),
  ('b7000000-0000-0000-0000-000000000002','Central limit theorem',7),
  ('b7000000-0000-0000-0000-000000000002','t-distribution',8),
  ('b7000000-0000-0000-0000-000000000002','F-distribution',9),
  ('b7000000-0000-0000-0000-000000000002','Chi-square distribution',10),

  -- ── Prob & Stats M3: Hypothesis Testing ──────────────────────
  ('b7000000-0000-0000-0000-000000000003','Hypothesis formulation',1),
  ('b7000000-0000-0000-0000-000000000003','Simple and composite hypotheses',2),
  ('b7000000-0000-0000-0000-000000000003','Type I and Type II errors',3),
  ('b7000000-0000-0000-0000-000000000003','Z-test',4),
  ('b7000000-0000-0000-0000-000000000003','t-test',5),
  ('b7000000-0000-0000-0000-000000000003','F-test',6),
  ('b7000000-0000-0000-0000-000000000003','Chi-square goodness of fit',7),
  ('b7000000-0000-0000-0000-000000000003','Chi-square test of independence',8),
  ('b7000000-0000-0000-0000-000000000003','Confidence intervals',9),

  -- ── Prob & Stats M4: Correlation and Regression ──────────────
  ('b7000000-0000-0000-0000-000000000004','Pearson correlation',1),
  ('b7000000-0000-0000-0000-000000000004','Spearman rank correlation',2),
  ('b7000000-0000-0000-0000-000000000004','Multiple and partial correlation',3),
  ('b7000000-0000-0000-0000-000000000004','Simple linear regression',4),
  ('b7000000-0000-0000-0000-000000000004','Multiple linear regression',5),
  ('b7000000-0000-0000-0000-000000000004','Model assumptions and estimation',6),
  ('b7000000-0000-0000-0000-000000000004','Model diagnostics and validation',7),

  -- ── Prob & Stats M5: ANOVA ───────────────────────────────────
  ('b7000000-0000-0000-0000-000000000005','One-way ANOVA',1),
  ('b7000000-0000-0000-0000-000000000005','Two-way ANOVA',2),
  ('b7000000-0000-0000-0000-000000000005','Completely Randomized Design (CRD)',3),
  ('b7000000-0000-0000-0000-000000000005','Randomized Block Design (RBD)',4),
  ('b7000000-0000-0000-0000-000000000005','Latin Square Design (LSD)',5),

  -- ── Tech English M1: Intro ────────────────────────────────────
  ('b8000000-0000-0000-0000-000000000001','Nature of technical communication',1),
  ('b8000000-0000-0000-0000-000000000001','Scientific writing',2),
  ('b8000000-0000-0000-0000-000000000001','Technical reporting',3),
  ('b8000000-0000-0000-0000-000000000001','Business communication',4),
  ('b8000000-0000-0000-0000-000000000001','5Cs of technical writing',5),
  ('b8000000-0000-0000-0000-000000000001','Conceptual application',6),

  -- ── Tech English M2: Grammar ─────────────────────────────────
  ('b8000000-0000-0000-0000-000000000002','Concord',1),
  ('b8000000-0000-0000-0000-000000000002','Tense',2),
  ('b8000000-0000-0000-0000-000000000002','Conditionals',3),
  ('b8000000-0000-0000-0000-000000000002','Voice',4),
  ('b8000000-0000-0000-0000-000000000002','Transitions and linking words',5),

  -- ── Tech English M3: Reading ─────────────────────────────────
  ('b8000000-0000-0000-0000-000000000003','Types of definitions and expansion methods',1),
  ('b8000000-0000-0000-0000-000000000003','Reading comprehension and inference',2),
  ('b8000000-0000-0000-0000-000000000003','Research article structure',3),
  ('b8000000-0000-0000-0000-000000000003','Analysis of research articles',4),

  -- ── Tech English M4: Writing ─────────────────────────────────
  ('b8000000-0000-0000-0000-000000000004','Review paper structure',1),
  ('b8000000-0000-0000-0000-000000000004','Types of reviews',2),
  ('b8000000-0000-0000-0000-000000000004','Literature review',3),
  ('b8000000-0000-0000-0000-000000000004','IEEE referencing style',4),
  ('b8000000-0000-0000-0000-000000000004','APA referencing style',5),

  -- ── Tech English M5: Interpersonal ───────────────────────────
  ('b8000000-0000-0000-0000-000000000005','Cross-cultural communication',1),
  ('b8000000-0000-0000-0000-000000000005','Interpersonal communication',2),
  ('b8000000-0000-0000-0000-000000000005','Leadership styles',3),
  ('b8000000-0000-0000-0000-000000000005','Belbin team roles',4),
  ('b8000000-0000-0000-0000-000000000005','Negotiation skills',5),
  ('b8000000-0000-0000-0000-000000000005','Conflict management (Thomas-Kilmann)',6),
  ('b8000000-0000-0000-0000-000000000005','Statement of purpose',7),

  -- ── Java M1: Basic Programming ───────────────────────────────
  ('b9000000-0000-0000-0000-000000000001','Arithmetic problems',1),
  ('b9000000-0000-0000-0000-000000000001','Number analysis',2),
  ('b9000000-0000-0000-0000-000000000001','Prime numbers',3),
  ('b9000000-0000-0000-0000-000000000001','Loop-based programs',4),

  -- ── Java M2: Arrays ──────────────────────────────────────────
  ('b9000000-0000-0000-0000-000000000002','Array operations',1),
  ('b9000000-0000-0000-0000-000000000002','2D arrays',2),
  ('b9000000-0000-0000-0000-000000000002','Merging arrays',3),
  ('b9000000-0000-0000-0000-000000000002','Data processing',4),

  -- ── Java M3: OOP ─────────────────────────────────────────────
  ('b9000000-0000-0000-0000-000000000003','Classes and objects',1),
  ('b9000000-0000-0000-0000-000000000003','Constructors',2),
  ('b9000000-0000-0000-0000-000000000003','Inheritance',3),
  ('b9000000-0000-0000-0000-000000000003','Abstract classes',4),
  ('b9000000-0000-0000-0000-000000000003','Interfaces',5),

  -- ── Java M4: Advanced ────────────────────────────────────────
  ('b9000000-0000-0000-0000-000000000004','Exception handling',1),
  ('b9000000-0000-0000-0000-000000000004','Custom exceptions',2),
  ('b9000000-0000-0000-0000-000000000004','Multithreading',3),
  ('b9000000-0000-0000-0000-000000000004','Synchronization',4),
  ('b9000000-0000-0000-0000-000000000004','File handling',5),

  -- ── Java M5: Collections ─────────────────────────────────────
  ('b9000000-0000-0000-0000-000000000005','ArrayList',1),
  ('b9000000-0000-0000-0000-000000000005','HashMap',2),
  ('b9000000-0000-0000-0000-000000000005','Generics',3),
  ('b9000000-0000-0000-0000-000000000005','Serialization',4),
  ('b9000000-0000-0000-0000-000000000005','JDBC basics',5)

ON CONFLICT DO NOTHING;

-- ============================================================
-- DONE. VIT Vellore now has 9 subjects total.
-- ============================================================
