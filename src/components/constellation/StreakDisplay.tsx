import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import type { MoodEntry } from '../../lib/supabase';
import { MOODS } from '../sections/HeroSection';
import { AnimatedNumber } from '../common/AnimatedNumber';

interface StreakDisplayProps {
  entries: MoodEntry[];
  streakCount: number;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  entries,
  streakCount,
}) => {
  // Show up to last 7 days of connected checkpoint beads
  const recentEntries = entries.slice(-7);

  return (
    <div className="p-6 rounded-2xl bg-[#121316] border border-white/[0.08] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <Flame className="w-5 h-5 text-[#F59E0B] stroke-[1.75]" />
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-white/50">
              Continuity Tracking
            </div>
            <h4 className="text-lg font-semibold text-white tracking-tight">
              <AnimatedNumber value={streakCount} />-Day Calibration Streak
            </h4>
          </div>
        </div>

        <div className="px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-white/70">
          Daily Continuity Active
        </div>
      </div>

      {/* Visual String of Connected Celestial Checkpoints */}
      <div className="relative py-4 flex items-center justify-between px-3 sm:px-8">
        {/* Subtle Connective Hairline */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[1px] bg-white/[0.08] z-0" />

        {recentEntries.map((entry, idx) => {
          const moodConfig = MOODS[entry.mood_category] || MOODS.neutral;
          return (
            <motion.div
              key={entry.id || idx}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              {/* Checkpoint Node */}
              <div
                className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center bg-[#08090A]"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: moodConfig.color }}
                />
              </div>

              {/* Day Label */}
              <span className="text-[10px] font-mono text-white/50">
                Day {idx + 1}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/50">
        <span>Daily calibrations reinforce longitudinal baseline accuracy.</span>
        <span className="font-mono text-white/70 font-medium">100% Client-Side</span>
      </div>
    </div>
  );
};
