import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
            Longitudinal Telemetry
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-normal tracking-tight text-white mb-2">
            Autonomic milestones & metrics
          </h2>

          <p className="text-sm text-neutral-400 max-w-xl leading-relaxed">
            Continuity metrics and progress benchmarks tracked without punitive counters or gamified distractions.
          </p>
        </motion.div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-neutral-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>
            {streakDays >= 7
              ? 'Status: Advanced Consistency'
              : streakDays >= 3
              ? 'Status: Developing Routine'
              : 'Status: Baseline Calibration'}
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
