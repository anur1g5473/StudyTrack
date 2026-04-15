import React, { useState } from 'react';
import { User, Clock, Flame, BookOpen, LogOut, Shield, Target, Trophy, Edit3, Check, X, Code } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';

const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}M`;
  if (m === 0) return `${h}H`;
  return `${h}H ${m}M`;
};

// ── Chip selector ──────────
interface ChipSelectorProps {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  showCustom?: boolean;
  customValue?: string;
  onCustomChange?: (v: string) => void;
  customPlaceholder?: string;
}

const ChipSelector: React.FC<ChipSelectorProps> = ({
  options, value, onChange, showCustom = false, customValue = '', onCustomChange, customPlaceholder = 'Type here...',
}) => {
  const isOther = value === 'Other' || (value && !options.slice(0, -1).includes(value) && value !== '');

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt === 'Other' ? isOther : value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt === 'Other' ? 'Other' : opt)}
              className={`px-3 py-2 text-xs font-black uppercase border-2 border-black transition-transform active:translate-y-1 ${active ? 'bg-brutal-green text-black translate-y-1 shadow-none' : 'bg-white text-black shadow-[2px_2px_0_#000] hover:bg-slate-100'}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {/* Custom text input when "Other" is selected */}
      {showCustom && isOther && (
        <input
          type="text"
          value={customValue}
          onChange={(e) => onCustomChange?.(e.target.value)}
          placeholder={customPlaceholder}
          className="w-full px-4 py-3 text-black font-bold uppercase border-4 border-black focus:outline-none focus:ring-4 focus:ring-brutal-yellow"
        />
      )}
    </div>
  );
};

