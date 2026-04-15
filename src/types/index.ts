export interface Profile {
  id: string;
  reg_no: string;
  full_name: string;
  branch: string;
  college_year: string;
  college_name: string;
  total_study_minutes: number;
  streak_days: number;
  last_study_date: string | null;
  created_at: string;
}

export interface Subject {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
  // computed
  modules?: Module[];
  total_topics?: number;
  completed_topics?: number;
  total_study_minutes?: number;
}

export interface Module {
  id: string;
  subject_id: string;
  user_id: string;
  name: string;
  order_index: number;
  created_at: string;
  // computed
  topics?: Topic[];
}

export interface Topic {
  id: string;
  module_id: string;
  user_id: string;
  name: string;
  is_completed: boolean;
  study_minutes: number;
  notes: string;
  order_index: number;
  completed_at: string | null;
  created_at: string;
}

export interface Developer {
  id: string;
  name: string;
  role: string;
  email: string;
  github_profile?: string;
  linkedin_profile?: string;
  bio?: string;
  image_url?: string;
  skills: string[];
  contributions?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  name: string;
  code?: string;
  description?: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface College {
  id: string;
  name: string;
  location?: string;
  state?: string;
  country?: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface AcademicYear {
  id: string;
  name: string;
  display_name: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  condition_type: string; // 'subjects_count', 'topics_completed', 'streak_days', 'total_minutes', 'progress_percent', etc.
  condition_value: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  subject_id: string | null;
  module_id: string | null;
  topic_id: string | null;
  duration_minutes: number;
  session_date: string;
  created_at: string;
}

export interface Feedback {
  id: string;
  user_id: string;
  content: string;
  is_featured: boolean;
  created_at: string;
  // joined fields (optional)
  profiles?: {
    full_name: string;
    branch: string;
  };
}

export type NavTab = 'home' | 'subjects' | 'focus' | 'stats' | 'profile';

export type AppView =
  | { type: 'landing' }
  | { type: 'auth' }
  | { type: 'home' }
  | { type: 'subjects' }
  | { type: 'subject-detail'; subjectId: string }
  | { type: 'topic-detail'; topicId: string; moduleId: string; subjectId: string }
  | { type: 'focus' }
  | { type: 'stats' }
  | { type: 'profile' }
  | { type: 'developers' }
  | { type: 'templates' }
  | { type: 'admin' };

