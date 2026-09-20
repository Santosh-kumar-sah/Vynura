import React from 'react';
import { EyeOff, Lock, Cpu } from 'lucide-react';

export const PrivacySection: React.FC = () => {
  const privacyPillars = [
    {
      icon: <EyeOff className="w-5 h-5 text-amber-400" />,
      title: 'Zero Frame Transmission',
      description:
        'Video stream data never exits your browser execution environment. Frames are ingested into transient typed arrays and flushed every cycle.',
    },
    {
      icon: <Lock className="w-5 h-5 text-sky-400" />,
      title: 'No Biometric Profiles',
      description:
        'Vynura computes normalized geometric distances in real time without creating or storing facial vectors, signatures, or templates.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      title: 'Client-Side WebAssembly',
      description:
        'Inference runs natively on your GPU/CPU via WebGL shaders. The system operates fully even in disconnected offline mode.',
    },
  ];

  return (
    <section id="privacy" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-white/[0.06]">
      <div className="rounded-2xl bg-[#11131A] border border-white/[0.08] p-8 sm:p-12 shadow-[0_20px_48px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)] relative overflow-hidden">
        {/* Top 1px sheen */}
        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

        <div className="max-w-xl mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-[#94A3B8] mb-2">
            Security & Data Boundary
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            Your camera stays on your hardware. Always.
          </h2>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Architected specifically to prevent biometric exposure. Zero cloud processing, zero external model APIs, zero persistent imagery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {privacyPillars.map((pillar) => (
            <div
              key={pillar.title}
              className="p-6 rounded-xl bg-[#090A0F]/60 border border-white/[0.06] flex flex-col justify-between space-y-4"
            >
              <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                {pillar.icon}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-white mb-1.5">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
