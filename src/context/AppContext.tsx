import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { idbGet, idbSet } from '@/lib/offlineDB';
import { flushOfflineQueue } from '@/lib/syncQueue';
import type { Profile, Subject, AppView, Developer, Branch, College, AcademicYear, Achievement } from '@/types';

interface AppContextType {
  userId: string | null;
  profile: Profile | null;
  loading: boolean;
  isOnline: boolean;
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
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
  theme: 'brutal' | 'glass';
  setTheme: (t: 'brutal' | 'glass') => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [view, setView] = useState<AppView>({ type: 'landing' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setTheme] = useState<'brutal' | 'glass'>('brutal');
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (theme === 'glass') {
      document.body.setAttribute('data-theme', 'glass');
    } else {
      document.body.removeAttribute('data-theme');
    }
    // Persist theme preference
    idbSet('theme', theme);
  }, [theme]);

  // Restore theme from IndexedDB on startup
  useEffect(() => {
    idbGet<'brutal' | 'glass'>('theme').then((saved) => {
      if (saved === 'brutal' || saved === 'glass') setTheme(saved);
    });
  }, []);

  // ── Online / Offline tracking + auto-sync ─────────────────
  useEffect(() => {
    const goOnline = async () => {
      setIsOnline(true);
      try {
        const { synced } = await flushOfflineQueue();
        // Refresh data from server after sync
        if (synced > 0 && userIdRef.current) {
          fetchProfile(userIdRef.current);
          fetchSubjects(userIdRef.current);
        }
      } catch (e) {
        console.error('[StudyTrack] Sync flush error', e);
      }
    };
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Service Worker message: FLUSH_QUEUE (from background sync) ──
  useEffect(() => {
    const onMessage = async (e: MessageEvent) => {
      if (e.data?.type === 'FLUSH_QUEUE') {
        const { synced } = await flushOfflineQueue();
        if (synced > 0 && userIdRef.current) {
          fetchProfile(userIdRef.current);
          fetchSubjects(userIdRef.current);
        }
      }
    };
    navigator.serviceWorker?.addEventListener('message', onMessage);
    return () => navigator.serviceWorker?.removeEventListener('message', onMessage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── App Visibility: refresh data when app is foregrounded ──
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && navigator.onLine && userIdRef.current) {
        fetchProfile(userIdRef.current);
        fetchSubjects(userIdRef.current);
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = useCallback(async (uid: string) => {
    // Always try network first
    if (navigator.onLine) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', uid)
          .single();

        if (data) {
          setProfile(data as Profile);
          setIsAdmin(((data as Profile).reg_no || '').toUpperCase() === '25BYB0101');
          // Cache for offline
          await idbSet(`profile:${uid}`, data);
          return;
        } else if (error && error.code === 'PGRST116') {
          // Auto-heal: create missing profile row
          const session = await supabase.auth.getSession();
          const user = session.data.session?.user;
          if (user) {
            const regNo = user.user_metadata?.reg_no || user.email?.split('@')[0].toUpperCase();
            const { data: newProfile } = await supabase
              .from('profiles')
              .insert({ id: uid, reg_no: regNo })
              .select('*')
              .single();
            if (newProfile) {
              setProfile(newProfile as Profile);
              setIsAdmin(((newProfile as Profile).reg_no || '').toUpperCase() === '25BYB0101');
              await idbSet(`profile:${uid}`, newProfile);
            }
          }
          return;
        }
      } catch {
        // Fall through to offline cache below
      }
    }
    // Offline fallback: serve from IndexedDB
    const cached = await idbGet<Profile>(`profile:${uid}`);
    if (cached) {
      setProfile(cached);
      setIsAdmin((cached.reg_no || '').toUpperCase() === '25BYB0101');
    }
  }, []);

  const fetchSubjects = useCallback(async (uid: string) => {
    if (navigator.onLine) {
      try {
        const { data: subjectsData } = await supabase
          .from('subjects')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: true });

        if (subjectsData) {
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

              return {
                ...s,
                total_topics: topics?.length ?? 0,
                completed_topics: topics?.filter((t) => t.is_completed).length ?? 0,
                total_study_minutes: topics?.reduce((sum: number, t: { study_minutes: number }) => sum + (t.study_minutes ?? 0), 0) ?? 0,
              } as Subject;
            })
          );
          setSubjects(enriched);
          // Cache for offline access
          await idbSet(`subjects:${uid}`, enriched);
          return;
        }
      } catch {
        // Fall through to offline cache
      }
    }
    // Offline fallback
    const cached = await idbGet<Subject[]>(`subjects:${uid}`);
    if (cached) setSubjects(cached);
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
    const init = async (uid: string) => {
      userIdRef.current = uid;
      setUserId(uid); // ← CRITICAL: populate userId state so inserts have the right user_id
      // Immediately try to load from cache so app opens instantly
      const cachedProfile = await idbGet<Profile>(`profile:${uid}`);
      if (cachedProfile) {
        setProfile(cachedProfile);
        setIsAdmin((cachedProfile.reg_no || '').toUpperCase() === '25BYB0101');
      }
      const cachedSubjects = await idbGet<Subject[]>(`subjects:${uid}`);
      if (cachedSubjects) setSubjects(cachedSubjects);

      // Then hydrate from network (if online)
      fetchProfile(uid);
      fetchSubjects(uid);
      fetchDevelopers();
      fetchSystemConfig();
      setView({ type: 'home' });
    };

    const sessionPromise = supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) init(session.user.id);
    });

    const timeoutPromise = new Promise<void>((resolve) => setTimeout(resolve, 4000));
    Promise.race([sessionPromise, timeoutPromise]).finally(() => setLoading(false));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        init(session.user.id);
      } else {
        userIdRef.current = null;
        setUserId(null);
        setProfile(null);
        setSubjects([]);
        setDevelopers([]);
        setBranches([]);
        setColleges([]);
        setAcademicYears([]);
        setAchievements([]);
        setView({ type: 'landing' });
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
        isOnline,
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
        theme,
        setTheme,
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
