import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Star, Award } from 'lucide-react';
import type { MoodEntry } from '../../lib/supabase';
import { MOODS } from '../sections/HeroSection';

interface StreakDisplayProps {
  entries: MoodEntry[];
  streakCount: number;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  entries,
  streakCount,
}) => {
  // Show up to last 7 days of connected star beads
  const recentEntries = entries.slice(-7);

  return (
    <div className="p-5 rounded-3xl bg-gradient-to-b from-[#24214A]/80 via-[#1A1836]/90 to-[#121029]/95 border border-[#FFC978]/30 backdrop-blur-xl relative overflow-hidden">
      {/* Top Accent Rim */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFC978] to-transparent" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-[#B8B4D9]/15">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFC978]/15 border border-[#FFC978]/40 flex items-center justify-center text-[#FFC978] shadow-glow-sm">
            <Flame className="w-5 h-5 text-[#FF9E7D]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FFC978]">
                Celestial Streak Arc
              </span>
              <span className="text-xs text-[#FFC978]/90 font-mono">Streak Arc</span>
            </div>
            <h4 className="font-heading text-lg font-bold text-[#F5F2ED]">
              {streakCount}-Day Star Chain Ignited
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121029]/80 border border-[#FFC978]/30 text-xs font-semibold text-[#FFF2D6]">
          <Award className="w-3.5 h-3.5 text-[#FFC978]" />
          <span>Orion Cluster Rank</span>
        </div>
      </div>

      {/* Visual String of Connected Celestial Stars */}
      <div className="relative py-3 flex items-center justify-between px-2 sm:px-6">
        {/* Connective Line */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[1.5px] bg-gradient-to-r from-[#FFC978]/20 via-[#FFC978]/50 to-[#6FBFC4]/40 z-0" />

        {recentEntries.map((entry, idx) => {
          const moodConfig = MOODS[entry.mood_category] || MOODS.neutral;
          return (
            <motion.div
              key={entry.id || idx}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.08, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative z-10 flex flex-col items-center gap-1.5"
            >
              {/* Star Node */}
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center relative transition-transform hover:scale-125 cursor-pointer shadow-md"
                style={{
                  backgroundColor: `${moodConfig.color}25`,
                  borderColor: moodConfig.color,
                  boxShadow: `0 0 12px ${moodConfig.color}60`,
                }}
              >
                <Star className="w-3.5 h-3.5" style={{ color: moodConfig.color }} />
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-25"
                  style={{ backgroundColor: moodConfig.color }}
                />
              </div>

              {/* Day Label */}
              <span className="text-[10px] font-mono text-[#B8B4D9] font-semibold">
                Day {idx + 1}
              </span>
              <span className="text-[9px] font-mono font-bold" style={{ color: moodConfig.color }}>
                {moodConfig.sublabel}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-[#B8B4D9]/10 flex items-center justify-between text-[11px] text-[#B8B4D9]">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#FFC978]" />
          <span>Each daily calibration adds a permanent beacon to your constellation map.</span>
        </span>
        <span className="text-[#FFC978] font-mono font-bold">100% Continuity</span>
      </div>
    </div>
  );
};
