import React from 'react';
import { ShieldCheck, EyeOff, Lock, Cpu, CheckCircle } from 'lucide-react';
import { GlowingCard } from '../common/GlowingCard';

export const PrivacySection: React.FC = () => {
  const privacyPillars = [
    {
      icon: <EyeOff className="w-5 h-5 text-[#FFC978]" />,
      title: 'Zero Video Uploads',
      tag: 'Private Sandbox',
      description:
        'Your camera stream never leaves your browser sandbox. WebAssembly processes video frames in transient memory and purges them instantly.',
    },
    {
      icon: <Lock className="w-5 h-5 text-[#6FBFC4]" />,
      title: 'No Photos or Biometrics Stored',
      tag: 'Zero Retention',
      description:
        'We never record, save, or construct biometric templates. No facial databases exist; your reflection remains purely your own.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-[#FF9E7D]" />,
      title: '100% On-Device Neural Compute',
      tag: 'Device Hardware',
      description:
        'Powered by local WebGL / WebGPU acceleration. The entire neural face-landmark model runs directly on your device GPU/CPU.',
    },
  ];

  return (
    <section id="privacy" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <GlowingCard
        accentColor="#6FBFC4"
        className="p-8 sm:p-12 relative overflow-hidden bg-gradient-to-br from-[#1E1B40]/90 via-[#181636]/95 to-[#121029]/95"
      >
        {/* Background Watermark */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full border border-[#FFC978]/10 pointer-events-none flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border border-[#6FBFC4]/10 flex items-center justify-center">
            <span className="text-8xl opacity-5 font-mono text-[#FFC978]">✦</span>
          </div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#B8B4D9]/15">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#6FBFC4]/15 border border-[#6FBFC4]/40 flex items-center justify-center text-[#6FBFC4] shadow-glow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#6FBFC4] font-bold">
                    Privacy Sanctuary
                  </span>
                  <span className="text-xs text-[#FFC978] font-mono">100% Client-Side</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#F5F2ED]">
                  Your face belongs to you. Always.
                </h3>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2D2A5C]/80 border border-[#6FBFC4]/30 text-xs text-[#6FBFC4] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#6FBFC4] animate-pulse" />
              <span>Zero-Telemetry Architecture</span>
            </div>
          </div>

          {/* Privacy Statement Text */}
          <p className="text-base text-[#B8B4D9] leading-relaxed mb-8 max-w-3xl">
            Wellness requires unconditional safety. Vynura was engineered from the first line of code with a strict zero-server-video paradigm. When you look into your camera, the neural inference happens completely inside your browser's private memory sandbox.
          </p>

          {/* 3 Privacy Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {privacyPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#1A1836]/70 border border-[#B8B4D9]/15 hover:border-[#6FBFC4]/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-2 rounded-lg bg-[#2D2A5C]/60 border border-[#B8B4D9]/15">
                    {pillar.icon}
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-[#F5F2ED]">
                      {pillar.title}
                    </h4>
                    <span className="text-[10px] text-[#B8B4D9] font-mono">{pillar.tag}</span>
                  </div>
                </div>
                <p className="text-xs text-[#B8B4D9] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Trust Badge */}
          <div className="mt-8 pt-6 border-t border-[#B8B4D9]/15 flex flex-wrap items-center justify-between gap-4 text-xs text-[#B8B4D9]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-[#F5F2ED]">
                <CheckCircle className="w-3.5 h-3.5 text-[#6FBFC4]" /> No Account Required for Vision Test
              </span>
              <span className="flex items-center gap-1 text-[#F5F2ED]">
                <CheckCircle className="w-3.5 h-3.5 text-[#6FBFC4]" /> Client-Side Encryption
              </span>
            </div>
            <span className="italic text-[#FFC978]/90 font-heading">
              "Trust is the soil wherein peace can blossom."
            </span>
          </div>
        </div>
      </GlowingCard>
    </section>
  );
};
