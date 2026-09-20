import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';
import { Button } from '../common/Button';
import { HeroCore3D } from '../3d/HeroCore3D';
import type { MoodType, MoodConfig } from '../../types';

export const MOODS: Record<MoodType, MoodConfig> = {
  calm: {
    id: 'calm',
    label: 'Deep Calm',
    sublabel: 'Parasympathetic Active',
    kanji: '',
    color: '#38BDF8',
    gradient: 'from-sky-500/10 to-transparent',
    quote: 'Baseline parasympathetic tone. Optimal state for deep reasoning.',
    shiftAction: '4-7-8 Coherent Pacing',
    soundscape: 'Binaural 432Hz Drift',
  },
  happy: {
    id: 'happy',
    label: 'Radiant Joy',
    sublabel: 'High Dopaminergic Momentum',
    kanji: '',
    color: '#F59E0B',
    gradient: 'from-amber-500/10 to-transparent',
    quote: 'Dopaminergic and optimistic momentum. Amplify through creative output.',
    shiftAction: 'Capture Anchor + Micro-Journal',
    soundscape: 'Warm Resonant Acoustics',
  },
  energetic: {
    id: 'energetic',
    label: 'High Energy',
    sublabel: 'Sympathetic Activation',
    kanji: '',
    color: '#A855F7',
    gradient: 'from-purple-500/10 to-transparent',
    quote: 'Elevated sympathetic arousal. Direct raw drive into focused execution.',
    shiftAction: '25m Focus Sprint Timer',
    soundscape: 'High-Tempo Neuro Synth',
  },
  neutral: {
    id: 'neutral',
    label: 'Equilibrium',
    sublabel: 'Homeostatic Baseline',
    kanji: '',
    color: '#94A3B8',
    gradient: 'from-slate-500/10 to-transparent',
    quote: 'Balanced sensory equilibrium. Open bandwidth for new tasks.',
    shiftAction: 'Cognitive Grounding Scan',
    soundscape: 'White Noise & Forest Air',
  },
  sad: {
    id: 'sad',
    label: 'Low Valence',
    sublabel: 'Reflective Down-Regulation',
    kanji: '',
    color: '#64748B',
    gradient: 'from-slate-600/10 to-transparent',
    quote: 'Energy conservation state. Gentle physiological regulation recommended.',
    shiftAction: 'Physiological Sigh + Rest',
    soundscape: 'Slow Ambient Piano',
  },
};

interface HeroSectionProps {
  onStartJourney?: () => void;
  activeMood?: MoodType;
  onSelectMood?: (mood: MoodType) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartJourney,
  activeMood = 'calm',
  onSelectMood,
}) => {
  const [internalMood, setInternalMood] = useState<MoodType>(activeMood);
  const selectedMood = activeMood || internalMood;
  const currentMood = MOODS[selectedMood];

  const handleMoodSelect = (mKey: MoodType) => {
    setInternalMood(mKey);
    if (onSelectMood) onSelectMood(mKey);
  };

  const moodKeys: MoodType[] = ['calm', 'happy', 'energetic', 'neutral', 'sad'];

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col items-center text-center">
      {/* Subtle Directional Top Sheen */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-gradient-to-b from-white/[0.04] to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Engineering Capsule */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs text-[#94A3B8] mb-6"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <span className="font-medium text-white/90">Vynura 2.0</span>
        <span className="text-white/20">|</span>
        <span>Local Neural Vision Engine</span>
      </motion.div>

      {/* Main Headline — Exactly 8 words, strong & benefit-driven */}
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.1] mb-5"
      >
        Real-time emotional tracking powered by local vision intelligence.
      </motion.h1>

      {/* Single Sentence Subline */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="text-base sm:text-lg text-[#94A3B8] max-w-2xl leading-relaxed mb-8"
      >
        Private on-device facial landmark analysis with instant physiological regulation and soundscape shifts.
      </motion.p>

      {/* Call to Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        className="flex flex-wrap items-center justify-center gap-3.5 mb-14"
      >
        <Button
          size="lg"
          variant="primary"
          icon={<ArrowRight className="w-4 h-4" />}
          onClick={() => {
            if (onStartJourney) onStartJourney();
          }}
        >
          Start Calibration
        </Button>

        <Button
          size="lg"
          variant="secondary"
          icon={<Terminal className="w-4 h-4 text-[#94A3B8]" />}
          iconPosition="left"
          onClick={() => {
            const el = document.getElementById('concept');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          System Architecture
        </Button>
      </motion.div>

      {/* 3D Centerpiece & Interactive State Controller */}
      <div className="w-full relative flex flex-col items-center">
        {/* Interactive Three.js Core */}
        <div className="relative w-full max-w-2xl">
          <HeroCore3D activeMoodColor={currentMood.color} />
        </div>

        {/* Minimal State Controller Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="mt-2 w-full max-w-xl p-2 rounded-2xl bg-[#11131A] border border-white/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col gap-3"
        >
          <div className="grid grid-cols-5 gap-1.5">
            {moodKeys.map((key) => {
              const item = MOODS[key];
              const isSelected = selectedMood === key;
              return (
                <button
                  key={key}
                  onClick={() => handleMoodSelect(key)}
                  className={`py-2 px-1.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer border flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'bg-white/[0.08] text-white border-white/[0.18] shadow-sm'
                      : 'bg-transparent text-[#94A3B8] border-transparent hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate w-full text-center text-[11px] sm:text-xs">
                    {item.label.replace(/Deep |Radiant |High /g, '')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Real-Time Shift Telemetry */}
          <div className="px-3 py-2 rounded-xl bg-[#090A0F]/60 border border-white/[0.04] flex items-center justify-between text-xs text-[#94A3B8]">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">{currentMood.label}</span>
              <span className="text-[#64748B]">·</span>
              <span className="text-[11px] text-[#64748B]">{currentMood.sublabel}</span>
            </div>
            <div className="text-[11px] text-white/80 font-mono">
              Suggested: <span className="text-white font-medium">{currentMood.shiftAction}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
