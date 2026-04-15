import React from 'react';
import { ArrowLeft, Globe, Mail, Code } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const Developers: React.FC = () => {
  const { developers, navigate } = useApp();

  return (
    <div className="flex flex-col gap-6 pb-4">
      {/* Header with back button */}
      <div className="flex items-center gap-4 brutal-box p-4 bg-brutal-blue shadow-[6px_6px_0px_#000]">
        <button
          onClick={() => navigate({ type: 'profile' })}
          className="w-12 h-12 brutal-box bg-white flex items-center justify-center active:translate-y-1 active:translate-x-1 active:shadow-none hover:bg-slate-100"
        >
          <ArrowLeft className="w-6 h-6 text-black stroke-[3]" />
        </button>
        <div>
          <h1 className="text-white font-black text-2xl tracking-tighter uppercase" style={{textShadow: '2px 2px 0px #000'}}>SYSTEM ARCHITECTS</h1>
          <p className="text-white font-bold text-xs uppercase underline decoration-2 underline-offset-4">THE TEAM BEHIND STUDYTRACK</p>
        </div>
      </div>

      {/* Introduction card */}
      <div className="brutal-box p-5 bg-brutal-pink border-4 border-black text-black shadow-[6px_6px_0px_#000]">
        <p className="text-lg font-black uppercase leading-tight relative z-10">
          <span className="text-white drop-shadow-[2px_2px_0_#000] text-xl bg-black px-2">StudyTrack</span> IS BUILT BY A PASSIONATE TEAM OF DEVELOPERS COMMITTED TO MAKING LEARNING BETTER. 
          OUR MISSION IS TO PROVIDE STUDENTS WITH POWERFUL TOOLS TO ORGANIZE, TRACK, AND MASTER THEIR STUDIES.
        </p>
      </div>

      {/* Developers Grid */}
      <div className="space-y-6">
        {developers.length === 0 ? (
          <div className="brutal-box p-8 text-center bg-white border-4 border-dashed border-black shadow-none">
             <div className="w-16 h-16 brutal-box border-4 border-black bg-brutal-yellow flex items-center justify-center mx-auto mb-4 transform -rotate-6">
                <Code className="w-8 h-8 text-black stroke-[3]" />
             </div>
             <p className="text-black font-black text-xl uppercase">NO ARCHITECTS FOUND</p>
             <p className="text-black/70 font-bold text-sm uppercase mt-1">DEVELOPER DATA IS BEING SYNCED...</p>
          </div>
        ) : (
          developers.map((dev, index) => {
            const avatarColors = ['bg-brutal-yellow', 'bg-brutal-green', 'bg-brutal-blue'];
            const bColor = avatarColors[index % avatarColors.length];
            return (
              <div key={dev.id} className="brutal-card p-5 bg-white flex flex-col border-4 border-black shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-transform">
                {/* Developer header */}
                <div className="flex items-start gap-4 mb-4 border-b-4 border-black pb-4">
                  {/* Avatar wrapper */}
                  <div className={`w-16 h-16 brutal-box ${bColor} flex items-center justify-center shrink-0 border-4 border-black transform -rotate-3`}>
                    <Code className="w-8 h-8 text-black stroke-[3]" />
                  </div>

                  {/* Developer info */}
                  <div className="flex-1">
                    <h3 className="text-black font-black text-2xl uppercase leading-none mb-1">{dev.name}</h3>
                    <p className="text-white font-black text-xs uppercase px-2 py-0.5 bg-black border-2 border-black inline-block">{dev.role}</p>
                    {dev.bio && (
                      <p className="text-black/80 font-bold text-sm uppercase mt-2 leading-tight">{dev.bio}</p>
                    )}
                  </div>
                </div>

                {/* Skills */}
                {dev.skills && dev.skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-black text-xs font-black mb-2 uppercase tracking-widest bg-slate-100 border-2 border-black px-2 py-1 inline-block">SKILL REGISTRY</p>
                    <div className="flex flex-wrap gap-2">
                      {dev.skills.map((skill) => (
                        <span key={skill}
                          className="px-3 py-1 font-black text-xs uppercase border-2 border-black bg-white shadow-[2px_2px_0_#000]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contributions */}
                {dev.contributions && (
                  <div className="mb-4 bg-slate-50 border-4 border-black p-3">
                    <p className="text-black font-black text-xs mb-1 uppercase tracking-widest underline decoration-2 underline-offset-4">CONTRIBUTIONS</p>
                    <p className="text-black font-bold text-sm uppercase">{dev.contributions}</p>
                  </div>
                )}

                {/* Social Links */}
                <div className="flex items-center gap-3 pt-4 border-t-4 border-black">
                  {dev.email && (
                    <a href={`mailto:${dev.email}`}
                       className="w-12 h-12 brutal-btn flex items-center justify-center bg-brutal-yellow text-black border-2 border-black shadow-[2px_2px_0_#000]"
                       title={`Email: ${dev.email}`}>
                      <Mail className="w-6 h-6 stroke-[3]" />
                    </a>
                  )}
                  {dev.github_profile && (
                    <a href={`https://github.com/${dev.github_profile}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="w-12 h-12 brutal-btn flex items-center justify-center bg-black text-white border-2 border-black shadow-[2px_2px_0_#000]"
                       title={`GitHub: ${dev.github_profile}`}>
                      <Code className="w-6 h-6 stroke-[3]" />
                    </a>
                  )}
                  {dev.linkedin_profile && (
                    <a href={dev.linkedin_profile}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="w-12 h-12 brutal-btn flex items-center justify-center bg-brutal-blue text-white border-2 border-black shadow-[2px_2px_0_#000]"
                       title="LinkedIn">
                      <Globe className="w-6 h-6 stroke-[3]" />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer note */}
      <div className="mt-6 p-4 brutal-box bg-white border-4 border-dashed border-black/80 text-center shadow-none">
        <p className="text-black font-black text-sm uppercase">
          ⭐ WANT TO CONTRIBUTE? CHECK OUT OUR{' '}
          <a href="https://github.com/anur1g5473/StudyTrack"
             target="_blank"
             rel="noopener noreferrer"
             className="text-white bg-black px-2 mx-1 hover:bg-brutal-pink hover:text-black transition-colors"
          >
            GITHUB REPOSITORY
          </a>
        </p>
      </div>
    </div>
  );
};
