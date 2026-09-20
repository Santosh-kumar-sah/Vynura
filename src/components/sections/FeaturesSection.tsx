import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FeaturesSection: React.FC = () => {
  const navigate = useNavigate();

  const interventions = [
    {
      title: 'Somatic Breath Pacing',
      desc: '4-7-8 and physiological sigh cycles timed for rapid parasympathetic activation.',
      to: '/wellness/breathing',
      action: 'Start Breathing',
    },
    {
      title: 'Adaptive Soundscapes',
      desc: 'Generative 432Hz theta waves and ambient acoustics to retune cognitive focus.',
      to: '/mood',
      action: 'Listen Now',
    },
    {
      title: 'Constellation Trajectory',
      desc: 'Longitudinal emotional patterns mapped over time without intrusive metric scores.',
      to: '/constellation',
      action: 'View Sky',
    },
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/[0.08]">
      {/* Section Header */}
      <div className="max-w-xl mb-16">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#94A3B8] mb-2">
          Interventions
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
          Targeted sensory regulation
        </h2>
        <p className="text-sm text-[#94A3B8]">
          Actionable tools calibrated to your current physiological frequency.
        </p>
      </div>

      {/* Part 1: Full-Width Feature Highlight (Unboxed) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/[0.06]">
        <div className="max-w-xl">
          <div className="text-xs font-mono text-amber-400 mb-2">
            01 / REAL-TIME TENSOR TRACKING
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
            60 FPS on-device micro-expression analysis.
          </h3>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Continuously evaluates subtle micro-smiles, eyebrow furrowing, and ocular narrowing without transmitting any imagery over the network.
          </p>
        </div>

        <button
          onClick={() => navigate('/mood')}
          className="inline-flex items-center gap-2 text-xs font-medium text-white hover:text-amber-300 transition-colors cursor-pointer bg-transparent border-none p-0 shrink-0 self-start md:self-end"
        >
          <span>Open Shift Engine</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Part 2: 3-Column Editorial Text Split (Unboxed, sitting directly on page) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-12">
        {interventions.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            className="flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="text-[11px] font-mono text-[#64748B] mb-2">
                0{idx + 2} / SYSTEM
              </div>
              <h4 className="text-base font-semibold text-white mb-2">
                {item.title}
              </h4>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div>
              <button
                onClick={() => navigate(item.to)}
                className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                <span>{item.action}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
