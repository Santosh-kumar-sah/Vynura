import React, { useState, useEffect } from 'react';
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
    quote: 'Baseline parasympathetic tone.',
    shiftAction: '4-7-8 Coherent Breath Pacing',
    soundscape: 'Binaural 432Hz Drift',
  },
  happy: {
    id: 'happy',
    label: 'Radiant Joy',
    sublabel: 'Dopaminergic Tone',
    kanji: '',
    color: '#F59E0B',
    gradient: 'from-amber-500/10 to-transparent',
    quote: 'Elevated creative momentum.',
    shiftAction: 'Momentum Anchor + Quick Journal',
    soundscape: 'Warm Resonant Acoustics',
  },
  energetic: {
    id: 'energetic',
    label: 'High Focus',
    sublabel: 'Sympathetic Drive',
    kanji: '',
    color: '#A855F7',
    gradient: 'from-purple-500/10 to-transparent',
    quote: 'High sympathetic drive.',
    shiftAction: '25-Minute Execution Sprint',
    soundscape: 'High-Tempo Neuro Synth',
  },
  neutral: {
    id: 'neutral',
    label: 'Equilibrium',
    sublabel: 'Homeostatic Baseline',
    kanji: '',
    color: '#94A3B8',
    gradient: 'from-slate-500/10 to-transparent',
    quote: 'Balanced baseline state.',
    shiftAction: 'Cognitive Grounding Scan',
    soundscape: 'Ambient White Noise',
  },
  sad: {
    id: 'sad',
    label: 'Low Valence',
    sublabel: 'Down-Regulation',
    kanji: '',
    color: '#64748B',
    gradient: 'from-slate-600/10 to-transparent',
    quote: 'Energy conservation state.',
    shiftAction: 'Physiological Sigh + Rest',
    soundscape: 'Slow Piano Ambient',
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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMoodSelect = (mKey: MoodType) => {
    setInternalMood(mKey);
    if (onSelectMood) onSelectMood(mKey);
  };

  const moodKeys: MoodType[] = ['calm', 'happy', 'energetic', 'neutral', 'sad'];

  return (
    <section className="relative min-h-[85vh] pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col justify-center overflow-hidden">
      {/* LAYER 1: Dark Base Ambient Layer */}
      <div className="absolute inset-0 bg-[#090A0F] pointer-events-none -z-30" />

      {/* LAYER 2: Asymmetric Breathing Light Source (Offset to upper-right, parallax drift, soft ember intensity) */}
      <div
        className="absolute -top-12 -right-12 sm:right-0 md:right-4 w-[460px] sm:w-[560px] md:w-[620px] h-[460px] sm:h-[560px] md:h-[620px] pointer-events-none -z-20 transition-transform duration-100 ease-out opacity-60"
        style={{
          transform: `translateY(${scrollY * 0.22}px)`,
        }}
      >
        <HeroCore3D activeMoodColor={currentMood.color} />
      </div>

      {/* LAYER 3: Dark Protective Scrim Buffer (Guarantees WCAG AA contrast over text) + Fine Film-Grain Noise */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#090A0F] via-[#090A0F]/90 to-transparent pointer-events-none -z-10" />
      <div className="absolute inset-0 grain-overlay pointer-events-none -z-10" />

      {/* LAYER 4: Content Layer (Crisp, High Contrast, Fully Readable) */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Top Meta Label */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-[11px] font-mono uppercase tracking-widest text-[#94A3B8] mb-6 flex items-center gap-2"
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: currentMood.color }}
          />
          <span>4-7-8 Breathing Light Core · Local Neural Vision</span>
        </motion.div>

        {/* Headline — 8 words, strong & benefit-driven */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.08] mb-5 text-balance"
        >
          Real-time emotional tracking powered by local vision intelligence.
        </motion.h1>

        {/* Single Sentence Subline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-base sm:text-lg text-[#94A3B8] max-w-xl leading-relaxed mb-8 font-normal"
        >
          Private on-device facial landmark analysis paired with instantaneous somatic and acoustic regulation.
        </motion.p>

        {/* Primary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex items-center justify-center gap-3.5 mb-16"
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
            Architecture
          </Button>
        </motion.div>

        {/* Unboxed State Selector — Sits directly on canvas with hairline separator */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full max-w-xl pt-6 border-t border-white/[0.08]"
        >
          <div className="flex items-center justify-center gap-1 sm:gap-2 mb-3">
            {moodKeys.map((key) => {
              const item = MOODS[key];
              const isSelected = selectedMood === key;
              return (
                <button
                  key={key}
                  onClick={() => handleMoodSelect(key)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer border-none flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white/10 text-white font-medium'
                      : 'bg-transparent text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      isSelected ? 'scale-125' : 'opacity-60'
                    }`}
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Supporting microcopy: Exactly one line */}
          <div className="text-xs text-[#94A3B8] flex items-center justify-center gap-2">
            <span className="text-white font-medium">{currentMood.label}:</span>
            <span>{currentMood.shiftAction}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
