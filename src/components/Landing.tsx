import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BookOpen, Users, Clock, Quote, ArrowRight, Activity, Flame } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Feedback } from '@/types';

interface GlobalStats {
  total_users: number;
  total_minutes: number;
}

export const Landing: React.FC = () => {
  const { navigate } = useApp();
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch global stats using the RPC function
      const { data: statsData, error: statsError } = await supabase.rpc('get_global_stats');
      if (!statsError && statsData) {
        setStats(statsData as GlobalStats);
      }

      // Fetch featured feedback
      const { data: feedbackData } = await supabase
        .from('feedbacks')
        .select(`
          id, content, created_at, is_featured, user_id,
          profiles ( full_name, branch )
        `)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (feedbackData) {
        setFeedbacks(feedbackData as unknown as Feedback[]);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const formatHours = (minutes: number) => {
    return Math.floor(minutes / 60).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-brutal-lilac p-4 relative overflow-y-auto custom-scrollbar">

      {/* Grid Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
         backgroundImage: 'linear-gradient(to right, #000 2px, transparent 2px), linear-gradient(to bottom, #000 2px, transparent 2px)',
         backgroundSize: '80px 80px'
      }} />

      <div className="max-w-4xl mx-auto relative z-10 pt-10 pb-20 space-y-10">

        {/* Hero Section */}
        <div className="brutal-box bg-white p-8 border-8 border-black text-center shadow-[12px_12px_0px_#000]">
          <div className="inline-flex w-24 h-24 bg-brutal-yellow border-4 border-black items-center justify-center rotate-6 mb-6 shadow-[4px_4px_0_#000]">
             <BookOpen className="w-12 h-12 text-black stroke-[3]" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-black uppercase tracking-tighter leading-none mb-4" style={{textShadow: '4px 4px 0 #fff, -2px -2px 0 #00e5a3'}}>
            STUDY<br/>TRACK
          </h1>
          <p className="text-xl md:text-2xl font-black uppercase bg-black text-white px-4 py-2 inline-block transform -rotate-1 border-4 border-brutal-pink">
            THE ULTIMATE EXAM PREP COMPANION
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
               onClick={() => navigate({ type: 'auth' })}
               className="brutal-btn bg-brutal-green text-black px-10 py-5 text-2xl font-black uppercase flex items-center gap-3 border-4 border-black group"
            >
               LAUNCH APP <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform stroke-[4]" />
            </button>
          </div>
        </div>

        {/* Global Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="brutal-box p-6 bg-brutal-blue border-4 border-black shadow-[8px_8px_0_#000] flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-transform">
              <Users className="w-16 h-16 text-white stroke-[3] mb-4 drop-shadow-[2px_2px_0_#000]" />
              <p className="text-6xl font-black text-white tracking-tighter" style={{textShadow: '3px 3px 0 #000'}}>
                 {loading ? '...' : (stats?.total_users || 0).toLocaleString()}
              </p>
              <p className="text-black font-black uppercase bg-brutal-yellow px-3 py-1 mt-3 border-2 border-black rotate-2 text-lg">
                 ACTIVE OPERATIVES
              </p>
           </div>

           <div className="brutal-box p-6 bg-brutal-pink border-4 border-black shadow-[8px_8px_0_#000] flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-transform">
              <Clock className="w-16 h-16 text-black stroke-[3] mb-4 drop-shadow-[2px_2px_0_#fff]" />
              <p className="text-6xl font-black text-black tracking-tighter" style={{textShadow: '3px 3px 0 #fff'}}>
                 {loading ? '...' : formatHours(stats?.total_minutes || 0)}
              </p>
              <p className="text-white font-black uppercase bg-black px-3 py-1 mt-3 border-2 border-white -rotate-2 text-lg">
                 HOURS DOMINATED
              </p>
           </div>
        </div>

        {/* Wall of Fame (Feedback) */}
        <div className="brutal-box bg-white border-8 border-black p-6 md:p-10 shadow-[12px_12px_0_#000]">
           <div className="flex items-center gap-4 mb-8 pb-6 border-b-8 border-black border-dotted">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center border-4 border-brutal-yellow -rotate-6">
                 <Quote className="w-8 h-8 stroke-[4] fill-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter">WALL OF FAME</h2>
           </div>

           {loading ? (
             <div className="flex justify-center p-10">
               <div className="w-12 h-12 border-8 border-black border-t-brutal-orange animate-spin" />
             </div>
           ) : feedbacks.length === 0 ? (
             <div className="bg-slate-100 border-4 border-black p-8 text-center">
               <Flame className="w-12 h-12 text-black mx-auto mb-4 stroke-[3]" />
               <p className="text-2xl font-black text-black uppercase">NO INTEL YET.</p>
               <p className="text-black/60 font-bold uppercase mt-2">LOGIN AND DROP YOUR FIRST SITREP.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {feedbacks.map((fb, idx) => {
                 const bgColors = ['bg-brutal-yellow', 'bg-brutal-green', 'bg-brutal-blue', 'bg-brutal-pink'];
                 const bg = bgColors[idx % bgColors.length];
                 return (
                   <div key={fb.id} className={`brutal-card p-6 border-4 border-black ${bg} shadow-[6px_6px_0_#000] relative`}>
                      <Quote className="absolute top-4 right-4 w-12 h-12 text-black opacity-20" />
                      <p className="text-xl font-black uppercase text-black leading-tight mb-6">
                        "{fb.content}"
                      </p>
                      <div className="flex items-center gap-3 border-t-4 border-black pt-4">
                         <div className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center rotate-3">
                           <Activity className="w-6 h-6 text-black stroke-[3]" />
                         </div>
                         <div>
                           <p className="text-black font-black uppercase leading-none">
                              {fb.profiles?.full_name || 'UNKNOWN AGENT'}
                           </p>
                           <p className="text-black/70 font-bold text-xs uppercase mt-1">
                              {fb.profiles?.branch || 'UNDISCLOSED'}
                           </p>
                         </div>
                      </div>
                   </div>
                 );
               })}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
