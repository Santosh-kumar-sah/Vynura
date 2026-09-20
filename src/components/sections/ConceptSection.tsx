import React from 'react';
import { motion } from 'framer-motion';

export const ConceptSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Transient In-Memory Ingestion',
      desc: 'Frames are evaluated locally in memory and flushed immediately after inference. Zero bytes leave your browser.',
    },
    {
      num: '02',
      title: '68-Point Landmark Geometry',
      desc: 'Neural models measure normalized vector distances across lip contours and ocular tension at 60 FPS.',
    },
    {
      num: '03',
      title: 'Immediate Sensory Dispatch',
      desc: 'Valence tensors trigger targeted somatic breath pacing or adaptive soundscapes in sub-16ms frames.',
    },
  ];

  return (
    <section id="concept" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/[0.08]">
      {/* Section Header: Centered & Minimal */}
      <div className="max-w-xl mb-16">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#94A3B8] mb-2">
          System Architecture
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
          How Vynura evaluates state
        </h2>
        <p className="text-sm text-[#94A3B8]">
          A deterministic client-side pipeline converting facial geometry into physiological regulation.
        </p>
      </div>

      {/* Unboxed Asymmetric Split: Narrative on Left, Graphic on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: 3 Numbered Steps sitting directly on page */}
        <div className="lg:col-span-7 space-y-10">
          {steps.map((item, idx) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="flex items-start gap-4"
            >
              <span className="font-mono text-xs text-[#64748B] pt-1">
                {item.num}
              </span>
              <div>
                <h3 className="text-base font-semibold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-lg">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right: Clean Wireframe Geometry Graphic directly on dark canvas */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-6">
          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* Ambient concentric landmark rings */}
            <div className="absolute inset-0 rounded-full border border-white/[0.08]" />
            <div className="absolute inset-6 rounded-full border border-dashed border-white/[0.12]" />
            <div className="absolute inset-14 rounded-full border border-white/[0.05]" />

            {/* Landmark nodal markers */}
            <div className="absolute top-16 left-16 w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            <div className="absolute top-16 right-16 w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            <div className="absolute top-24 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            <div className="absolute bottom-16 left-20 right-20 h-3 border-b-2 border-amber-400/80 rounded-full" />

            <div className="text-center">
              <span className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-widest block mb-0.5">
                Latency
              </span>
              <span className="text-2xl font-mono font-bold text-white tracking-tight">
                &lt;16ms
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-6 text-[11px] font-mono text-[#64748B]">
            <span>68 Landmarking Points</span>
            <span>·</span>
            <span>0 KB Cloud Transfer</span>
          </div>
        </div>
      </div>
    </section>
  );
};
