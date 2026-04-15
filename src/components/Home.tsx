import React from 'react';
import { Zap, ChevronRight, BookOpen, Flame, Clock, TrendingUp, AlertTriangle, BookMarked, Lock } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
};

const BrutalProgressBar: React.FC<{ value: number; colorClass?: string; bgColor?: string }> = ({ value, colorClass = 'bg-brutal-green', bgColor = '#fff' }) => (
  <div className="w-full h-8 border-2 border-black rounded flex overflow-hidden" style={{ background: bgColor }}>
    <div
      className={`h-full border-r-2 border-black transition-all duration-700 ${colorClass} bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiYSgwLDAsMCwwLjMpIi8+PC9zdmc+')]`}
      style={{ width: `${Math.min(100, value)}%` }}
    />
  </div>
);

export const Home: React.FC = () => {
  const { profile, subjects, navigate, isAdmin } = useApp();

  const totalTopics = subjects.reduce((sum, s) => sum + (s.total_topics ?? 0), 0);
  const completedTopics = subjects.reduce((sum, s) => sum + (s.completed_topics ?? 0), 0);
  const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const weakestSubject = subjects.reduce(
    (min, s) => {
      const pct = s.total_topics ? Math.round(((s.completed_topics ?? 0) / s.total_topics) * 100) : 0;
      const minPct = min?.total_topics ? Math.round(((min.completed_topics ?? 0) / min.total_topics) * 100) : 100;
      return pct < minPct ? s : min;
    },
    null as typeof subjects[0] | null
  );

  const weakPct = weakestSubject?.total_topics
    ? Math.round(((weakestSubject.completed_topics ?? 0) / weakestSubject.total_topics) * 100)
    : 0;

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'GOOD MORNING' : greetingHour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';

  return (
    <div className="flex flex-col gap-6 pb-4">

      {/* Marquee Banner */}
      <div className="overflow-hidden border-y-4 border-black bg-brutal-yellow py-2 -mx-4 -mt-4 mb-2 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <div className="animate-marquee">
          {[...Array(6)].map((_, i) => (
             <span key={i} className="text-black font-black uppercase text-sm tracking-widest mx-4 whitespace-nowrap">
               ⚡ EXAM GRID ACTIVE • CRUSH YOUR GOALS • TRACK EVERY MINUTE ⚡
             </span>
          ))}
        </div>
      </div>

      {/* Hero Banner */}
      <div className="brutal-box p-5 bg-brutal-blue relative overflow-hidden" style={{ backgroundImage: `radial-gradient(#000 2px, transparent 2px)`, backgroundSize: '16px 16px' }}>
        <div className="relative z-10 p-4 brutal-box bg-white translate-x-[-10px] translate-y-[-10px] shadow-none">
          <p className="text-black text-sm font-black uppercase tracking-wider">{greeting}!</p>
          <h2 className="text-black text-4xl font-black mt-1 tracking-tighter uppercase uppercase">
            {profile?.reg_no ?? 'STUDENT'}
          </h2>

          {/* Stat pills */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <div className="flex items-center gap-2 brutal-btn px-4 py-2 bg-brutal-pink text-black">
               <Flame className="w-5 h-5" />
               <span className="text-sm">{profile?.streak_days ?? 0} DAY STREAK</span>
            </div>
            <div className="flex items-center gap-2 brutal-btn px-4 py-2 bg-brutal-yellow text-black">
               <Clock className="w-5 h-5" />
               <span className="text-sm">{formatTime(profile?.total_study_minutes ?? 0)} STUDIED</span>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6 border-t-4 border-black pt-4">
            <div className="flex justify-between text-xs mb-2 items-center">
              <span className="text-black font-black uppercase">Overall Progress</span>
              <span className="text-black font-black text-xl bg-brutal-green px-2 py-1 border-2 border-black rotate-3">{overallProgress}%</span>
            </div>
            <BrutalProgressBar value={overallProgress} colorClass="bg-brutal-pink" bgColor="#ffeccf" />
            <p className="text-black font-bold text-xs mt-2 text-right">{completedTopics} / {totalTopics} TOPICS DONE</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-black text-lg font-black uppercase tracking-widest mb-3 flex items-center gap-2 underline decoration-4 decoration-brutal-pink underline-offset-4">
          <Zap className="w-6 h-6 fill-current" /> QUICK ACTIONS
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate({ type: 'subjects' })}
            className="brutal-btn p-4 bg-brutal-lilac text-left flex flex-col gap-3 group"
          >
            <div className="w-12 h-12 brutal-box bg-white flex items-center justify-center group-hover:bg-brutal-yellow transition-colors relative">
               <BookOpen className="w-6 h-6 text-black" />
            </div>
            <div>
              <p className="text-black font-black text-xl uppercase">STUDY</p>
              <p className="text-black/70 font-semibold text-xs uppercase mt-1">Pick a topic</p>
            </div>
          </button>

          <button
            onClick={() => navigate({ type: 'focus' })}
            className="brutal-btn p-4 bg-brutal-green text-left flex flex-col gap-3 group"
          >
            <div className="w-12 h-12 brutal-box bg-white flex items-center justify-center group-hover:bg-brutal-pink transition-colors">
               <Zap className="w-6 h-6 text-black" />
            </div>
            <div>
               <p className="text-black font-black text-xl uppercase">FOCUS</p>
               <p className="text-black/70 font-semibold text-xs uppercase mt-1">Timer</p>
            </div>
          </button>

          <button
            onClick={() => navigate({ type: 'templates' })}
            className="brutal-btn p-4 bg-white text-left flex flex-col gap-3 group"
          >
            <div className="w-12 h-12 brutal-box bg-brutal-yellow flex items-center justify-center group-hover:bg-brutal-blue transition-colors">
               <BookMarked className="w-6 h-6 text-black group-hover:text-white" />
            </div>
            <div>
               <p className="text-black font-black text-lg uppercase">TEMPLATES</p>
               <p className="text-black/70 font-semibold text-xs uppercase mt-1">Add library</p>
            </div>
          </button>

          {isAdmin && (
            <button
               onClick={() => navigate({ type: 'admin' })}
               className="brutal-btn p-4 bg-red-500 text-left flex flex-col gap-3 group"
            >
               <div className="w-12 h-12 brutal-box bg-black flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
               </div>
               <div>
                  <p className="text-black font-black text-lg uppercase">ADMIN</p>
                  <p className="text-black/80 font-semibold text-xs uppercase mt-1">Superuser</p>
               </div>
            </button>
          )}
        </div>
      </div>

      {/* Weak Subject Alert */}
      {weakestSubject && weakPct < 60 && (
         <button
            className="brutal-card w-full p-4 text-left bg-brutal-orange flex items-center gap-4"
            onClick={() => navigate({ type: 'subject-detail', subjectId: weakestSubject.id })}
         >
            <div className="w-12 h-12 brutal-box bg-white flex items-center justify-center shrink-0">
               <AlertTriangle className="w-6 h-6 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex items-center justify-between mb-1">
                  <p className="text-black text-xs font-black uppercase tracking-wider bg-white border-2 border-black px-2 py-0.5 inline-block -rotate-2">
                     NEEDS ATTENTION ⚠️
                  </p>
               </div>
               <p className="text-black font-black text-xl uppercase truncate mb-2 mt-1">
                  {weakestSubject.icon} {weakestSubject.name}
               </p>
               <BrutalProgressBar value={weakPct} colorClass="bg-brutal-yellow" />
            </div>
            <div className="w-10 h-10 brutal-box bg-white flex items-center justify-center shrink-0 rounded-full shadow-none border-2">
               <ChevronRight className="w-6 h-6 text-black" />
            </div>
         </button>
      )}

      {/* Subjects Overview */}
      {subjects.length > 0 && (
         <div className="brutal-box p-5 bg-white">
            <h3 className="text-black font-black text-lg uppercase mb-5 flex items-center gap-2 decoration-brutal-green underline decoration-4 underline-offset-4">
               <TrendingUp className="w-6 h-6" /> SUBJECTS OVERVIEW
            </h3>
            <div className="space-y-4">
               {subjects.slice(0, 4).map((s) => {
                  const pct = s.total_topics
                     ? Math.round(((s.completed_topics ?? 0) / s.total_topics) * 100)
                     : 0;
                  // Alternate colors based on index or hash
                  const colors = ['bg-brutal-blue', 'bg-brutal-green', 'bg-brutal-yellow', 'bg-brutal-pink'];
                  const colorClass = colors[s.name.length % colors.length];

                  return (
                     <button
                        key={s.id}
                        className="w-full text-left bg-slate-50 border-2 border-black p-3 translate-x-1 translate-y-1 hover:translate-x-0 hover:translate-y-0 transition-transform shadow-[-4px_-4px_0_0_#000]"
                        onClick={() => navigate({ type: 'subject-detail', subjectId: s.id })}
                     >
                        <div className="flex justify-between items-end mb-2">
                           <span className="text-black text-base font-black uppercase truncate mr-4">
                              {s.icon} {s.name}
                           </span>
                           <span className="text-base font-black border-2 border-black px-2 py-0.5 bg-white drop-shadow-[2px_2px_0_#000] rotate-2">
                              {pct}%
                           </span>
                        </div>
                        <BrutalProgressBar value={pct} colorClass={colorClass} bgColor="#e2e8f0" />
                     </button>
                  );
               })}
            </div>
         </div>
      )}

      {/* Empty state */}
      {subjects.length === 0 && (
         <div className="brutal-box p-8 text-center bg-brutal-pink border-dashed border-4">
            <div className="w-20 h-20 brutal-box bg-white flex items-center justify-center mx-auto mb-6 transform -rotate-6">
               <BookOpen className="w-10 h-10 text-black" />
            </div>
            <p className="text-black font-black text-2xl uppercase mb-2">NO SUBJECTS YET</p>
            <p className="text-black/80 font-bold text-sm mb-6 uppercase">Time to build your curriculum</p>
            <button
               onClick={() => navigate({ type: 'subjects' })}
               className="brutal-btn bg-white text-black px-8 py-3 text-lg"
            >
               ADD SUBJECT
            </button>
         </div>
      )}
    </div>
  );
};
