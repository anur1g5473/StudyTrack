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

export type NavTab = 'home' | 'subjects' | 'focus' | 'stats' | 'profile';

export type AppView =
  | { type: 'auth' }
  | { type: 'home' }
  | { type: 'subjects' }
  | { type: 'subject-detail'; subjectId: string }
  | { type: 'topic-detail'; topicId: string; moduleId: string; subjectId: string }
  | { type: 'focus' }
  | { type: 'stats' }
  | { type: 'profile' }
  | { type: 'templates' }
  | { type: 'admin' };

