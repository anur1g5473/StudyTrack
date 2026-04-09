import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Auth } from '@/components/Auth';
import { Layout } from '@/components/Layout';

const AppInner: React.FC = () => {
  const { view, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #09091a 0%, #0f0f2a 50%, #09091a 100%)' }}>
        {/* Ambient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl opacity-20"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-15"
            style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        </div>
        <div className="relative flex flex-col items-center gap-5">
          {/* Logo mark */}
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center float-anim"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))',
              border: '1px solid rgba(99,102,241,0.4)',
              boxShadow: '0 0 40px rgba(99,102,241,0.25)',
            }}>
            <span className="text-4xl">📘</span>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl tracking-tight">StudyTrack</p>
            <p className="text-slate-400 text-sm mt-1">Loading your study world...</p>
          </div>
          {/* Spinner */}
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-400"
            style={{ animation: 'spin 1s linear infinite' }} />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (view.type === 'auth') {
    return <Auth />;
  }

  return <Layout />;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
};

export default App;
