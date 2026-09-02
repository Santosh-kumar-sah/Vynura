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
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#24214A]/90 via-[#1A1836]/95 to-[#121029]/95 border border-[#FFC978]/30 backdrop-blur-xl relative overflow-hidden shadow-xl">
      {/* Top Rim Glow */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#FFC978] to-transparent" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#B8B4D9]/15">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#FFC978]/15 border border-[#FFC978]/40 flex items-center justify-center text-[#FFC978] shadow-glow-sm">
            <Award className="w-5 h-5 text-[#FFC978]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FFC978]">
                Harmonic Synthesis
              </span>
              <span className="text-xs text-[#FFC978]/80 font-heading">週間健康指標</span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F5F2ED]">
              Weekly Celestial Wellness Resonance
            </h3>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121029]/90 border border-[#6FBFC4]/40 text-xs font-semibold text-[#6FBFC4]">
          <span className="w-2 h-2 rounded-full bg-[#6FBFC4] animate-pulse" />
          <span>Rank: 天頂 · Zenith Harmonic</span>
        </div>
      </div>

      {/* Main Row: Circular Astral Meter + Tri-Pillar Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Large Left Astral Score Dial (Span 5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
          <div className="relative w-44 h-44 flex items-center justify-center mb-3">
            {/* SVG Circular Progress Track */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="76"
                fill="none"
                stroke="#1A1836"
                strokeWidth="8"
              />
              <motion.circle
                cx="88"
                cy="88"
                r="76"
                fill="none"
                stroke="url(#wellnessGrad)"
                strokeWidth="8"
                strokeDasharray={477}
                initial={{ strokeDashoffset: 477 }}
                whileInView={{ strokeDashoffset: 477 - (477 * score) / 100 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="wellnessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFC978" />
                  <stop offset="50%" stopColor="#FF9E7D" />
                  <stop offset="100%" stopColor="#6FBFC4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Glow Center Core */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#24214A] to-[#14122C] border border-[#FFC978]/30 flex flex-col items-center justify-center shadow-inner">
              <span className="font-heading text-4xl sm:text-5xl font-bold text-[#F5F2ED]">
                {score}
              </span>
              <span className="text-[10px] font-mono text-[#FFC978] uppercase tracking-widest -mt-1 font-bold">
                Resonance Index
              </span>
            </div>
          </div>

          <span className="font-heading text-xs italic text-[#FFF2D6]">
            "Your nervous system is operating in deep coherent equilibrium."
          </span>
        </div>

        {/* Right Tri-Pillar Breakdown (Span 7 cols) */}
        <div className="md:col-span-7 space-y-4">
          {/* Pillar 1: Emotional Balance */}
          <div className="p-3.5 rounded-2xl bg-[#121029]/80 border border-[#B8B4D9]/15">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-2 font-semibold text-[#F5F2ED]">
                <Activity className="w-4 h-4 text-[#FF9E7D]" />
                <span>Emotional Baseline Stability</span>
              </span>
              <span className="font-mono font-bold text-[#FF9E7D]">{balanceScore}%</span>
            </div>
            <div className="h-2 w-full bg-[#1A1836] rounded-full overflow-hidden border border-[#B8B4D9]/10">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${balanceScore}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#FFC978] to-[#FF9E7D] rounded-full"
              />
            </div>
          </div>

          {/* Pillar 2: Somatic Breathing Rhythm */}
          <div className="p-3.5 rounded-2xl bg-[#121029]/80 border border-[#B8B4D9]/15">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-2 font-semibold text-[#F5F2ED]">
                <Wind className="w-4 h-4 text-[#6FBFC4]" />
                <span>Somatic Breath Downshift Compliance</span>
              </span>
              <span className="font-mono font-bold text-[#6FBFC4]">{somaticScore}%</span>
            </div>
            <div className="h-2 w-full bg-[#1A1836] rounded-full overflow-hidden border border-[#B8B4D9]/10">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${somaticScore}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#6FBFC4] to-[#4A5B8C] rounded-full"
              />
            </div>
          </div>

          {/* Pillar 3: Reflective Continuity */}
          <div className="p-3.5 rounded-2xl bg-[#121029]/80 border border-[#B8B4D9]/15">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-2 font-semibold text-[#F5F2ED]">
                <BookOpen className="w-4 h-4 text-[#C25AE0]" />
                <span>Constellation Journal Continuity</span>
              </span>
              <span className="font-mono font-bold text-[#C25AE0]">{reflectionScore}%</span>
            </div>
            <div className="h-2 w-full bg-[#1A1836] rounded-full overflow-hidden border border-[#B8B4D9]/10">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${reflectionScore}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#C25AE0] to-[#FFC978] rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-[#B8B4D9]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#B8B4D9]">
        <div className="flex items-center gap-2 text-[#6FBFC4]">
          <Heart className="w-4 h-4 text-[#6FBFC4]" />
          <span>Calculated across 7-day biometric calibrations and somatic breathing resets.</span>
        </div>
        <span className="font-heading italic text-[#FFC978]/90">
          "Mastery of the self is the highest constellation."
        </span>
      </div>
    </div>
  );
};
