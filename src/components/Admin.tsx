import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Plus, X, Users, BookOpen, Settings, Code, ChevronDown, ChevronRight } from 'lucide-react';
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
  const [devFormOpen, setDevFormOpen] = useState(false);
  const [newDeveloper, setNewDeveloper] = useState<Partial<Developer>>({
    skills: [],
  });

  // Template management state
  const [expandedUniv, setExpandedUniv] = useState<string | null>(null);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [unirForm, setUnivForm] = useState(false);
  const [newUniv, setNewUniv] = useState({ name: '', location: '', emoji: '🎓', color: '#6366f1' });
  const [newSubj, setNewSubj] = useState({ name: '', icon: '📘', color: '#06b6d4' });
  const [newMod, setNewMod] = useState({ name: '' });
  const [newTopic, setNewTopic] = useState({ name: '' });

  // Security check: If user is not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <X className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-white font-bold text-lg mb-1">Access Denied</p>
        <p className="text-slate-500 text-sm text-center max-w-xs mb-6">
          You don't have permission to access this page. Only authorized administrators can view this content.
        </p>
        <button
          onClick={() => navigate({ type: 'home' })}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          Go Back Home
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
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setUsers(data as UserData[]);
    }
    setLoading(false);
  };

  const fetchDevelopers = async () => {
    const { data } = await supabase
      .from('developers')
      .select('*')
      .order('created_at', { ascending: true });
    if (data) setDevelopers(data as Developer[]);
  };

  // ─── Template Management Functions ──────────────────────
  const fetchUniversities = async () => {
    const { data } = await supabase
      .from('universities')
      .select('*')
      .order('created_at', { ascending: true });
    if (data) setUniversities(data as University[]);
  };

  const fetchSubjects = async (univId: string) => {
    const { data } = await supabase
      .from('university_subjects')
      .select('*')
      .eq('university_id', univId)
      .order('order_index', { ascending: true });
    if (data) setSubjects(data as UniversitySubject[]);
  };

  const fetchModules = async (subjId: string) => {
    const { data } = await supabase
      .from('university_modules')
      .select('*')
      .eq('university_subject_id', subjId)
      .order('order_index', { ascending: true });
    if (data) setModules(data as UniversityModule[]);
  };

  const fetchTopics = async (modId: string) => {
    const { data } = await supabase
      .from('university_topics')
      .select('*')
      .eq('university_module_id', modId)
      .order('order_index', { ascending: true });
    if (data) setTopics(data as UniversityTopic[]);
  };

  const addUniversity = async () => {
    if (!newUniv.name) {
      alert('University name is required');
      return;
    }
    try {
      await supabase.from('universities').insert({
        name: newUniv.name,
        location: newUniv.location,
        emoji: newUniv.emoji,
        color: newUniv.color,
        is_active: true,
      });
      setNewUniv({ name: '', location: '', emoji: '🎓', color: '#6366f1' });
      setUnivForm(false);
      fetchUniversities();
    } catch (error) {
      console.error('Error adding university:', error);
    }
  };

  const addSubject = async (univId: string) => {
    if (!newSubj.name) {
      alert('Subject name is required');
      return;
    }
    try {
      await supabase.from('university_subjects').insert({
        university_id: univId,
        name: newSubj.name,
        icon: newSubj.icon,
        color: newSubj.color,
        order_index: subjects.length,
        is_active: true,
      });
      setNewSubj({ name: '', icon: '📘', color: '#06b6d4' });
      fetchSubjects(univId);
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  const addModule = async (subjId: string) => {
    if (!newMod.name) {
      alert('Module name is required');
      return;
    }
    try {
      await supabase.from('university_modules').insert({
        university_subject_id: subjId,
        name: newMod.name,
        order_index: modules.length,
        is_active: true,
      });
      setNewMod({ name: '' });
      fetchModules(subjId);
    } catch (error) {
      console.error('Error adding module:', error);
    }
  };

  const addTopic = async (modId: string) => {
    if (!newTopic.name) {
      alert('Topic name is required');
      return;
    }
    try {
      await supabase.from('university_topics').insert({
        university_module_id: modId,
        name: newTopic.name,
        order_index: topics.length,
        is_active: true,
      });
      setNewTopic({ name: '' });
      fetchTopics(modId);
    } catch (error) {
      console.error('Error adding topic:', error);
    }
  };

  const deleteUniversity = async (id: string) => {
    if (!confirm('Delete this university? All subjects, modules, and topics will be deleted.')) return;
    try {
      await supabase.from('universities').delete().eq('id', id);
      fetchUniversities();
    } catch (error) {
      console.error('Error deleting university:', error);
    }
  };

  const deleteSubject = async (id: string, univId: string) => {
    if (!confirm('Delete this subject? All modules and topics will be deleted.')) return;
    try {
      await supabase.from('university_subjects').delete().eq('id', id);
      fetchSubjects(univId);
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const deleteModule = async (id: string, subjId: string) => {
    if (!confirm('Delete this module? All topics will be deleted.')) return;
    try {
      await supabase.from('university_modules').delete().eq('id', id);
      fetchModules(subjId);
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  const deleteTopic = async (id: string, modId: string) => {
    try {
      await supabase.from('university_topics').delete().eq('id', id);
      fetchTopics(modId);
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  const addDeveloper = async () => {
    if (!newDeveloper.name || !newDeveloper.email || !newDeveloper.role) {
      alert('Please fill in required fields');
      return;
    }

    try {
      await supabase.from('developers').insert({
        name: newDeveloper.name,
        email: newDeveloper.email,
        role: newDeveloper.role,
        github_profile: newDeveloper.github_profile,
        linkedin_profile: newDeveloper.linkedin_profile,
        bio: newDeveloper.bio,
        contributions: newDeveloper.contributions,
        skills: newDeveloper.skills || [],
        is_active: true,
      });
      setNewDeveloper({ skills: [] });
      setDevFormOpen(false);
      fetchDevelopers();
    } catch (error) {
      console.error('Error adding developer:', error);
    }
  };

  const deleteDeveloper = async (devId: string) => {
    if (!confirm('Are you sure? This will remove the developer.')) return;
    
    try {
      await supabase.from('developers').delete().eq('id', devId);
      fetchDevelopers();
    } catch (error) {
      console.error('Error deleting developer:', error);
    }
  };

 const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure? This will delete all user data.')) return;

    try {
      // Delete from profiles
      await supabase.from('profiles').delete().eq('id', userId);

      // Refresh list
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Header with back button */}
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => navigate({ type: 'home' })}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-slate-700"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </button>
        <div>
          <h1 className="text-white font-bold text-lg">Admin Panel</h1>
          <p className="text-slate-500 text-xs">Manage users and system settings</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4">
        {['users', 'templates', 'developers', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: activeTab === tab ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
              color: activeTab === tab ? 'white' : '#818cf8',
              border: activeTab === tab ? 'none' : '1px solid rgba(99,102,241,0.2)',
            }}>
            {tab === 'users' && <Users className="w-4 h-4" />}
            {tab === 'templates' && <BookOpen className="w-4 h-4" />}
            {tab === 'developers' && <Code className="w-4 h-4" />}
            {tab === 'settings' && <Settings className="w-4 h-4" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between">
              <p className="text-white font-semibold">Users ({users.length})</p>
              <button
                onClick={fetchUsers}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-200"
                style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}>
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="px-4 py-8 text-center text-slate-500">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="px-4 py-8 text-center text-slate-500">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-black/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-slate-400 font-semibold">Reg No</th>
                    <th className="px-4 py-3 text-left text-slate-400 font-semibold">Name</th>
                    <th className="px-4 py-3 text-left text-slate-400 font-semibold">Branch</th>
                    <th className="px-4 py-3 text-left text-slate-400 font-semibold">Study Time</th>
                    <th className="px-4 py-3 text-left text-slate-400 font-semibold">Joined</th>
                    <th className="px-4 py-3 text-center text-slate-400 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                      <td className="px-4 py-3">
                        <span className="text-white font-medium">{user.reg_no}</span>
                        {user.reg_no === '25BYB0101' && (
                          <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold"
                            style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>
                            ADMIN
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-300">{user.full_name}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{user.branch}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {Math.floor(user.total_study_minutes / 60)}h {user.total_study_minutes % 60}m
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 flex justify-center gap-2">
                        <button
                          className="p-1.5 rounded-lg transition-all duration-200 hover:bg-red-500/20"
                          style={{ background: 'rgba(239,68,68,0.1)' }}
                          onClick={() => deleteUser(user.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="rounded-2xl p-4 space-y-3"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">University Templates</h3>
            <button
              onClick={() => setUnivForm(!unirForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Plus className="w-4 h-4" />
              Add University
            </button>
          </div>

          {/* Add University Form */}
          {unirForm && (
            <div className="p-3 rounded-xl space-y-2"
              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <input
                type="text"
                placeholder="University name"
                value={newUniv.name}
                onChange={(e) => setNewUniv({ ...newUniv, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm text-white bg-slate-700/50"
              />
              <input
                type="text"
                placeholder="Location"
                value={newUniv.location}
                onChange={(e) => setNewUniv({ ...newUniv, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm text-white bg-slate-700/50"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Emoji"
                  maxLength={2}
                  value={newUniv.emoji}
                  onChange={(e) => setNewUniv({ ...newUniv, emoji: e.target.value })}
                  className="w-20 px-3 py-2 rounded-lg text-sm text-white bg-slate-700/50"
                />
                <input
                  type="color"
                  value={newUniv.color}
                  onChange={(e) => setNewUniv({ ...newUniv, color: e.target.value })}
                  className="w-20 px-2 py-2 rounded-lg cursor-pointer"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addUniversity}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
                  Add
                </button>
                <button
                  onClick={() => setUnivForm(false)}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-slate-400"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Universities List */}
          {universities.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No universities yet</div>
          ) : (
            universities.map((univ) => (
              <div key={univ.id} className="rounded-xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                
                {/* University Header */}
                <button
                  onClick={() => {
                    setExpandedUniv(expandedUniv === univ.id ? null : univ.id);
                    if (expandedUniv !== univ.id) fetchSubjects(univ.id);
                  }}
                  className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-all"
                  style={{ background: univ.color + '20' }}>
                  <div className="flex items-center gap-3">
                    {expandedUniv === univ.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    <span className="text-2xl">{univ.emoji}</span>
                    <div className="text-left">
                      <p className="text-white font-semibold">{univ.name}</p>
                      <p className="text-slate-500 text-xs">{univ.location || 'No location'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteUniversity(univ.id);
                      }}
                      className="p-1.5 rounded-lg transition-all hover:bg-red-500/20"
                      style={{ background: 'rgba(239,68,68,0.1)' }}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </button>

                {/* Subjects Section */}
                {expandedUniv === univ.id && (
                  <div className="p-3 space-y-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    {subjects.map((subj) => (
                      <div key={subj.id} className="rounded-lg p-2"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        
                        {/* Subject Header */}
                        <button
                          onClick={() => {
                            setExpandedSubject(expandedSubject === subj.id ? null : subj.id);
                            if (expandedSubject !== subj.id) fetchModules(subj.id);
                          }}
                          className="w-full flex items-center justify-between p-2 hover:bg-white/5 rounded transition-all"
                          style={{ background: subj.color + '15' }}>
                          <div className="flex items-center gap-2">
                            {expandedSubject === subj.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            <span className="text-lg">{subj.icon}</span>
                            <p className="text-white font-medium text-sm">{subj.name}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSubject(subj.id, univ.id);
                            }}
                            className="p-1 rounded transition-all hover:bg-red-500/20 text-xs">
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </button>
                        </button>

                        {/* Modules Section */}
                        {expandedSubject === subj.id && (
                          <div className="ml-6 mt-2 space-y-1">
                            {modules.map((mod) => (
                              <div key={mod.id} className="rounded p-1.5"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
                                
                                {/* Module Header */}
                                <button
                                  onClick={() => {
                                    setExpandedModule(expandedModule === mod.id ? null : mod.id);
                                    if (expandedModule !== mod.id) fetchTopics(mod.id);
                                  }}
                                  className="w-full flex items-center justify-between p-1.5 hover:bg-white/5 rounded transition-all text-sm">
                                  <div className="flex items-center gap-2">
                                    {expandedModule === mod.id ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                    <p className="text-slate-300">{mod.name}</p>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteModule(mod.id, subj.id);
                                    }}
                                    className="p-0.5 rounded transition-all hover:bg-red-500/20">
                                    <Trash2 className="w-3 h-3 text-red-500" />
                                  </button>
                                </button>

                                {/* Topics Section */}
                                {expandedModule === mod.id && (
                                  <div className="ml-4 mt-1 space-y-0.5">
                                    {topics.length === 0 && (
                                      <p className="text-slate-600 text-xs ml-2">No topics</p>
                                    )}
                                    {topics.map((topic) => (
                                      <div key={topic.id} className="flex items-center justify-between p-1 rounded text-xs"
                                        style={{ background: 'rgba(255,255,255,0.02)' }}>
                                        <p className="text-slate-400">• {topic.name}</p>
                                        <button
                                          onClick={() => deleteTopic(topic.id, mod.id)}
                                          className="p-0 rounded hover:bg-red-500/20">
                                          <X className="w-2.5 h-2.5 text-red-500" />
                                        </button>
                                      </div>
                                    ))}

                                    {/* Add Topic Form */}
                                    <div className="ml-2 mt-1 flex gap-1">
                                      <input
                                        type="text"
                                        placeholder="Add topic"
                                        value={newTopic.name}
                                        onChange={(e) => setNewTopic({ name: e.target.value })}
                                        onKeyPress={(e) => {
                                          if (e.key === 'Enter') {
                                            addTopic(mod.id);
                                          }
                                        }}
                                        className="flex-1 px-2 py-1 rounded text-xs text-white bg-slate-700/50"
                                      />
                                      <button
                                        onClick={() => addTopic(mod.id)}
                                        className="px-2 py-1 rounded text-xs font-semibold text-white"
                                        style={{ background: '#10b981' }}>
                                        Add
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}

                            {/* Add Module Form */}
                            <div className="ml-4 flex gap-1 mt-1">
                              <input
                                type="text"
                                placeholder="New module"
                                value={newMod.name}
                                onChange={(e) => setNewMod({ name: e.target.value })}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    addModule(subj.id);
                                  }
                                }}
                                className="flex-1 px-2 py-1 rounded text-xs text-white bg-slate-700/50"
                              />
                              <button
                                onClick={() => addModule(subj.id)}
                                className="px-2 py-1 rounded text-xs font-semibold text-white"
                                style={{ background: '#6366f1' }}>
                                Add
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add Subject Form */}
                    <div className="flex gap-2 p-2">
                      <input
                        type="text"
                        placeholder="Subject name"
                        value={newSubj.name}
                        onChange={(e) => setNewSubj({ ...newSubj, name: e.target.value })}
                        className="flex-1 px-3 py-1.5 rounded-lg text-xs text-white bg-slate-700/50"
                      />
                      <input
                        type="text"
                        placeholder="Icon"
                        maxLength={2}
                        value={newSubj.icon}
                        onChange={(e) => setNewSubj({ ...newSubj, icon: e.target.value })}
                        className="w-12 px-2 py-1.5 rounded-lg text-xs text-white bg-slate-700/50"
                      />
                      <button
                        onClick={() => addSubject(univ.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                        style={{ background: '#34d399' }}>
                        Add Subject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Developers Tab */}
      {activeTab === 'developers' && (
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between">
              <p className="text-white font-semibold">Developers ({developers.length})</p>
              <button
                onClick={() => setDevFormOpen(!devFormOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                <Plus className="w-3.5 h-3.5" />
                Add Developer
              </button>
            </div>
          </div>

          {/* Add developer form */}
          {devFormOpen && (
            <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={newDeveloper.name || ''}
                  onChange={(e) => setNewDeveloper({ ...newDeveloper, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white bg-slate-700/50"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newDeveloper.email || ''}
                  onChange={(e) => setNewDeveloper({ ...newDeveloper, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white bg-slate-700/50"
                />
                <input
                  type="text"
                  placeholder="Role (e.g., Full Stack Developer)"
                  value={newDeveloper.role || ''}
                  onChange={(e) => setNewDeveloper({ ...newDeveloper, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white bg-slate-700/50"
                />
                <input
                  type="text"
                  placeholder="GitHub Profile"
                  value={newDeveloper.github_profile || ''}
                  onChange={(e) => setNewDeveloper({ ...newDeveloper, github_profile: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white bg-slate-700/50"
                />
                <input
                  type="text"
                  placeholder="LinkedIn Profile URL"
                  value={newDeveloper.linkedin_profile || ''}
                  onChange={(e) => setNewDeveloper({ ...newDeveloper, linkedin_profile: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white bg-slate-700/50"
                />
                <textarea
                  placeholder="Bio"
                  value={newDeveloper.bio || ''}
                  onChange={(e) => setNewDeveloper({ ...newDeveloper, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white bg-slate-700/50 h-16 resize-none"
                />
                <textarea
                  placeholder="Contributions"
                  value={newDeveloper.contributions || ''}
                  onChange={(e) => setNewDeveloper({ ...newDeveloper, contributions: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white bg-slate-700/50 h-16 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addDeveloper}
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
                    Save Developer
                  </button>
                  <button
                    onClick={() => setDevFormOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-slate-400"
                    style={{ background: 'rgba(255,255,255,0.05)' }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Developers list */}
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {developers.length === 0 ? (
              <div className="px-4 py-8 text-center text-slate-500">No developers added yet</div>
            ) : (
              developers.map((dev) => (
                <div key={dev.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{dev.name}</p>
                    <p className="text-slate-500 text-xs">{dev.role}</p>
                  </div>
                  <button
                    onClick={() => deleteDeveloper(dev.id)}
                    className="p-1.5 rounded-lg transition-all duration-200 hover:bg-red-500/20"
                    style={{ background: 'rgba(239,68,68,0.1)' }}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="rounded-2xl p-4 space-y-4"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-white font-semibold mb-4">System Settings</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div>
                <p className="text-white font-semibold text-sm">Admin Mode</p>
                <p className="text-slate-500 text-xs">You have admin privileges enabled</p>
              </div>
              <div className="w-10 h-6 rounded-full flex items-center pl-0.5"
                style={{ background: '#10b981' }}>
                <div className="w-5 h-5 rounded-full bg-white transition-all" />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <p className="text-white font-semibold text-sm">Data Backup</p>
                <p className="text-slate-500 text-xs">Last backup: Never</p>
              </div>
              <button
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-400 transition-all duration-200"
                style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}>
                Backup Now
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <p className="text-white font-semibold text-sm">User Audit Log</p>
                <p className="text-slate-500 text-xs">Monitor user activities</p>
              </div>
              <button
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-400 transition-all duration-200"
                style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}>
                View
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl"
            style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)' }}>
            <p className="text-orange-400 font-semibold text-sm mb-2">⚠️ Danger Zone</p>
            <p className="text-slate-400 text-xs mb-3">
              Irreversible actions that will permanently affect the system.
            </p>
            <button
              className="w-full px-4 py-2 rounded-lg text-sm font-semibold text-red-500 transition-all duration-200"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              Reset All Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
