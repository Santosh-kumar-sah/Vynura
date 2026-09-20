import React, { useState } from 'react';
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

      <div className="relative min-h-screen pt-24 pb-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 space-y-12">
        {/* Clean Editorial Header */}
        <div className="border-b border-white/[0.06] pb-8">
          <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/50 mb-2">
            03 / LONGITUDINAL TRAJECTORY
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-2">
            Constellation Pattern Map.
          </h1>
          <p className="text-sm text-white/70 max-w-2xl leading-relaxed">
            Your emotional trajectory mapped as continuous nodal checkpoints. Analyze valence consistency and autonomic recovery patterns over time.
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
