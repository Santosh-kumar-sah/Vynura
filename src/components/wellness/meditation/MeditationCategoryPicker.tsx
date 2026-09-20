import React from 'react';
import { motion } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Sun, 
  Moon, 
  Droplets, 
  Target, 
  BedDouble, 
  Flame, 
  HeartHandshake, 
  Leaf 
} from 'lucide-react';
import type { MeditationCategoryId } from '../../../types/meditation';
import { MEDITATION_CATEGORIES_LIST, MEDITATION_CATEGORIES } from '../../../types/meditation';

interface MeditationCategoryPickerProps {
  selectedCategory: MeditationCategoryId;
  onSelectCategory: (id: MeditationCategoryId) => void;
  selectedDuration: number;
  onSelectDuration: (seconds: number) => void;
  ambientSound: boolean;
  onToggleAmbientSound: () => void;
  onStart: () => void;
}

const DURATION_OPTIONS = [
  { label: '1 Min', seconds: 60, tag: 'Reset' },
  { label: '3 Mins', seconds: 180, tag: 'Ground' },
  { label: '5 Mins', seconds: 300, tag: 'Restore' },
  { label: '10 Mins', seconds: 600, tag: 'Deep' },
  { label: '15 Mins', seconds: 900, tag: 'Immersion' },
  { label: '20 Mins', seconds: 1200, tag: 'Sanctuary' },
];

export const CATEGORY_ICONS: Record<MeditationCategoryId, React.ReactNode> = {
  starlight: <Moon className="w-4 h-4" />,
  joy: <Sun className="w-4 h-4" />,
  calm: <Droplets className="w-4 h-4" />,
  focus: <Target className="w-4 h-4" />,
  sleep: <BedDouble className="w-4 h-4" />,
  stress: <Flame className="w-4 h-4" />,
  gratitude: <HeartHandshake className="w-4 h-4" />,
  healing: <Leaf className="w-4 h-4" />,
};

export const MeditationCategoryPicker: React.FC<MeditationCategoryPickerProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedDuration,
  onSelectDuration,
  ambientSound,
  onToggleAmbientSound,
  onStart,
}) => {
  const currentCategory = MEDITATION_CATEGORIES[selectedCategory];

  return (
    <div className="space-y-6 text-left">
      {/* Category Horizontal Carousel / Tabs */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-neutral-400">
            Select Environment
          </span>
          <span className="text-xs font-mono text-amber-400">
            {currentCategory.emotion}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {MEDITATION_CATEGORIES_LIST.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`p-3 rounded-xl border text-left transition-all duration-150 relative overflow-hidden cursor-pointer group ${
                  isSelected
                    ? 'bg-amber-400/[0.06] border-amber-400/40 text-white'
                    : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.08] text-white/70 hover:text-white'
                }`}
              >
                {/* Active Indicator Top Rim */}
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryRim"
                    className="absolute top-0 left-0 right-0 h-[2px] bg-amber-400"
                  />
                )}

                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`transition-colors ${
                      isSelected ? 'text-amber-400' : 'text-white/60 group-hover:text-white'
                    }`}
                  >
                    {CATEGORY_ICONS[cat.id]}
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </div>

                <div className="text-xs sm:text-sm font-medium text-white truncate">
                  {cat.name}
                </div>
                <div className="text-[10px] text-neutral-400 font-mono truncate">
                  {cat.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Category Feature Highlight Box */}
      <motion.div
        key={currentCategory.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="p-4 sm:p-5 rounded-xl border border-white/[0.08] bg-[#121316]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-medium bg-white/[0.04] border border-white/[0.08] text-amber-400">
                {currentCategory.subtitle}
              </span>
              <span className="text-xs text-neutral-400">
                {currentCategory.tagline}
              </span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-xl">
              {currentCategory.visualMetaphor}
            </p>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleAmbientSound}
            className="self-start sm:self-center px-3 py-1.5 rounded-lg border border-white/[0.08] flex items-center gap-2 text-xs font-mono transition-colors cursor-pointer bg-white/[0.03] hover:bg-white/[0.06] text-neutral-300 hover:text-white shrink-0"
            title="Toggle Ambient Audio Soundscape"
          >
            {ambientSound ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400 stroke-[1.5]" />
                <span>Ambient On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-neutral-500 stroke-[1.5]" />
                <span>Sound Off</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Duration Picker Chips */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-neutral-400">
            Session Duration
          </span>
          <span className="text-xs font-mono text-neutral-400">
            {Math.floor(selectedDuration / 60)} minutes
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {DURATION_OPTIONS.map((opt) => {
            const isSelected = selectedDuration === opt.seconds;
            return (
              <button
                key={opt.seconds}
                onClick={() => onSelectDuration(opt.seconds)}
                className={`py-2 px-2 rounded-lg text-xs font-medium transition-all duration-150 border text-center cursor-pointer ${
                  isSelected
                    ? 'bg-white text-neutral-950 border-white font-medium'
                    : 'bg-white/[0.02] text-neutral-400 border-white/[0.08] hover:border-white/[0.15] hover:text-white'
                }`}
              >
                <div>{opt.label}</div>
                <div className={`text-[10px] font-mono ${isSelected ? 'text-neutral-600' : 'text-neutral-500'}`}>{opt.tag}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Begin Meditation Action Button */}
      <div className="pt-2">
        <button
          onClick={onStart}
          className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-medium text-sm transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-sm group"
        >
          <Play className="w-4 h-4 fill-current transition-transform group-hover:scale-105" />
          <span>Begin {currentCategory.name} Session</span>
        </button>
      </div>
    </div>
  );
};
