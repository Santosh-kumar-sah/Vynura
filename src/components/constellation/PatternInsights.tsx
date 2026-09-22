import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Compass, 
  Heart, 
  Activity,
  Sparkles,
  Calendar,
  Clock
} from 'lucide-react';
import type { PatternInsight, MoodCorrelationAnalysis } from '../../lib/supabase';
import { MOODS } from '../sections/HeroSection';

interface PatternInsightsProps {
  insight: PatternInsight;
  correlations?: MoodCorrelationAnalysis | null;
  topInsight?: string | null;
}

export const PatternInsights: React.FC<PatternInsightsProps> = ({ 
  insight, 
  correlations,
  topInsight 
}) => {
  const dominantMoodData = MOODS[insight.dominantMood] || MOODS.calm;
  const activeInsight = topInsight || correlations?.topInsight || 'Keep calibrating, patterns will appear soon as your constellation grows.';

  return (
    <div className="space-y-6">
      {/* Prominent Correlation Top Insight Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25 }}
        className="p-5 sm:p-6 rounded-xl bg-[#121316] border border-white/[0.08] relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider bg-white/[0.04] border border-white/[0.08] text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 stroke-[1.5]" />
                <span>Longitudinal Correlation</span>
              </span>
              {correlations?.hasSufficientData && (
                <span className="text-[10px] font-mono text-neutral-400">
                  90-Day Analysis
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-medium text-white leading-snug">
              {activeInsight}
            </h3>

            <p className="text-xs text-neutral-400 leading-relaxed">
              {correlations?.hasSufficientData
                ? 'Synthesized across circadian time-of-day windows and weekday state distribution.'
                : 'Calibrate 14 or more mood entries to unlock circadian and diurnal correlation analysis.'}
            </p>
          </div>

          {correlations?.hasSufficientData && (
            <div className="flex items-center gap-2 shrink-0">
              {correlations.peakDay && (
                <div className="px-3.5 py-2 rounded-lg bg-white/[0.02] border border-white/[0.08] text-center min-w-[110px]">
                  <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-neutral-400 uppercase">
                    <Calendar className="w-3 h-3 text-amber-400 stroke-[1.5]" />
                    <span>Peak Day</span>
                  </div>
                  <div className="text-sm font-medium text-white mt-0.5">
                    {correlations.peakDay.day}
                  </div>
                </div>
              )}
              {correlations.peakTime && (
                <div className="px-3.5 py-2 rounded-lg bg-white/[0.02] border border-white/[0.08] text-center min-w-[110px]">
                  <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-neutral-400 uppercase">
                    <Clock className="w-3 h-3 text-white/70 stroke-[1.5]" />
                    <span>Peak Time</span>
                  </div>
                  <div className="text-sm font-medium text-white mt-0.5 capitalize">
                    {correlations.peakTime.period}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Grid of 3 Detailed Pattern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Dominant Resonance Insight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25 }}
          className="p-5 rounded-xl bg-[#121316] border border-white/[0.08] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400 stroke-[1.5]" />
                <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-amber-400">
                  Dominant State
                </span>
              </div>

              <span className="text-xs font-mono text-neutral-400">
                {dominantMoodData.sublabel}
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-medium text-white mb-2 leading-snug">
              {insight.headline}
            </h4>

            <p className="text-xs text-neutral-400 leading-relaxed">
              {insight.subtext}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-neutral-500">Frequency Share</span>
            <span className="font-mono font-medium text-white">
              {insight.dominantPercentage}% Harmonic Weight
            </span>
          </div>
        </motion.div>

        {/* Card 2: Somatic Equilibrium Index */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="p-5 rounded-xl bg-[#121316] border border-white/[0.08] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400 stroke-[1.5]" />
                <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-emerald-400">
                  Equilibrium Index
                </span>
              </div>

              <span className="text-xs font-mono text-neutral-400">Stability</span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl sm:text-3xl font-normal text-white">
                {insight.equilibriumScore}
              </span>
              <span className="text-xs text-neutral-400">/ 100 Score</span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Calculated across emotional volatility variance and parasympathetic recovery frequency over time.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-neutral-500">Coherence Status</span>
            <span className="font-mono font-medium text-white">Optimal Equilibrium</span>
          </div>
        </motion.div>

        {/* Card 3: Adaptive Recommendation Note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="p-5 rounded-xl bg-[#121316] border border-white/[0.08] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400 stroke-[1.5]" />
                <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-amber-400">
                  Recommendation
                </span>
              </div>

              <span className="text-xs font-mono text-neutral-400">Next Shift</span>
            </div>

            <h4 className="text-xs sm:text-sm font-medium text-white mb-2">
              Suggested Focus
            </h4>

            <p className="text-xs text-neutral-300 leading-relaxed">
              "{insight.recommendationNote}"
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400">
            <span className="flex items-center gap-1 text-amber-400">
              <Heart className="w-3.5 h-3.5 stroke-[1.5]" /> Active
            </span>
            <span className="font-mono text-neutral-500 text-[11px]">Engine v4.2</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
