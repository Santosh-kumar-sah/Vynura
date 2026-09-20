import React, { useState } from 'react';
import { ArrowRight, Volume2, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOODS } from './HeroSection';
import type { MoodType } from '../../types';

interface MoodStateSectionProps {
  activeMood?: MoodType;
  onSelectMood?: (mood: MoodType) => void;
}

export const MoodStateSection: React.FC<MoodStateSectionProps> = ({
  activeMood = 'calm',
  onSelectMood,
}) => {
  const navigate = useNavigate();
  const [internalMood, setInternalMood] = useState<MoodType>(activeMood);
  const selectedMood = activeMood || internalMood;
  const currentMood = MOODS[selectedMood];

  const handleMoodSelect = (mKey: MoodType) => {
    setInternalMood(mKey);
    if (onSelectMood) onSelectMood(mKey);
  };

  const moodKeys: MoodType[] = ['calm', 'happy', 'energetic', 'neutral', 'sad'];

  return (
    <section id="states" className="py-28 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/[0.06]">
      {/* Section Header */}
      <div className="max-w-xl mb-16">
        <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/50 mb-3">
          Autonomic Mapping
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-3">
          Physiological state profiles.
        </h2>
        <p className="text-sm text-white/70 leading-relaxed">
          Select any neural baseline to review its somatic intervention and generative acoustic pacing.
        </p>
      </div>

      {/* Unboxed State Selector Tabs sitting directly on canvas */}
      <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-white/[0.06]">
        {moodKeys.map((key) => {
          const item = MOODS[key];
          const isSelected = selectedMood === key;
          return (
            <button
              key={key}
              onClick={() => handleMoodSelect(key)}
              className={`px-3.5 py-2 rounded-lg text-xs transition-all duration-150 cursor-pointer border flex items-center gap-2.5 ${
                isSelected
                  ? 'bg-white/[0.08] text-white font-medium border-white/20 shadow-[0_1px_4px_rgba(0,0,0,0.4)]'
                  : 'bg-transparent text-white/60 border-transparent hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  isSelected ? 'scale-125' : 'opacity-50'
                }`}
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active State Specification Display (Unboxed 3-column split) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider mb-2">
            Classification & Tone
          </div>
          <h3 className="text-xl font-semibold text-white mb-1.5 flex items-center gap-2">
            <span>{currentMood.label}</span>
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: currentMood.color }}
            />
          </h3>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            {currentMood.sublabel} · {currentMood.quote}
          </p>
        </div>

        <div>
          <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Targeted Intervention</span>
          </div>
          <div className="text-sm font-semibold text-white mb-1">
            {currentMood.shiftAction}
          </div>
          <p className="text-xs text-white/70 leading-relaxed">
            Calibrated timing to either down-regulate sympathetic arousal or stimulate creative focus.
          </p>
        </div>

        <div>
          <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-white/60" />
            <span>Generative Soundscape</span>
          </div>
          <div className="text-sm font-semibold text-white mb-1">
            {currentMood.soundscape}
          </div>
          <button
            onClick={() => navigate('/mood')}
            className="inline-flex items-center gap-1.5 text-xs text-[#F59E0B] hover:text-amber-300 transition-colors cursor-pointer bg-transparent border-none p-0 mt-2"
          >
            <span>Engage Frequency Shift</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </section>
  );
};
