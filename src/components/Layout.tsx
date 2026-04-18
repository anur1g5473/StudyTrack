import React from 'react';
import { BottomNav } from './BottomNav';
import { Home } from './Home';
import { Subjects } from './Subjects';
import { SubjectDetail } from './SubjectDetail';
import { TopicDetail } from './TopicDetail';
import { Focus } from './Focus';
import { Stats } from './Stats';
import { Profile } from './Profile';
import { Developers } from './Developers';
import { Templates } from './Templates';
import { Admin } from './Admin';
import { useApp } from '@/context/AppContext';

export const Layout: React.FC = () => {
  const { view, theme, isOnline } = useApp();

  const renderContent = () => {
    switch (view.type) {
      case 'home': return <Home />;
      case 'subjects': return <Subjects />;
      case 'subject-detail': return <SubjectDetail subjectId={view.subjectId} />;
      case 'topic-detail': return (
        <TopicDetail
          topicId={view.topicId}
          moduleId={view.moduleId}
          subjectId={view.subjectId}
        />
      );
      case 'focus': return <Focus />;
      case 'stats': return <Stats />;
      case 'profile': return <Profile />;
      case 'developers': return <Developers />;
      case 'templates': return <Templates />;
      case 'admin': return <Admin />;
      default: return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent relative z-0">
      
      {/* Ambient background for glass mode */}
      {theme === 'glass' && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-indigo-500/20 rounded-full blur-3xl mix-blend-screen animate-blob"></div>
          <div className="absolute top-[20%] -right-[10%] w-[45vw] h-[45vw] bg-purple-500/20 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-[10%] left-[20%] w-[55vw] h-[55vw] bg-pink-500/20 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-4000"></div>
        </div>
      )}

      {/* Top App Bar */}
      <header className={`sticky top-0 z-40 safe-top ${theme === 'glass' ? 'bg-transparent backdrop-blur-md border-b border-white/10' : 'bg-white border-b-[3px] border-black'}`}>
        <div className={`mx-auto px-4 py-3.5 flex items-center justify-between transition-all duration-300 ${view.type === 'admin' ? 'max-w-7xl' : 'max-w-md'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 flex items-center justify-center ${theme === 'glass' ? 'bg-indigo-500/30 rounded-xl border border-indigo-400/50' : 'brutal-box bg-brutal-pink'}`}>
              <span className="text-base leading-none">⚡</span>
            </div>
            <span className={`font-extrabold text-xl tracking-tight uppercase ${theme === 'glass' ? 'text-white' : 'text-black'}`}>StudyTrack</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Connectivity indicator */}
            {!isOnline && (
              <span className="flex items-center gap-1.5 text-[10px] font-black uppercase px-2 py-1 bg-amber-400 text-black border-2 border-black rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 bg-black rounded-full" />
                OFFLINE
              </span>
            )}
            <ViewTitle />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className={`flex-1 mx-auto w-full px-4 pt-4 pb-24 page-enter transition-all duration-300 ${view.type === 'admin' ? 'max-w-7xl' : 'max-w-md'}`}>
        {renderContent()}
      </main>

      <BottomNav />
    </div>
  );
};

const ViewTitle: React.FC = () => {
  const { view } = useApp();
  const label: Record<string, string> = {
    home: 'Home',
    subjects: 'Subjects',
    'subject-detail': 'Subject',
    'topic-detail': 'Topic',
    focus: 'Focus',
    stats: 'Stats',
    profile: 'Profile',
    developers: 'Developers',
    templates: 'Templates',
    admin: 'Admin Panel',
  };
  const viewLabel = label[view.type];
  if (!viewLabel) return null;
  return (
    <span className="text-xs font-black uppercase tracking-wider px-3 py-1.5 brutal-box bg-brutal-yellow text-black">
      {viewLabel}
    </span>
  );
};
