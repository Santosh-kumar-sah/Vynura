import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
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
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#B8B4D9]">
            Select Sanctuary Environment
          </span>
          <span className="text-xs font-mono" style={{ color: currentCategory.colors.primary }}>
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
                className={`p-3 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden cursor-pointer group ${
                  isSelected
                    ? 'shadow-glow-sm'
                    : 'bg-[#15122E]/70 hover:bg-[#1E1B3D]/80 border-[#B8B4D9]/15'
                }`}
                style={{
                  backgroundColor: isSelected ? `${cat.colors.primary}18` : undefined,
                  borderColor: isSelected ? cat.colors.primary : undefined,
                }}
              >
                {/* Active Indicator Top Rim */}
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryRim"
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ backgroundColor: cat.colors.primary }}
                  />
                )}

                <div className="flex items-center justify-between mb-1.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center border"
                    style={{
                      backgroundColor: `${cat.colors.primary}20`,
                      borderColor: `${cat.colors.primary}40`,
                      color: cat.colors.primary,
                    }}
                  >
                    {CATEGORY_ICONS[cat.id]}
                  </div>
                  {isSelected && (
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-ping"
                      style={{ backgroundColor: cat.colors.primary }}
                    />
                  )}
                </div>

                <div className="font-heading text-xs sm:text-sm font-bold text-[#F5F2ED] truncate">
                  {cat.name}
                </div>
                <div className="text-[10px] text-[#B8B4D9] font-mono truncate opacity-80">
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
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 sm:p-5 rounded-2xl border relative overflow-hidden backdrop-blur-md"
        style={{
          backgroundColor: `${currentCategory.colors.primary}0D`,
          borderColor: `${currentCategory.colors.primary}35`,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold border"
                style={{
                  backgroundColor: currentCategory.colors.badgeBg,
                  borderColor: `${currentCategory.colors.primary}40`,
                  color: currentCategory.colors.textAccent,
                }}
              >
                {currentCategory.subtitle}
              </span>
              <span className="text-xs text-[#B8B4D9] italic">
                {currentCategory.tagline}
              </span>
            </div>
            <p className="text-xs text-[#F5F2ED]/90 leading-relaxed max-w-xl">
              {currentCategory.visualMetaphor}
            </p>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleAmbientSound}
            className="self-start sm:self-center px-3 py-2 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer bg-[#121029]/80 shrink-0"
            style={{
              borderColor: ambientSound ? `${currentCategory.colors.primary}60` : '#B8B4D9/20',
              color: ambientSound ? currentCategory.colors.primary : '#B8B4D9',
            }}
            title="Toggle Ambient Audio Soundscape"
          >
            {ambientSound ? (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Ambient Sound On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Sound Off</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Duration Picker Chips */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#B8B4D9]">
            Session Duration
          </span>
          <span className="text-xs font-mono text-[#B8B4D9]">
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
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all duration-200 border text-center cursor-pointer ${
                  isSelected
                    ? 'text-[#F5F2ED] shadow-glow-sm'
                    : 'bg-[#15122E]/60 text-[#B8B4D9] border-[#B8B4D9]/15 hover:border-[#B8B4D9]/30'
                }`}
                style={{
                  backgroundColor: isSelected ? `${currentCategory.colors.primary}25` : undefined,
                  borderColor: isSelected ? currentCategory.colors.primary : undefined,
                  color: isSelected ? '#FFFFFF' : undefined,
                }}
              >
                <div>{opt.label}</div>
                <div className="text-[10px] font-mono opacity-70 font-normal">{opt.tag}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Begin Meditation Action Button */}
      <div className="pt-2">
        <button
          onClick={onStart}
          className="w-full py-4 px-6 rounded-2xl font-heading text-base sm:text-lg font-bold transition-all flex items-center justify-center gap-3 cursor-pointer shadow-glow-md group"
          style={{
            background: `linear-gradient(135deg, ${currentCategory.colors.primary} 0%, ${currentCategory.colors.secondary} 100%)`,
            color: '#0A081C',
          }}
        >
          <Play className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
          <span>Begin {currentCategory.name} Meditation</span>
          <Sparkles className="w-4 h-4 ml-1 opacity-70" />
        </button>
      </div>
    </div>
  );
};
