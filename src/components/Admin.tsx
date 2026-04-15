import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Plus, X, Users, BookOpen, Settings, Code, ChevronDown, ChevronRight, Edit2, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import type { Developer } from '@/types';

interface UserData {
  id: string;
  reg_no: string;
  full_name: string;
  email: string;
  branch: string;
  college_year: string;
  college_name: string;
  total_study_minutes: number;
  streak_days: number;
  created_at: string;
}

interface University {
  id: string;
  name: string;
  location?: string;
  emoji: string;
  color: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

interface UniversitySubject {
  id: string;
  university_id: string;
  name: string;
  icon: string;
  color: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

interface UniversityModule {
  id: string;
  university_subject_id: string;
  name: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

interface UniversityTopic {
  id: string;
  university_module_id: string;
  name: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export const Admin: React.FC = () => {
  const { navigate, isAdmin } = useApp();
  const [activeTab, setActiveTab] = useState<'users' | 'templates' | 'developers' | 'settings'>('users');
  const [users, setUsers] = useState<UserData[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [subjects, setSubjects] = useState<UniversitySubject[]>([]);
  const [modules, setModules] = useState<UniversityModule[]>([]);
  const [topics, setTopics] = useState<UniversityTopic[]>([]);
  const [loading, setLoading] = useState(true);

  // User edit state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUserData, setEditUserData] = useState<Partial<UserData>>({});

  // Developer form state
  const [devFormOpen, setDevFormOpen] = useState(false);
  const [newDeveloper, setNewDeveloper] = useState<Partial<Developer>>({ skills: [] });

  // Developer edit state
  const [editingDevId, setEditingDevId] = useState<string | null>(null);
  const [editDevData, setEditDevData] = useState<Partial<Developer>>({});

  // Template management state
  const [expandedUniv, setExpandedUniv] = useState<string | null>(null);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [unirForm, setUnivForm] = useState(false);
  
  const [newUniv, setNewUniv] = useState({ name: '', location: '', emoji: '🎓', color: '#6366f1' });
  const [newSubj, setNewSubj] = useState({ name: '', icon: '📘', color: '#06b6d4' });
  const [newMod, setNewMod] = useState({ name: '' });
  const [newTopic, setNewTopic] = useState({ name: '' });

  // Template Edit State
  const [editingUnivId, setEditingUnivId] = useState<string | null>(null);
  const [editUnivData, setEditUnivData] = useState<Partial<University>>({});
  
  const [editingSubjId, setEditingSubjId] = useState<string | null>(null);
  const [editSubjData, setEditSubjData] = useState<Partial<UniversitySubject>>({});

  const [editingModId, setEditingModId] = useState<string | null>(null);
  const [editModData, setEditModData] = useState<{name: string}>({name: ''});

  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editTopicData, setEditTopicData] = useState<{name: string}>({name: ''});

  // Security check: If user is not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-20 h-20 brutal-box bg-red-600 flex items-center justify-center mb-6">
          <X className="w-10 h-10 text-white stroke-[4]" />
        </div>
        <p className="text-black font-black text-2xl mb-2 uppercase">Access Denied</p>
        <p className="text-black/70 font-bold text-center max-w-xs mb-8 uppercase">
          CLEARANCE LEVEL INSUFFICIENT.
        </p>
        <button
          onClick={() => navigate({ type: 'home' })}
          className="brutal-btn bg-black text-white px-8 py-3 w-full max-w-xs"
        >
          GO BACK
        </button>
      </div>
    );
  }

  useEffect(() => {
    fetchUsers();
    fetchDevelopers();
    fetchUniversities();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data as UserData[]);
    setLoading(false);
  };

