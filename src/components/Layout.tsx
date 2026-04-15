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
  const { view } = useApp();

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
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 safe-top"
        style={{
          background: '#fff',
          borderBottom: '3px solid #000',
        }}>
        <div className={`mx-auto px-4 py-3.5 flex items-center justify-between transition-all duration-300 ${view.type === 'admin' ? 'max-w-7xl' : 'max-w-md'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center brutal-box bg-brutal-pink">
              <span className="text-base leading-none">⚡</span>
            </div>
            <span className="font-extrabold text-black text-xl tracking-tight uppercase">StudyTrack</span>
          </div>
          <ViewTitle />
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
