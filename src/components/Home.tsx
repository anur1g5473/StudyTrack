import React from 'react';
import { Zap, ChevronRight, BookOpen, Flame, Clock, TrendingUp, AlertTriangle, BookMarked, Lock } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
};

const ProgressBar: React.FC<{ value: number; color?: string }> = ({ value, color = '#6366f1' }) => (
  <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.07)' }}>
    <div
      className="h-1.5 rounded-full transition-all duration-700"
      style={{ width: `${Math.min(100, value)}%`, background: color }}
    />
  </div>
);

export const Home: React.FC = () => {
  const { profile, subjects, navigate, isAdmin } = useApp();

  const totalTopics = subjects.reduce((sum, s) => sum + (s.total_topics ?? 0), 0);
  const completedTopics = subjects.reduce((sum, s) => sum + (s.completed_topics ?? 0), 0);
  const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const weakestSubject = subjects.reduce(
    (min, s) => {
      const pct = s.total_topics ? Math.round(((s.completed_topics ?? 0) / s.total_topics) * 100) : 0;
      const minPct = min?.total_topics ? Math.round(((min.completed_topics ?? 0) / min.total_topics) * 100) : 100;
      return pct < minPct ? s : min;
    },
    null as typeof subjects[0] | null
  );

  const weakPct = weakestSubject?.total_topics
    ? Math.round(((weakestSubject.completed_topics ?? 0) / weakestSubject.total_topics) * 100)
    : 0;

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'Good Morning' : greetingHour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="flex flex-col gap-4 pb-4">

      {/* Hero Banner */}
      <div className="rounded-3xl p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #312e81 0%, #4c1d95 50%, #1e1b4b 100%)',
          boxShadow: '0 20px 60px rgba(99,102,241,0.3)',
          border: '1px solid rgba(139,92,246,0.25)',
        }}>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />

        <div className="relative">
          <p className="text-violet-300 text-sm font-medium">{greeting} 👋</p>
          <h2 className="text-white text-2xl font-bold mt-0.5 tracking-tight">
            {profile?.reg_no ?? 'Student'}
          </h2>

          {/* Stat pills */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <div className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5"
              style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}>
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-white text-xs font-semibold">{profile?.streak_days ?? 0}d streak</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5"
              style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}>
              <Clock className="w-3.5 h-3.5 text-blue-300" />
              <span className="text-white text-xs font-semibold">{formatTime(profile?.total_study_minutes ?? 0)}</span>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-violet-200 font-medium">Overall Progress</span>
              <span className="text-white font-bold">{overallProgress}%</span>
            </div>
            <div className="w-full rounded-full h-2.5" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <div
                className="h-2.5 rounded-full transition-all duration-700"
                style={{
                  width: `${overallProgress}%`,
                  background: 'linear-gradient(90deg, #34d399, #10b981)',
                  boxShadow: '0 0 10px rgba(52,211,153,0.5)',
                }}
              />
            </div>
            <p className="text-violet-300 text-xs mt-1.5">{completedTopics} / {totalTopics} topics completed</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-yellow-500" /> Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate({ type: 'subjects' })}
            className="rounded-2xl p-4 flex flex-col gap-3 text-left transition-all duration-200 active:scale-95"
            style={{
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.18)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.border = '1px solid rgba(99,102,241,0.4)'}
            onMouseLeave={(e) => e.currentTarget.style.border = '1px solid rgba(99,102,241,0.18)'}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}>
              <BookOpen className="w-5 h-5" style={{ color: '#818cf8' }} />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Study</p>
              <p className="text-slate-500 text-xs">Pick a topic</p>
            </div>
          </button>

          <button
            onClick={() => navigate({ type: 'focus' })}
            className="rounded-2xl p-4 flex flex-col gap-3 text-left transition-all duration-200 active:scale-95"
            style={{
              background: 'rgba(139,92,246,0.08)',
              border: '1px solid rgba(139,92,246,0.18)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.border = '1px solid rgba(139,92,246,0.4)'}
            onMouseLeave={(e) => e.currentTarget.style.border = '1px solid rgba(139,92,246,0.18)'}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}>
              <Zap className="w-5 h-5" style={{ color: '#a78bfa' }} />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Focus</p>
              <p className="text-slate-500 text-xs">Pomodoro timer</p>
            </div>
          </button>

          <button
            onClick={() => navigate({ type: 'templates' })}
            className="rounded-2xl p-4 flex flex-col gap-3 text-left transition-all duration-200 active:scale-95"
            style={{
              background: 'rgba(34,211,153,0.08)',
              border: '1px solid rgba(34,211,153,0.18)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.border = '1px solid rgba(34,211,153,0.4)'}
            onMouseLeave={(e) => e.currentTarget.style.border = '1px solid rgba(34,211,153,0.18)'}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(34,211,153,0.2)', border: '1px solid rgba(34,211,153,0.3)' }}>
              <BookMarked className="w-5 h-5" style={{ color: '#34d399' }} />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Templates</p>
              <p className="text-slate-500 text-xs">Add from templates</p>
            </div>
          </button>

          {isAdmin && (
            <button
              onClick={() => navigate({ type: 'admin' })}
              className="rounded-2xl p-4 flex flex-col gap-3 text-left transition-all duration-200 active:scale-95"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.18)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.border = '1px solid rgba(239,68,68,0.4)'}
              onMouseLeave={(e) => e.currentTarget.style.border = '1px solid rgba(239,68,68,0.18)'}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <Lock className="w-5 h-5" style={{ color: '#ef4444' }} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Admin</p>
                <p className="text-slate-500 text-xs">Manage system</p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Weak Subject Alert */}
      {weakestSubject && weakPct < 60 && (
        <button
          className="w-full rounded-2xl p-4 text-left transition-all duration-200 active:scale-98"
          onClick={() => navigate({ type: 'subject-detail', subjectId: weakestSubject.id })}
          style={{
            background: 'rgba(251,146,60,0.07)',
            border: '1px solid rgba(251,146,60,0.22)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(251,146,60,0.2)' }}>
              <AlertTriangle className="w-4 h-4 text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-0.5">
                Needs Attention ⚠️
              </p>
              <p className="text-white font-semibold text-sm">
                {weakestSubject.icon} {weakestSubject.name}
              </p>
              <div className="mt-1.5">
                <ProgressBar value={weakPct} color="#fb923c" />
                <p className="text-slate-500 text-xs mt-1">{weakPct}% completed</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-orange-400 shrink-0" />
          </div>
        </button>
      )}

      {/* Subjects Overview */}
      {subjects.length > 0 && (
        <div className="rounded-2xl p-4"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Subjects Overview
          </h3>
          <div className="space-y-4">
            {subjects.slice(0, 4).map((s) => {
              const pct = s.total_topics
                ? Math.round(((s.completed_topics ?? 0) / s.total_topics) * 100)
                : 0;
              return (
                <button
                  key={s.id}
                  className="w-full text-left transition-opacity duration-150 active:opacity-70"
                  onClick={() => navigate({ type: 'subject-detail', subjectId: s.id })}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-slate-300 text-sm font-medium">
                      {s.icon} {s.name}
                    </span>
                    <span className="text-xs font-bold"
                      style={{ color: pct >= 70 ? '#34d399' : pct >= 40 ? '#818cf8' : '#fb923c' }}>
                      {pct}%
                    </span>
                  </div>
                  <ProgressBar
                    value={pct}
                    color={pct >= 70 ? '#34d399' : pct >= 40 ? '#6366f1' : '#fb923c'}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {subjects.length === 0 && (
        <div className="rounded-2xl p-10 text-center"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(255,255,255,0.1)',
          }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <BookOpen className="w-6 h-6 text-indigo-500" />
          </div>
          <p className="text-slate-400 font-semibold">No subjects yet</p>
          <p className="text-slate-600 text-sm mt-1">Add your first subject to get started</p>
          <button
            onClick={() => navigate({ type: 'subjects' })}
            className="mt-4 font-semibold px-6 py-2.5 rounded-xl text-sm text-white transition-all duration-200"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}
          >
            Add Subject
          </button>
        </div>
      )}
    </div>
  );
};
