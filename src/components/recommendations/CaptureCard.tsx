import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, BookmarkCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { MoodType } from '../../types';
import type { RecommendationEngineOutput } from '../../types/recommendations';
import { saveMoodEntry } from '../../lib/supabase';
import { MOODS } from '../sections/HeroSection';

interface CaptureCardProps {
  mood: MoodType;
  confidence: number;
  prescription: RecommendationEngineOutput;
  onCaptured?: (savedText?: string) => void;
}

export const CaptureCard: React.FC<CaptureCardProps> = ({
  mood,
  confidence,
  prescription,
  onCaptured,
}) => {
  const [reflectionText, setReflectionText] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const moodInfo = MOODS[mood] || MOODS.neutral;
  const maxChars = 150;

  const handleFreeze = async () => {
    if (isSubmitting || isSaved) return;
    setIsSubmitting(true);

    try {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#FFC978', '#78FFD6', '#FFF2D6', '#FFAE68'],
      });
    } catch {
      // ignore
    }

    const trimmed = reflectionText.trim();
    await saveMoodEntry({
      mood_category: mood,
      confidence_score: confidence,
      journal_text: trimmed || 'A golden moment preserved in the night sky.',
      metadata: {
        capture_type: 'freeze',
        mode: prescription.mode,
        tier: prescription.tier,
        valence: prescription.valence,
        arousal: prescription.arousal,
      },
    });

    setIsSaved(true);
    setIsSubmitting(false);

    if (onCaptured) {
      onCaptured(trimmed);
    }
  };

  const handleSkip = async () => {
    if (isSubmitting || isSaved) return;
    setIsSubmitting(true);

    await saveMoodEntry({
      mood_category: mood,
      confidence_score: confidence,
      journal_text: undefined,
      metadata: {
        mode: prescription.mode,
        tier: prescription.tier,
        valence: prescription.valence,
        arousal: prescription.arousal,
      },
    });

    setIsSaved(true);
    setIsSubmitting(false);

    if (onCaptured) {
      onCaptured(undefined);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl p-6 sm:p-8 bg-[#121316] border border-white/[0.08] space-y-6 relative overflow-hidden"
    >
      {/* Header Pill & Mode Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono uppercase bg-white/[0.04] border border-white/[0.08] text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 stroke-[1.5]" />
            <span>Optimal Equilibrium State</span>
          </span>

          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-neutral-400 bg-white/[0.02] border border-white/[0.06]">
            {prescription.mode.toUpperCase()} · HIGH TIER
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Zero Intervention Required</span>
        </div>
      </div>

      {/* Prompt Headline */}
      <div className="space-y-1.5 relative z-10">
        <h3 className="text-xl sm:text-2xl font-medium text-white tracking-tight">
          What is supporting this equilibrium?
        </h3>
        <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl">
          Your system is in high coherence ({moodInfo.label} at {Math.round(confidence * 100)}% clarity).
          No regulation exercise is required right now — simply record the present state.
        </p>
      </div>

      {/* Interactive Input or Saved State */}
      <AnimatePresence mode="wait">
        {isSaved ? (
          <motion.div
            key="saved-confirmation"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-white"
          >
            <div className="flex items-center gap-3">
              <BookmarkCheck className="w-5 h-5 text-emerald-400 stroke-[1.5] shrink-0" />
              <div>
                <div className="text-sm font-medium text-white">
                  State recorded in local archive
                </div>
                {reflectionText.trim() && (
                  <p className="text-xs text-neutral-300 mt-0.5">
                    "{reflectionText.trim()}"
                  </p>
                )}
                <p className="text-[11px] text-neutral-500">
                  Stored on-device in local telemetry index.
                </p>
              </div>
            </div>

            <div className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-neutral-300">
              Preserved
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="input-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3 relative z-10"
          >
            <div className="relative">
              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value.slice(0, maxChars))}
                placeholder="Log a quick reflection, trigger, or sensation..."
                rows={3}
                maxLength={maxChars}
                className="w-full rounded-xl p-3.5 bg-[#18191c] border border-white/[0.08] focus:border-amber-400/60 focus:outline-none text-xs text-white placeholder:text-neutral-500 resize-none font-sans transition-colors"
              />

              <div className="absolute bottom-3 right-3 text-[11px] font-mono text-neutral-500">
                {reflectionText.length}/{maxChars}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <button
                onClick={handleSkip}
                disabled={isSubmitting}
                className="text-xs text-neutral-400 hover:text-white transition-colors py-2 px-3 cursor-pointer"
              >
                Skip note · Just save telemetry
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleFreeze}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-5 py-2 rounded-lg bg-white hover:bg-neutral-200 text-neutral-950 font-medium text-xs tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>{isSubmitting ? 'Saving...' : 'Save Check-in'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
