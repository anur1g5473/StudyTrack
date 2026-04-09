import React, { useState } from 'react';
import { User, Clock, Flame, BookOpen, LogOut, Shield, Target, Trophy, Edit3, Check, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';

const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

// ── Predefined options ──────────────────────────────────────
const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const BRANCH_OPTIONS = ['CSE', 'ECE', 'EEE', 'IT', 'Mechanical', 'Civil', 'Chemical', 'Other'];
const COLLEGE_OPTIONS = [
  'VIT Vellore', 'VIT Chennai', 'VIT AP', 'VIT Bhopal',
  'BITS Pilani', 'BITS Goa', 'BITS Hyderabad',
  'IIT Madras', 'IIT Bombay', 'IIT Delhi',
  'NIT Trichy', 'NIT Warangal', 'NIT Surathkal',
  'Anna University', 'SRM', 'Amrita', 'Other',
];

// ── Chip selector (used for year, branch, college) ──────────
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
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt === 'Other' ? isOther : value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt === 'Other' ? 'Other' : opt)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150"
              style={active ? {
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white',
                boxShadow: '0 2px 10px rgba(99,102,241,0.35)',
              } : {
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#94a3b8',
              }}
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
          className="w-full rounded-xl px-3 py-2.5 text-white text-sm placeholder-slate-600"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.4)' }}
        />
      )}
    </div>
  );
};

