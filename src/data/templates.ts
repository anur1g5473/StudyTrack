export interface TemplateModule {
  name: string;
  topics: string[];
}

export interface TemplateSubject {
  name: string;
  icon: string;
  color: string;
  modules: TemplateModule[];
}

export interface UniversityTemplate {
  id: string;
  name: string;
  shortName: string;
  location: string;
  emoji: string;
  color: string;
  subjects: TemplateSubject[];
}

export const UNIVERSITY_TEMPLATES: UniversityTemplate[] = [
  {
    id: 'vit-vellore',
    name: 'VIT Vellore',
    shortName: 'VIT',
    location: 'Vellore, TN',
    emoji: '🎓',
    color: '#6366f1',
    subjects: [
      {
        name: 'Applied Chemistry',
        icon: '🔬',
        color: '#06b6d4',
        modules: [
          {
            name: 'Module 1: Chemical Thermodynamics & Kinetics',
            topics: [
              'Thermodynamics',
              'Zeroth, First, Second, Third Laws',
              'Enthalpy, Heat Capacity',
              'Carnot Cycle',
              'Gibbs Helmholtz Equation',
              'Rate Equation, Order',
              'Integral Rate Equations',
              'Half-life, Molecularity',
              'Collision Theory',
              'Temperature & Catalyst Effects',
            ],
          },
          {
            name: 'Module 2: Energy Devices',
            topics: [
              'Electrochemical & Electrolytic Cells',
              'Batteries (Li-ion)',
              'Fuel Cells (H₂-O₂, SOFC)',
              'Solar Cells',
              'Photovoltaic',
              'Photoelectrochemical',
              'Dye-sensitized Solar Cells',
            ],
          },
          {
            name: 'Module 3: Functional Materials',
            topics: [
              'Metals, Semiconductors, Insulators, Superconductors',
              'Para, Dia, Ferro, Anti-ferro Magnetic Materials',
              'Liquid Cooling',
              'Top-down & Bottom-up Nanomaterials',
              'Quantum Dots',
            ],
          },
          {
            name: 'Module 4: Spectroscopy & Diffraction',
            topics: [
              'UV-Visible Spectroscopy',
              'X-Ray Diffraction (XRD)',
              'Instrumentation & Applications',
              'Crystallite Size',
            ],
          },
          {
            name: 'Module 5: Computational Chemistry',
            topics: [
              'Quantum Calculations',
              'Molecular Orbital Theory',
              'Potential Energy Surface',
              'Geometry Optimization',
              'Reaction Mechanism',
              'AI in Material Screening',
            ],
          },
          {
            name: 'Module 6: Contemporary Topics',
            topics: ['Contemporary Topics in Chemistry'],
          },
        ],
      },
      {
        name: 'Discrete Mathematics & Linear Algebra',
        icon: '🧮',
        color: '#8b5cf6',
        modules: [
          {
            name: 'Module 1: Mathematical Logic',
            topics: [
              'Statements, Connectives',
              'Tautologies, Equivalence',
              'Implications, Normal Forms',
              'Predicate Calculus',
              'Inference Theory',
            ],
          },
          {
            name: 'Module 2: Counting Techniques',
            topics: [
              'Basic Counting',
              'Pigeonhole Principle',
              'Permutations & Combinations',
              'Inclusion-Exclusion',
              'Recurrence Relations',
              'Generating Functions',
            ],
          },
          {
            name: 'Module 3: Algebraic Structures & Lattices',
            topics: [
              "Groups, Subgroups",
              "Lagrange's Theorem",
              'Homomorphism',
              'Posets & Lattices',
              'Hasse Diagram',
              'Boolean Algebra',
            ],
          },
          {
            name: 'Module 4: Vector Spaces & Linear Transformations',
            topics: [
              'Vector Space, Subspace',
              'Linear Independence, Basis',
              'Row, Column, Null Space',
              'Rank-Nullity Theorem',
              'Linear Transformations',
              'Change of Basis',
            ],
          },
          {
            name: 'Module 5: Inner Product Spaces',
            topics: [
              'Dot Product, Length, Angle',
              'Gram-Schmidt Process',
              'Orthonormal Basis',
              'Quadratic Forms',
            ],
          },
          {
            name: 'Module 6: Contemporary Topics',
            topics: ['Contemporary Topics in Mathematics'],
          },
        ],
      },
      {
        name: 'Operating Systems',
        icon: '💻',
        color: '#f59e0b',
        modules: [
          {
            name: 'Module 1: OS Basics & Structure',
            topics: [
              'OS Concepts & History',
              'OS Structures (Monolithic, Microkernel)',
              'System Calls',
              'Interrupts',
              'OS Design & Booting',
            ],
          },
          {
            name: 'Module 2: Processes, Scheduling & Deadlocks',
            topics: [
              'Process States & Operations',
              'Threads & Multithreading',
              'FCFS, SJF, Priority Scheduling',
              'Round Robin, SRTF',
              'Resource Allocation Graph (RAG)',
              'Deadlock Prevention & Handling',
            ],
          },
          {
            name: 'Module 3: Process Synchronization',
            topics: [
              'IPC (Shared Memory, Message Passing)',
              'Critical Section Problem',
              'Peterson, Bakery Algorithm',
              'Mutex, Semaphores',
              'Dining Philosophers Problem',
              'Readers-Writers Problem',
            ],
          },
          {
            name: 'Module 4: Memory & File Management',
            topics: [
              'Memory Allocation',
              'Paging, Segmentation',
              'Virtual Memory',
              'Page Replacement (FIFO, LRU, Optimal)',
              'File Systems',
              'Directory Structure',
            ],
          },
          {
            name: 'Module 5: Devices, Security & Virtualization',
            topics: [
              'Disk Scheduling (FCFS, SSTF, SCAN)',
              'RAID',
              'Cryptography',
              'Protection Mechanisms',
              'Virtual Machines & Containers',
            ],
          },
          {
            name: 'Module 6: Contemporary Issues',
            topics: ['Contemporary Issues in Operating Systems'],
          },
        ],
      },
      {
        name: 'Data Structures & Algorithms',
        icon: '📊',
        color: '#10b981',
        modules: [
          {
            name: 'Module 1: Algorithm Analysis',
            topics: [
              'Time & Space Complexity',
              'Asymptotic Notations',
              'Best/Worst/Average Case',
              'Recurrence Relations',
              'Master Method',
              'Proof of Correctness',
            ],
          },
          {
            name: 'Module 2: Data Structures',
            topics: [
              'Arrays (1D, 2D)',
              'Stack, Queue, Deque',
              'Linked Lists (SLL, DLL, CLL)',
              'Binary Tree, BST, AVL',
              'Graph BFS, DFS',
              'Hashing',
            ],
          },
          {
            name: 'Module 3: Divide & Conquer / Backtracking / Branch & Bound',
            topics: [
              'Quick Sort, Merge Sort',
              'Karatsuba Algorithm',
              'N-Queens Problem',
              'Graph Coloring',
              '0/1 Knapsack (Backtracking)',
              'Job Selection (Branch & Bound)',
              'Subset Sum',
            ],
          },
          {
            name: 'Module 4: Greedy & Dynamic Programming',
            topics: [
              'Huffman Coding',
              "Prim's & Kruskal's MST",
              "Dijkstra's Algorithm",
              'Matrix Chain Multiplication',
              'Longest Common Subsequence (LCS)',
            ],
          },
          {
            name: 'Module 5: Complexity & Approximation',
            topics: [
              'Class P, NP',
              'NP-Completeness',
              'SAT, 3SAT',
              'Clique, Independent Set',
              'Vertex Cover Approximation',
              'Set Cover',
              'TSP Approximation',
            ],
          },
        ],
      },
    ],
  },
];
