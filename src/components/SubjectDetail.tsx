import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, ChevronDown, ChevronUp, Check, Trash2, X, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import type { Module, Topic } from '@/types';

interface Props {
  subjectId: string;
}

interface ModuleWithTopics extends Module {
  topics: Topic[];
  expanded: boolean;
}

const AddModuleModal: React.FC<{
  subjectId: string;
  userId: string;
  onClose: () => void;
  onAdded: () => void;
}> = ({ subjectId, userId, onClose, onAdded }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await supabase.from('modules').insert({ subject_id: subjectId, user_id: userId, name: name.trim() });
    onAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-t-3xl p-6 pb-10 shadow-2xl"
        style={{ background: '#111122', border: '1px solid rgba(255,255,255,0.08)', borderBottom: 'none' }}
        onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'rgba(255,255,255,0.15)' }} />
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg">Add Module</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="e.g. Module 1 — Introduction"
          className="w-full rounded-2xl px-4 py-3.5 text-white text-sm placeholder-slate-700 mb-4"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
          onFocus={(e) => e.currentTarget.style.border = '1px solid rgba(99,102,241,0.5)'}
          onBlur={(e) => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.09)'}
          autoFocus
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="w-full font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', boxShadow: '0 6px 20px rgba(99,102,241,0.35)' }}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Module
        </button>
      </div>
    </div>
  );
};

const AddTopicModal: React.FC<{
  moduleId: string;
  userId: string;
  onClose: () => void;
  onAdded: () => void;
}> = ({ moduleId, userId, onClose, onAdded }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await supabase.from('topics').insert({ module_id: moduleId, user_id: userId, name: name.trim() });
    onAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-t-3xl p-6 pb-10"
        style={{ background: '#111122', border: '1px solid rgba(255,255,255,0.08)', borderBottom: 'none' }}
        onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'rgba(255,255,255,0.15)' }} />
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg">Add Topic</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="e.g. Binary Trees"
          className="w-full rounded-2xl px-4 py-3.5 text-white text-sm placeholder-slate-700 mb-4"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
          onFocus={(e) => e.currentTarget.style.border = '1px solid rgba(99,102,241,0.5)'}
          onBlur={(e) => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.09)'}
          autoFocus
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="w-full font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', boxShadow: '0 6px 20px rgba(99,102,241,0.35)' }}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Topic
        </button>
      </div>
    </div>
  );
};

