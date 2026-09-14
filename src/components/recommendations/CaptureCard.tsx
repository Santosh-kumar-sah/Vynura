import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Star, BookmarkCheck } from 'lucide-react';
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
  const [savedType, setSavedType] = useState<'freeze' | 'skipped' | null>(null);
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
    setSavedType('freeze');
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
    setSavedType('skipped');
    setIsSubmitting(false);

    if (onCaptured) {
      onCaptured(undefined);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className="relative rounded-3xl p-6 sm:p-8 overflow-hidden border border-[#FFC978]/40 shadow-[0_15px_50px_rgba(255,201,120,0.18)] backdrop-blur-2xl space-y-6"
      style={{
        background:
          'linear-gradient(135deg, rgba(36, 33, 74, 0.95) 0%, rgba(26, 24, 54, 0.98) 50%, rgba(18, 16, 41, 0.95) 100%)',
      }}
    >
      {/* Ambient Starlight Radial Glow */}
      <div
        className="absolute top-0 right-1/4 w-80 h-80 rounded-full blur-[110px] pointer-events-none -z-10 opacity-30"
        style={{ backgroundColor: moodInfo.color }}
      />

      {/* Header Pill & Mode Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#FFC978]/20 border border-[#FFC978]/50 text-[#FFC978] flex items-center gap-1.5 shadow-glow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC978]" />
            <span>High Resonance Calibration · Freeze Flow</span>
          </span>

          <span
            className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border flex items-center gap-1"
            style={{
              backgroundColor: `${prescription.accentColor}18`,
              borderColor: `${prescription.accentColor}40`,
              color: prescription.accentColor,
            }}
          >
            <span>{prescription.mode.toUpperCase()}</span>
            <span className="opacity-60">•</span>
            <span>HIGH TIER</span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs font-mono text-[#B8B4D9]">
          <Star className="w-3.5 h-3.5 text-[#FFC978] fill-current" />
          <span>Optimal State: Zero Intervention Needed</span>
        </div>
      </div>

      {/* Prompt Headline */}
      <div className="space-y-2 relative z-10">
        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#F5F2ED] tracking-tight">
          What's making this moment shine?
        </h3>
        <p className="text-sm text-[#B8B4D9] leading-relaxed max-w-2xl">
          Your resonance is in radiant alignment ({moodInfo.label} at {Math.round(confidence * 100)}% clarity). 
          No shift or exercise needed right now — simply anchor this feeling.
        </p>
      </div>

      {/* Interactive Input or Saved State */}
      <AnimatePresence mode="wait">
        {isSaved ? (
          <motion.div
            key="saved-confirmation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className="p-5 rounded-2xl bg-[#121029]/80 border border-[#78FFD6]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#F5F2ED]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#78FFD6]/15 border border-[#78FFD6]/40 flex items-center justify-center text-[#78FFD6] shrink-0">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#78FFD6]">
                  {savedType === 'freeze'
                    ? '✨ Moment Frozen in Your Constellation!'
                    : '✦ Starlight Resonance Recorded'}
                </div>
                {reflectionText.trim() && (
                  <p className="text-xs text-[#FFF2D6] italic mt-0.5">
                    "{reflectionText.trim()}"
                  </p>
                )}
                <p className="text-[11px] text-[#B8B4D9]">
                  Saved to your personal starlight memory.
                </p>
              </div>
            </div>

            <div className="px-4 py-1.5 rounded-xl bg-[#24214A] border border-[#B8B4D9]/20 text-xs font-mono text-[#FFC978]">
              Saved to Constellation
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
                placeholder="A warm conversation, feeling centered, sunlight through the window, finished a big milestone..."
                rows={3}
                maxLength={maxChars}
                className="w-full rounded-2xl p-4 bg-[#121029]/85 border border-[#B8B4D9]/25 focus:border-[#FFC978]/70 focus:outline-none focus:ring-1 focus:ring-[#FFC978]/50 text-sm text-[#F5F2ED] placeholder:text-[#B8B4D9]/40 resize-none font-body transition-all"
              />

              <div className="absolute bottom-3 right-3 text-[11px] font-mono text-[#B8B4D9]/60">
                {reflectionText.length}/{maxChars}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <button
                onClick={handleSkip}
                disabled={isSubmitting}
                className="text-xs text-[#B8B4D9] hover:text-[#F5F2ED] transition-colors py-2 px-3 cursor-pointer"
              >
                Skip note · Just save resonance
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleFreeze}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FFC978] to-[#FFAE68] hover:from-[#FFD88A] hover:to-[#FFBF78] text-[#1A1836] font-bold text-xs tracking-wide transition-all shadow-[0_4px_20px_rgba(255,201,120,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>{isSubmitting ? 'Freezing...' : 'Freeze it ✨'}</span>
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
