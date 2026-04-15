import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import type { Module, Topic } from '@/types';

const PRESETS = [
  { label: '15M', seconds: 15 * 60 },
  { label: '25M', seconds: 25 * 60 },
  { label: '45M', seconds: 45 * 60 },
  { label: '60M', seconds: 60 * 60 },
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
  
  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);
  const selectedModule = modules.find((m) => m.id === selectedModuleId);
  const selectedTopic = topics.find((t) => t.id === selectedTopicId);

  const selectStyle: React.CSSProperties = {
    background: '#fff',
    border: '3px solid #000',
    color: '#000',
    borderRadius: '0px',
    padding: '12px 40px 12px 16px',
    fontSize: '14px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    width: '100%',
    appearance: 'none',
    WebkitAppearance: 'none',
    boxShadow: '4px 4px 0px #000'
  };

  return (
    <div className="flex flex-col gap-6 pb-4">
      <div className="brutal-box p-4 bg-brutal-blue border-4 border-black text-center shadow-[6px_6px_0px_#000]">
        <h2 className="text-white text-3xl font-black tracking-tighter uppercase">Focus Tracker</h2>
        <p className="text-white/80 font-bold text-sm uppercase mt-1">One task. Total lock in.</p>
      </div>

      {/* Preset selector */}
      <div className="flex gap-2">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => selectPreset(i)}
            className={`flex-1 py-3 text-sm font-black border-2 border-black transition-transform active:translate-y-1 ${
               selectedPreset === i 
                 ? 'bg-black text-brutal-yellow shadow-none translate-y-1' 
                 : 'bg-white text-black shadow-[3px_3px_0px_#000] hover:-translate-y-1 hover:shadow-[4px_6px_0px_#000]'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Timer Display block */}
      <div className="brutal-box overflow-hidden bg-white">
         <div className="p-8 pb-4 text-center">
            <span className="text-[5rem] leading-none font-black text-black tabular-nums tracking-tighter drop-shadow-[4px_4px_0_theme(colors.brutal.blue)]" style={{textShadow: '4px 4px 0px #23a0ff'}}>
               {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
            <div className="mt-4 flex justify-center">
               <span className={`px-4 py-1 border-2 border-black font-black uppercase text-xs ${finished ? 'bg-brutal-green' : isRunning ? 'bg-brutal-pink animate-pulse' : 'bg-slate-200'}`}>
                  {finished ? '🎉 STOPWATCH DONE' : isRunning ? '⏱ LOGGING FOCUS...' : 'AWAITING START'}
               </span>
            </div>
         </div>
         {/* Brutal progress bar replacing circular ring */}
         <div className="w-full h-8 border-t-4 border-black bg-slate-200 mt-4 relative overflow-hidden">
            <div 
               className={`h-full border-r-4 border-black transition-all duration-1000 ${finished ? 'bg-brutal-green' : 'bg-brutal-blue'}`}
               style={{ width: `${Math.min(100, progress * 100)}%` }}
            />
            {/* Grid pattern overlay on progress bar */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNSIgY3k9IjUiIHI9IjAuNSIgZmlsbD0icmdiYSgwLDAsMCwwLjMpIi8+PC9zdmc+')] opacity-50" />
         </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 items-center">
        <button
          onClick={handleReset}
          className="w-16 h-16 brutal-box bg-white flex items-center justify-center active:translate-y-2 active:translate-x-2 active:shadow-none hover:bg-slate-100 transition-all p-0"
        >
          <RotateCcw className="w-8 h-8 text-black" strokeWidth={3} />
        </button>

        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex-1 h-16 font-black text-2xl uppercase brutal-box bg-brutal-green text-black flex items-center justify-center gap-2 active:translate-y-2 active:translate-x-2 active:shadow-none hover:bg-[#00ffd6] transition-all"
          >
            <Play className="w-8 h-8 fill-black" strokeWidth={3} />
            {finished ? 'RESTART' : secondsLeft < totalSeconds ? 'RESUME' : 'START NOW'}
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex-1 h-16 font-black text-2xl uppercase brutal-box bg-brutal-orange text-white flex items-center justify-center gap-2 active:translate-y-2 active:translate-x-2 active:shadow-none hover:bg-[#ff7b52] transition-all"
          >
            <Pause className="w-8 h-8 fill-white" strokeWidth={3} />
            PAUSE
          </button>
        )}
      </div>

      {/* Target selection */}
      <div className="brutal-box p-5 space-y-4 bg-brutal-yellow">
        <p className="text-black text-lg font-black uppercase underline decoration-4 underline-offset-4 decoration-black">Session Target</p>

        {/* Subject */}
        <div className="relative">
          <select value={selectedSubjectId} onChange={(e) => setSelectedSubjectId(e.target.value)} disabled={isRunning} style={selectStyle}>
            <option value="">SELECT SUBJECT (OPTIONAL)</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-black pointer-events-none" strokeWidth={3} />
        </div>

        {/* Module */}
        {modules.length > 0 && (
          <div className="relative">
            <select value={selectedModuleId} onChange={(e) => setSelectedModuleId(e.target.value)} disabled={isRunning} style={selectStyle}>
              <option value="">SELECT MODULE (OPTIONAL)</option>
              {modules.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-black pointer-events-none" strokeWidth={3} />
          </div>
        )}

        {/* Topic */}
        {topics.length > 0 && (
          <div className="relative">
            <select value={selectedTopicId} onChange={(e) => setSelectedTopicId(e.target.value)} disabled={isRunning} style={selectStyle}>
              <option value="">SELECT TOPIC (OPTIONAL)</option>
              {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-black pointer-events-none" strokeWidth={3} />
          </div>
        )}

        {(selectedSubject || selectedModule || selectedTopic) && (
          <div className="bg-white border-2 border-black px-3 py-2 mt-2 font-bold text-sm text-black flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brutal-green" />
            <span className="truncate">
               {[selectedSubject?.name, selectedModule?.name, selectedTopic?.name].filter(Boolean).join(' → ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
