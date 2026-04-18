import React, { useState } from 'react';
import { ArrowLeft, Check, ChevronDown, ChevronUp, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import { UNIVERSITY_TEMPLATES } from '@/data/templates';
import type { UniversityTemplate } from '@/data/templates';

// ── University card ──────────────────────────────────────────
const UniversityCard: React.FC<{
  template: UniversityTemplate;
  onSelect: () => void;
}> = ({ template, onSelect }) => (
  <button
    onClick={onSelect}
    className="w-full text-left p-5 transition-all brutal-card bg-white border-4 border-black"
  >
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-brutal-yellow border-4 border-black flex items-center justify-center text-3xl shrink-0 shadow-[4px_4px_0_#000]">
        {template.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-black font-black text-xl uppercase tracking-tighter">{template.name}</p>
        <p className="text-black/70 font-bold text-sm mt-0.5 uppercase">{template.location}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs font-black px-2 py-0.5 bg-black text-white border-2 border-black uppercase">
            {template.subjects.length} SUBJECTS
          </span>
          <span className="text-black font-bold text-xs uppercase">
            {template.subjects.reduce((s, sub) => s + sub.modules.length, 0)} MODS •{' '}
            {template.subjects.reduce((s, sub) => s + sub.modules.reduce((m, mod) => m + mod.topics.length, 0), 0)} TOPICS
          </span>
        </div>
      </div>
      <div className="w-10 h-10 border-4 border-black bg-brutal-pink text-black flex items-center justify-center shrink-0">
        <ChevronDown className="w-6 h-6 stroke-[3]" style={{ transform: 'rotate(-90deg)' }} />
      </div>
    </div>
  </button>
);

// ── Subject picker for a chosen university ───────────────────
const SubjectPicker: React.FC<{
  template: UniversityTemplate;
  onBack: () => void;
  onDone: () => void;
}> = ({ template, onBack, onDone }) => {
  const { userId, refreshSubjects } = useApp();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [adding, setAdding] = useState(false);
  const [done, setDone] = useState(false);

  const toggle = (i: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const toggleExpand = (i: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const selectAll = () => setSelected(new Set(template.subjects.map((_, i) => i)));
  const clearAll  = () => setSelected(new Set());

  const handleAdd = async () => {
    if (!userId || selected.size === 0) return;
    setAdding(true);

    for (const idx of Array.from(selected)) {
      const sub = template.subjects[idx];

      const { data: subjectRow, error: subErr } = await supabase
        .from('subjects')
        .insert({ user_id: userId, name: sub.name, icon: sub.icon, color: sub.color })
        .select()
        .single();

      if (subErr || !subjectRow) continue;

      for (const mod of sub.modules) {
        const { data: moduleRow, error: modErr } = await supabase
          .from('modules')
          .insert({ subject_id: subjectRow.id, user_id: userId, name: mod.name })
          .select()
          .single();

        if (modErr || !moduleRow) continue;

        if (mod.topics.length > 0) {
          await supabase.from('topics').insert(
            mod.topics.map((t) => ({
              module_id: moduleRow.id,
              user_id: userId,
              name: t,
            }))
          );
        }
      }
    }

    await refreshSubjects();
    setAdding(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16">
        <div className="w-24 h-24 brutal-box bg-brutal-green flex items-center justify-center border-4 border-black rotate-3 shadow-[8px_8px_0_#000]">
          <Check className="w-12 h-12 text-black stroke-[4]" />
        </div>
        <div className="text-center brutal-box p-6 bg-white shadow-[6px_6px_0_#000]">
          <p className="text-black text-2xl font-black uppercase mb-2 leading-none">{selected.size} SUBJECT{selected.size > 1 ? 'S' : ''} ACQUIRED!</p>
          <p className="text-black/60 text-sm font-bold uppercase">All modules and topics injected into your curriculum.</p>
        </div>
        <button
          onClick={onDone}
          className="font-black px-8 py-4 brutal-btn bg-black text-white text-xl uppercase flex items-center gap-2 mt-4 hover:bg-slate-800"
        >
          ENTER DASHBOARD <ArrowLeft className="w-6 h-6 stroke-[3] rotate-180" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white p-4 brutal-box border-4 border-black shadow-[6px_6px_0_#000]">
        <button
          onClick={onBack}
          className="w-12 h-12 brutal-btn bg-brutal-blue flex items-center justify-center text-white"
        >
          <ArrowLeft className="w-6 h-6 stroke-[3]" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-black font-black text-2xl uppercase tracking-tighter leading-none">{template.emoji} {template.name}</h2>
          <p className="text-black/60 font-bold text-xs uppercase mt-1">Select curriculum payload to extract</p>
        </div>
      </div>

      {/* Select all / clear */}
      <div className="flex items-center justify-between brutal-box bg-slate-100 p-3 border-4 border-black shadow-none">
        <span className="text-black font-black text-sm uppercase">
          {selected.size} OF {template.subjects.length} SELECTED
        </span>
        <div className="flex gap-2">
          <button onClick={selectAll} className="text-xs font-black px-4 py-2 bg-black text-brutal-yellow border-2 border-black uppercase hover:-translate-y-0.5 transition-transform">
            SELECT ALL
          </button>
          <button onClick={clearAll} className="text-xs font-black px-4 py-2 bg-white text-black border-2 border-black uppercase hover:-translate-y-0.5 transition-transform">
            CLEAR
          </button>
        </div>
      </div>

      {/* Subject list */}
      <div className="space-y-4">
        {template.subjects.map((sub, idx) => {
          const isSelected = selected.has(idx);
          const isExpanded = expanded.has(idx);
          const topicCount = sub.modules.reduce((s, m) => s + m.topics.length, 0);

          return (
            <div key={idx} className={`brutal-box overflow-hidden transition-all duration-200 border-4 border-black ${isSelected ? 'bg-brutal-yellow shadow-[6px_6px_0_#000] translate-x-[-2px] translate-y-[-2px]' : 'bg-white shadow-[2px_2px_0_#000]'}`}>
              {/* Subject row */}
              <div className="flex items-center gap-3 p-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggle(idx)}
                  className={`w-8 h-8 border-4 border-black flex items-center justify-center shrink-0 transition-all duration-200 ${isSelected ? 'bg-black text-brutal-green' : 'bg-white'}`}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[4]" />}
                </button>

                {/* Icon + info */}
                <button
                  onClick={() => toggleExpand(idx)}
                  className="flex-1 flex items-center gap-3 text-left min-w-0"
                >
                  <div className="w-12 h-12 border-4 border-black flex items-center justify-center text-2xl shrink-0 bg-white rotate-3">
                    {sub.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-black font-black text-xl uppercase leading-none">{sub.name}</p>
                    <p className="text-black/60 font-bold text-xs mt-1 uppercase">
                      {sub.modules.length} MODULES • {topicCount} TOPICS
                    </p>
                  </div>
                  <div className="w-8 h-8 border-2 border-black bg-white flex items-center justify-center">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-black stroke-[3]" /> : <ChevronDown className="w-5 h-5 text-black stroke-[3]" />}
                  </div>
                </button>
              </div>

              {/* Expanded module preview */}
              {isExpanded && (
                <div className="bg-slate-100 border-t-4 border-black">
                  {sub.modules.map((mod, mi) => (
                    <div key={mi} className="px-4 py-3 border-b-2 border-black border-dashed last:border-b-0">
                      <p className="text-black text-sm font-black uppercase mb-2">{mod.name}</p>
                      <div className="flex flex-wrap gap-2">
                        {mod.topics.slice(0, 4).map((t, ti) => (
                          <span key={ti} className="text-[10px] px-2 py-1 font-bold bg-white border-2 border-black text-black uppercase">
                            {t}
                          </span>
                        ))}
                        {mod.topics.length > 4 && (
                          <span className="text-[10px] px-2 py-1 font-black bg-brutal-pink border-2 border-black text-black uppercase">
                            +{mod.topics.length - 4} MORE
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add button */}
      <div className="sticky bottom-20 pt-4 pb-4 bg-transparent z-10">
        <button
          onClick={handleAdd}
          disabled={selected.size === 0 || adding}
          className="w-full font-black py-5 brutal-btn text-xl uppercase disabled:opacity-50 flex items-center justify-center gap-3 transition-colors bg-brutal-green text-black hover:bg-[#00e0a0]"
        >
          {adding
            ? <><Loader2 className="w-6 h-6 animate-spin stroke-[3]" /> INJECTING DATA...</>
            : <><BookOpen className="w-6 h-6 stroke-[3]" /> IMPORT {selected.size > 0 ? `${selected.size} ` : ''}SUBJECT{selected.size !== 1 ? 'S' : ''}</>}
        </button>
      </div>
    </div>
  );
};

// ── Main Templates page ──────────────────────────────────────
export const Templates: React.FC = () => {
  const { navigate } = useApp();
  const [chosenTemplate, setChosenTemplate] = useState<UniversityTemplate | null>(null);

  if (chosenTemplate) {
    return (
      <SubjectPicker
        template={chosenTemplate}
        onBack={() => setChosenTemplate(null)}
        onDone={() => navigate({ type: 'subjects' })}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-4 pt-2">
      {/* Header */}
      <div className="flex items-center gap-4 bg-brutal-blue border-4 border-black p-4 brutal-box shadow-[6px_6px_0_#000]">
        <button
          onClick={() => navigate({ type: 'subjects' })}
          className="w-12 h-12 brutal-btn bg-white hover:bg-slate-100 flex items-center justify-center text-black"
        >
          <ArrowLeft className="w-6 h-6 stroke-[3]" />
        </button>
        <div>
          <h2 className="text-white font-black text-2xl uppercase tracking-tighter leading-none flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brutal-yellow fill-brutal-yellow stroke-[2]" /> TEMPLATES
          </h2>
          <p className="text-white font-bold text-xs uppercase mt-1 drop-shadow-[1px_1px_0_#000]">Prebuilt curriculum masters</p>
        </div>
      </div>

      {/* Banner */}
      <div className="brutal-box p-5 bg-brutal-yellow border-4 border-black shadow-[4px_4px_0_#000]">
        <p className="text-black font-black text-sm uppercase leading-tight">
          Select a master template below to instantly copy all required modules and topics directly into your personal dashboard!
        </p>
      </div>

      {/* University grid */}
      <div className="space-y-4">
        {UNIVERSITY_TEMPLATES.map((t) => (
          <UniversityCard key={t.id} template={t} onSelect={() => setChosenTemplate(t)} />
        ))}
      </div>

      {/* More coming soon */}
      <div className="brutal-box p-6 text-center bg-slate-200 border-dashed border-4 border-black shadow-none mt-4">
        <p className="text-black font-black text-sm uppercase">More universities transmitting soon...</p>
      </div>
    </div>
  );
};
