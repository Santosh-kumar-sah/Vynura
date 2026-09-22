import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wind, 
  BookOpen, 
  Activity, 
  Award,
  Heart
} from 'lucide-react';

interface WeeklyWellnessScoreProps {
  score?: number;
  balanceScore?: number;
  somaticScore?: number;
  reflectionScore?: number;
}

export const WeeklyWellnessScore: React.FC<WeeklyWellnessScoreProps> = ({
  score = 92,
  balanceScore = 94,
  somaticScore = 88,
  reflectionScore = 95,
}) => {
  return (
    <div className="p-6 sm:p-8 rounded-xl bg-[#121316] border border-white/[0.08]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3.5">
          <Award className="w-5 h-5 text-amber-400 stroke-[1.5] shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-amber-400">
                Harmonic Synthesis
              </span>
              <span className="text-xs text-neutral-400 font-mono uppercase">· Weekly Metric</span>
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-white">
              Composite Wellness Index
            </h3>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-neutral-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Status: High Coherence</span>
        </div>
      </div>

      {/* Main Row: Circular Astral Meter + Tri-Pillar Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Large Left Score Dial */}
        <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
          <div className="relative w-40 h-40 flex items-center justify-center mb-3">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="68"
                className="stroke-white/[0.06]"
                strokeWidth="7"
                fill="transparent"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="68"
                className="stroke-amber-400"
                strokeWidth="7"
                strokeDasharray={427}
                initial={{ strokeDashoffset: 427 }}
                animate={{ strokeDashoffset: 427 - (427 * score) / 100 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner Center Core */}
            <div className="absolute inset-4 rounded-full bg-white/[0.02] border border-white/[0.06] flex flex-col items-center justify-center">
              <span className="text-4xl font-normal text-white">
                {score}
              </span>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider -mt-0.5">
                Coherence Index
              </span>
            </div>
          </div>

          <span className="text-xs text-neutral-400">
            Autonomic tone operating in sustained parasympathetic equilibrium.
          </span>
        </div>

        {/* Right Tri-Pillar Breakdown */}
        <div className="md:col-span-7 space-y-3">
          {/* Pillar 1: Emotional Balance */}
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-2 text-white">
                <Activity className="w-3.5 h-3.5 text-amber-400 stroke-[1.5]" />
                <span>Emotional Baseline Stability</span>
              </span>
              <span className="font-mono text-white font-medium">{balanceScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${balanceScore}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-amber-400 rounded-full"
              />
            </div>
          </div>

          {/* Pillar 2: Somatic Breathing Rhythm */}
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-2 text-white">
                <Wind className="w-3.5 h-3.5 text-white/70 stroke-[1.5]" />
                <span>Somatic Breath Regulation</span>
              </span>
              <span className="font-mono text-white font-medium">{somaticScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${somaticScore}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.05, ease: 'easeOut' }}
                className="h-full bg-white/70 rounded-full"
              />
            </div>
          </div>

          {/* Pillar 3: Reflective Continuity */}
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-2 text-white">
                <BookOpen className="w-3.5 h-3.5 text-white/70 stroke-[1.5]" />
                <span>Reflection Log Continuity</span>
              </span>
              <span className="font-mono text-white font-medium">{reflectionScore}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${reflectionScore}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                className="h-full bg-white/70 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <Heart className="w-3.5 h-3.5 text-amber-400 stroke-[1.5]" />
          <span>Synthesized across 7-day biometric calibrations and respiration cycles.</span>
        </div>
        <span className="font-mono text-[11px] text-neutral-500">
          Telemetry Verified
        </span>
      </div>
    </div>
  );
};
