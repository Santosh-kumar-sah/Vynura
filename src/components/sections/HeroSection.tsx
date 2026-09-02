import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye, Music, Wind, Heart, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';
import type { MoodType, MoodConfig } from '../../types';

export const MOODS: Record<MoodType, MoodConfig> = {
  happy: {
    id: 'happy',
    label: 'Joy & Radiance',
    sublabel: 'Radiance',
    kanji: 'Joy',
    color: '#FF9E7D',
    gradient: 'from-[#FF9E7D]/20 via-[#FFC978]/10 to-transparent',
    quote: 'Your light is magnetic today. Let us amplify this resonance.',
    shiftAction: 'Euphoric Lofi Soundscape + Gratitude Anchor',
    soundscape: 'Warm Acoustic & Summer Fireflies',
  },
  calm: {
    id: 'calm',
    label: 'Deep Serenity',
    sublabel: 'Serenity',
    kanji: 'Calm',
    color: '#6FBFC4',
    gradient: 'from-[#6FBFC4]/20 via-[#4A5B8C]/10 to-transparent',
    quote: 'Still waters reflect the infinite sky. You are grounded in this moment.',
    shiftAction: 'Coherent 4-7-8 Breathing + Ocean Drift',
    soundscape: 'Binaural Theta Waves (432Hz)',
  },
  sad: {
    id: 'sad',
    label: 'Gentle Rain',
    sublabel: 'Gentle',
    kanji: 'Reflect',
    color: '#4A5B8C',
    gradient: 'from-[#4A5B8C]/25 via-[#2D2A5C]/20 to-transparent',
    quote: 'Every rain shower cleanses the soil for tomorrow\'s blossoming.',
    shiftAction: 'Compassionate Self-Inquiry Prompt + Warm Tone Hug',
    soundscape: 'Soft Piano & Midnight Rain',
  },
  energetic: {
    id: 'energetic',
    label: 'Starlight Surge',
    sublabel: 'Surge',
    kanji: 'Energy',
    color: '#C25AE0',
    gradient: 'from-[#C25AE0]/20 via-[#FFC978]/10 to-transparent',
    quote: 'Raw momentum flows through you. Direct this current with intention.',
    shiftAction: 'Focus Sprint Timer + High-Vibe Groove',
    soundscape: 'Uplifting Synthwave & Cosmic Pulses',
  },
  neutral: {
    id: 'neutral',
    label: 'Clear Equilibrium',
    sublabel: 'Equilibrium',
    kanji: 'Balance',
    color: '#8B87B0',
    gradient: 'from-[#8B87B0]/20 via-[#2D2A5C]/15 to-transparent',
    quote: 'A clean slate before the brush touches canvas. Where will you wander?',
    shiftAction: 'Micro-Mindfulness Scan + Vision Prompt',
    soundscape: 'Ambient Wind Chimes & Forest Mist',
  },
};

