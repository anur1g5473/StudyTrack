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
  if (h === 0) return `${m}M`;
  return m === 0 ? `${h}H` : `${h}H ${m}M`;
};

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const statCards = [
  { key: 'time',    icon: Clock,    bg: 'bg-brutal-yellow', color: 'text-black' },
  { key: 'streak',  icon: Flame,    bg: 'bg-brutal-pink',   color: 'text-black' },
  { key: 'overall', icon: Target,   bg: 'bg-brutal-green',  color: 'text-black' },
  { key: 'topics',  icon: BookOpen, bg: 'bg-brutal-blue',   color: 'text-white' },
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
    { value: formatTime(profile?.total_study_minutes ?? 0), label: 'TOTAL STUDY TIME' },
    { value: `${profile?.streak_days ?? 0}`, label: 'DAY STREAK' },
    { value: `${overallPct}%`, label: 'OVERALL PROGRESS' },
    { value: completedTopics, label: 'TOPICS DONE' },
  ];

  return (
    <div className="flex flex-col gap-6 pb-4">
      <div className="brutal-box p-4 bg-white border-4 border-black text-left shadow-[6px_6px_0px_#000]">
         <h2 className="text-black text-3xl font-black tracking-tighter uppercase" style={{textShadow: '2px 2px 0px #00e5a3'}}>WAR ROOM</h2>
         <p className="text-black/80 font-bold text-sm uppercase mt-1">Study Overview & Analytics</p>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={card.key} className={`brutal-card p-4 ${card.bg} border-4 border-black`}>
              <div className="flex justify-between items-start mb-2">
                 <div className="bg-white border-2 border-black w-10 h-10 flex items-center justify-center transform -rotate-3 shadow-[2px_2px_0_#000]">
                    <Icon className="w-5 h-5 text-black stroke-[3]" />
                 </div>
              </div>
              <p className={`text-4xl font-black ${card.color} tracking-tighter`}>{statValues[i].value}</p>
              <p className="text-black font-bold text-xs uppercase mt-1 border-t-2 border-black pt-1">{statValues[i].label}</p>
            </div>
          );
        })}
      </div>

      {/* Weekly chart */}
      <div className="brutal-box p-5 bg-white border-4 border-black shadow-[6px_6px_0px_#000]">
        <div className="flex flex-col items-center mb-6 pb-4 border-b-4 border-black border-dashed">
          <span className="text-black font-black text-xl uppercase tracking-widest">7-DAY BURN RATE</span>
          <span className="text-black bg-brutal-yellow font-bold text-sm uppercase px-3 py-1 border-2 border-black mt-2 -rotate-1">{formatTime(weekTotal)} LOGGED</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-black stroke-[3] animate-spin" />
          </div>
        ) : (
          <div className="flex items-end gap-2 h-40 pt-4">
            {weekData.map((d, i) => {
              const heightPct = maxMins > 0 ? Math.max(8, (d.total_minutes / maxMins) * 100) : 8;
              const dayName = DAYS[new Date(d.session_date + 'T12:00:00').getDay()];
              const isToday = d.session_date === new Date().toISOString().split('T')[0];
              return (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="relative w-full flex justify-center items-end h-full">
                    {d.total_minutes > 0 && (
                      <div className="absolute -top-10 brutal-box bg-white px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 text-xs font-black rotate-3">
                        {formatTime(d.total_minutes)}
                      </div>
                    )}
                    <div
                      className={`w-full border-4 border-black border-b-0 transition-all duration-500 origin-bottom ${isToday ? 'bg-brutal-pink' : d.total_minutes > 0 ? 'bg-brutal-blue' : 'bg-slate-100'}`}
                      style={{
                        height: `${heightPct}%`,
                      }}
                    />
                  </div>
                  <span className={`text-[10px] font-black uppercase mt-2 px-1 border-2 border-black ${isToday ? 'bg-brutal-yellow text-black' : 'bg-white text-black'}`}>
                    {dayName}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Subject breakdown */}
      <div className="brutal-box p-5 bg-brutal-lilac border-4 border-black shadow-[6px_6px_0px_#000]">
        <h3 className="text-black font-black text-xl uppercase mb-6 flex items-center gap-2 underline decoration-4 underline-offset-4 decoration-black">
          <TrendingUp className="w-6 h-6 stroke-[3]" /> MODULE BURN
        </h3>

        {subjects.length === 0 ? (
          <p className="text-black font-bold uppercase text-sm border-2 border-black bg-white p-2">NO GRIND DATA AVAILABLE.</p>
        ) : (
          <div className="space-y-6">
            {subjects.map((s, index) => {
              const pct = s.total_topics
                ? Math.round(((s.completed_topics ?? 0) / s.total_topics) * 100)
                : 0;
              const barColors = ['bg-brutal-pink', 'bg-brutal-green', 'bg-brutal-yellow', 'bg-brutal-blue'];
              const bColor = barColors[index % barColors.length];

              return (
                <div key={s.id} className="bg-white border-4 border-black p-3 hover:-translate-y-1 transition-transform shadow-[4px_4px_0_#000]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl drop-shadow-[2px_2px_0_#000]">{s.icon}</span>
                      <span className="text-black text-lg font-black uppercase truncate max-w-[150px]">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-black font-bold text-xs uppercase px-2 py-0.5 border-2 border-black bg-slate-100">{formatTime(s.total_study_minutes ?? 0)}</span>
                      <span className="text-black text-lg font-black rotate-3">{pct}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 border-2 border-black h-4 flex overflow-hidden">
                    <div
                      className={`h-full border-r-2 border-black transition-all duration-700 ${bColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-black font-bold text-xs uppercase mt-2 text-right">
                    {s.completed_topics ?? 0} / {s.total_topics ?? 0} BLOCKS
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
