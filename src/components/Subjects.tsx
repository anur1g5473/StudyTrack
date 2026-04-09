import React, { useState } from 'react';
import { Plus, ChevronRight, Clock, X, Loader2, BookOpen, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';

const SUBJECT_ICONS = ['📘', '📗', '📙', '📕', '📓', '🔬', '🧮', '💻', '🌐', '⚙️', '📐', '🧠'];
const SUBJECT_COLORS = [
  '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444',
  '#ec4899', '#3b82f6', '#84cc16', '#f97316',
];

const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
};

interface AddSubjectModalProps {
  onClose: () => void;
  onAdded: () => void;
}

const AddSubjectModal: React.FC<AddSubjectModalProps> = ({ onClose, onAdded }) => {
  const { userId } = useApp();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(SUBJECT_ICONS[0]);
  const [color, setColor] = useState(SUBJECT_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    if (!name.trim()) { setError('Subject name is required.'); return; }
    setLoading(true);
    const { error: err } = await supabase.from('subjects').insert({
      user_id: userId,
      name: name.trim(),
      icon,
      color,
    });
    if (err) { setError(err.message); setLoading(false); return; }
    onAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-3xl p-6 pb-10 shadow-2xl"
        style={{
          background: '#111122',
          border: '1px solid rgba(255,255,255,0.08)',
          borderBottom: 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'rgba(255,255,255,0.15)' }} />

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg">Add Subject</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-widest mb-2 block font-semibold">Subject Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Data Structures"
              className="w-full rounded-2xl px-4 py-3.5 text-white text-sm placeholder-slate-700 transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
              onFocus={(e) => e.currentTarget.style.border = '1px solid rgba(99,102,241,0.5)'}
              onBlur={(e) => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.09)'}
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 uppercase tracking-widest mb-2 block font-semibold">Icon</label>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_ICONS.map((ic) => (
                <button
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className="w-11 h-11 rounded-2xl text-xl flex items-center justify-center transition-all duration-150"
                  style={icon === ic ? {
                    background: 'rgba(99,102,241,0.25)',
                    border: '2px solid rgba(99,102,241,0.7)',
                    transform: 'scale(1.1)',
                  } : {
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500 uppercase tracking-widest mb-2 block font-semibold">Color</label>
            <div className="flex flex-wrap gap-2.5">
              {SUBJECT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full transition-all duration-150"
                  style={{
                    backgroundColor: c,
                    transform: color === c ? 'scale(1.2)' : 'scale(1)',
                    boxShadow: color === c ? `0 0 0 3px rgba(255,255,255,0.9), 0 0 15px ${c}88` : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleAdd}
            disabled={loading}
            className="w-full font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              boxShadow: '0 6px 20px rgba(99,102,241,0.35)',
            }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add Subject
          </button>
        </div>
      </div>
    </div>
  );
};

export const Subjects: React.FC = () => {
  const { subjects, navigate, refreshSubjects } = useApp();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-bold tracking-tight">My Subjects</h2>
          <p className="text-slate-500 text-sm mt-0.5">{subjects.length} subject{subjects.length !== 1 ? 's' : ''} tracked</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-2xl px-4 py-2.5 flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
          }}
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Empty state */}
      {subjects.length === 0 ? (
        <div className="rounded-2xl p-10 text-center"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <BookOpen className="w-6 h-6 text-indigo-500" />
          </div>
          <p className="text-slate-400 font-medium">No subjects yet</p>
          <p className="text-slate-700 text-sm mt-1">Tap "Add" to create your first one</p>
        </div>
      ) : (
        <div className="space-y-3">
          {subjects.map((s) => {
            const pct = s.total_topics
              ? Math.round(((s.completed_topics ?? 0) / s.total_topics) * 100)
              : 0;
            return (
              <button
                key={s.id}
                onClick={() => navigate({ type: 'subject-detail', subjectId: s.id })}
                className="w-full rounded-2xl p-4 text-left transition-all duration-200 active:scale-98"
                style={{
                  background: `${s.color}09`,
                  border: `1px solid ${s.color}28`,
                }}
                onMouseEnter={(e) => e.currentTarget.style.border = `1px solid ${s.color}55`}
                onMouseLeave={(e) => e.currentTarget.style.border = `1px solid ${s.color}28`}
              >
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: `${s.color}18`, border: `1px solid ${s.color}33` }}>
                    {s.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-semibold text-sm truncate">{s.name}</p>
                      <ChevronRight className="w-4 h-4 text-slate-600 shrink-0 ml-2" />
                    </div>
                    <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div
                        className="h-1.5 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: s.color, boxShadow: `0 0 6px ${s.color}88` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-slate-600 text-xs">{s.completed_topics ?? 0}/{s.total_topics ?? 0} topics</span>
                      <div className="flex items-center gap-1 text-slate-600 text-xs">
                        <Clock className="w-3 h-3" />
                        {formatTime(s.total_study_minutes ?? 0)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge row */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: `${s.color}18`, color: s.color }}>
                    {pct}% done
                  </span>
                  {pct === 100 && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>
                      ✓ Complete
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {showModal && (
        <AddSubjectModal
          onClose={() => setShowModal(false)}
          onAdded={refreshSubjects}
        />
      )}
    </div>
  );
};
