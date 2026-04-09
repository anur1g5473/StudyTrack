import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, ChevronDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import type { Module, Topic } from '@/types';

const PRESETS = [
  { label: '15m', seconds: 15 * 60 },
  { label: '25m', seconds: 25 * 60 },
  { label: '45m', seconds: 45 * 60 },
  { label: '60m', seconds: 60 * 60 },
];

export const Focus: React.FC = () => {
  const { subjects, userId, refreshSubjects, refreshProfile } = useApp();

  const [selectedPreset, setSelectedPreset] = useState(1);
  const [totalSeconds, setTotalSeconds] = useState(PRESETS[1].seconds);
  const [secondsLeft, setSecondsLeft] = useState(PRESETS[1].seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [sessionLogged, setSessionLogged] = useState(false);

  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState('');

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const logSession = useCallback(async (durationSeconds: number) => {
    if (!userId || sessionLogged) return;
    const minutes = Math.max(1, Math.round(durationSeconds / 60));
    await supabase.from('study_sessions').insert({
      user_id: userId,
      subject_id: selectedSubjectId || null,
      module_id: selectedModuleId || null,
      topic_id: selectedTopicId || null,
      duration_minutes: minutes,
    });
    if (selectedTopicId) {
      const { data } = await supabase.from('topics').select('study_minutes').eq('id', selectedTopicId).single();
      if (data) {
        await supabase.from('topics').update({ study_minutes: (data.study_minutes ?? 0) + minutes }).eq('id', selectedTopicId);
      }
    }
    setSessionLogged(true);
    refreshSubjects();
    refreshProfile();
  }, [userId, selectedSubjectId, selectedModuleId, selectedTopicId, sessionLogged, refreshSubjects, refreshProfile]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  useEffect(() => {
    if (finished && !sessionLogged) logSession(totalSeconds);
  }, [finished, sessionLogged, logSession, totalSeconds]);

  useEffect(() => {
    if (!selectedSubjectId) { setModules([]); setSelectedModuleId(''); setTopics([]); setSelectedTopicId(''); return; }
    supabase.from('modules').select('*').eq('subject_id', selectedSubjectId).order('created_at').then(({ data }) => {
      setModules(data ?? []);
      setSelectedModuleId('');
      setTopics([]);
      setSelectedTopicId('');
    });
  }, [selectedSubjectId]);

  useEffect(() => {
    if (!selectedModuleId) { setTopics([]); setSelectedTopicId(''); return; }
    supabase.from('topics').select('*').eq('module_id', selectedModuleId).order('created_at').then(({ data }) => {
      setTopics(data ?? []);
      setSelectedTopicId('');
    });
  }, [selectedModuleId]);

  const selectPreset = (idx: number) => {
    if (isRunning) return;
    setSelectedPreset(idx);
    setTotalSeconds(PRESETS[idx].seconds);
    setSecondsLeft(PRESETS[idx].seconds);
    setFinished(false);
    setSessionLogged(false);
  };

  const handleStart = () => {
    if (finished) {
      setSecondsLeft(totalSeconds);
      setFinished(false);
      setSessionLogged(false);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    if (totalSeconds - secondsLeft > 60) logSession(totalSeconds - secondsLeft);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSecondsLeft(totalSeconds);
    setFinished(false);
    setSessionLogged(false);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progress = 1 - secondsLeft / totalSeconds;
  const circumference = 2 * Math.PI * 88;

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);
  const selectedModule = modules.find((m) => m.id === selectedModuleId);
  const selectedTopic = topics.find((t) => t.id === selectedTopicId);

  const timerColor = finished ? '#10b981' : isRunning ? '#818cf8' : '#334155';
  const timerGlow = isRunning ? '0 0 40px rgba(129,140,248,0.4)' : 'none';

  const selectStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#cbd5e1',
    borderRadius: '16px',
    padding: '12px 40px 12px 16px',
    fontSize: '14px',
    width: '100%',
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
  };

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div className="text-center">
        <h2 className="text-white text-xl font-bold tracking-tight">Focus Mode</h2>
        <p className="text-slate-500 text-sm mt-0.5">Stay in the zone. One task at a time.</p>
      </div>

      {/* Preset selector */}
      <div className="flex gap-2">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => selectPreset(i)}
            className="flex-1 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200"
            style={selectedPreset === i ? {
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
            } : {
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: '#64748b',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Timer ring */}
      <div className="flex flex-col items-center">
        <div className="relative" style={{ filter: isRunning ? 'drop-shadow(0 0 20px rgba(129,140,248,0.35))' : 'none', transition: 'filter 0.5s ease' }}>
          <svg width="220" height="220" className="-rotate-90">
            <circle cx="110" cy="110" r="88" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
            <defs>
              <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={finished ? '#10b981' : '#818cf8'} />
                <stop offset="100%" stopColor={finished ? '#34d399' : '#a78bfa'} />
              </linearGradient>
            </defs>
            <circle
              cx="110" cy="110" r="88"
              fill="none"
              stroke={progress > 0 ? 'url(#timerGrad)' : timerColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-white tabular-nums tracking-tight">
              {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
            <span className="text-slate-400 text-sm mt-1.5 font-medium">
              {finished ? '🎉 Session Done!' : isRunning ? '⏱ Focusing...' : 'Ready to start'}
            </span>
          </div>
        </div>
      </div>

      {/* Subject/topic selection */}
      <div className="rounded-2xl p-4 space-y-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold">Currently Studying</p>

        {/* Subject */}
        <div className="relative">
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            disabled={isRunning}
            style={selectStyle}
          >
            <option value="">Select Subject (optional)</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>

        {/* Module */}
        {modules.length > 0 && (
          <div className="relative">
            <select value={selectedModuleId} onChange={(e) => setSelectedModuleId(e.target.value)} disabled={isRunning} style={selectStyle}>
              <option value="">Select Module (optional)</option>
              {modules.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        )}

        {/* Topic */}
        {topics.length > 0 && (
          <div className="relative">
            <select value={selectedTopicId} onChange={(e) => setSelectedTopicId(e.target.value)} disabled={isRunning} style={selectStyle}>
              <option value="">Select Topic (optional)</option>
              {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        )}

        {(selectedSubject || selectedModule || selectedTopic) && (
          <p className="text-xs font-medium px-1" style={{ color: '#818cf8' }}>
            📍 {[selectedSubject?.name, selectedModule?.name, selectedTopic?.name].filter(Boolean).join(' → ')}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3 items-center">
        <button
          onClick={handleReset}
          className="w-13 h-13 rounded-2xl flex items-center justify-center transition-all duration-200 active:scale-90"
          style={{
            width: 52, height: 52,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#64748b',
          }}
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex-1 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-98"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              boxShadow: timerGlow || '0 8px 25px rgba(99,102,241,0.4)',
            }}
          >
            <Play className="w-5 h-5 fill-white" />
            {finished ? 'Restart' : secondsLeft < totalSeconds ? 'Resume' : 'Start Focus'}
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex-1 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-98"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              color: 'white',
              boxShadow: '0 8px 25px rgba(245,158,11,0.35)',
            }}
          >
            <Pause className="w-5 h-5 fill-white" />
            Pause
          </button>
        )}
      </div>

      {/* Tip */}
      <div className="rounded-2xl p-4"
        style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)' }}>
        <p className="text-violet-300 text-xs font-semibold mb-1">💡 Pomodoro Technique</p>
        <p className="text-slate-500 text-xs leading-relaxed">
          Study 25 min → short 5 min break → repeat. After 4 sessions, take a 15-30 min break. Proven to boost focus and retention!
        </p>
      </div>
    </div>
  );
};
