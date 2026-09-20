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
    color: '#818CF8',
    gradient: 'from-indigo-500/10 to-transparent',
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
    <section className="relative min-h-[88vh] pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col justify-center overflow-hidden">
      {/* LAYER 1: Deep Near-Black Base Canvas */}
      <div className="absolute inset-0 bg-[#0B0A10] pointer-events-none -z-30" />

      {/* Subtle Warm Amber Atmospheric Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none -z-25 opacity-60">
        <div className="absolute -top-24 right-0 w-[600px] h-[500px] bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-[100px]" />
      </div>

      {/* LAYER 2: Asymmetric 4-7-8 Breathing Light Source (Ambient Room Light, Parallax Drift) */}
      <div
        className="absolute -top-10 -right-16 sm:right-2 md:right-8 w-[520px] sm:w-[620px] md:w-[700px] h-[520px] sm:h-[620px] md:h-[700px] pointer-events-none -z-20 transition-transform duration-100 ease-out opacity-80"
        style={{
          transform: `translateY(${scrollY * 0.18}px)`,
        }}
      >
        <HeroCore3D activeMoodColor="#F59E0B" />
      </div>

      {/* LAYER 3: Directional Scrim Buffer & Fine Film-Grain Noise */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0A10] via-[#0B0A10]/80 to-transparent pointer-events-none -z-10" />
      <div className="absolute inset-0 grain-overlay pointer-events-none -z-10 opacity-70" />

      {/* LAYER 4: Content Layer (Crisp, High Contrast, Fully Readable) */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Top Meta Label — Letter-spaced uppercase with warm accent dot */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.16em] text-white/60 mb-6 flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
          <span>4-7-8 Somatic Engine · Client-Side Vision</span>
        </motion.div>

        {/* Headline — Solid #FFFFFF, 56-72px, weight 600, tight tracking -2.5%, line-height 1.07 */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="font-heading font-semibold text-4xl sm:text-6xl lg:text-7xl tracking-[-0.025em] text-white max-w-4xl leading-[1.07] mb-5 text-balance"
        >
          Real-time emotional tracking powered by on-device vision.
        </motion.h1>

        {/* Subtext Below Headline — 70% opacity, weight 400, strictly one sentence */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-base sm:text-lg text-white/70 max-w-xl leading-relaxed mb-10 font-normal"
        >
          Private facial landmark analysis paired with instantaneous somatic pacing and acoustic frequency shifts.
        </motion.p>

        {/* Primary & Secondary CTAs */}
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
            variant="ghost"
            icon={<Terminal className="w-4 h-4 text-white/60" />}
            iconPosition="left"
            onClick={() => {
              const el = document.getElementById('concept');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            System Architecture
          </Button>
        </motion.div>

        {/* Unboxed State Selector — Sits directly on canvas with hairline divider */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full max-w-xl pt-6 border-t border-white/[0.08]"
        >
          <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 mb-3">
            {moodKeys.map((key) => {
              const item = MOODS[key];
              const isSelected = selectedMood === key;
              return (
                <button
                  key={key}
                  onClick={() => handleMoodSelect(key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs transition-all duration-150 cursor-pointer border flex items-center gap-2 ${
                    isSelected
                      ? 'bg-white/[0.08] text-white font-medium border-white/20'
                      : 'bg-transparent text-white/60 border-transparent hover:text-white hover:bg-white/[0.03]'
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

          {/* Supporting Microcopy */}
          <div className="text-xs text-white/60 flex items-center justify-center gap-2">
            <span className="text-white font-medium">{currentMood.label}:</span>
            <span className="text-[#F59E0B] font-mono text-[11px]">{currentMood.shiftAction}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
