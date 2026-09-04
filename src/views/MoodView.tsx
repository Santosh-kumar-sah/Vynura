import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Compass } from 'lucide-react';
import { RouteTransition } from '../components/common/RouteTransition';
import { CloseButton } from '../components/common/CloseButton';
import { WebcamLookingGlass } from '../components/vision/WebcamLookingGlass';
import { RecommendationSection } from '../components/recommendations/RecommendationSection';
import { BreathingGuide } from '../components/wellness/BreathingGuide';
import { MeditationTimer } from '../components/wellness/MeditationTimer';
import type { MoodType } from '../types';
import type { MeditationCategoryId } from '../types/meditation';
import { MOODS } from '../components/sections/HeroSection';

interface MoodViewProps {
  activeMood: MoodType;
  confidence: number;
  onConfirmMood: (mood: MoodType, confidence: number) => void;
}

export const MoodView: React.FC<MoodViewProps> = ({
  activeMood,
  confidence,
  onConfirmMood,
}) => {
  const [activeBreathingTech, setActiveBreathingTech] = useState<'478' | 'box' | 'calm' | null>(null);
  const [isMeditationOpen, setIsMeditationOpen] = useState(false);
  const [meditationCategory, setMeditationCategory] = useState<MeditationCategoryId>('starlight');

  const currentMoodData = MOODS[activeMood];

  return (
    <RouteTransition>
      {/* Floating On-Brand X Close Button */}
      <CloseButton to="/" ariaLabel="Return to Night Sky Hub" />

      <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 space-y-12">
        {/* Dedicated Room Header */}
        <div className="border-b border-[#B8B4D9]/15 pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#FFC978] mb-2">
            <Compass className="w-4 h-4" />
            <span>Room 01 / Phase 2: Face Detection Core</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-[#F5F2ED] tracking-tight mb-3">
            Biometric Looking Glass
          </h1>
          <p className="text-sm sm:text-base text-[#B8B4D9] max-w-2xl leading-relaxed">
            Look into your camera. Vynura detects your emotional resonance in real-time using on-device neural vision. Zero video is ever uploaded or stored.
          </p>
        </div>

        {/* Phase 2: Embedded Live Webcam & Neural Expression Calibration */}
        <WebcamLookingGlass
          currentMood={activeMood}
          currentConfidence={confidence}
          onConfirmMood={onConfirmMood}
        />

        {/* Dynamic Calibrated Sky Affirmation */}
        <div
          className="w-full rounded-3xl p-6 sm:p-7 border backdrop-blur-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-5 transition-all duration-500"
          style={{
            backgroundColor: `${currentMoodData.color}10`,
            borderColor: `${currentMoodData.color}40`,
          }}
        >
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#B8B4D9] mb-1">
              Active Emotional Calibration
            </div>
            <div className="font-heading text-2xl font-bold text-[#F5F2ED] mb-1">
              {currentMoodData.label} · {currentMoodData.sublabel}
            </div>
            <p className="text-xs text-[#B8B4D9] italic font-heading max-w-xl">
              "{currentMoodData.quote}"
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-[#121029]/80 border text-xs font-mono text-[#FFC978] shadow-inner shrink-0"
               style={{ borderColor: `${currentMoodData.color}50` }}>
            Clarity: {Math.round(confidence * 100)}%
          </div>
        </div>

        {/* Phase 3 Shift Engine: Personalized Recommendations based on Calibrated Mood */}
        <RecommendationSection
          mood={activeMood}
          confidence={confidence}
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
