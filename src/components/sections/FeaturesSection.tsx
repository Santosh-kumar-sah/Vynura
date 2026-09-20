import React from 'react';
import { motion } from 'framer-motion';
import { 
  ScanFace, 
  Wind, 
  Headphones, 
  Sparkles, 
  Users, 
  ArrowUpRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FeaturesSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-white/[0.06]">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#94A3B8] mb-2">
            Intervention Suite
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Targeted sensory regulation
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#94A3B8] max-w-md">
          Actionable tools calibrated to your current physiological frequency. Minimal cognitive load, maximum nervous system shift.
        </p>
      </div>

      {/* Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Tile 1: Neural Expression Tracking (Large Hero Tile - Span 8) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          onClick={() => navigate('/mood')}
          className="md:col-span-8 rounded-2xl bg-[#11131A] border border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-[0_16px_36px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] group cursor-pointer hover:border-white/[0.16] transition-all"
        >
          {/* Top 1px sheen */}
          <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-amber-400">
                <ScanFace className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-amber-300 transition-colors">
                  Local Facial Landmark Detection
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Zero cloud roundtrips. Instant micro-expression tensor evaluation.
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#64748B] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>

          {/* Mini UI Component: Real-time Telemetry Bar */}
          <div className="mt-4 p-4 rounded-xl bg-[#090A0F]/70 border border-white/[0.06] grid grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <div className="text-[#64748B] text-[11px] mb-1">FPS</div>
              <div className="text-white font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                60.0 STABLE
              </div>
            </div>
            <div>
              <div className="text-[#64748B] text-[11px] mb-1">LATENCY</div>
              <div className="text-white font-semibold">14.2 ms</div>
            </div>
            <div>
              <div className="text-[#64748B] text-[11px] mb-1">CONFIDENCE</div>
              <div className="text-amber-400 font-semibold">96.8% MATCH</div>
            </div>
          </div>
        </motion.div>

        {/* Tile 2: Somatic Breath Regulation (Span 4) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.08 }}
          onClick={() => navigate('/wellness/breathing')}
          className="md:col-span-4 rounded-2xl bg-[#11131A] border border-white/[0.08] p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden shadow-[0_16px_36px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] group cursor-pointer hover:border-white/[0.16] transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-sky-400">
              <Wind className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#64748B] group-hover:text-white transition-all" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white group-hover:text-sky-300 transition-colors mb-1">
              Somatic Breath Pacing
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              4-7-8 and physiological sigh cycles timed for rapid vagal nerve activation.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
            <span>COHERENT 4-7-8</span>
            <span className="text-sky-400">ACTIVE</span>
          </div>
        </motion.div>

        {/* Tile 3: Resonant Soundscapes (Span 4) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.12 }}
          onClick={() => navigate('/mood')}
          className="md:col-span-4 rounded-2xl bg-[#11131A] border border-white/[0.08] p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden shadow-[0_16px_36px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] group cursor-pointer hover:border-white/[0.16] transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-purple-400">
              <Headphones className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#64748B] group-hover:text-white transition-all" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors mb-1">
              Adaptive Sonic Engines
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Binaural frequencies (432Hz/theta) and organic generative audio to alter acoustic context.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
            <span>GENERATIVE AUDIO</span>
            <span className="text-purple-400">WEB AUDIO API</span>
          </div>
        </motion.div>

        {/* Tile 4: Constellation Trajectory Map (Span 4) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.16 }}
          onClick={() => navigate('/constellation')}
          className="md:col-span-4 rounded-2xl bg-[#11131A] border border-white/[0.08] p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden shadow-[0_16px_36px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] group cursor-pointer hover:border-white/[0.16] transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#64748B] group-hover:text-white transition-all" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white group-hover:text-amber-300 transition-colors mb-1">
              Constellation Trajectory
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Longitudinal emotional patterns mapped without intrusive questionnaires or metric overload.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
            <span>EXPORT SNAPSHOT</span>
            <span className="text-amber-400">CLIENT-SIDE</span>
          </div>
        </motion.div>

        {/* Tile 5: Opt-in Paired Resonance (Span 4) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.2 }}
          onClick={() => {
            const el = document.getElementById('paired-checkins');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="md:col-span-4 rounded-2xl bg-[#11131A] border border-white/[0.08] p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden shadow-[0_16px_36px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] group cursor-pointer hover:border-white/[0.16] transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#64748B] group-hover:text-white transition-all" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors mb-1">
              Paired Check-ins
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Opt-in mutual status. Today's resonance label only — zero journal text or scores shared.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
            <span>MUTUAL CONSENT</span>
            <span className="text-emerald-400">SEALED</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
