import React, { useState } from 'react';
import { Orbit } from 'lucide-react';
import { RouteTransition } from '../components/common/RouteTransition';
import { CloseButton } from '../components/common/CloseButton';
import { ConstellationHub } from '../components/constellation/ConstellationHub';
import { GamificationSection } from '../components/gamification/GamificationSection';
import { FaceDetectionModal } from '../components/vision/FaceDetectionModal';
import type { MoodType } from '../types';

interface ConstellationViewProps {
  activeMood: MoodType;
  onConfirmMood: (mood: MoodType, confidence: number) => void;
}

export const ConstellationView: React.FC<ConstellationViewProps> = ({
  activeMood,
  onConfirmMood,
}) => {
  const [isFaceDetectionOpen, setIsFaceDetectionOpen] = useState(false);

  return (
    <RouteTransition>
      {/* Floating On-Brand X Close Button */}
      <CloseButton to="/" ariaLabel="Return to Night Sky Hub" />

      <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 space-y-12">
        {/* Dedicated Room Header */}
        <div className="border-b border-[#B8B4D9]/15 pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#6FBFC4] mb-2">
            <Orbit className="w-4 h-4" />
            <span>Room 02 / Astral History & Pattern Insights</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-[#F5F2ED] tracking-tight mb-3">
            Constellation Mood Map
          </h1>
          <p className="text-sm sm:text-base text-[#B8B4D9] max-w-2xl leading-relaxed">
            Your emotional journey mapped as interconnected stellar nodes across the night sky. Explore your longitudinal resonance patterns and celestial streaks.
          </p>
        </div>

        {/* Living Constellation Map & Pattern Insights */}
        <ConstellationHub
          activeMood={activeMood}
          onOpenFaceDetection={() => setIsFaceDetectionOpen(true)}
        />

        {/* Star Milestones & Gamification */}
        <GamificationSection />
      </div>

      <FaceDetectionModal
        isOpen={isFaceDetectionOpen}
        onClose={() => setIsFaceDetectionOpen(false)}
        onConfirmMood={onConfirmMood}
      />
    </RouteTransition>
  );
};
