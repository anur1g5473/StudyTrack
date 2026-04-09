import React from 'react';
import { ArrowLeft, Globe, Mail, Code } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const Developers: React.FC = () => {
  const { developers, navigate } = useApp();

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Header with back button */}
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => navigate({ type: 'profile' })}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-slate-700"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </button>
        <div>
          <h1 className="text-white font-bold text-lg">Meet the Team</h1>
          <p className="text-slate-500 text-xs">The brilliant minds behind StudyTrack</p>
        </div>
      </div>

      {/* Introduction card */}
      <div className="rounded-2xl p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
        }}>
        <p className="text-white text-sm leading-relaxed">
          <span className="font-semibold">StudyTrack</span> is built by a passionate team of developers committed to making learning better. 
          Our mission is to provide students with powerful tools to organize, track, and master their studies.
        </p>
      </div>

      {/* Developers Grid */}
      <div className="space-y-3">
        {developers.length === 0 ? (
          <div className="rounded-2xl p-10 text-center"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px dashed rgba(255,255,255,0.1)',
            }}>
            <Code className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-semibold">No developers found</p>
            <p className="text-slate-600 text-sm">Developers data is being synced...</p>
          </div>
        ) : (
          developers.map((dev) => (
            <div key={dev.id}
              className="rounded-2xl overflow-hidden transition-all duration-200 hover:scale-102"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
              <div className="p-4">
                {/* Developer header */}
                <div className="flex items-start gap-4 mb-3">
                  {/* Avatar placeholder */}
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
                      border: '2px solid rgba(99,102,241,0.3)',
                    }}>
                    <Code className="w-8 h-8 text-indigo-400" />
                  </div>

                  {/* Developer info */}
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">{dev.name}</h3>
                    <p className="text-indigo-400 font-semibold text-sm">{dev.role}</p>
                    {dev.bio && (
                      <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">{dev.bio}</p>
                    )}
                  </div>
                </div>

                {/* Skills */}
                {dev.skills && dev.skills.length > 0 && (
                  <div className="mb-3">
                    <p className="text-slate-600 text-xs font-semibold mb-1.5 uppercase tracking-widest">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {dev.skills.map((skill) => (
                        <span key={skill}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium"
                          style={{
                            background: 'rgba(99,102,241,0.15)',
                            color: '#818cf8',
                            border: '1px solid rgba(99,102,241,0.25)',
                          }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contributions */}
                {dev.contributions && (
                  <div className="mb-3">
                    <p className="text-slate-600 text-xs font-semibold mb-1.5 uppercase tracking-widest">Contributions</p>
                    <p className="text-slate-400 text-xs leading-relaxed">{dev.contributions}</p>
                  </div>
                )}

                {/* Social Links */}
                <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  {dev.email && (
                    <a href={`mailto:${dev.email}`}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-blue-500/20"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                      title={`Email: ${dev.email}`}>
                      <Mail className="w-4 h-4 text-blue-400" />
                    </a>
                  )}
                  {dev.github_profile && (
                    <a href={`https://github.com/${dev.github_profile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-slate-700"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                      title={`GitHub: ${dev.github_profile}`}>
                      <Code className="w-4 h-4 text-slate-300" />
                    </a>
                  )}
                  {dev.linkedin_profile && (
                    <a href={dev.linkedin_profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-blue-500/20"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                      title="LinkedIn">
                      <Globe className="w-4 h-4 text-blue-400" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer note */}
      <div className="mt-4 p-4 rounded-2xl text-center"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
        <p className="text-slate-500 text-xs">
          ⭐ Want to contribute? Check out our{' '}
          <a href="https://github.com/anur1g5473/StudyTrack"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 underline">
            GitHub repository
          </a>
        </p>
      </div>
    </div>
  );
};
