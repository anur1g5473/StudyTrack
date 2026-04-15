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
      setError('PLEASE FILL IN ALL FIELDS.');
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('PASSWORDS DO NOT MATCH.');
        return;
      }
      if (password.length < 6) {
        setError('PASSWORD MUST BE AT LEAST 6 CHARACTERS.');
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
        setSuccess('ACCOUNT CREATED! YOU CAN NOW LOG IN.');
        setMode('login');
        setPassword('');
        setConfirmPassword('');
      }
    } else {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) {
        setError('INVALID REG NO OR PASSWORD.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brutal-yellow overflow-hidden relative">

      {/* Grid texture overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
         backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)',
         backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white border-4 border-black shadow-[4px_4px_0_#000] rotate-3 mb-4 transition-transform hover:-rotate-3">
            <BookOpen className="w-10 h-10 text-black stroke-[3]" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-black" style={{textShadow: '2px 2px 0px #fff'}}>STUDYTRACK</h1>
          <p className="text-black font-bold uppercase mt-2 bg-white border-2 border-black px-3 py-1 inline-block transform -rotate-1">EXAM PREP COMPANION</p>
        </div>

        {/* Brutal card */}
        <div className="brutal-box p-6 bg-white border-4 border-black shadow-[8px_8px_0px_#000]">

          {/* Mode tabs */}
          <div className="flex mb-6 border-4 border-black bg-slate-100">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                className={`flex-1 py-3 text-sm font-black uppercase transition-all ${
                  mode === m 
                  ? 'bg-brutal-blue text-white shadow-none' 
                  : 'bg-transparent text-black hover:bg-slate-200'
                } ${m === 'login' ? 'border-r-4 border-black' : ''}`}
              >
                {m === 'login' ? 'LOGIN' : 'SIGN UP'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Reg No */}
            <div>
              <label className="block text-sm font-black text-black mb-2 uppercase">
                REGISTER NUMBER
              </label>
              <input
                type="text"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="E.G. 22CS123"
                className="w-full px-4 py-3 bg-white text-black font-bold text-lg uppercase border-4 border-black placeholder:text-black/30 focus:outline-none focus:ring-4 focus:ring-brutal-green transition-all"
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-black text-black mb-2 uppercase">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white text-black font-bold text-lg border-4 border-black placeholder:text-black/30 focus:outline-none focus:ring-4 focus:ring-brutal-pink transition-all pr-12"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-0 top-0 h-full w-12 flex items-center justify-center border-l-4 border-black bg-slate-100 hover:bg-slate-200"
                >
                  {showPass ? <EyeOff className="w-5 h-5 text-black stroke-[3]" /> : <Eye className="w-5 h-5 text-black stroke-[3]" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-black text-black mb-2 uppercase">
                  CONFIRM PASSWORD
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white text-black font-bold text-lg border-4 border-black placeholder:text-black/30 focus:outline-none focus:ring-4 focus:ring-brutal-blue transition-all"
                  autoComplete="new-password"
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-brutal-orange border-4 border-black font-black text-white text-sm uppercase">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-brutal-green border-4 border-black font-black text-black text-sm uppercase">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-xl font-black uppercase text-white bg-black hover:bg-slate-800 disabled:opacity-50 transition-all brutal-btn flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : mode === 'login' ? 'INITIALIZE SESSION' : 'REGISTER PROFILE'}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center bg-white border-4 border-black p-2 transform rotate-1">
          <p className="text-black font-black text-xs uppercase tracking-widest">
            SECURED BY SUPABASE MATRIX 🔒
          </p>
        </div>
      </div>
    </div>
  );
};
