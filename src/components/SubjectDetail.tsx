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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-md brutal-box bg-white p-6 shadow-[8px_8px_0px_#000]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-black">
          <h3 className="text-black font-black text-2xl uppercase">ADD MODULE</h3>
          <button onClick={onClose} className="w-10 h-10 brutal-box bg-brutal-pink flex items-center justify-center hover:bg-red-500 active:translate-y-1 active:translate-x-1 active:shadow-none transition-all">
            <X className="w-6 h-6 text-black stroke-[3]" />
          </button>
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="E.G. INTRO TO MODULE 1"
          className="w-full px-4 py-3 text-black text-lg font-bold border-4 border-black focus:outline-none focus:ring-4 focus:ring-brutal-green mb-6"
          autoFocus
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="w-full font-black text-xl py-4 flex items-center justify-center gap-2 brutal-btn bg-brutal-yellow text-black hover:bg-[#ffcf00]"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6 stroke-[3]" />} CREATE MODULE
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-md brutal-box bg-white p-6 shadow-[8px_8px_0px_#000]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-black">
          <h3 className="text-black font-black text-2xl uppercase">ADD TOPIC</h3>
          <button onClick={onClose} className="w-10 h-10 brutal-box bg-brutal-pink flex items-center justify-center hover:bg-red-500 active:translate-y-1 active:translate-x-1 active:shadow-none transition-all">
             <X className="w-6 h-6 text-black stroke-[3]" />
          </button>
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="E.G. BINARY TREES"
          className="w-full px-4 py-3 text-black text-lg font-bold border-4 border-black focus:outline-none focus:ring-4 focus:ring-brutal-blue mb-6"
          autoFocus
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="w-full font-black text-xl py-4 flex items-center justify-center gap-2 brutal-btn bg-brutal-green text-black hover:bg-[#00ffb5]"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6 stroke-[3]" />} CREATE TOPIC
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
    <div className="flex flex-col gap-6 pb-4">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate({ type: 'subjects' })}
          className="w-14 h-14 brutal-box bg-white flex items-center justify-center shrink-0 active:translate-y-1 active:translate-x-1 active:shadow-none hover:bg-slate-100"
        >
          <ArrowLeft className="w-6 h-6 text-black stroke-[3]" />
        </button>
        <div className="flex-1 min-w-0 brutal-box p-3 bg-white" style={{ backgroundColor: subject.color }}>
          <h2 className="text-black font-black text-2xl truncate uppercase" style={{textShadow: '1px 1px 0px #fff'}}>{subject.icon} {subject.name}</h2>
          <div className="flex justify-between items-center mt-2 bg-white border-2 border-black px-2 py-1 transform -rotate-1">
             <span className="text-black font-bold text-xs uppercase">{completedTopics}/{totalTopics} TOPICS</span>
             <span className="text-black font-black text-xs uppercase px-1 bg-brutal-green border-2 border-black">{pct}% DONE</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
         <button
            onClick={() => setShowAddModule(true)}
            className="flex-1 brutal-btn bg-brutal-yellow text-black py-4 flex items-center justify-center gap-2 hover:bg-[#ffcf00]"
         >
            <Plus className="w-5 h-5 stroke-[3]" /> NEW MODULE
         </button>
         
         {/* Delete Subject Button */}
         <button
            onClick={async () => {
              if (window.confirm(`Are you sure you want to delete ${subject.name}? This will remove all modules and topics inside it permanently.`)) {
                await supabase.from('subjects').delete().eq('id', subjectId);
                refreshSubjects();
                navigate({ type: 'subjects' });
              }
            }}
            className="w-14 h-14 brutal-btn bg-brutal-orange text-white flex items-center justify-center hover:bg-[#ff7b52]"
            title="Delete Subject"
         >
            <Trash2 className="w-6 h-6 stroke-[3]" />
         </button>
      </div>

      {/* Modules */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-10 h-10 text-black stroke-[3] animate-spin" />
        </div>
      ) : modules.length === 0 ? (
        <div className="brutal-box p-8 text-center bg-brutal-pink border-dashed border-4 border-black">
          <p className="text-black font-black text-lg uppercase">NO MODULES YET</p>
          <p className="text-black/80 font-bold text-sm uppercase mt-1">Tap + to craft your first chunk</p>
        </div>
      ) : (
        <div className="space-y-6">
          {modules.map((mod) => {
            const modDone = mod.topics.filter((t) => t.is_completed).length;
            const modPct = mod.topics.length > 0 ? Math.round((modDone / mod.topics.length)*100) : 0;
            return (
              <div key={mod.id} className="brutal-card bg-white overflow-hidden shadow-[6px_6px_0px_#000]">
                {/* Module header */}
                <div className={`p-4 border-b-4 border-black ${mod.expanded ? 'bg-brutal-lilac' : 'bg-slate-50'}`}>
                   <div className="flex items-center gap-3">
                     <button onClick={() => toggleExpand(mod.id)} className="flex-1 flex items-center gap-4 text-left">
                        <div className="w-10 h-10 brutal-box bg-white flex items-center justify-center border-2 border-black">
                           {mod.expanded ? <ChevronUp className="w-6 h-6 text-black stroke-[3]" /> : <ChevronDown className="w-6 h-6 text-black stroke-[3]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-black font-black text-xl uppercase leading-tight">{mod.name}</p>
                           <p className="text-black/70 font-bold text-xs uppercase mt-0.5">{modDone}/{mod.topics.length} DONE • {modPct}%</p>
                        </div>
                     </button>
                     <button
                        onClick={() => toggleExpand(mod.id)}
                        className={`w-14 h-14 brutal-box flex items-center justify-center shrink-0 border-2 ${modPct===100 ? 'bg-brutal-green' : 'bg-white'}`}
                     >
                        <span className="font-black text-sm">{modPct}%</span>
                     </button>
                   </div>
                </div>

                {/* Topics */}
                {mod.expanded && (
                  <div className="bg-white">
                    {mod.topics.length === 0 ? (
                      <div className="px-6 py-6 text-black font-bold text-sm uppercase text-center border-b-4 border-black border-dashed">
                        No topics assigned to this module.
                      </div>
                    ) : (
                      mod.topics.map((topic, i) => (
                        <div
                          key={topic.id}
                          className="flex items-stretch group border-b-4 border-black bg-white hover:bg-brutal-yellow transition-colors"
                        >
                          {/* Checkbox Trigger Area */}
                          <button
                            onClick={() => toggleTopicComplete(topic)}
                            className={`w-16 flex items-center justify-center border-r-4 border-black shrink-0 transition-colors ${topic.is_completed ? 'bg-brutal-green' : 'bg-slate-100 group-hover:bg-white'}`}
                          >
                            {topic.is_completed ? (
                               <Check className="w-8 h-8 text-black stroke-[4]" />
                            ) : (
                               <div className="w-6 h-6 border-4 border-black rounded-sm" />
                            )}
                          </button>

                          {/* Name Block */}
                          <button
                            className="flex-1 text-left p-4 min-w-0 flex flex-col justify-center"
                            onClick={() => navigate({ type: 'topic-detail', topicId: topic.id, moduleId: mod.id, subjectId: subject.id })}
                          >
                            <p className={`text-lg font-black uppercase truncate ${topic.is_completed ? 'line-through text-black/40' : 'text-black'}`}>
                              {topic.name}
                            </p>
                            {topic.study_minutes > 0 && (
                              <p className="text-black font-bold text-xs mt-1 bg-black/5 px-2 py-0.5 inline-block w-fit border-2 border-black/10">
                                ⏱ STUDIED: {Math.floor(topic.study_minutes / 60) > 0 ? `${Math.floor(topic.study_minutes / 60)}H ` : ''}{topic.study_minutes % 60}M
                              </p>
                            )}
                          </button>

                          {/* Delete Topic */}
                          <button
                            onClick={() => deleteTopic(topic.id)}
                            className="w-14 items-center justify-center border-l-4 border-black bg-brutal-orange text-white hover:bg-[#ff7b52] hidden group-hover:flex"
                          >
                            <Trash2 className="w-5 h-5 stroke-[3]" />
                          </button>
                        </div>
                      ))
                    )}
                    
                    {/* Add Topic Action Row */}
                    <div className="flex bg-slate-100">
                       <button
                          onClick={() => setAddTopicForModule(mod.id)}
                          className="w-20 flex items-center justify-center border-r-4 border-black bg-brutal-blue text-white hover:bg-[#1da2ff]"
                       >
                          <Plus className="w-8 h-8 stroke-[3]" />
                       </button>
                       <button
                          onClick={() => setAddTopicForModule(mod.id)}
                          className="flex-1 text-left p-4 font-black uppercase text-sm text-black/60 hover:text-black transition-colors"
                       >
                          ADD NEW TOPIC TO MODULE
                       </button>
                       
                       {/* Delete Module Action */}
                       <button
                          onClick={() => {
                             if(window.confirm('Delete an entire module? Are you absolutely sure?')) deleteModule(mod.id);
                          }}
                          className="w-14 flex items-center justify-center border-l-4 border-black bg-slate-200 text-slate-500 hover:bg-brutal-orange hover:text-white transition-colors"
                       >
                          <Trash2 className="w-5 h-5 stroke-[3]" />
                       </button>
                    </div>
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
