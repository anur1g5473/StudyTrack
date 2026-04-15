import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile, Subject, AppView, Developer, Branch, College, AcademicYear, Achievement } from '@/types';

interface AppContextType {
  userId: string | null;
  profile: Profile | null;
  loading: boolean;
  subjects: Subject[];
  developers: Developer[];
  branches: Branch[];
  colleges: College[];
  academicYears: AcademicYear[];
  achievements: Achievement[];
  refreshSubjects: () => Promise<void>;
  refreshDevelopers: () => Promise<void>;
  refreshSystemConfig: () => Promise<void>;
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
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [view, setView] = useState<AppView>({ type: 'auth' });
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchProfile = useCallback(async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();
        
      if (data) {
        setProfile(data as Profile);
        setIsAdmin(((data as Profile).reg_no || '').toUpperCase() === '25BYB0101');
      } else if (error && error.code === 'PGRST116') {
        // PGRST116 means zero rows found. Auto-heal the database!
        const session = await supabase.auth.getSession();
        const user = session.data.session?.user;
        if (user) {
          const regNo = user.user_metadata?.reg_no || user.email?.split('@')[0].toUpperCase();
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({ id: uid, reg_no: regNo })
            .select('*')
            .single();
            
          if (newProfile && !insertError) {
            setProfile(newProfile as Profile);
            setIsAdmin(((newProfile as Profile).reg_no || '').toUpperCase() === '25BYB0101');
          } else if (insertError) {
            window.alert('Auto-Heal Insert Error: ' + insertError.message + ' | Code: ' + insertError.code);
          }
        }
      } else if (error) {
        window.alert('Generic Profile Fetch Error: ' + error.message + ' | Code: ' + error.code);
      } else {
        window.alert('Profile Fetch returned absolutely no data and no error!');
      }
    } catch (err: any) {
      console.error('Error in fetchProfile:', err);
      window.alert('Profile Fetch Error: ' + err.message);
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

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const fetchDevelopers = useCallback(async () => {
    const { data } = await supabase
      .from('developers')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });
    if (data) setDevelopers(data as Developer[]);
  }, []);

  const refreshDevelopers = useCallback(async () => {
    await fetchDevelopers();
  }, [fetchDevelopers]);

  const fetchSystemConfig = useCallback(async () => {
    // Fetch branches
    const { data: branchesData } = await supabase
      .from('branches')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    if (branchesData) setBranches(branchesData as Branch[]);

    // Fetch colleges
    const { data: collegesData } = await supabase
      .from('colleges')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    if (collegesData) setColleges(collegesData as College[]);

    // Fetch academic years
    const { data: yearsData } = await supabase
      .from('academic_years')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    if (yearsData) setAcademicYears(yearsData as AcademicYear[]);

    // Fetch achievements
    const { data: achievementsData } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (achievementsData) setAchievements(achievementsData as Achievement[]);
  }, []);

  const refreshSystemConfig = useCallback(async () => {
    await fetchSystemConfig();
  }, [fetchSystemConfig]);

  useEffect(() => {
    // Race the session check with a timeout so the app never hangs on a blank screen
    const sessionPromise = supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        fetchProfile(session.user.id);
        fetchSubjects(session.user.id);
        fetchDevelopers();
        fetchSystemConfig();
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
        fetchDevelopers();
        fetchSystemConfig();
        setView({ type: 'home' });
      } else {
        setUserId(null);
        setProfile(null);
        setSubjects([]);
        setDevelopers([]);
        setBranches([]);
        setColleges([]);
        setAcademicYears([]);
        setAchievements([]);
        setView({ type: 'auth' });
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [fetchProfile, fetchSubjects, fetchDevelopers, fetchSystemConfig]);

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
        developers,
        branches,
        colleges,
        academicYears,
        achievements,
        refreshSubjects,
        refreshDevelopers,
        refreshSystemConfig,
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
