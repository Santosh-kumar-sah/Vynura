import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';
import { WeeklyWellnessScore } from './WeeklyWellnessScore';
import { StarBadgeGrid } from './StarBadgeGrid';

export const GamificationSection: React.FC = () => {
  return (
    <section
      id="gamification"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#FFC978] mb-2">
            <Trophy className="w-4 h-4 text-[#FFC978]" />
            <span>05 / MILESTONES · Gamification & Wellness Index</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#F5F2ED] tracking-tight mb-2">
            Milestones & Harmonic Rank
          </h2>

          <p className="text-sm sm:text-base text-[#B8B4D9] max-w-xl leading-relaxed">
            Unlock new celestial star clusters and track your longitudinal emotional resonance without punitive counters.
          </p>
        </motion.div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121029]/80 border border-[#FFC978]/30 text-xs font-semibold text-[#FFC978]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Milestone Level: Sirius Master</span>
        </div>
      </div>

      {/* 1. Weekly Wellness Score Dial Summary */}
      <WeeklyWellnessScore
        score={92}
        balanceScore={94}
        somaticScore={88}
        reflectionScore={95}
      />

      {/* 2. Star Badge Milestones Grid */}
      <StarBadgeGrid
        streakDays={7}
        calibrationsCount={12}
      />
    </section>
  );
};
