import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { MoodType } from '../../types';

interface ManualMoodSelectorProps {
  currentMood: MoodType;
  onSelectMood: (mood: MoodType) => void;
}

interface MoodOption {
  id: MoodType;
  label: string;
  tag: string;
  color: string;
  description: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'happy',
    label: 'Joy & Radiance',
    tag: 'Joy',
    color: '#FF9E7D',
    description: 'Vibrant, open, uplifted',
  },
  {
    id: 'calm',
    label: 'Deep Serenity',
    tag: 'Calm',
    color: '#6FBFC4',
    description: 'Grounded, peaceful, steady',
  },
  {
    id: 'sad',
    label: 'Gentle Rain',
    tag: 'Reflect',
    color: '#4A5B8C',
    description: 'Introspective, heavy, tender',
  },
  {
    id: 'energetic',
    label: 'Starlight Surge',
    tag: 'Energy',
    color: '#C25AE0',
    description: 'High momentum, passion, intense',
  },
  {
    id: 'neutral',
    label: 'Equilibrium',
    tag: 'Balance',
    color: '#8B87B0',
    description: 'Clear slate, receptive, centered',
  },
];

export const ManualMoodSelector: React.FC<ManualMoodSelectorProps> = ({
  currentMood,
  onSelectMood,
}) => {
  return (
    <div className="w-full bg-[#121029]/85 rounded-2xl border border-[#B8B4D9]/20 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#B8B4D9]/15">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#FFC978]" />
          <span className="text-xs font-semibold text-[#F5F2ED]">
            Manual Emotional Override
          </span>
        </div>
        <span className="text-[11px] text-[#FFC978]/90 font-medium">
          Feel something different? Tap to recalibrate:
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {MOOD_OPTIONS.map((opt) => {
          const isSelected = currentMood === opt.id;
          return (
            <motion.button
              key={opt.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
              onClick={() => onSelectMood(opt.id)}
              className={`p-2.5 rounded-xl text-left transition-all relative overflow-hidden border cursor-pointer ${
                isSelected
                  ? 'bg-[#24214A] shadow-glow-sm'
                  : 'bg-[#1A1836]/60 hover:bg-[#201D40]/70 border-[#B8B4D9]/15 hover:border-[#B8B4D9]/30'
              }`}
              style={{
                borderColor: isSelected ? opt.color : undefined,
              }}
            >
              {isSelected && (
                <div
                  className="absolute top-0 right-0 w-12 h-12 rounded-bl-full opacity-20 pointer-events-none"
                  style={{ backgroundColor: opt.color }}
                />
              )}

              <div className="flex items-center justify-between mb-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: opt.color,
                    boxShadow: isSelected ? `0 0 8px ${opt.color}` : 'none',
                  }}
                />
                <span className="text-[10px] font-mono font-bold text-[#B8B4D9]">
                  {opt.tag}
                </span>
              </div>

              <div className="text-xs font-bold text-[#F5F2ED] truncate">
                {opt.label.split(' ')[0]}
              </div>
              <div className="text-[10px] text-[#B8B4D9] truncate">
                {opt.description.split(',')[0]}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