export const SubjectDetail: React.FC<Props> = ({ subjectId }) => {
  const { subjects, navigate, userId, refreshSubjects } = useApp();
  const subject = subjects.find((s) => s.id === subjectId);
  const [modules, setModules] = useState<ModuleWithTopics[]>([]);
  const [showAddModule, setShowAddModule] = useState(false);
  const [addTopicForModule, setAddTopicForModule] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchModules = useCallback(async () => {
    setLoading(true);
    const { data: mods } = await supabase
      .from('modules')
      .select('*')
      .eq('subject_id', subjectId)
      .order('created_at', { ascending: true });

    if (!mods) { setLoading(false); return; }

    const enriched: ModuleWithTopics[] = await Promise.all(
      mods.map(async (m) => {
        const { data: topics } = await supabase
          .from('topics')
          .select('*')
          .eq('module_id', m.id)
          .order('created_at', { ascending: true });
        return { ...m, topics: topics ?? [], expanded: true };
      })
    );

    setModules(enriched);
    setLoading(false);
  }, [subjectId]);

  useEffect(() => { fetchModules(); }, [fetchModules]);

  const toggleExpand = (moduleId: string) =>
    setModules((prev) => prev.map((m) => m.id === moduleId ? { ...m, expanded: !m.expanded } : m));

  const toggleTopicComplete = async (topic: Topic) => {
    const newVal = !topic.is_completed;
    await supabase.from('topics').update({
      is_completed: newVal,
      completed_at: newVal ? new Date().toISOString() : null,
    }).eq('id', topic.id);
    fetchModules();
    refreshSubjects();
  };

  const deleteTopic = async (topicId: string) => {
    await supabase.from('topics').delete().eq('id', topicId);
    fetchModules();
    refreshSubjects();
  };

  const deleteModule = async (moduleId: string) => {
    await supabase.from('topics').delete().eq('module_id', moduleId);
    await supabase.from('modules').delete().eq('id', moduleId);
    fetchModules();
    refreshSubjects();
  };

  if (!subject) return null;

  const totalTopics = modules.reduce((sum, m) => sum + m.topics.length, 0);
  const completedTopics = modules.reduce((sum, m) => sum + m.topics.filter((t) => t.is_completed).length, 0);
  const pct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate({ type: 'subjects' })}
          className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-150 active:scale-90"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-lg truncate">{subject.icon} {subject.name}</h2>
          <p className="text-slate-500 text-xs">{completedTopics}/{totalTopics} topics • {pct}% done</p>
        </div>
        <button
          onClick={() => setShowAddModule(true)}
          className="rounded-xl px-3 py-2 flex items-center gap-1.5 text-sm font-semibold transition-all active:scale-95"
          style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}
        >
          <Plus className="w-4 h-4" /> Module
        </button>
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl p-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex justify-between text-sm mb-2.5">
          <span className="text-slate-500 font-medium">Progress</span>
          <span className="text-white font-bold">{pct}%</span>
        </div>
        <div className="w-full rounded-full h-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-3 rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: subject.color, boxShadow: `0 0 12px ${subject.color}88` }}
          />
        </div>
        <p className="text-slate-600 text-xs mt-1.5">{completedTopics} of {totalTopics} topics completed</p>
      </div>

      {/* Modules */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
        </div>
      ) : modules.length === 0 ? (
        <div className="rounded-2xl p-8 text-center"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
          <p className="text-slate-500">No modules yet. Tap "+ Module" to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {modules.map((mod) => {
            const modDone = mod.topics.filter((t) => t.is_completed).length;
            return (
              <div key={mod.id} className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {/* Module header */}
                <div className="flex items-center gap-3 p-4">
                  <button
                    onClick={() => toggleExpand(mod.id)}
                    className="flex-1 flex items-center gap-3 text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm">{mod.name}</p>
                      <p className="text-slate-600 text-xs mt-0.5">{modDone}/{mod.topics.length} done</p>
                    </div>
                    {mod.expanded
                      ? <ChevronUp className="w-4 h-4 text-slate-600 shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-slate-600 shrink-0" />}
                  </button>
                  <button
                    onClick={() => setAddTopicForModule(mod.id)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                    style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteModule(mod.id)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Topics */}
                {mod.expanded && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {mod.topics.length === 0 ? (
                      <div className="px-4 py-3 text-slate-600 text-sm">No topics yet — tap + to add</div>
                    ) : (
                      mod.topics.map((topic) => (
                        <div
                          key={topic.id}
                          className="flex items-center gap-3 px-4 py-3.5 group transition-all"
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          {/* Checkbox */}
                          <button
                            onClick={() => toggleTopicComplete(topic)}
                            className="w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                            style={topic.is_completed ? {
                              background: '#10b981',
                              borderColor: '#10b981',
                            } : {
                              borderColor: 'rgba(255,255,255,0.15)',
                            }}
                          >
                            {topic.is_completed && <Check className="w-3.5 h-3.5 text-white" />}
                          </button>

                          {/* Name */}
                          <button
                            className="flex-1 text-left min-w-0"
                            onClick={() =>
                              navigate({ type: 'topic-detail', topicId: topic.id, moduleId: mod.id, subjectId: subject.id })
                            }
                          >
                            <p className={`text-sm truncate ${topic.is_completed ? 'line-through text-slate-600' : 'text-slate-200'}`}>
                              {topic.name}
                            </p>
                            {topic.study_minutes > 0 && (
                              <p className="text-slate-600 text-xs mt-0.5">
                                ⏱ {Math.floor(topic.study_minutes / 60) > 0 ? `${Math.floor(topic.study_minutes / 60)}h ` : ''}{topic.study_minutes % 60}m studied
                              </p>
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => deleteTopic(topic.id)}
                            className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                            style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showAddModule && userId && (
        <AddModuleModal
          subjectId={subjectId}
          userId={userId}
          onClose={() => setShowAddModule(false)}
          onAdded={fetchModules}
        />
      )}

      {addTopicForModule && userId && (
        <AddTopicModal
          moduleId={addTopicForModule}
          userId={userId}
          onClose={() => setAddTopicForModule(null)}
          onAdded={fetchModules}
        />
      )}
    </div>
  );
};
