import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Check, Clock, Plus, Save, Loader2, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import type { Topic } from '@/types';

interface Props {
  topicId: string;
  moduleId: string;
  subjectId: string;
}

const AddTimeModal: React.FC<{
  onClose: () => void;
  onAdd: (mins: number) => void;
}> = ({ onClose, onAdd }) => {
  const [hours, setHours] = useState('0');
  const [mins, setMins] = useState('0');

  const handleAdd = () => {
    const total = parseInt(hours || '0') * 60 + parseInt(mins || '0');
    if (total > 0) onAdd(total);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-slate-800 border border-slate-700 rounded-t-3xl p-6 pb-10" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg">Add Study Time</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="flex gap-3 mb-5">
          <div className="flex-1">
            <label className="text-xs text-slate-400 mb-1.5 block">Hours</label>
            <input
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 text-center text-lg font-bold"
            />
          </div>
          <div className="flex items-end pb-3 text-slate-400 font-bold text-lg">:</div>
          <div className="flex-1">
            <label className="text-xs text-slate-400 mb-1.5 block">Minutes</label>
            <input
              type="number"
              min="0"
              max="59"
              value={mins}
              onChange={(e) => setMins(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 text-center text-lg font-bold"
            />
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition"
        >
          <Plus className="w-4 h-4" /> Add Time
        </button>
      </div>
    </div>
  );
};

export const TopicDetail: React.FC<Props> = ({ topicId, subjectId }) => {
  const { navigate, refreshSubjects, userId } = useApp();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAddTime, setShowAddTime] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTopic = useCallback(async () => {
    const { data } = await supabase.from('topics').select('*').eq('id', topicId).single();
    if (data) {
      setTopic(data as Topic);
      setNotes(data.notes ?? '');
    }
    setLoading(false);
  }, [topicId]);

  useEffect(() => { fetchTopic(); }, [fetchTopic]);

  const toggleComplete = async () => {
    if (!topic) return;
    const newVal = !topic.is_completed;
    await supabase.from('topics').update({
      is_completed: newVal,
      completed_at: newVal ? new Date().toISOString() : null,
    }).eq('id', topicId);
    fetchTopic();
    refreshSubjects();
  };

  const saveNotes = async () => {
    setSaving(true);
    await supabase.from('topics').update({ notes }).eq('id', topicId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addTime = async (mins: number) => {
    if (!topic || !userId) return;
    const newMins = (topic.study_minutes ?? 0) + mins;
    await supabase.from('topics').update({ study_minutes: newMins }).eq('id', topicId);
    // Log a study session
    await supabase.from('study_sessions').insert({
      user_id: userId,
      topic_id: topicId,
      duration_minutes: mins,
    });
    fetchTopic();
    refreshSubjects();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!topic) return null;

  const studyHours = Math.floor((topic.study_minutes ?? 0) / 60);
  const studyMins = (topic.study_minutes ?? 0) % 60;

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate({ type: 'subject-detail', subjectId })}
          className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-lg truncate">{topic.name}</h2>
          <p className="text-slate-400 text-xs">Topic Details</p>
        </div>
      </div>

      {/* Status card */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Status</p>
            <p className={`font-semibold ${topic.is_completed ? 'text-emerald-400' : 'text-orange-400'}`}>
              {topic.is_completed ? '✓ Completed' : '○ In Progress'}
            </p>
            {topic.completed_at && (
              <p className="text-slate-500 text-xs mt-1">
                Completed {new Date(topic.completed_at).toLocaleDateString()}
              </p>
            )}
          </div>
          <button
            onClick={toggleComplete}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              topic.is_completed
                ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400'
                : 'bg-slate-700 border-2 border-slate-600 text-slate-400 hover:border-indigo-400'
            }`}
          >
            <Check className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Time card */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Time Studied</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">
                {studyHours > 0 ? `${studyHours}h ` : ''}{studyMins}m
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddTime(true)}
              className="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-400 rounded-xl px-4 py-2.5 flex items-center gap-1.5 text-sm font-semibold transition"
            >
              <Plus className="w-4 h-4" />
              <Clock className="w-4 h-4" />
              Add Time
            </button>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 flex flex-col gap-3">
        <p className="text-slate-400 text-xs uppercase tracking-wider">Notes</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write your notes, key concepts, formulas here..."
          rows={8}
          className="w-full bg-slate-900/40 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm resize-none leading-relaxed"
        />
        <button
          onClick={saveNotes}
          disabled={saving}
          className={`self-end px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
            saved
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
          }`}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <><Check className="w-4 h-4" /> Saved!</>
          ) : (
            <><Save className="w-4 h-4" /> Save Notes</>
          )}
        </button>
      </div>

      {showAddTime && (
        <AddTimeModal onClose={() => setShowAddTime(false)} onAdd={addTime} />
      )}
    </div>
  );
};
