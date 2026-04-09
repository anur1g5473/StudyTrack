import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile, Subject, AppView } from '@/types';

interface AppContextType {
  userId: string | null;
  profile: Profile | null;
  loading: boolean;
  subjects: Subject[];
  refreshSubjects: () => Promise<void>;
  view: AppView;
  navigate: (v: AppView) => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [view, setView] = useState<AppView>({ type: 'auth' });
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchProfile = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single();
    if (data) {
      setProfile(data as Profile);
      // Check if user is admin (only user with reg_no "25BYB0101" is admin)
      setIsAdmin((data as Profile).reg_no === '25BYB0101');
    }
  }, []);

  const fetchSubjects = useCallback(async (uid: string) => {
    const { data: subjectsData } = await supabase
      .from('subjects')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: true });

    if (!subjectsData) return;

    const enriched: Subject[] = await Promise.all(
      subjectsData.map(async (s) => {
        const { data: moduleRows } = await supabase
          .from('modules')
          .select('id')
          .eq('subject_id', s.id);

        const moduleIds = (moduleRows ?? []).map((m: { id: string }) => m.id);

        if (moduleIds.length === 0) {
          return { ...s, total_topics: 0, completed_topics: 0, total_study_minutes: 0 } as Subject;
        }

        const { data: topics } = await supabase
          .from('topics')
          .select('is_completed, study_minutes')
          .eq('user_id', uid)
          .in('module_id', moduleIds);

        const total = topics?.length ?? 0;
        const completed = topics?.filter((t) => t.is_completed).length ?? 0;
        const mins = topics?.reduce((sum: number, t: { study_minutes: number }) => sum + (t.study_minutes ?? 0), 0) ?? 0;

        return {
          ...s,
          total_topics: total,
          completed_topics: completed,
          total_study_minutes: mins,
        } as Subject;
      })
    );

    setSubjects(enriched);
  }, []);

  const refreshSubjects = useCallback(async () => {
    if (userId) await fetchSubjects(userId);
  }, [userId, fetchSubjects]);

  const refreshProfile = useCallback(async () => {
    if (userId) await fetchProfile(userId);
  }, [userId, fetchProfile]);

  useEffect(() => {
    // Race the session check with a timeout so the app never hangs on a blank screen
    const sessionPromise = supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        fetchProfile(session.user.id);
        fetchSubjects(session.user.id);
        setView({ type: 'home' });
      }
    });

    const timeoutPromise = new Promise<void>((resolve) => setTimeout(resolve, 4000));

    // Whichever finishes first, we stop loading
    Promise.race([sessionPromise, timeoutPromise]).finally(() => {
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        fetchProfile(session.user.id);
        fetchSubjects(session.user.id);
        setView({ type: 'home' });
      } else {
        setUserId(null);
        setProfile(null);
        setSubjects([]);
        setView({ type: 'auth' });
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [fetchProfile, fetchSubjects]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const navigate = (v: AppView) => {
    // Security: Prevent unauthorized access to admin view
    if (v.type === 'admin' && !isAdmin) {
      console.warn('Unauthorized access attempt to admin panel');
      return;
    }
    setView(v);
  };

  return (
    <AppContext.Provider
      value={{
        userId,
        profile,
        loading,
        subjects,
        refreshSubjects,
        view,
        navigate,
        signOut,
        refreshProfile,
        isAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