  const updateUser = async (userId: string) => {
    try {
      await supabase.from('profiles').update({
        full_name: editUserData.full_name,
        branch: editUserData.branch,
        college_year: editUserData.college_year,
      }).eq('id', userId);
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure? This will delete all user data.')) return;
    try {
      await supabase.from('profiles').delete().eq('id', userId);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const fetchDevelopers = async () => {
    const { data } = await supabase.from('developers').select('*').order('created_at', { ascending: true });
    if (data) setDevelopers(data as Developer[]);
  };

  const addDeveloper = async () => {
    if (!newDeveloper.name || !newDeveloper.email || !newDeveloper.role) return alert('Please fill in required fields');
    try {
      await supabase.from('developers').insert({ ...newDeveloper, is_active: true });
      setNewDeveloper({ skills: [] }); setDevFormOpen(false); fetchDevelopers();
    } catch (error) { console.error(error); }
  };

  const updateDeveloper = async (devId: string) => {
    try {
      await supabase.from('developers').update(editDevData).eq('id', devId);
      setEditingDevId(null); fetchDevelopers();
    } catch (error) { console.error(error); }
  };

  const deleteDeveloper = async (devId: string) => {
    if (!confirm('Are you sure?')) return;
    try { await supabase.from('developers').delete().eq('id', devId); fetchDevelopers(); } catch (error) { console.error(error); }
  };

  // ─── Template Management Functions ──────────────────────
  const fetchUniversities = async () => {
     const { data } = await supabase.from('universities').select('*').order('created_at', { ascending: true });
     if (data) setUniversities(data as University[]);
  };
  const fetchSubjects = async (univId: string) => {
     const { data } = await supabase.from('university_subjects').select('*').eq('university_id', univId).order('order_index', { ascending: true });
     if (data) setSubjects(data as UniversitySubject[]);
  };
  const fetchModules = async (subjId: string) => {
     const { data } = await supabase.from('university_modules').select('*').eq('university_subject_id', subjId).order('order_index', { ascending: true });
     if (data) setModules(data as UniversityModule[]);
  };
  const fetchTopics = async (modId: string) => {
     const { data } = await supabase.from('university_topics').select('*').eq('university_module_id', modId).order('order_index', { ascending: true });
     if (data) setTopics(data as UniversityTopic[]);
  };

  const addUniversity = async () => {
    if (!newUniv.name) return alert('University name is required');
    try {
      await supabase.from('universities').insert({ ...newUniv, is_active: true });
      setNewUniv({ name: '', location: '', emoji: '🎓', color: '#6366f1' }); setUnivForm(false); fetchUniversities();
    } catch (error) { console.error(error); }
  };
  const updateUniversity = async (id: string) => {
    try { await supabase.from('universities').update(editUnivData).eq('id', id); setEditingUnivId(null); fetchUniversities(); } catch (error) { console.error(error); }
  };
  const deleteUniversity = async (id: string) => {
    if (!confirm('Delete this university? All subjects will be deleted.')) return;
    try { await supabase.from('universities').delete().eq('id', id); fetchUniversities(); } catch (error) { console.error(error); }
  };

  const addSubject = async (univId: string) => {
    if (!newSubj.name) return alert('Subject name required');
    try {
      await supabase.from('university_subjects').insert({ university_id: univId, name: newSubj.name, icon: newSubj.icon, color: newSubj.color, order_index: subjects.length, is_active: true });
      setNewSubj({ name: '', icon: '📘', color: '#06b6d4' }); fetchSubjects(univId);
    } catch (error) { console.error(error); }
  };
  const updateSubject = async (id: string, univId: string) => {
    try { await supabase.from('university_subjects').update(editSubjData).eq('id', id); setEditingSubjId(null); fetchSubjects(univId); } catch (error) { console.error(error); }
  };
  const deleteSubject = async (id: string, univId: string) => {
    if (!confirm('Delete this subject?')) return;
    try { await supabase.from('university_subjects').delete().eq('id', id); fetchSubjects(univId); } catch (error) { console.error(error); }
  };

  const addModule = async (subjId: string) => {
    if (!newMod.name) return;
    try {
      await supabase.from('university_modules').insert({ university_subject_id: subjId, name: newMod.name, order_index: modules.length, is_active: true });
      setNewMod({ name: '' }); fetchModules(subjId);
    } catch (error) { console.error(error); }
  };
  const updateModule = async (id: string, subjId: string) => {
    try { await supabase.from('university_modules').update(editModData).eq('id', id); setEditingModId(null); fetchModules(subjId); } catch (error) { console.error(error); }
  };
  const deleteModule = async (id: string, subjId: string) => {
    if (!confirm('Delete this module?')) return;
    try { await supabase.from('university_modules').delete().eq('id', id); fetchModules(subjId); } catch (error) { console.error(error); }
  };

  const addTopic = async (modId: string) => {
    if (!newTopic.name) return;
    try {
      await supabase.from('university_topics').insert({ university_module_id: modId, name: newTopic.name, order_index: topics.length, is_active: true });
      setNewTopic({ name: '' }); fetchTopics(modId);
    } catch (error) { console.error(error); }
  };
  const updateTopic = async (id: string, modId: string) => {
    try { await supabase.from('university_topics').update(editTopicData).eq('id', id); setEditingTopicId(null); fetchTopics(modId); } catch (error) { console.error(error); }
  };
  const deleteTopic = async (id: string, modId: string) => {
    try { await supabase.from('university_topics').delete().eq('id', id); fetchTopics(modId); } catch (error) { console.error(error); }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 brutal-box p-4 bg-red-600 shadow-[6px_6px_0px_#000]">
        <button
          onClick={() => navigate({ type: 'home' })}
          className="w-12 h-12 brutal-box bg-white flex items-center justify-center active:translate-y-1 active:translate-x-1 active:shadow-none hover:bg-slate-100"
        >
          <ArrowLeft className="w-6 h-6 text-black stroke-[3]" />
        </button>
        <div>
          <h1 className="text-white font-black text-2xl tracking-tighter uppercase">SYSTEM CONTROL</h1>
          <p className="text-white font-bold text-xs uppercase underline decoration-2 underline-offset-4">SUPERUSER ACCESS ONLY</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 pb-4">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-3">
          {[ 
            { id: 'users', label: 'USERS', icon: Users, color: 'bg-brutal-blue' }, 
            { id: 'templates', label: 'TEMPLATES', icon: BookOpen, color: 'bg-brutal-yellow' }, 
            { id: 'developers', label: 'DEVELOPERS', icon: Code, color: 'bg-brutal-pink' }, 
            { id: 'settings', label: 'CONFIG', icon: Settings, color: 'bg-slate-300' } 
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-5 py-4 text-sm font-black border-4 border-black transition-transform active:translate-y-1 ${
                 activeTab === tab.id 
                 ? `${tab.color} text-black translate-y-1 shadow-none` 
                 : 'bg-white text-black shadow-[4px_4px_0_#000] hover:-translate-y-1 focus:-translate-y-1'
              }`}
            >
              <tab.icon className="w-6 h-6 stroke-[3]" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 brutal-box bg-white p-6 overflow-y-auto custom-scrollbar shadow-[8px_8px_0_#000]">
          
          {/* ──────────────── USERS TAB ──────────────── */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6 pb-2 border-b-4 border-black">
                <h3 className="text-black font-black text-2xl uppercase">User Directory ({users.length})</h3>
                <button onClick={fetchUsers} className="px-4 py-2 brutal-btn bg-brutal-pink text-black text-xs">REFRESH</button>
              </div>
              <div className="overflow-x-auto border-4 border-black border-b-0 shadow-[4px_4px_0_#000]">
                 <table className="w-full text-sm text-left">
                   <thead className="bg-black text-white uppercase text-xs font-black">
                     <tr>
                       <th className="px-6 py-4 border-b-4 border-white">Reg No</th>
                       <th className="px-6 py-4 border-b-4 border-white">Name</th>
                       <th className="px-6 py-4 border-b-4 border-white">Branch / Year</th>
                       <th className="px-6 py-4 border-b-4 border-white">Study Time</th>
                       <th className="px-6 py-4 text-center border-b-4 border-white border-l-4">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y-4 divide-black bg-white">
                    {users.map(user => {
                      const isEditing = editingUserId === user.id;
                      return (
                        <tr key={user.id} className={`${isEditing ? 'bg-brutal-yellow' : 'hover:bg-brutal-yellow/20'} transition-colors`}>
                          <td className="px-6 py-4 border-r-4 border-black">
                            <span className="text-black font-black block text-lg">{user.reg_no}</span>
                            {user.reg_no === '25BYB0101' && <span className="text-[10px] uppercase font-black text-white bg-red-600 px-2 py-0.5 mt-1 border-2 border-black inline-block">ADMIN</span>}
                          </td>
                          <td className="px-6 py-4 border-r-4 border-black">
                            {isEditing ? (
                              <input type="text" value={editUserData.full_name || ''} onChange={e => setEditUserData({...editUserData, full_name: e.target.value})} className="bg-white border-4 border-black px-2 py-1 text-black font-bold w-full uppercase" placeholder="NAME" />
                            ) : (
                              <span className="text-black font-bold uppercase">{user.full_name || 'NO NAME'}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 border-r-4 border-black">
                             {isEditing ? (
                               <div className="space-y-2">
                                 <input type="text" value={editUserData.branch || ''} onChange={e => setEditUserData({...editUserData, branch: e.target.value})} className="bg-white border-4 border-black px-2 py-1 text-black font-bold w-full text-xs uppercase" placeholder="BRANCH" />
                                 <input type="text" value={editUserData.college_year || ''} onChange={e => setEditUserData({...editUserData, college_year: e.target.value})} className="bg-white border-4 border-black px-2 py-1 text-black font-bold w-full text-xs uppercase" placeholder="YEAR" />
                               </div>
                             ) : (
                               <span className="text-black font-bold text-xs uppercase block">{user.branch || 'N/A'}<br/>{user.college_year || 'N/A'}</span>
                             )}
                          </td>
                          <td className="px-6 py-4 text-black font-black border-r-4 border-black bg-slate-100">
                             {Math.floor(user.total_study_minutes / 60)}H {user.total_study_minutes % 60}M
                          </td>
                          <td className="px-6 py-4 flex justify-center items-center gap-3">
                             {isEditing ? (
                               <>
                                 <button onClick={() => updateUser(user.id)} className="w-10 h-10 brutal-box bg-brutal-green text-black flex items-center justify-center hover:bg-[#00ffb5] shadow-none border-4"><Check className="w-5 h-5 stroke-[3]" /></button>
                                 <button onClick={() => setEditingUserId(null)} className="w-10 h-10 brutal-box bg-slate-300 text-black flex items-center justify-center hover:bg-slate-400 shadow-none border-4"><X className="w-5 h-5 stroke-[3]" /></button>
                               </>
                             ) : (
                               <>
                                 <button onClick={() => { setEditingUserId(user.id); setEditUserData(user); }} className="w-10 h-10 brutal-box bg-brutal-blue text-white flex items-center justify-center hover:bg-[#1da2ff] shadow-none border-4"><Edit2 className="w-5 h-5 stroke-[3]" /></button>
                                 <button onClick={() => deleteUser(user.id)} className="w-10 h-10 brutal-box bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-none border-4"><Trash2 className="w-5 h-5 stroke-[3]" /></button>
                               </>
                             )}
                          </td>
                        </tr>
                      );
                    })}
                   </tbody>
                 </table>
              </div>
            </div>
          )}

          {/* ──────────────── TEMPLATES TAB ──────────────── */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b-4 border-black pb-4">
                <h3 className="text-black font-black text-2xl uppercase">Curriculum Templates</h3>
                <button onClick={() => setUnivForm(!unirForm)} className="brutal-btn bg-black text-white px-6 py-3 flex items-center gap-2">
                  <Plus className="w-5 h-5 stroke-[3]" /> ADD MASTER
                </button>
              </div>

              {unirForm && (
                <div className="p-6 bg-brutal-yellow border-4 border-black shadow-[4px_4px_0_#000] grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input type="text" placeholder="TITLE (E.G. VIT)" value={newUniv.name} onChange={e => setNewUniv({...newUniv, name: e.target.value})} className="px-4 py-3 font-bold uppercase rounded-none border-4 border-black bg-white focus:outline-none focus:ring-4 focus:ring-black" />
                  <input type="text" placeholder="SUBTITLE" value={newUniv.location} onChange={e => setNewUniv({...newUniv, location: e.target.value})} className="px-4 py-3 font-bold uppercase rounded-none border-4 border-black bg-white focus:outline-none focus:ring-4 focus:ring-black" />
                  <div className="flex gap-2">
                    <input type="text" placeholder="🎓" maxLength={2} value={newUniv.emoji} onChange={e => setNewUniv({...newUniv, emoji: e.target.value})} className="w-20 px-2 py-3 text-center text-xl rounded-none border-4 border-black bg-white focus:outline-none" />
                    <input type="color" value={newUniv.color} onChange={e => setNewUniv({...newUniv, color: e.target.value})} className="w-16 h-full p-0 m-0 border-4 border-black bg-white cursor-pointer" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addUniversity} className="flex-1 brutal-box border-4 border-black bg-brutal-green text-black font-black uppercase tracking-widest shadow-none hover:bg-[#00ffb5]">SAVE</button>
                    <button onClick={() => setUnivForm(false)} className="w-14 brutal-box border-4 border-black bg-slate-300 text-black flex items-center justify-center shadow-none hover:bg-slate-400"><X className="w-6 h-6 stroke-[3]"/></button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {universities.map(univ => (
                  <div key={univ.id} className="brutal-card bg-white overflow-hidden shadow-[6px_6px_0_#000]">
                    
                    {/* UNIV BINDER HEADER */}
                    <div className="flex items-center justify-between p-4 border-b-4 border-black" style={{ backgroundColor: univ.color }}>
                      <button onClick={() => { setExpandedUniv(expandedUniv === univ.id ? null : univ.id); if (expandedUniv !== univ.id) fetchSubjects(univ.id); }} className="flex-1 flex gap-4 items-center text-left">
                        <div className="w-12 h-12 brutal-box bg-white flex items-center justify-center border-4">
                           {expandedUniv === univ.id ? <ChevronDown className="w-8 h-8 text-black stroke-[3]" /> : <ChevronRight className="w-8 h-8 text-black stroke-[3]" />}
                        </div>
                        <span className="text-4xl drop-shadow-[2px_2px_0_#000] bg-white border-2 border-black px-2">{univ.emoji}</span>
                        {editingUnivId === univ.id ? (
                          <div className="flex gap-3 w-full max-w-sm mr-4" onClick={e => e.stopPropagation()}>
                            <input type="text" value={editUnivData.name || ''} onChange={e=>setEditUnivData({...editUnivData, name: e.target.value})} className="px-3 py-2 border-4 border-black bg-white text-black font-black uppercase text-lg w-full" />
                            <input type="color" value={editUnivData.color || ''} onChange={e=>setEditUnivData({...editUnivData, color: e.target.value})} className="w-12 border-4 border-black p-0 h-full" />
                          </div>
                        ) : (
                          <div>
                             <p className="text-2xl font-black text-white tracking-tight uppercase" style={{textShadow: '2px 2px 0 #000'}}>{univ.name}</p>
                             <p className="text-black font-black text-xs uppercase px-2 py-0.5 bg-white border-2 border-black inline-block">{univ.location}</p>
                          </div>
                        )}
                      </button>
                      <div className="flex gap-2 items-center pl-4 bg-white/20 p-2 border-l-4 border-black">
                        {editingUnivId === univ.id ? (
                          <>
                            <button onClick={() => updateUniversity(univ.id)} className="w-12 h-12 brutal-btn bg-brutal-green flex items-center justify-center"><Check className="w-6 h-6 stroke-[3]" /></button>
                            <button onClick={() => setEditingUnivId(null)} className="w-12 h-12 brutal-btn bg-slate-300 flex items-center justify-center"><X className="w-6 h-6 stroke-[3]" /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => { setEditingUnivId(univ.id); setEditUnivData(univ); }} className="w-12 h-12 brutal-btn bg-brutal-blue text-white flex items-center justify-center"><Edit2 className="w-6 h-6 stroke-[3]" /></button>
                            <button onClick={() => deleteUniversity(univ.id)} className="w-12 h-12 brutal-btn bg-red-600 text-white flex items-center justify-center"><Trash2 className="w-6 h-6 stroke-[3]" /></button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* SUBJECTS ACCORDION */}
                    {expandedUniv === univ.id && (
                      <div className="p-4 bg-slate-100 space-y-4">
                        <div className="flex gap-2 items-center mb-6 pb-6 border-b-4 border-black border-dashed">
                            <input type="text" placeholder="SUBJECT NAME" value={newSubj.name} onChange={e => setNewSubj({...newSubj, name: e.target.value})} className="flex-1 px-4 py-3 bg-white font-black uppercase text-lg border-4 border-black focus:outline-none" />
                            <input type="text" placeholder="📚" maxLength={2} value={newSubj.icon} onChange={e => setNewSubj({...newSubj, icon: e.target.value})} className="w-16 px-2 py-3 bg-white text-xl text-center border-4 border-black focus:outline-none" />
                            <button onClick={() => addSubject(univ.id)} className="px-6 py-3 bg-black text-brutal-yellow text-lg border-4 border-black font-black uppercase hover:bg-slate-800 transition-colors">APPEND</button>
                        </div>

                        {subjects.map(subj => (
                          <div key={subj.id} className="border-4 border-black bg-white shadow-[4px_4px_0_#000]">
                            <div className="flex items-center justify-between p-3 border-b-4 border-black" style={{ backgroundColor: subj.color }}>
                              <button onClick={() => { setExpandedSubject(expandedSubject === subj.id ? null : subj.id); if (expandedSubject !== subj.id) fetchModules(subj.id); }} className="flex-1 flex gap-3 items-center">
                                <div className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black">
                                   {expandedSubject === subj.id ? <ChevronDown className="w-6 h-6 text-black stroke-[3]" /> : <ChevronRight className="w-6 h-6 text-black stroke-[3]" />}
                                </div>
                                <span className="text-2xl bg-white border-2 border-black w-10 h-10 flex items-center justify-center">{subj.icon}</span>
                                {editingSubjId === subj.id ? (
                                  <input type="text" value={editSubjData.name || ''} onChange={e=>setEditSubjData({...editSubjData, name: e.target.value})} onClick={e=>e.stopPropagation()} className="px-3 py-1 border-4 border-black bg-white text-black font-black uppercase w-full max-w-sm" />
                                ) : (
                                  <span className="text-white font-black text-xl uppercase" style={{textShadow: '2px 2px 0 #000'}}>{subj.name}</span>
                                )}
                              </button>
                              <div className="flex gap-2">
                                {editingSubjId === subj.id ? (
                                  <>
                                    <button onClick={() => updateSubject(subj.id, univ.id)} className="w-10 h-10 brutal-box shadow-none bg-brutal-green border-2 flex items-center justify-center"><Check className="w-5 h-5 stroke-[3]" /></button>
                                    <button onClick={() => setEditingSubjId(null)} className="w-10 h-10 brutal-box shadow-none bg-slate-300 border-2 flex items-center justify-center"><X className="w-5 h-5 stroke-[3]" /></button>
                                  </>
                                ) : (
                                  <>
                                    <button onClick={() => { setEditingSubjId(subj.id); setEditSubjData(subj); }} className="w-10 h-10 brutal-box shadow-none bg-brutal-blue text-white border-2 flex items-center justify-center hover:bg-blue-600"><Edit2 className="w-4 h-4 stroke-[3]" /></button>
                                    <button onClick={() => deleteSubject(subj.id, univ.id)} className="w-10 h-10 brutal-box shadow-none bg-red-600 text-white border-2 flex items-center justify-center hover:bg-red-700"><Trash2 className="w-4 h-4 stroke-[3]" /></button>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* MODULES ACCORDION */}
                            {expandedSubject === subj.id && (
                              <div className="p-4 bg-slate-50 space-y-4">
                                <div className="flex gap-2 border-b-4 border-black pb-4">
                                  <input type="text" placeholder="ADD MODULE" value={newMod.name} onChange={e=>setNewMod({name:e.target.value})} className="flex-1 bg-white border-4 border-black px-4 py-2 font-bold uppercase text-black focus:outline-none" />
                                  <button onClick={()=>addModule(subj.id)} className="bg-black text-white px-6 font-black uppercase border-4 border-black">ADD</button>
                                </div>
                                
                                {modules.map(mod => (
                                  <div key={mod.id} className="border-4 border-black bg-white shadow-[2px_2px_0_#000]">
                                    <div className="flex items-center justify-between p-3 bg-brutal-lilac border-b-4 border-black">
                                       <button onClick={() => { setExpandedModule(expandedModule === mod.id ? null : mod.id); if (expandedModule !== mod.id) fetchTopics(mod.id); }} className="flex-1 flex gap-2 items-center text-left">
                                         <div className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black">
                                           {expandedModule === mod.id ? <ChevronDown className="w-6 h-6 text-black stroke-[3]" /> : <ChevronRight className="w-6 h-6 text-black stroke-[3]" />}
                                         </div>
                                         {editingModId === mod.id ? (
                                           <input value={editModData.name} onChange={e=>setEditModData({name:e.target.value})} onClick={e=>e.stopPropagation()} className="px-3 py-1 bg-white border-4 border-black text-black font-black w-full" />
                                         ) : (
                                           <span className="text-black text-lg font-black uppercase">{mod.name}</span>
                                         )}
                                       </button>
                                       <div className="flex gap-2">
                                         {editingModId === mod.id ? (
                                            <>
                                              <button onClick={() => updateModule(mod.id, subj.id)} className="w-8 h-8 bg-brutal-green border-2 border-black flex flex-col justify-center items-center"><Check className="w-4 h-4 stroke-[3]"/></button>
                                              <button onClick={() => setEditingModId(null)} className="w-8 h-8 bg-slate-300 border-2 border-black flex flex-col justify-center items-center"><X className="w-4 h-4 stroke-[3]"/></button>
                                            </>
                                         ) : (
                                            <>
                                              <button onClick={() => { setEditingModId(mod.id); setEditModData({name:mod.name}); }} className="w-8 h-8 bg-brutal-blue text-white border-2 border-black flex items-center justify-center hover:bg-blue-600"><Edit2 className="w-3 h-3 stroke-[3]" /></button>
                                              <button onClick={() => deleteModule(mod.id, subj.id)} className="w-8 h-8 bg-brutal-orange text-white border-2 border-black flex items-center justify-center hover:bg-orange-600"><Trash2 className="w-3 h-3 stroke-[3]" /></button>
                                            </>
                                         )}
                                       </div>
                                    </div>
                                    
                                    {/* TOPICS ACCORDION */}
                                    {expandedModule === mod.id && (
                                      <div className="p-4 space-y-2 bg-slate-100">
                                        {topics.map(topic => (
                                          <div key={topic.id} className="flex justify-between items-center group bg-white border-2 border-black p-2">
                                            {editingTopicId === topic.id ? (
                                              <input type="text" value={editTopicData.name} onChange={e=>setEditTopicData({name:e.target.value})} className="px-2 py-1 bg-white border-2 border-black text-black font-bold uppercase w-full" />
                                            ) : (
                                              <span className="text-sm text-black font-bold uppercase">{topic.name}</span>
                                            )}
                                            <div className="flex pl-2">
                                              {editingTopicId === topic.id ? (
                                                <div className="flex gap-2">
                                                  <button onClick={() => updateTopic(topic.id, mod.id)} className="w-6 h-6 bg-brutal-green border-2 border-black flex items-center justify-center"><Check className="w-3 h-3 stroke-[4]"/></button>
                                                  <button onClick={() => setEditingTopicId(null)} className="w-6 h-6 bg-slate-300 border-2 border-black flex items-center justify-center"><X className="w-3 h-3 stroke-[4]"/></button>
                                                </div>
                                              ) : (
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                  <button onClick={() => { setEditingTopicId(topic.id); setEditTopicData({name:topic.name}); }} className="w-6 h-6 bg-brutal-blue text-white border-2 border-black flex items-center justify-center"><Edit2 className="w-3 h-3 stroke-[3]" /></button>
                                                  <button onClick={() => deleteTopic(topic.id, mod.id)} className="w-6 h-6 bg-red-600 text-white border-2 border-black flex items-center justify-center"><Trash2 className="w-3 h-3 stroke-[3]" /></button>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                        <div className="flex gap-2 pt-2 border-t-2 border-black border-dashed mt-2">
                                          <input type="text" placeholder="TOPIC NAME" value={newTopic.name} onChange={e=>setNewTopic({name:e.target.value})} className="flex-1 bg-white border-2 border-black px-3 py-1 font-bold uppercase text-black focus:outline-none text-sm" />
                                          <button onClick={()=>addTopic(mod.id)} className="bg-brutal-green text-black px-4 font-black uppercase border-2 border-black border-b-4 hover:-translate-y-1 transition-transform">ADD</button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──────────────── DEVELOPERS TAB ──────────────── */}
          {activeTab === 'developers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b-4 border-black pb-4">
                <h3 className="text-black font-black text-2xl uppercase">Developer Roster</h3>
                <button onClick={() => setDevFormOpen(!devFormOpen)} className="brutal-btn bg-black text-white px-6 py-3 flex items-center gap-2"><Plus className="w-5 h-5 stroke-[3]" /> ADD DEV</button>
              </div>
              
              {devFormOpen && (
                <div className="p-6 bg-brutal-blue border-4 border-black shadow-[4px_4px_0_#000] grid grid-cols-2 gap-4 mb-8">
                  <input type="text" placeholder="NAME" value={newDeveloper.name||''} onChange={e=>setNewDeveloper({...newDeveloper, name:e.target.value})} className="col-span-2 md:col-span-1 bg-white border-4 border-black px-4 py-3 text-black font-bold uppercase focus:outline-none focus:ring-4 focus:ring-black" />
                  <input type="email" placeholder="EMAIL" value={newDeveloper.email||''} onChange={e=>setNewDeveloper({...newDeveloper, email:e.target.value})} className="col-span-2 md:col-span-1 bg-white border-4 border-black px-4 py-3 text-black font-bold uppercase focus:outline-none focus:ring-4 focus:ring-black" />
                  <input type="text" placeholder="ROLE" value={newDeveloper.role||''} onChange={e=>setNewDeveloper({...newDeveloper, role:e.target.value})} className="col-span-2 md:col-span-1 bg-white border-4 border-black px-4 py-3 text-black font-bold uppercase focus:outline-none focus:ring-4 focus:ring-black" />
                  <input type="text" placeholder="GITHUB URL" value={newDeveloper.github_profile||''} onChange={e=>setNewDeveloper({...newDeveloper, github_profile:e.target.value})} className="col-span-2 md:col-span-1 bg-white border-4 border-black px-4 py-3 text-black font-bold uppercase focus:outline-none focus:ring-4 focus:ring-black" />
                  <textarea placeholder="BIO" value={newDeveloper.bio||''} onChange={e=>setNewDeveloper({...newDeveloper, bio:e.target.value})} className="col-span-2 h-24 resize-none bg-white border-4 border-black px-4 py-3 text-black font-bold uppercase focus:outline-none focus:ring-4 focus:ring-black" />
                  <div className="col-span-2 flex justify-end gap-3 mt-2">
                    <button onClick={()=>setDevFormOpen(false)} className="px-8 py-3 brutal-box border-4 bg-slate-300 text-black font-black uppercase text-lg shadow-none border-black">CANCEL</button>
                    <button onClick={addDeveloper} className="px-8 py-3 brutal-box border-4 bg-brutal-yellow text-black font-black uppercase text-lg hover:-translate-y-1 transition-transform border-black hover:shadow-[4px_4px_0_#000]">CREATE</button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {developers.map(dev => (
                  <div key={dev.id} className="brutal-card p-6 bg-white flex flex-col justify-between border-4 border-black">
                    {editingDevId === dev.id ? (
                       <div className="space-y-3">
                         <input type="text" placeholder="NAME" value={editDevData.name||''} onChange={e=>setEditDevData({...editDevData, name:e.target.value})} className="w-full bg-white font-bold uppercase border-4 border-black text-black px-4 py-2" />
                         <input type="text" placeholder="ROLE" value={editDevData.role||''} onChange={e=>setEditDevData({...editDevData, role:e.target.value})} className="w-full bg-white font-bold uppercase border-4 border-black text-black px-4 py-2" />
                         <div className="flex gap-2 pt-2">
                           <button onClick={()=>updateDeveloper(dev.id)} className="flex-1 brutal-box shadow-none border-4 bg-brutal-green border-black py-2 text-black font-black uppercase hover:bg-[#00ffb5]">SAVE</button>
                           <button onClick={()=>setEditingDevId(null)} className="brutal-box shadow-none border-4 bg-slate-300 border-black w-14 flex items-center justify-center hover:bg-slate-400"><X className="w-6 h-6 stroke-[3]"/></button>
                         </div>
                       </div>
                    ) : (
                      <>
                        <div className="mb-4">
                          <div className="flex justify-between items-start border-b-4 border-black pb-3">
                            <div>
                               <h4 className="text-black font-black text-2xl uppercase leading-none">{dev.name}</h4>
                               <p className="text-white text-xs font-black uppercase bg-brutal-blue border-2 border-black px-2 mt-2 py-0.5 inline-block">{dev.role}</p>
                            </div>
                            <div className="flex gap-2">
                               <button onClick={()=>{setEditingDevId(dev.id); setEditDevData(dev);}} className="w-10 h-10 brutal-box border-2 border-black flex items-center justify-center bg-brutal-pink hover:bg-pink-400 shadow-none"><Edit2 className="w-5 h-5 stroke-[3]" /></button>
                               <button onClick={()=>deleteDeveloper(dev.id)} className="w-10 h-10 brutal-box border-2 border-black flex items-center justify-center bg-red-600 text-white hover:bg-red-700 shadow-none"><Trash2 className="w-5 h-5 stroke-[3]" /></button>
                            </div>
                          </div>
                          {dev.bio && <p className="text-black/80 font-bold text-sm mt-4 uppercase leading-relaxed">{dev.bio}</p>}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ──────────────── SETTINGS TAB ──────────────── */}
          {activeTab === 'settings' && (
            <div className="brutal-box p-12 text-center bg-slate-200 border-dashed border-4 border-black/50 shadow-none">
               <div className="w-24 h-24 border-4 border-black bg-white flex items-center justify-center mx-auto mb-6 transform rotate-12">
                 <Settings className="w-12 h-12 text-black stroke-[3]" />
               </div>
               <h2 className="text-black font-black text-3xl uppercase tracking-tighter mb-4">SYSTEM CONFIGURATION</h2>
               <p className="text-black/70 font-bold uppercase max-w-sm mx-auto p-4 border-2 border-black bg-white">
                 Colleges, Branches, and Global Site variables are managed implicitly through the unified backend configuration in this phase.
               </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
