import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';
import { WeeklyWellnessScore } from './WeeklyWellnessScore';
import { StarBadgeGrid } from './StarBadgeGrid';
import { fetchMoodEntries, calculateStreak, type MoodEntry } from '../../lib/supabase';

export const GamificationSection: React.FC = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [streakDays, setStreakDays] = useState<number>(5);

  useEffect(() => {
    fetchMoodEntries().then((loaded) => {
      setEntries(loaded);
      const streak = calculateStreak(loaded);
      setStreakDays(streak);
    });
  }, []);

  const calibrationsCount = entries.length;
  // Calculate dynamic weekly wellness metrics
  const score = Math.min(78 + calibrationsCount * 2, 98);
  const reflectionCount = entries.filter((e) => Boolean(e.journal_text)).length;
  const reflectionScore = Math.min(80 + reflectionCount * 3, 98);
  const balanceScore = Math.min(82 + Math.min(calibrationsCount * 2, 16), 96);
  const somaticScore = Math.min(85 + (streakDays >= 3 ? 10 : 4), 98);

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
          <span>
            {streakDays >= 7
              ? 'Milestone Level: Cassiopeia Master ✦'
              : streakDays >= 3
              ? 'Milestone Level: Orion Weaver ✦'
              : 'Milestone Level: First Light ✦'}
          </span>
        </div>
      </div>

      {/* 1. Weekly Wellness Score Dial Summary */}
      <WeeklyWellnessScore
        score={score}
        balanceScore={balanceScore}
        somaticScore={somaticScore}
        reflectionScore={reflectionScore}
      />

      {/* 2. Star Badge Milestones Grid */}
      <StarBadgeGrid
        streakDays={streakDays}
        calibrationsCount={calibrationsCount}
      />
    </section>
  );
};
