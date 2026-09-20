import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RouteTransition } from '../components/common/RouteTransition';
import { CloseButton } from '../components/common/CloseButton';
import { WebcamLookingGlass } from '../components/vision/WebcamLookingGlass';
import { RecommendationSection } from '../components/recommendations/RecommendationSection';
import { BreathingGuide } from '../components/wellness/BreathingGuide';
import { MeditationTimer } from '../components/wellness/MeditationTimer';
import { AnimatedNumber } from '../components/common/AnimatedNumber';
import type { MoodType } from '../types';
import type { MeditationCategoryId } from '../types/meditation';
import type { RawExpressions } from '../utils/expressionMapper';
import { getBlendLabel } from '../utils/valenceArousal';
import { MOODS } from '../components/sections/HeroSection';

interface MoodViewProps {
  activeMood: MoodType;
  confidence: number;
  rawExpressions?: RawExpressions | null;
  onConfirmMood: (
    mood: MoodType,
    confidence: number,
    rawExpressions?: RawExpressions | null
  ) => void;
}

export const MoodView: React.FC<MoodViewProps> = ({
  activeMood,
  confidence,
  rawExpressions,
  onConfirmMood,
}) => {
  const [activeBreathingTech, setActiveBreathingTech] = useState<'478' | 'box' | 'calm' | null>(null);
  const [isMeditationOpen, setIsMeditationOpen] = useState(false);
  const [meditationCategory, setMeditationCategory] = useState<MeditationCategoryId>('starlight');

  const currentMoodData = MOODS[activeMood] || MOODS.calm;
  const blendInfo = rawExpressions ? getBlendLabel(rawExpressions) : null;

  return (
    <RouteTransition>
      {/* Minimal Monochrome Close Button */}
      <CloseButton to="/" ariaLabel="Return to Overview" />

      <div className="relative min-h-screen pt-24 pb-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 space-y-12">
        {/* Clean Editorial Header */}
        <div className="border-b border-white/[0.06] pb-8">
          <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/50 mb-2">
            01 / REAL-TIME INGESTION
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-2">
            Biometric Looking Glass.
          </h1>
          <p className="text-sm text-white/70 max-w-2xl leading-relaxed">
            Continuously evaluates facial geometry using client-side neural inference. Video frames exist solely in volatile GPU memory and are immediately purged.
          </p>
        </div>

        {/* Phase 2: Embedded Live Webcam & Neural Expression Calibration */}
        <WebcamLookingGlass
          currentMood={activeMood}
          currentConfidence={confidence}
          onConfirmMood={onConfirmMood}
        />

        {/* Dynamic Calibrated State Status (Linear Surface Panel) */}
        <div className="w-full rounded-2xl p-6 sm:p-7 bg-[#121316] border border-white/[0.08] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-white/50">
                Calibrated State
              </span>
              {blendInfo?.isBlend && (
                <span className="text-[10px] font-mono text-white/50">
                  · Composite Harmonic
                </span>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeMood}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-2xl font-semibold text-white tracking-tight"
              >
                {blendInfo?.isBlend
                  ? blendInfo.blendLabel
                  : `${currentMoodData.label} — ${currentMoodData.sublabel}`}
              </motion.div>
            </AnimatePresence>

            <p className="text-xs text-white/60 mt-1 max-w-xl">
              {currentMoodData.shiftAction}
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-white/80 shrink-0">
            <span>Confidence: </span>
            <AnimatedNumber
              value={Math.round(confidence * 100)}
              className="font-semibold text-white"
            />
            <span>%</span>
          </div>
        </div>

        {/* Shift Engine: Targeted Recommendations */}
        <RecommendationSection
          mood={activeMood}
          confidence={confidence}
          rawExpressions={rawExpressions}
          onOpenFaceDetection={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onLaunchBreathing={(tech) => setActiveBreathingTech(tech)}
          onLaunchMeditation={(cat) => {
            if (cat) setMeditationCategory(cat);
            setIsMeditationOpen(true);
          }}
        />
      </div>

      {/* Breathing Guide Modal */}
      <AnimatePresence>
        {activeBreathingTech && (
          <BreathingGuide
            isOpen={Boolean(activeBreathingTech)}
            technique={activeBreathingTech}
            onClose={() => setActiveBreathingTech(null)}
          />
        )}
      </AnimatePresence>

      {/* Meditation Fullscreen Sanctuary */}
      <AnimatePresence>
        {isMeditationOpen && (
          <MeditationTimer
            isOpen={isMeditationOpen}
            initialCategory={meditationCategory}
            onClose={() => setIsMeditationOpen(false)}
          />
        )}
      </AnimatePresence>
    </RouteTransition>
  );
};
