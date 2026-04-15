import React, { useState } from 'react';
import { Plus, ChevronRight, Clock, X, Loader2, BookOpen, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';

const SUBJECT_ICONS = ['📘', '📗', '📙', '📕', '📓', '🔬', '🧮', '💻', '🌐', '⚙️', '📐', '🧠'];
const SUBJECT_COLORS = [
  '#fff', '#ffe600', '#ff90e8', '#23a0ff', '#00e5a3', '#ff5722', '#d1c4e9', '#ffb5a7'
];

const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}M`;
  return `${h}H ${m}M`;
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
    if (!name.trim()) { setError('SUBJECT NAME IS REQUIRED.'); return; }
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}>
      <div
        className="w-full max-w-md brutal-box bg-white p-6 shadow-[8px_8px_0px_#000]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-black">
          <h3 className="text-black font-black text-2xl uppercase">ADD SUBJECT</h3>
          <button onClick={onClose} className="w-10 h-10 brutal-box bg-brutal-pink flex items-center justify-center hover:bg-red-500 active:translate-y-1 active:translate-x-1 active:shadow-none transition-all">
            <X className="w-6 h-6 text-black stroke-[3]" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm text-black font-black uppercase tracking-widest mb-2 block">NAME</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.G. DATA STRUCTURES"
              className="w-full px-4 py-3 text-black text-lg font-bold border-4 border-black placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brutal-blue rounded-none"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm text-black font-black uppercase tracking-widest mb-2 block">ICON</label>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_ICONS.map((ic) => (
                <button
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className={`w-12 h-12 text-2xl flex items-center justify-center border-4 border-black transition-transform active:translate-y-1 ${icon === ic ? 'bg-brutal-yellow -translate-y-2 shadow-[2px_4px_0_#000]' : 'bg-white hover:bg-slate-100'}`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-black font-black uppercase tracking-widest mb-2 block">COLOR ID</label>
            <div className="flex flex-wrap gap-3">
              {SUBJECT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 border-4 border-black transition-transform active:scale-90 ${color === c ? 'scale-110 shadow-[4px_4px_0_#000] rotate-6' : 'hover:scale-105 hover:-rotate-3'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-white bg-red-600 font-bold p-2 text-sm uppercase text-center border-2 border-black">{error}</p>}

          <button
            onClick={handleAdd}
            disabled={loading}
            className="w-full font-black text-xl py-4 flex items-center justify-center gap-2 brutal-btn bg-brutal-green text-black hover:bg-[#00ffb5]"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6 stroke-[3]" />}
            CREATE SUBJECT
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
    <div className="flex flex-col gap-6 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-brutal-yellow brutal-box p-4 shadow-[4px_4px_0_#000]">
        <div>
          <h2 className="text-black text-3xl font-black uppercase tracking-tighter">LIBRARY</h2>
          <p className="text-black font-bold text-sm uppercase mt-1 px-2 py-0.5 border-2 border-black bg-white inline-block">{subjects.length} ACTIVE</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-14 h-14 bg-brutal-blue brutal-btn flex items-center justify-center text-white"
        >
          <Plus className="w-8 h-8 stroke-[3]" />
        </button>
      </div>

      {/* Empty state */}
      {subjects.length === 0 ? (
        <div className="brutal-box p-8 text-center bg-brutal-pink">
          <div className="w-20 h-20 brutal-box bg-white flex items-center justify-center mx-auto mb-6 transform -rotate-12 border-dashed">
            <BookOpen className="w-10 h-10 text-black stroke-[3]" />
          </div>
          <p className="text-black font-black text-2xl uppercase">EMPTY LIBRARY</p>
          <p className="text-black/80 font-bold text-sm mt-2 mb-6 uppercase">Time to build your curriculum</p>
          <button
             onClick={() => setShowModal(true)}
             className="brutal-btn bg-white text-black px-6 py-3 text-lg"
          >
             ADD FIRST SUBJECT
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {subjects.map((s) => {
            const pct = s.total_topics
              ? Math.round(((s.completed_topics ?? 0) / s.total_topics) * 100)
              : 0;
              
            return (
              <button
                key={s.id}
                onClick={() => navigate({ type: 'subject-detail', subjectId: s.id })}
                className="brutal-card text-left flex flex-col hover:bg-slate-50 overflow-hidden"
                style={{ backgroundColor: s.color || '#fff' }}
              >
                <div className="p-4 flex items-start gap-4">
                  {/* Icon Box */}
                  <div className="w-16 h-16 brutal-box bg-white flex items-center justify-center text-3xl shrink-0 shadow-[2px_2px_0_#000]">
                    {s.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-black font-black text-2xl uppercase truncate leading-none mr-2" style={{textShadow: '1px 1px 0px #fff'}}>{s.name}</p>
                      <div className="w-8 h-8 brutal-box bg-white flex items-center justify-center shadow-none border-2">
                         <ChevronRight className="w-5 h-5 text-black stroke-[3]" />
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-3">
                       <span className="text-black font-black text-sm border-2 border-black bg-white px-2 py-0.5 shadow-[2px_2px_0_#000] -rotate-2">
                           {pct}% DONE
                       </span>
                       <div className="flex items-center gap-1.5 text-black font-bold text-xs bg-white/70 px-2 border-2 border-black py-0.5">
                           <Clock className="w-3 h-3" strokeWidth={3} />
                           {formatTime(s.total_study_minutes ?? 0)}
                       </div>
                    </div>
                  </div>
                </div>

                {/* Brutal Progress Bar Bottom */}
                <div className="w-full h-3 border-t-4 border-black bg-white relative flex">
                  <div
                     className="h-full border-r-4 border-black bg-black transition-all duration-700"
                     style={{ width: `${pct}%` }}
                  />
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
