import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, Compass } from 'lucide-react';
import { RouteTransition } from '../components/common/RouteTransition';
import { CloseButton } from '../components/common/CloseButton';
import { RecommendationSection } from '../components/recommendations/RecommendationSection';
import { FaceDetectionModal } from '../components/vision/FaceDetectionModal';
import { BreathingGuide } from '../components/wellness/BreathingGuide';
import { MeditationTimer } from '../components/wellness/MeditationTimer';
import { Button } from '../components/common/Button';
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
  const [isFaceDetectionOpen, setIsFaceDetectionOpen] = useState(false);
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#B8B4D9]/15 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#FFC978] mb-2">
              <Compass className="w-4 h-4" />
              <span>Room 01 / Mood Detection & Shift Engine</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl font-bold text-[#F5F2ED] tracking-tight mb-3">
              Biometric Looking Glass
            </h1>
            <p className="text-sm sm:text-base text-[#B8B4D9] max-w-2xl leading-relaxed">
              Real-time facial expression analysis running 100% in your browser memory. Calibrate your emotional resonance to discover targeted sensory shifts.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              size="md"
              variant="primary"
              icon={<Camera className="w-4 h-4" />}
              onClick={() => setIsFaceDetectionOpen(true)}
              className="shadow-glow-md"
            >
              Scan Facial Resonance
            </Button>
          </div>
        </div>

        {/* Dynamic Atmospheric Pool */}
        <div
          className="w-full rounded-3xl p-6 sm:p-8 border backdrop-blur-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{
            backgroundColor: `${currentMoodData.color}10`,
            borderColor: `${currentMoodData.color}40`,
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center border text-xl"
              style={{
                backgroundColor: `${currentMoodData.color}25`,
                borderColor: `${currentMoodData.color}60`,
                color: currentMoodData.color,
              }}
            >
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#B8B4D9]">
                Current Emotional Sky
              </div>
              <div className="font-heading text-2xl font-bold text-[#F5F2ED]">
                {currentMoodData.label}
              </div>
              <div className="text-xs text-[#B8B4D9]">
                Resonance calibrated at {Math.round(confidence * 100)}% clarity
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsFaceDetectionOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#1A1836]/80 hover:bg-[#2D2A5C] border text-xs font-semibold text-[#F5F2ED] transition-colors cursor-pointer"
            style={{ borderColor: `${currentMoodData.color}50` }}
          >
            Recalibrate Looking Glass ✦
          </button>
        </div>

        {/* Shift Engine / Recommendations */}
        <RecommendationSection
          mood={activeMood}
          confidence={confidence}
          onOpenFaceDetection={() => setIsFaceDetectionOpen(true)}
          onLaunchBreathing={(tech) => setActiveBreathingTech(tech)}
          onLaunchMeditation={(cat) => {
            if (cat) setMeditationCategory(cat);
            setIsMeditationOpen(true);
          }}
        />
      </div>

      {/* Face Detection Modal */}
      <FaceDetectionModal
        isOpen={isFaceDetectionOpen}
        onClose={() => setIsFaceDetectionOpen(false)}
        onConfirmMood={onConfirmMood}
      />

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
