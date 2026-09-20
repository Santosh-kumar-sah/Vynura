import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacySection: React.FC = () => {
  const proofs = [
    {
      label: 'Frame Transmission',
      status: '0 Bytes Uploaded',
      desc: 'Video frames are ingested into local browser memory and purged immediately after landmark regression.',
    },
    {
      label: 'Biometric Storage',
      status: 'Zero Retention',
      desc: 'No face geometry or coordinate profiles are ever stored on disk or sent across the network.',
    },
    {
      label: 'Inference Runtime',
      status: 'Local WebGL/Wasm',
      desc: 'All models execute natively on your device hardware, operating seamlessly even offline.',
    },
  ];

  return (
    <section id="privacy" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/[0.08]">
      {/* Centered Single-Column Moment */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-[#94A3B8] mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Security & Data Boundary</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
          Your camera never leaves your hardware.
        </h2>
        <p className="text-sm text-[#94A3B8] leading-relaxed">
          Engineered with zero cloud transmission, zero biometric retention, and complete client-side execution.
        </p>
      </div>

      {/* Editorial Specification Rows with Thin Hairline Dividers (Zero Card Boxes) */}
      <div className="border-t border-b border-white/[0.08] divide-y divide-white/[0.06]">
        {proofs.map((proof) => (
          <div
            key={proof.label}
            className="py-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6"
          >
            <div className="sm:w-1/3 flex items-center justify-between sm:justify-start gap-3">
              <span className="text-xs font-semibold text-white">
                {proof.label}
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                {proof.status}
              </span>
            </div>
            <p className="sm:w-2/3 text-xs text-[#94A3B8] leading-relaxed">
              {proof.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