// ── Main Profile component ───────────────────────────────────
export const Profile: React.FC = () => {
  const { profile, subjects, signOut, userId, refreshProfile } = useApp();

  const totalTopics = subjects.reduce((sum, s) => sum + (s.total_topics ?? 0), 0);
  const completedTopics = subjects.reduce((sum, s) => sum + (s.completed_topics ?? 0), 0);
  const overallPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const streakEmoji = (profile?.streak_days ?? 0) >= 7 ? '🔥🔥' : (profile?.streak_days ?? 0) >= 3 ? '🔥' : '✨';

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
    setBranch(BRANCH_OPTIONS.slice(0,-1).includes(b) ? b : b ? 'Other' : '');
    setCustomBranch(BRANCH_OPTIONS.slice(0,-1).includes(b) ? '' : b);
    setYear(profile?.college_year ?? '');
    const c = profile?.college_name ?? '';
    setCollege(COLLEGE_OPTIONS.slice(0,-1).includes(c) ? c : c ? 'Other' : '');
    setCustomCollege(COLLEGE_OPTIONS.slice(0,-1).includes(c) ? '' : c);
    setEditing(true);
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    const finalBranch  = branch === 'Other'  ? customBranch.trim()  : branch;
    const finalCollege = college === 'Other' ? customCollege.trim() : college;
    await supabase.from('profiles').update({
      full_name:    fullName.trim(),
      branch:       finalBranch,
      college_year: year,
      college_name: finalCollege,
    }).eq('id', userId);
    await refreshProfile();
    setSaving(false);
    setEditing(false);
  };

  const displayBranch  = profile?.branch       || '—';
  const displayYear    = profile?.college_year  || '—';
  const displayCollege = profile?.college_name  || '—';
  const displayName    = profile?.full_name     || profile?.reg_no || '—';

  const achievements = [
    { title: 'First Step',      desc: 'Add your first subject',           emoji: '📘', unlocked: subjects.length >= 1 },
    { title: 'Getting Serious', desc: 'Complete 5 topics',                emoji: '⭐', unlocked: completedTopics >= 5 },
    { title: 'Week Warrior',    desc: 'Maintain a 7-day streak',          emoji: '🔥', unlocked: (profile?.streak_days ?? 0) >= 7 },
    { title: 'Study Marathon',  desc: 'Log 10+ hours total',              emoji: '⏱', unlocked: (profile?.total_study_minutes ?? 0) >= 600 },
    { title: 'Half Way There',  desc: 'Reach 50% overall progress',       emoji: '🎯', unlocked: overallPct >= 50 },
    { title: 'Exam Ready',      desc: 'Complete all topics in a subject',  emoji: '🏆', unlocked: subjects.some((s) => s.total_topics && s.total_topics > 0 && s.completed_topics === s.total_topics) },
  ];

  const statItems = [
    { icon: Clock,    color: '#6366f1', bg: 'rgba(99,102,241,0.12)',   value: formatTime(profile?.total_study_minutes ?? 0), label: 'Study Time' },
    { icon: Target,   color: '#34d399', bg: 'rgba(52,211,153,0.12)',   value: `${overallPct}%`,  label: 'Progress' },
    { icon: BookOpen, color: '#a78bfa', bg: 'rgba(167,139,250,0.12)',  value: subjects.length,   label: 'Subjects' },
    { icon: Trophy,   color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',   value: completedTopics,   label: 'Topics Done' },
  ];

  return (
    <div className="flex flex-col gap-4 pb-4">

      {/* Profile Hero */}
      <div className="rounded-3xl p-6 relative overflow-hidden text-center"
        style={{
          background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #2e1065 100%)',
          border: '1px solid rgba(139,92,246,0.25)',
          boxShadow: '0 20px 50px rgba(99,102,241,0.2)',
        }}>
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />
        <div className="relative">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ background: 'rgba(255,255,255,0.12)', border: '3px solid rgba(255,255,255,0.2)', boxShadow: '0 0 20px rgba(139,92,246,0.3)' }}>
            <User className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-white text-2xl font-bold tracking-tight">{displayName}</h2>
          {profile?.reg_no && profile.full_name && (
            <p className="text-violet-300 text-sm mt-0.5">{profile.reg_no}</p>
          )}
          {/* Info pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {displayYear !== '—' && (
              <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'rgba(255,255,255,0.12)', color: '#c4b5fd' }}>
                📅 {displayYear}
              </span>
            )}
            {displayBranch !== '—' && (
              <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'rgba(255,255,255,0.12)', color: '#93c5fd' }}>
                🎓 {displayBranch}
              </span>
            )}
            {displayCollege !== '—' && (
              <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'rgba(255,255,255,0.12)', color: '#6ee7b7' }}>
                🏫 {displayCollege}
              </span>
            )}
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-2xl px-4 py-1.5"
            style={{ background: 'rgba(255,255,255,0.12)' }}>
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-white text-sm font-semibold">{profile?.streak_days ?? 0} day streak {streakEmoji}</span>
          </div>
        </div>
      </div>

      {/* ── Edit / View Info Card ─────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>

        {/* Card header */}
        <div className="flex items-center justify-between px-4 py-3.5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" style={{ color: '#818cf8' }} />
            <span className="text-white font-semibold text-sm">Personal Info</span>
          </div>
          {!editing ? (
            <button
              onClick={openEdit}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
              style={{ background: 'rgba(99,102,241,0.14)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' }}
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-50"
                style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}
              >
                {saving
                  ? <div className="w-3 h-3 rounded-full border border-emerald-400 border-t-transparent animate-spin" />
                  : <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* View mode */}
        {!editing && (
          <div className="px-4 py-3 space-y-3">
            {[
              { label: 'Full Name',    value: displayName    !== '—' ? displayName    : 'Not set' },
              { label: 'Branch',       value: displayBranch  !== '—' ? displayBranch  : 'Not set' },
              { label: 'Year',         value: displayYear    !== '—' ? displayYear    : 'Not set' },
              { label: 'College',      value: displayCollege !== '—' ? displayCollege : 'Not set' },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-medium">{row.label}</span>
                <span className="text-slate-300 text-sm font-medium">{row.value}</span>
              </div>
            ))}
            {displayName === '—' && displayBranch === '—' && (
              <p className="text-slate-600 text-xs text-center pt-1">Tap Edit to fill in your details</p>
            )}
          </div>
        )}

        {/* Edit mode */}
        {editing && (
          <div className="p-4 space-y-5">

            {/* Full Name */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Anura Sharma"
                className="w-full rounded-2xl px-4 py-3 text-white text-sm placeholder-slate-700"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
                onFocus={(e) => e.currentTarget.style.border = '1px solid rgba(99,102,241,0.5)'}
                onBlur={(e) => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.09)'}
              />
            </div>

            {/* Year */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block">
                College Year
              </label>
              <div className="flex flex-wrap gap-2">
                {YEAR_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setYear(opt)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150"
                    style={year === opt ? {
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: 'white',
                      boxShadow: '0 2px 10px rgba(99,102,241,0.35)',
                    } : {
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#94a3b8',
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Branch */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block">
                Branch / Department
              </label>
              <ChipSelector
                options={BRANCH_OPTIONS}
                value={branch}
                onChange={setBranch}
                showCustom
                customValue={customBranch}
                onCustomChange={setCustomBranch}
                customPlaceholder="Type your branch..."
              />
            </div>

            {/* College */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block">
                College
              </label>
              <ChipSelector
                options={COLLEGE_OPTIONS}
                value={college}
                onChange={setCollege}
                showCustom
                customValue={customCollege}
                onCustomChange={setCustomCollege}
                customPlaceholder="Type your college name..."
              />
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', boxShadow: '0 6px 20px rgba(99,102,241,0.35)' }}
            >
              {saving
                ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                : <Check className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        )}
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl p-4 flex flex-col gap-2"
              style={{ background: item.bg, border: `1px solid ${item.color}33` }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: `${item.color}22` }}>
                <Icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <p className="text-xl font-bold text-white">{item.value}</p>
              <p className="text-slate-500 text-xs">{item.label}</p>
            </div>
          );
        })}
      </div>

      {/* Achievements */}
      <div className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm">
          <Trophy className="w-4 h-4 text-yellow-400" /> Achievements
        </h3>
        <div className="space-y-2">
          {achievements.map((a) => (
            <div key={a.title}
              className="flex items-center gap-3 p-3 rounded-2xl relative overflow-hidden"
              style={a.unlocked ? {
                background: 'rgba(251,191,36,0.08)',
                border: '1px solid rgba(251,191,36,0.2)',
              } : {
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                opacity: 0.45,
              }}>
              {a.unlocked && <div className="absolute inset-0 shimmer" />}
              <span className="text-2xl w-9 text-center relative">{a.unlocked ? a.emoji : '🔒'}</span>
              <div className="flex-1 relative">
                <p className="text-sm font-semibold" style={{ color: a.unlocked ? '#fde68a' : '#475569' }}>{a.title}</p>
                <p className="text-xs text-slate-600">{a.desc}</p>
              </div>
              {a.unlocked && (
                <span className="text-xs font-semibold rounded-full px-2 py-0.5 relative"
                  style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>✓</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Account Info */}
      <div className="rounded-2xl p-4 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <Shield className="w-4 h-4 text-slate-600 shrink-0" />
        <div>
          <p className="text-slate-500 text-xs">Secured by Supabase Auth</p>
          <p className="text-slate-700 text-xs">Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}</p>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={signOut}
        className="w-full font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-98"
        style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );
};
