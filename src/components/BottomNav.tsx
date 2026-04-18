import React from 'react';
import { Home, BookOpen, Timer, BarChart2, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { NavTab, AppView } from '@/types';

const tabs: { id: NavTab; label: string; icon: React.ReactNode; view: AppView }[] = [
  { id: 'home',     label: 'HOME',     icon: <Home className="w-5 h-5" />,     view: { type: 'home' } },
  { id: 'subjects', label: 'WORK', icon: <BookOpen className="w-5 h-5" />, view: { type: 'subjects' } },
  { id: 'focus',    label: 'FOCUS',    icon: <Timer className="w-6 h-6" />,    view: { type: 'focus' } },
  { id: 'stats',    label: 'STATS',    icon: <BarChart2 className="w-5 h-5" />,view: { type: 'stats' } },
  { id: 'profile',  label: 'PROFILE',  icon: <User className="w-5 h-5" />,    view: { type: 'profile' } },
];

export const BottomNav: React.FC = () => {
  const { view, navigate, theme } = useApp();
  const isGlass = theme === 'glass';

  const activeTab = (() => {
    if (view.type === 'home') return 'home';
    if (view.type === 'subjects' || view.type === 'subject-detail' || view.type === 'topic-detail') return 'subjects';
    if (view.type === 'focus') return 'focus';
    if (view.type === 'stats') return 'stats';
    if (view.type === 'profile') return 'profile';
    return 'home';
  })();

  return (
    <nav
      className={isGlass ? 'glass-bottom-nav' : 'brutal-bottom-nav'}
    >
      <div className="max-w-md mx-auto flex items-stretch h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isFocus = tab.id === 'focus';

          if (isGlass) {
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.view)}
                className="flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200 relative rounded-2xl mx-1"
                style={{
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                }}
              >
                <div className={`flex flex-col items-center gap-0.5 ${isActive ? 'scale-105' : ''} transition-transform`}>
                  {tab.icon}
                  <span className="text-[10px] font-semibold tracking-wide" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>
                    {tab.label.charAt(0) + tab.label.slice(1).toLowerCase()}
                  </span>
                </div>
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white opacity-60" />
                )}
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.view)}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-100 relative"
              style={{
                color: isActive ? '#000' : '#888',
                borderRight: tab.id !== 'profile' ? '3px solid #000' : 'none',
                background: isActive ? (isFocus ? '#00e5a3' : '#d1c4e9') : 'transparent',
              }}
            >
              {isFocus ? (
                <div className={`flex flex-col items-center justify-center w-full h-full ${isActive ? '' : 'hover:bg-slate-100'}`}>
                   <div className={`${isActive ? 'scale-110' : ''}`}>
                    {tab.icon}
                  </div>
                  <span className="text-[10px] font-black tracking-tight mt-0.5">
                    {tab.label}
                  </span>
                </div>
              ) : (
                <div className={`flex flex-col items-center justify-center w-full h-full ${isActive ? '' : 'hover:bg-slate-100'}`}>
                  <div className={`${isActive ? 'scale-110' : ''}`}>
                    {tab.icon}
                  </div>
                  <span className="text-[10px] font-black tracking-tight" style={{ color: isActive ? '#000' : '#888' }}>
                    {tab.label}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
