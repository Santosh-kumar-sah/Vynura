import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';
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
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartJourney }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-[85vh] pt-36 sm:pt-44 pb-36 sm:pb-40 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col items-center justify-center overflow-hidden">
      {/* 1. SOLID NEAR-BLACK BASE BACKGROUND */}
      <div className="absolute inset-0 bg-[#08090A] pointer-events-none -z-30" />

      {/* 2. AMBIENT CORNER LIGHTING ONLY: ONE soft radial mesh gradient blob in upper-right quadrant
          - NOT centered, NOT behind headline
          - Bleeds off the top-right edge partially like light spilling from outside the frame
          - Max 2 colors (warm amber into transparent), 120px blur radius, ~30-35% opacity */}
      <div
        className="absolute -top-32 -right-32 sm:-top-40 sm:-right-40 w-[550px] sm:w-[650px] h-[550px] sm:h-[650px] rounded-full pointer-events-none -z-20 opacity-35"
        style={{
          background: 'radial-gradient(circle at 60% 40%, rgba(245, 158, 11, 0.45) 0%, rgba(180, 83, 9, 0.12) 45%, transparent 70%)',
          filter: 'blur(120px)',
          transform: `translateY(${scrollY * 0.12}px)`,
        }}
      />

      {/* Subtle fine film-grain overlay for physical dark texture */}
      <div className="absolute inset-0 grain-overlay pointer-events-none -z-10 opacity-70" />

      {/* HERO CONTENT: ONLY EYEBROW TAG, HEADLINE, SUBTEXT, CTA ROW */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* 4. EYEBROW TAG: Small pill ONLY if single colored dot + short text
            - Background barely different (5-8% white overlay: bg-white/[0.06])
            - Border 1px at 10% opacity (border-white/10)
            - This is the ONLY pill-shaped element allowed on the page */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-normal text-white/70 mb-7"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
          <span>Vynura 2.0 · On-device vision intelligence</span>
        </motion.div>

        {/* 5. HEADLINE: Centered, max-width ~900-1000px, wraps to 2-3 lines naturally
            - Font-weight 600 (NOT 700+, NOT 900)
            - Font-size clamp(40px, 6vw, 64px)
            - Color solid white, NO gradient fill, NO accent-colored words */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="max-w-[920px] mx-auto text-center font-semibold text-[clamp(2.5rem,5.5vw,4rem)] leading-[1.08] tracking-[-0.025em] text-white text-balance"
        >
          Real-time emotional tracking powered by private on-device vision.
        </motion.h1>

        {/* 6. SUBTEXT: Centered, max-width ~600px, 18px, color gray-400 (60% white), font-weight 400
            - Margin-top 24px from headline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="max-w-[600px] mx-auto text-center text-[18px] text-white/60 font-normal leading-relaxed mt-6"
        >
          Private facial landmark analysis paired with instantaneous somatic pacing and acoustic frequency shifts.
        </motion.p>

        {/* 7. CTA ROW: Margin-top 40px, two buttons side by side with 12px gap
            - Primary: solid white, black text, 14px py / 24px px, rounded-lg (8px), arrow trailing
            - Secondary: transparent, no border, gray-400 text, icon leading, hover text to white only (no background) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex items-center justify-center gap-3 mt-10"
        >
          <button
            onClick={() => {
              if (onStartJourney) onStartJourney();
            }}
            className="inline-flex items-center justify-center py-3.5 px-6 rounded-lg bg-white text-[#08090A] font-medium text-sm tracking-tight hover:bg-neutral-100 transition-all duration-150 cursor-pointer active:scale-[0.97]"
          >
            <span>Start Calibration</span>
            <ArrowRight className="w-4 h-4 ml-1.5 shrink-0" />
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('concept');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center justify-center py-3.5 px-4 bg-transparent border-none text-white/60 hover:text-white transition-colors duration-150 text-sm font-normal cursor-pointer"
          >
            <Terminal className="w-4 h-4 mr-1.5 shrink-0" />
            <span>Architecture</span>
          </button>
        </motion.div>
      </div>

      {/* 8. Vertical empty space: 140px+ before next section (enforced by pb-36 sm:pb-40, no footer/status widgets inside hero) */}
    </section>
  );
};
