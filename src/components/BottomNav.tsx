import React from 'react';
import { Home, BookOpen, Timer, BarChart2, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { NavTab, AppView } from '@/types';

const tabs: { id: NavTab; label: string; icon: React.ReactNode; view: AppView }[] = [
  { id: 'home',     label: 'Home',     icon: <Home className="w-5 h-5" />,     view: { type: 'home' } },
  { id: 'subjects', label: 'Subjects', icon: <BookOpen className="w-5 h-5" />, view: { type: 'subjects' } },
  { id: 'focus',    label: 'Focus',    icon: <Timer className="w-5 h-5" />,    view: { type: 'focus' } },
  { id: 'stats',    label: 'Stats',    icon: <BarChart2 className="w-5 h-5" />,view: { type: 'stats' } },
  { id: 'profile',  label: 'Profile',  icon: <User className="w-5 h-5" />,    view: { type: 'profile' } },
];

export const BottomNav: React.FC = () => {
  const { view, navigate } = useApp();

  const activeTab = (() => {
    if (view.type === 'home') return 'home';
    if (view.type === 'subjects' || view.type === 'subject-detail' || view.type === 'topic-detail') return 'subjects';
    if (view.type === 'focus') return 'focus';
    if (view.type === 'stats') return 'stats';
    if (view.type === 'profile') return 'profile';
    return 'home';
  })();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bottom-nav-safe"
      style={{
        background: 'rgba(9,9,26,0.92)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}>
      <div className="max-w-md mx-auto flex items-stretch h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isFocus = tab.id === 'focus';

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.view)}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200 relative"
              style={{ color: isActive ? '#818cf8' : '#475569' }}
            >
              {/* Focus tab gets special elevated treatment */}
              {isFocus ? (
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${isActive ? 'scale-105' : ''}`}
                    style={isActive ? {
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      boxShadow: '0 4px 20px rgba(99,102,241,0.5)',
                      color: 'white',
                    } : {
                      background: 'rgba(99,102,241,0.12)',
                      border: '1px solid rgba(99,102,241,0.2)',
                      color: '#6366f1',
                    }}>
                    {tab.icon}
                  </div>
                </div>
              ) : (
                <>
                  {/* Active background pill */}
                  {isActive && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-2xl"
                      style={{ background: 'rgba(99,102,241,0.12)' }} />
                  )}
                  <div className={`relative transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                    {tab.icon}
                  </div>
                  <span className="text-[10px] font-semibold tracking-tight" style={{ color: isActive ? '#818cf8' : '#475569' }}>
                    {tab.label}
                  </span>
                </>
              )}
              {isFocus && (
                <span className="text-[10px] font-semibold tracking-tight mt-0.5" style={{ color: isActive ? '#818cf8' : '#4f46e5' }}>
                  {tab.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
