import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Compass, 
  Heart, 
  Activity 
} from 'lucide-react';
import type { PatternInsight } from '../../lib/supabase';
import { MOODS } from '../sections/HeroSection';

interface PatternInsightsProps {
  insight: PatternInsight;
}

export const PatternInsights: React.FC<PatternInsightsProps> = ({ insight }) => {
  const dominantMoodData = MOODS[insight.dominantMood] || MOODS.calm;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Card 1: Dominant Resonance Insight */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        className="p-5 rounded-3xl bg-gradient-to-b from-[#24214A]/80 to-[#181636]/90 border border-[#B8B4D9]/20 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center border"
                style={{
                  backgroundColor: `${dominantMoodData.color}20`,
                  borderColor: `${dominantMoodData.color}50`,
                  color: dominantMoodData.color,
                }}
              >
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FFC978]">
                Dominant Polarity
              </span>
            </div>

            <span className="text-xs font-heading text-[#B8B4D9]">
              {dominantMoodData.kanji}
            </span>
          </div>

          <h4 className="font-heading text-lg font-bold text-[#F5F2ED] mb-2 leading-snug">
            {insight.headline}
          </h4>

          <p className="text-xs text-[#B8B4D9] leading-relaxed">
            {insight.subtext}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#B8B4D9]/15 flex items-center justify-between text-xs">
          <span className="text-[#B8B4D9]">Frequency Share</span>
          <span className="font-mono font-bold" style={{ color: dominantMoodData.color }}>
            {insight.dominantPercentage}% Harmonic Weight
          </span>
        </div>
      </motion.div>

      {/* Card 2: Somatic Equilibrium Index */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.08, ease: [0.34, 1.56, 0.64, 1] }}
        className="p-5 rounded-3xl bg-gradient-to-b from-[#24214A]/80 to-[#181636]/90 border border-[#6FBFC4]/30 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#6FBFC4]/15 border border-[#6FBFC4]/40 flex items-center justify-center text-[#6FBFC4]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6FBFC4]">
                Equilibrium Index
              </span>
            </div>

            <span className="text-xs font-heading text-[#6FBFC4]">調和指数</span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-heading text-3xl font-bold text-[#F5F2ED]">
              {insight.equilibriumScore}
            </span>
            <span className="text-xs text-[#B8B4D9]">/ 100 Stability Score</span>
          </div>

          <p className="text-xs text-[#B8B4D9] leading-relaxed">
            Calculated across emotional volatility variance and parasympathetic recovery frequency over time.
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#B8B4D9]/15 flex items-center justify-between text-xs">
          <span className="text-[#6FBFC4]">Coherence Status</span>
          <span className="font-mono font-bold text-[#F5F2ED]">Optimal Homeostasis</span>
        </div>
      </motion.div>

      {/* Card 3: Adaptive Cosmic Recommendation Note */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.16, ease: [0.34, 1.56, 0.64, 1] }}
        className="p-5 rounded-3xl bg-gradient-to-b from-[#24214A]/80 to-[#181636]/90 border border-[#FFC978]/30 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FFC978]/15 border border-[#FFC978]/40 flex items-center justify-center text-[#FFC978]">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FFC978]">
                Astrological Synthesis
              </span>
            </div>

            <span className="text-xs font-heading text-[#FFC978]">星間指針</span>
          </div>

          <h4 className="font-heading text-sm font-bold text-[#F5F2ED] mb-2">
            Next Shift Alignment
          </h4>

          <p className="text-xs text-[#FFF2D6] font-heading italic leading-relaxed">
            "{insight.recommendationNote}"
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#B8B4D9]/15 flex items-center justify-between text-xs text-[#B8B4D9]">
          <span className="flex items-center gap-1 text-[#FFC978]">
            <Heart className="w-3.5 h-3.5" /> Synchronized
          </span>
          <span className="font-mono text-[#B8B4D9]">Pattern Gen v4.2</span>
        </div>
      </motion.div>
    </div>
  );
};
