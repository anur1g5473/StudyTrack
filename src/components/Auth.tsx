import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BookOpen, Eye, EyeOff, Loader2 } from 'lucide-react';

export const Auth: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const toEmail = (reg: string) => `${reg.toLowerCase().trim()}@studytrack.app`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!regNo.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    }

    setLoading(true);
    const email = toEmail(regNo);

    if (mode === 'signup') {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { reg_no: regNo.trim().toUpperCase() } },
      });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess('Account created! You can now log in.');
        setMode('login');
        setPassword('');
        setConfirmPassword('');
      }
    } else {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) {
        setError('Invalid Reg No or Password.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #09091a 0%, #0d0d2b 45%, #09091a 100%)' }}>

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-[100px] opacity-25"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[80px] opacity-10"
          style={{ background: 'radial-gradient(circle, #60a5fa, transparent 70%)' }} />
      </div>

      {/* Grid texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-18 h-18 rounded-2xl mb-4 float-anim"
            style={{
              width: 72, height: 72,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.25))',
              border: '1px solid rgba(99,102,241,0.4)',
              boxShadow: '0 0 30px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}>
            <BookOpen className="w-8 h-8" style={{ color: '#818cf8' }} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">StudyTrack</h1>
          <p className="text-slate-400 mt-1.5 text-sm">Your exam prep companion 📘</p>
        </div>

        {/* Glass card */}
        <div className="rounded-3xl p-6 shadow-2xl"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}>

          {/* Mode tabs */}
          <div className="flex rounded-2xl p-1 mb-6"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={mode === m ? {
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
                } : { color: '#64748b' }}
              >
                {m === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Reg No */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-widest">
                Register Number
              </label>
              <input
                type="text"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="e.g. 22CS123"
                className="w-full rounded-2xl px-4 py-3.5 text-white text-sm placeholder-slate-600 transition-all duration-200"
                style={{
                  background: 'rgba(0,0,0,0.35)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onFocus={(e) => e.currentTarget.style.border = '1px solid rgba(99,102,241,0.6)'}
                onBlur={(e) => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'}
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl px-4 py-3.5 pr-12 text-white text-sm placeholder-slate-600 transition-all duration-200"
                  style={{
                    background: 'rgba(0,0,0,0.35)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onFocus={(e) => e.currentTarget.style.border = '1px solid rgba(99,102,241,0.6)'}
                  onBlur={(e) => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-widest">
                  Confirm Password
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl px-4 py-3.5 text-white text-sm placeholder-slate-600 transition-all duration-200"
                  style={{
                    background: 'rgba(0,0,0,0.35)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onFocus={(e) => e.currentTarget.style.border = '1px solid rgba(99,102,241,0.6)'}
                  onBlur={(e) => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'}
                  autoComplete="new-password"
                />
              </div>
            )}

            {error && (
              <div className="rounded-2xl px-4 py-3 text-sm font-medium"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-2xl px-4 py-3 text-sm font-medium"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white',
                boxShadow: loading ? 'none' : '0 8px 25px rgba(99,102,241,0.4)',
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.boxShadow = '0 12px 35px rgba(99,102,241,0.55)')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,102,241,0.4)')}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === 'login' ? 'Login →' : 'Create Account →'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-700 text-xs mt-5">
          Secured by Supabase Auth 🔒
        </p>
      </div>
    </div>
  );
};