interface HeroSectionProps {
  onStartJourney?: () => void;
  activeMood?: MoodType;
  onSelectMood?: (mood: MoodType) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartJourney,
  activeMood = 'happy',
  onSelectMood,
}) => {
  const [internalMood, setInternalMood] = useState<MoodType>(activeMood);
  const selectedMood = activeMood || internalMood;
  const currentMood = MOODS[selectedMood];

  const handleMoodClick = (mKey: MoodType) => {
    setInternalMood(mKey);
    if (onSelectMood) onSelectMood(mKey);
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Dynamic Mood Ambient Radial Light (shifts smoothly when user clicks mood pills) */}
      <motion.div
        key={selectedMood}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.35, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute top-1/4 w-[500px] sm:w-[700px] h-[500px] rounded-full blur-[120px] pointer-events-none -z-10"
        style={{ backgroundColor: currentMood.color }}
      />

      <div className="max-w-5xl mx-auto w-full text-center flex flex-col items-center">
        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#24214A]/70 border border-[#FFC978]/35 backdrop-blur-md shadow-glow-sm mb-6"
        >
          <span className="text-[#FFC978] text-xs">✦</span>
          <span className="text-xs font-semibold text-[#F5F2ED] tracking-wide">
            Face-Powered Emotional Sanctuary
          </span>
          <span className="w-1 h-1 rounded-full bg-[#FFC978]/60" />
          <span className="text-[11px] text-[#FFC978] font-bold">Real-Time Insight</span>
        </motion.div>

        {/* Hero Title with Shinkai Sky Aesthetic */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08, ease: [0.34, 1.56, 0.64, 1] }}
          className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F5F2ED] leading-[1.12] mb-6 max-w-4xl"
        >
          See your emotion in the mirror of the{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-[#FFC978] via-[#FF9E7D] to-[#6FBFC4] bg-clip-text text-transparent">
              night sky
            </span>
            <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFC978] to-transparent opacity-70" />
          </span>
          .
        </motion.h1>

        {/* Tagline & Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-lg sm:text-xl text-[#B8B4D9] max-w-2xl font-normal leading-relaxed mb-4"
        >
          <span className="font-heading font-semibold text-[#F5F2ED] italic text-xl sm:text-2xl block mb-1">
            "See it. Feel it. Shift it."
          </span>
          An intimate web companion inspired by twilight skies & warm firefly glows.
          Look into your camera, discover your emotional landscape, and receive instantaneous sonic & somatic shifts.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.22, ease: [0.34, 1.56, 0.64, 1] }}
          className="flex flex-wrap items-center justify-center gap-4 mt-4 mb-12"
        >
          <Button
            size="lg"
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => {
              if (onStartJourney) onStartJourney();
            }}
          >
            Begin Your Journey
          </Button>

          <Button
            size="lg"
            variant="secondary"
            icon={<Eye className="w-4 h-4 text-[#6FBFC4]" />}
            iconPosition="left"
            onClick={() => {
              const el = document.getElementById('concept');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            How Vision Works
          </Button>
        </motion.div>

        {/* Interactive Mood Alchemy Preview Bar */}
        <motion.div
          id="spectrum"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          className="w-full max-w-3xl rounded-2xl bg-gradient-to-b from-[#24214A]/80 to-[#1A1836]/95 border border-[#B8B4D9]/20 p-5 sm:p-6 backdrop-blur-xl shadow-[0_16px_40px_-10px_rgba(10,8,28,0.85)] relative overflow-hidden"
        >
          {/* Top light rim */}
          <div
            className="absolute top-0 left-0 right-0 h-[1.5px] transition-colors duration-500"
            style={{
              background: `linear-gradient(90deg, transparent, ${currentMood.color}, transparent)`,
            }}
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#B8B4D9]/15">
            <div className="flex items-center gap-2 text-left">
              <Sparkles className="w-4 h-4 text-[#FFC978]" />
              <span className="text-xs uppercase tracking-wider font-semibold text-[#B8B4D9]">
                Interactive Mood Engine Preview
              </span>
            </div>
            <span className="text-xs text-[#FFC978]/90 font-medium">
              Select an emotional frequency to preview recommendations:
            </span>
          </div>

          {/* Mood Select Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
            {(Object.keys(MOODS) as MoodType[]).map((mKey) => {
              const mood = MOODS[mKey];
              const isSelected = selectedMood === mKey;
              return (
                <button
                  key={mKey}
                  onClick={() => handleMoodClick(mKey)}
                  className={`relative flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#2D2A5C] text-[#F5F2ED] border shadow-glow-sm'
                      : 'bg-[#1A1836]/60 text-[#B8B4D9] border border-[#B8B4D9]/10 hover:border-[#B8B4D9]/30 hover:text-[#F5F2ED]'
                  }`}
                  style={{
                    borderColor: isSelected ? mood.color : undefined,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: mood.color }}
                  />
                  <span>{mood.label.split(' ')[0]}</span>
                  <span className="text-[10px] opacity-70">({mood.sublabel})</span>
                </button>
              );
            })}
          </div>

          {/* Selected Mood Reactive Card Output */}
          <motion.div
            key={selectedMood}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-1"
          >
            <div className="p-3 rounded-xl bg-[#1A1836]/70 border border-[#B8B4D9]/10">
              <div className="flex items-center gap-1.5 text-xs text-[#FFC978] font-medium mb-1">
                <Heart className="w-3.5 h-3.5" />
                <span>Emotional Reading</span>
              </div>
              <p className="text-xs text-[#F5F2ED] italic leading-relaxed">
                "{currentMood.quote}"
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#1A1836]/70 border border-[#B8B4D9]/10">
              <div className="flex items-center gap-1.5 text-xs text-[#6FBFC4] font-medium mb-1">
                <Wind className="w-3.5 h-3.5" />
                <span>Recommended Shift</span>
              </div>
              <p className="text-xs text-[#F5F2ED] font-semibold leading-relaxed">
                {currentMood.shiftAction}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#1A1836]/70 border border-[#B8B4D9]/10">
              <div className="flex items-center gap-1.5 text-xs text-[#FF9E7D] font-medium mb-1">
                <Music className="w-3.5 h-3.5" />
                <span>Adaptive Soundscape</span>
              </div>
              <p className="text-xs text-[#F5F2ED] font-medium leading-relaxed">
                {currentMood.soundscape}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
