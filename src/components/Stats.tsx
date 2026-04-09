import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Flame, TrendingUp, BookOpen, Loader2, Target } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';

interface DaySession {
  session_date: string;
  total_minutes: number;
}

const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const statCards = [
  { key: 'time',    icon: Clock,    color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.2)' },
  { key: 'streak',  icon: Flame,    color: '#fb923c', bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.2)' },
  { key: 'overall', icon: Target,   color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.2)' },
  { key: 'topics',  icon: BookOpen, color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.2)' },
];

export const Stats: React.FC = () => {
  const { subjects, profile, userId } = useApp();
  const [weekData, setWeekData] = useState<DaySession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWeekData = useCallback(async () => {
    if (!userId) return;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const dateStr = sevenDaysAgo.toISOString().split('T')[0];

    const { data } = await supabase
      .from('study_sessions')
      .select('session_date, duration_minutes')
      .eq('user_id', userId)
      .gte('session_date', dateStr)
      .order('session_date', { ascending: true });

    if (!data) { setLoading(false); return; }

    const grouped: Record<string, number> = {};
    data.forEach((s: { session_date: string; duration_minutes: number }) => {
      grouped[s.session_date] = (grouped[s.session_date] ?? 0) + s.duration_minutes;
    });

    const result: DaySession[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      result.push({ session_date: key, total_minutes: grouped[key] ?? 0 });
    }

    setWeekData(result);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchWeekData(); }, [fetchWeekData]);

  const totalTopics = subjects.reduce((sum, s) => sum + (s.total_topics ?? 0), 0);
  const completedTopics = subjects.reduce((sum, s) => sum + (s.completed_topics ?? 0), 0);
  const overallPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const maxMins = Math.max(...weekData.map((d) => d.total_minutes), 1);
  const weekTotal = weekData.reduce((sum, d) => sum + d.total_minutes, 0);

  const statValues = [
    { value: formatTime(profile?.total_study_minutes ?? 0), label: 'Total Study Time' },
    { value: `${profile?.streak_days ?? 0}🔥`, label: 'Day Streak' },
    { value: `${overallPct}%`, label: 'Overall Progress' },
    { value: completedTopics, label: 'Topics Done' },
  ];

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div>
        <h2 className="text-white text-xl font-bold tracking-tight">Statistics</h2>
        <p className="text-slate-500 text-sm mt-0.5">Your study overview</p>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={card.key} className="rounded-2xl p-4"
              style={{ background: card.bg, border: `1px solid ${card.border}` }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${card.color}22` }}>
                <Icon className="w-4.5 h-4.5" style={{ color: card.color, width: 18, height: 18 }} />
              </div>
              <p className="text-2xl font-bold text-white">{statValues[i].value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{statValues[i].label}</p>
            </div>
          );
        })}
      </div>

      {/* Weekly chart */}
      <div className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between mb-5">
          <span className="text-white font-semibold text-sm">This Week</span>
          <span className="text-slate-500 text-xs">{formatTime(weekTotal)} total</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
          </div>
        ) : (
          <div className="flex items-end gap-1.5 h-28">
            {weekData.map((d, i) => {
              const heightPct = maxMins > 0 ? Math.max(4, (d.total_minutes / maxMins) * 100) : 4;
              const dayName = DAYS[new Date(d.session_date + 'T12:00:00').getDay()];
              const isToday = d.session_date === new Date().toISOString().split('T')[0];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="relative w-full flex justify-center group">
                    {d.total_minutes > 0 && (
                      <div className="absolute -top-7 rounded-md px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 text-[10px]"
                        style={{ background: 'rgba(99,102,241,0.9)', color: 'white' }}>
                        {formatTime(d.total_minutes)}
                      </div>
                    )}
                    <div
                      className="w-full rounded-t-xl transition-all duration-500"
                      style={{
                        height: `${heightPct}%`,
                        background: isToday
                          ? 'linear-gradient(180deg, #818cf8, #6366f1)'
                          : d.total_minutes > 0
                          ? 'rgba(99,102,241,0.4)'
                          : 'rgba(255,255,255,0.05)',
                        boxShadow: isToday ? '0 0 12px rgba(129,140,248,0.4)' : 'none',
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold"
                    style={{ color: isToday ? '#818cf8' : '#475569' }}>
                    {dayName}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Subject breakdown */}
      <div className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-white font-semibold text-sm">Subject Breakdown</span>
        </div>

        {subjects.length === 0 ? (
          <p className="text-slate-600 text-sm">No subjects added yet.</p>
        ) : (
          <div className="space-y-4">
            {subjects.map((s) => {
              const pct = s.total_topics
                ? Math.round(((s.completed_topics ?? 0) / s.total_topics) * 100)
                : 0;
              return (
                <div key={s.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{s.icon}</span>
                      <span className="text-slate-300 text-sm font-medium">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 text-xs">{formatTime(s.total_study_minutes ?? 0)}</span>
                      <span className="text-xs font-bold" style={{ color: s.color }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}66` }}
                    />
                  </div>
                  <p className="text-slate-600 text-xs mt-1">
                    {s.completed_topics ?? 0} / {s.total_topics ?? 0} topics
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