export const Profile: React.FC = () => {
  const { profile, subjects, signOut, userId, refreshProfile, navigate, branches, colleges, academicYears, achievements: dbAchievements, isAdmin } = useApp();

  const YEAR_OPTIONS = academicYears.length > 0 ? academicYears.map(y => y.display_name) : ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const BRANCH_OPTIONS = branches.length > 0 ? [...branches.map(b => b.name), 'Other'] : ['CSE', 'ECE', 'EEE', 'IT', 'Mechanical', 'Civil', 'Chemical', 'Other'];
  const COLLEGE_OPTIONS = colleges.length > 0 ? [...colleges.map(c => c.name), 'Other'] : ['VIT Vellore', 'VIT Chennai', 'VIT AP', 'VIT Bhopal', 'BITS Pilani', 'BITS Goa', 'BITS Hyderabad', 'IIT Madras', 'IIT Bombay', 'IIT Delhi', 'NIT Trichy', 'NIT Warangal', 'NIT Surathkal', 'Anna University', 'SRM University', 'Amrita', 'Other'];

  const totalTopics = subjects.reduce((sum, s) => sum + (s.total_topics ?? 0), 0);
  const completedTopics = subjects.reduce((sum, s) => sum + (s.completed_topics ?? 0), 0);
  const overallPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const streakEmoji = (profile?.streak_days ?? 0) >= 7 ? '🔥🔥🔥' : (profile?.streak_days ?? 0) >= 3 ? '🔥🔥' : '🔥';

  // ── Edit state ──────────────────────────────────────────────
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName]       = useState(profile?.full_name ?? '');
  const [branch, setBranch]           = useState(profile?.branch ?? '');
  const [customBranch, setCustomBranch] = useState('');
  const [year, setYear]               = useState(profile?.college_year ?? '');
  const [college, setCollege]         = useState(profile?.college_name ?? '');
  const [customCollege, setCustomCollege] = useState('');

  const openEdit = () => {
    setFullName(profile?.full_name ?? '');
    const b = profile?.branch ?? '';
    const branchNames = branches.map(br => br.name);
    setBranch(branchNames.includes(b) ? b : b ? 'Other' : '');
    setCustomBranch(branchNames.includes(b) ? '' : b);
    setYear(profile?.college_year ?? '');
    const c = profile?.college_name ?? '';
    const collegeNames = colleges.map(col => col.name);
    setCollege(collegeNames.includes(c) ? c : c ? 'Other' : '');
    setCustomCollege(collegeNames.includes(c) ? '' : c);
    setEditing(true);
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    const finalBranch  = branch === 'Other'  ? customBranch.trim()  : branch;
    const finalCollege = college === 'Other' ? customCollege.trim() : college;
    
    const { error: updateError } = await supabase.from('profiles').update({
      full_name:    fullName.trim(),
      branch:       finalBranch,
      college_year: year,
      college_name: finalCollege,
    }).eq('id', userId);

    if (updateError) {
      window.alert('Save Failed: ' + updateError.message);
    } else {
      await refreshProfile();
      setEditing(false);
    }
    
    setSaving(false);
  };

  const displayBranch  = profile?.branch       || 'UNKNOWN SECTOR';
  const displayYear    = profile?.college_year  || 'UNKNOWN TIER';
  const displayCollege = profile?.college_name  || 'UNASSIGNED BASE';
  const displayName    = profile?.full_name     || profile?.reg_no || 'OPERATIVE';

  const achievements = dbAchievements && dbAchievements.length > 0
    ? dbAchievements.map(a => {
        let unlocked = false;
        if (a.condition_type === 'subjects_count') unlocked = subjects.length >= (a.condition_value ?? 1);
        else if (a.condition_type === 'topics_completed') unlocked = completedTopics >= (a.condition_value ?? 5);
        else if (a.condition_type === 'streak_days') unlocked = (profile?.streak_days ?? 0) >= (a.condition_value ?? 7);
        else if (a.condition_type === 'total_minutes') unlocked = (profile?.total_study_minutes ?? 0) >= (a.condition_value ?? 600);
        else if (a.condition_type === 'progress_percent') unlocked = overallPct >= (a.condition_value ?? 50);
        else if (a.condition_type === 'subject_completion') unlocked = subjects.some((s) => s.total_topics && s.total_topics > 0 && s.completed_topics === s.total_topics);
        return { title: a.title, desc: a.description, emoji: a.emoji, unlocked };
      })
    : [
        { title: 'FIRST STEP',      desc: 'Add your first subject',           emoji: '📘', unlocked: subjects.length >= 1 },
        { title: 'GETTING SERIOUS', desc: 'Complete 5 topics',                emoji: '⭐', unlocked: completedTopics >= 5 },
        { title: 'WEEK WARRIOR',    desc: 'Maintain a 7-day streak',          emoji: '🔥', unlocked: (profile?.streak_days ?? 0) >= 7 },
        { title: 'STUDY MARATHON',  desc: 'Log 10+ hours total',              emoji: '⏱', unlocked: (profile?.total_study_minutes ?? 0) >= 600 },
        { title: 'HALF WAY THERE',  desc: 'Reach 50% overall progress',       emoji: '🎯', unlocked: overallPct >= 50 },
        { title: 'EXAM READY',      desc: 'Complete all topics in a subject', emoji: '🏆', unlocked: subjects.some((s) => s.total_topics && s.total_topics > 0 && s.completed_topics === s.total_topics) },
      ];

  const statItems = [
    { icon: Clock,    bg: 'bg-brutal-pink',    value: formatTime(profile?.total_study_minutes ?? 0), label: 'Study Time' },
    { icon: Target,   bg: 'bg-brutal-yellow',  value: `${overallPct}%`,  label: 'Progress' },
    { icon: BookOpen, bg: 'bg-brutal-blue',    value: subjects.length,   label: 'Subjects' },
    { icon: Trophy,   bg: 'bg-brutal-green',   value: completedTopics,   label: 'Topics Done' },
  ];

  return (
    <div className="flex flex-col gap-6 pb-4">

      {/* Profile Hero - Brutal ID Card */}
      <div className="brutal-box p-6 bg-white relative border-4 border-black overflow-hidden shadow-[8px_8px_0_#000]">
        {/* Diagonal Warning Stripes background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 8px)' }} />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
             <div className="w-20 h-20 brutal-box bg-brutal-yellow flex items-center justify-center border-4 border-black rotate-[-3deg] shadow-[4px_4px_0_#000]">
                <User className="w-10 h-10 text-black stroke-[3]" />
             </div>
             <div className="bg-black text-white px-3 py-1 font-black uppercase text-sm border-2 border-dashed border-white shadow-[2px_2px_0_#00e5a3]">
                {profile?.reg_no || 'NO ID'}
             </div>
          </div>
          
          <h2 className="text-black text-4xl font-black tracking-tighter uppercase whitespace-normal break-words leading-none mb-4">{displayName}</h2>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs px-2 py-1 font-black bg-brutal-pink border-2 border-black uppercase">{displayYear}</span>
            <span className="text-xs px-2 py-1 font-black bg-brutal-green border-2 border-black uppercase">{displayBranch}</span>
            <span className="text-xs px-2 py-1 font-black bg-brutal-blue text-white border-2 border-black uppercase">{displayCollege}</span>
          </div>
          
          <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 border-2 border-brutal-pink shadow-[4px_4px_0_#ff90e8] rotate-2">
            <Flame className="w-5 h-5 text-brutal-yellow" />
            <span className="text-sm font-black uppercase tracking-widest">{profile?.streak_days ?? 0} DAY STREAK {streakEmoji}</span>
          </div>
        </div>
      </div>

      {/* ── Edit / View Info Card ─────────────────────────────── */}
      <div className="brutal-box overflow-hidden bg-white">
        <div className="flex items-center justify-between px-5 py-4 border-b-4 border-black bg-slate-100">
          <div className="flex items-center gap-2">
            <Edit3 className="w-6 h-6 stroke-[3]" />
            <span className="text-black font-black text-lg uppercase">Clearance Level</span>
          </div>
          {!editing ? (
            <button
              onClick={openEdit}
              className="text-white text-xs font-black uppercase px-4 py-2 brutal-btn bg-black hover:bg-slate-800"
            >
              EDIT DATA
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="w-10 h-10 brutal-btn flex items-center justify-center bg-brutal-orange text-white"
              >
                <X className="w-6 h-6 stroke-[3]" />
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-10 h-10 brutal-btn flex items-center justify-center bg-brutal-green text-black disabled:opacity-50"
              >
                {saving ? <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" /> : <Check className="w-6 h-6 stroke-[3]" />}
              </button>
            </div>
          )}
        </div>

        {/* View mode */}
        {!editing && (
          <div className="p-5 space-y-4">
            {[
              { label: 'CLASSIFICATION', value: displayName },
              { label: 'DIVISION',       value: displayBranch },
              { label: 'RANK',           value: displayYear },
              { label: 'STATION',        value: displayCollege },
            ].map((row) => (
              <div key={row.label} className="flex items-end justify-between border-b-2 border-dashed border-black/20 pb-2">
                <span className="text-black/60 font-black text-xs uppercase">{row.label}</span>
                <span className="text-black text-lg font-black uppercase">{row.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Edit mode */}
        {editing && (
          <div className="p-5 space-y-6">
            <div>
              <label className="text-xs font-black text-black uppercase mb-2 block">FULL NAME</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="E.G. ANURA SHARMA"
                className="w-full px-4 py-3 text-black text-lg font-bold border-4 border-black focus:outline-none focus:ring-4 focus:ring-brutal-blue"
              />
            </div>
            <div>
              <label className="text-xs font-black text-black uppercase mb-2 block">COLLEGE YEAR</label>
              <ChipSelector options={YEAR_OPTIONS} value={year} onChange={setYear} />
            </div>
            <div>
              <label className="text-xs font-black text-black uppercase mb-2 block">DEPARTMENT</label>
              <ChipSelector options={BRANCH_OPTIONS} value={branch} onChange={setBranch} showCustom customValue={customBranch} onCustomChange={setCustomBranch} />
            </div>
            <div>
              <label className="text-xs font-black text-black uppercase mb-2 block">STATION / COLLEGE</label>
              <ChipSelector options={COLLEGE_OPTIONS} value={college} onChange={setCollege} showCustom customValue={customCollege} onCustomChange={setCustomCollege} />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full font-black text-xl py-4 brutal-btn flex items-center justify-center gap-2 bg-brutal-green text-black"
            >
              {saving ? <div className="w-5 h-5 rounded-full border-4 border-black border-t-white animate-spin" /> : <Check className="w-6 h-6 stroke-[3]" />}
              {saving ? 'UPDATING...' : 'SAVE CLEARANCE'}
            </button>
          </div>
        )}
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className={`brutal-card p-4 flex flex-col gap-2 border-4 border-black ${item.bg}`}>
              <div className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center shadow-[2px_2px_0_#000] -rotate-3">
                <Icon className="w-6 h-6 text-black stroke-[3]" />
              </div>
              <p className={`text-4xl font-black ${item.bg === 'bg-brutal-blue' ? 'text-white' : 'text-black'} tracking-tighter mt-2 leading-none drop-shadow-[1px_1px_0_#000]`}>{item.value}</p>
              <p className={`text-xs font-black uppercase ${item.bg === 'bg-brutal-blue' ? 'text-white' : 'text-black'} border-t-2 border-black pt-1`}>{item.label}</p>
            </div>
          );
        })}
      </div>

      {/* Achievements */}
      <div className="brutal-box p-5 bg-white border-4 border-black shadow-[6px_6px_0_#000]">
        <h3 className="text-black font-black text-xl mb-5 flex items-center gap-2 uppercase underline decoration-4 underline-offset-4">
          <Trophy className="w-6 h-6 text-black fill-brutal-yellow stroke-[2]" /> MEDALS
        </h3>
        <div className="space-y-4">
          {achievements.map((a) => (
            <div key={a.title}
              className={`flex flex-col gap-2 p-4 border-4 border-black transition-all ${a.unlocked ? 'bg-brutal-yellow shadow-[4px_4px_0_#000] translate-x-[-2px] translate-y-[-2px]' : 'bg-slate-100 opacity-60 grayscale'}`}>
              <div className="flex items-start gap-4">
                 <div className="w-14 h-14 shrink-0 bg-white border-2 border-black flex items-center justify-center text-3xl shadow-[2px_2px_0_#000]">
                    {a.unlocked ? a.emoji : '🔒'}
                 </div>
                 <div className="flex-1">
                   <p className="text-lg font-black uppercase leading-tight text-black">{a.title}</p>
                   <p className="text-sm font-bold text-black/70 uppercase mt-0.5">{a.desc}</p>
                 </div>
                 {a.unlocked && (
                   <div className="w-8 h-8 shrink-0 bg-brutal-green border-2 border-black flex items-center justify-center rotate-6 shadow-[2px_2px_0_#000]">
                      <Check className="w-5 h-5 text-black stroke-[4]" />
                   </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="brutal-box p-4 bg-slate-200 border-dashed border-4 border-black/50 text-center uppercase shadow-none">
        <p className="text-black font-black text-xs">Operative File ID: {userId?.split('-')[0]}</p>
        <p className="text-black/60 font-bold text-[10px] mt-1">Secured by Supabase Matrix</p>
      </div>

      {/* Admin Panel */}
      {isAdmin && (
         <button
            onClick={() => navigate({ type: 'admin' })}
            className="w-full font-black text-xl py-4 brutal-btn flex items-center justify-center gap-2 bg-red-600 text-white"
         >
            <Shield className="w-6 h-6 stroke-[3]" /> OVERRIDE DASHBOARD
         </button>
      )}

      {/* Developers */}
      <button
        onClick={() => navigate({ type: 'developers' })}
        className="w-full font-black text-xl py-4 brutal-btn flex items-center justify-center gap-3 bg-black text-white hover:bg-slate-800"
      >
        <Code className="w-6 h-6 stroke-[3]" /> SYSTEM ARCHITECTS
      </button>

      {/* Logout */}
      <button
        onClick={signOut}
        className="w-full font-black text-xl py-4 brutal-btn flex items-center justify-center gap-3 bg-brutal-orange text-white hover:bg-[#ff5722]"
      >
        <LogOut className="w-6 h-6 stroke-[3]" /> ABORT SESSION
      </button>
    </div>
  );
};
