import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Activity, Zap } from 'lucide-react';

export const ConceptSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Transient In-Memory Ingestion',
      desc: 'Raw video frames are evaluated locally within browser memory and discarded immediately after inference. Zero bytes ever leave the client sandbox.',
      icon: <Cpu className="w-4 h-4 text-sky-400" />,
    },
    {
      step: '02',
      title: '68-Point Landmark Geometry',
      desc: 'Local neural models compute normalized distance ratios across lip elevation, ocular narrowing, and eyebrow tension vectors at 60 FPS.',
      icon: <Activity className="w-4 h-4 text-amber-400" />,
    },
    {
      step: '03',
      title: 'Real-Time State Regulation',
      desc: 'Confidence-weighted valence maps trigger targeted somatic breath pacers, binaural soundscapes, or cognitive capture cards instantaneously.',
      icon: <Zap className="w-4 h-4 text-purple-400" />,
    },
  ];

  return (
    <section id="concept" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-white/[0.06]">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#94A3B8] mb-2">
            System Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            How Vynura evaluates state
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#94A3B8] max-w-md">
          A deterministic client-side pipeline. Facial landmark geometry converted into physiological regulation in sub-16ms frames.
        </p>
      </div>

      {/* Asymmetric Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Interactive Simulated Geometry Visual (Span 7) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#11131A] border border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-[0_16px_36px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]">
          {/* Top 1px sheen */}
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-mono text-xs text-white">LOCAL_NEURAL_PIPELINE</span>
            </div>
            <span className="font-mono text-[11px] text-[#94A3B8]">LATENCY &lt; 16ms</span>
          </div>

          {/* Abstract Wireframe Face Mesh Geometry Graphic */}
          <div className="my-8 py-6 flex items-center justify-center relative">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-white/10 flex items-center justify-center">
              {/* Concentric Calibration Rings */}
              <div className="absolute inset-4 rounded-full border border-dashed border-white/15" />
              <div className="absolute inset-10 rounded-full border border-white/[0.08]" />

              {/* Landmark Nodes */}
              <div className="absolute top-12 left-14 w-2 h-2 rounded-full bg-sky-400/80 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              <div className="absolute top-12 right-14 w-2 h-2 rounded-full bg-sky-400/80 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              <div className="absolute top-20 left-16 w-1.5 h-1.5 rounded-full bg-white/70" />
              <div className="absolute top-20 right-16 w-1.5 h-1.5 rounded-full bg-white/70" />
              <div className="absolute top-28 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400/90 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              <div className="absolute bottom-12 left-16 right-16 h-4 border-b-2 border-amber-400/80 rounded-full" />

              {/* Central Vector Crosshair */}
              <div className="text-xs font-mono text-white/40 tracking-wider">
                68 PTS
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Footer */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.06] text-xs">
            <div>
              <div className="text-[#64748B] text-[11px]">Inference</div>
              <div className="font-mono text-white font-medium">On-Device</div>
            </div>
            <div>
              <div className="text-[#64748B] text-[11px]">Frame Rate</div>
              <div className="font-mono text-white font-medium">60 FPS</div>
            </div>
            <div>
              <div className="text-[#64748B] text-[11px]">Storage</div>
              <div className="font-mono text-emerald-400 font-medium">0 KB Retained</div>
            </div>
          </div>
        </div>

        {/* Right: Architectural Workflow Steps (Span 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          {steps.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="p-5 sm:p-6 rounded-2xl bg-[#11131A] border border-white/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-white/[0.14] transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                    {item.icon}
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-white">
                    {item.title}
                  </h3>
                </div>
                <span className="font-mono text-xs text-[#64748B]">{item.step}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
