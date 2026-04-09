import React from 'react';
import { BottomNav } from './BottomNav';
import { Home } from './Home';
import { Subjects } from './Subjects';
import { SubjectDetail } from './SubjectDetail';
import { TopicDetail } from './TopicDetail';
import { Focus } from './Focus';
import { Stats } from './Stats';
import { Profile } from './Profile';
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
      case 'templates': return <Templates />;
      case 'admin': return <Admin />;
      default: return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#09091a' }}>
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 safe-top"
        style={{
          background: 'rgba(9,9,26,0.85)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
        <div className="max-w-md mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))',
                border: '1px solid rgba(99,102,241,0.3)',
              }}>
              <span className="text-base">📘</span>
            </div>
            <span className="font-bold text-white text-lg tracking-tight">StudyTrack</span>
          </div>
          <ViewTitle />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-4 pb-24 page-enter">
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
    templates: 'Templates',
    admin: 'Admin Panel',
  };
  const viewLabel = label[view.type];
  if (!viewLabel) return null;
  return (
    <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
      style={{
        background: 'rgba(99,102,241,0.12)',
        color: '#818cf8',
        border: '1px solid rgba(99,102,241,0.2)',
      }}>
      {viewLabel}
    </span>
  );
};
