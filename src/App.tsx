import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { StarfieldBackdrop } from './components/background/StarfieldBackdrop';
import { FireflyCanvas } from './components/background/FireflyCanvas';
import { ShootingStar } from './components/background/ShootingStar';
import { Navbar } from './components/common/Navbar';
import { HeroSection, MOODS } from './components/sections/HeroSection';
import { RecommendationSection } from './components/recommendations/RecommendationSection';
import { ConstellationHub } from './components/constellation/ConstellationHub';
import { WellnessActionsHub } from './components/wellness/WellnessActionsHub';
import { GamificationSection } from './components/gamification/GamificationSection';
import { BreathingGuide } from './components/wellness/BreathingGuide';
import { MeditationTimer } from './components/wellness/MeditationTimer';
import { ConceptSection } from './components/sections/ConceptSection';
import { FeaturesSection } from './components/sections/FeaturesSection';
import { PrivacySection } from './components/sections/PrivacySection';
import { Footer } from './components/sections/Footer';
import { FaceDetectionModal } from './components/vision/FaceDetectionModal';
import type { MoodType } from './types';

export const App: React.FC = () => {
  const [isFaceDetectionOpen, setIsFaceDetectionOpen] = useState(false);
  const [activeMood, setActiveMood] = useState<MoodType>('happy');
  const [activeConfidence, setActiveConfidence] = useState<number>(0.94);
  const [confirmationToast, setConfirmationToast] = useState<{
    mood: MoodType;
    confidence: number;
  } | null>(null);

  // Quick Action Modal states triggered from recommendations
  const [activeBreathingTech, setActiveBreathingTech] = useState<'478' | 'box' | 'calm' | null>(null);
  const [isMeditationOpen, setIsMeditationOpen] = useState(false);

  const handleConfirmMood = (mood: MoodType, confidence: number) => {
    setActiveMood(mood);
    setActiveConfidence(confidence);
    setConfirmationToast({ mood, confidence });

    // Smoothly shift sky accent tint
    const moodColor = MOODS[mood].color;
    document.documentElement.style.setProperty('--accent-glow', moodColor);

    // Auto-scroll to recommendation engine
    setTimeout(() => {
      const el = document.getElementById('recommendations');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 400);

    // Auto-dismiss confirmation banner after 4.5s
    setTimeout(() => {
      setConfirmationToast(null);
    }, 4500);
  };

  const currentMoodData = MOODS[activeMood];

  return (
    <div
      className="relative min-h-screen bg-[#1A1836] text-[#F5F2ED] selection:bg-[#FFC978]/30 selection:text-[#FFF2D6] overflow-x-hidden font-body transition-colors duration-700"
      style={{
        backgroundColor: '#1A1836',
      }}
    >
      {/* Dynamic Sky Atmospheric Tint Filter */}
      <div
        className="fixed inset-0 pointer-events-none transition-colors duration-700 z-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse at 50% 15%, ${currentMoodData.color} 0%, transparent 70%)`,
        }}
      />

      {/* 1. Starfield Layer (Stars, Twinkles & Ambient Horizon) */}
      <StarfieldBackdrop />

      {/* 2. Signature Firefly Particle System with Cursor Parallax */}
      <FireflyCanvas />

      {/* 3. Signature Load-In & Ambient Shooting Star Streaks */}
      <ShootingStar />

      {/* 4. Top Navigation Bar */}
      <Navbar onOpenFaceDetection={() => setIsFaceDetectionOpen(true)} />

      {/* Real-time Mood Shift Notification Toast */}
      <AnimatePresence>
        {confirmationToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-40 px-5 py-3 rounded-2xl bg-[#1A1836]/95 border shadow-[0_15px_40px_rgba(10,8,28,0.9)] backdrop-blur-xl flex items-center gap-3 text-sm text-[#F5F2ED]"
            style={{
              borderColor: MOODS[confirmationToast.mood].color,
              boxShadow: `0 0 25px -4px ${MOODS[confirmationToast.mood].color}50`,
            }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: `${MOODS[confirmationToast.mood].color}25`,
                borderColor: `${MOODS[confirmationToast.mood].color}60`,
                color: MOODS[confirmationToast.mood].color,
              }}
            >
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <span style={{ color: MOODS[confirmationToast.mood].color }}>
                  Resonance Calibrated: {MOODS[confirmationToast.mood].label}
                </span>
                <span className="text-[10px] text-[#B8B4D9]">
                  ({Math.round(confirmationToast.confidence * 100)}% Confidence)
                </span>
              </div>
              <p className="text-[11px] text-[#B8B4D9] italic">
                Sky shifted to {MOODS[confirmationToast.mood].sublabel} harmonic spectrum.
              </p>
            </div>
            <Sparkles
              className="w-4 h-4 animate-spin"
              style={{ color: MOODS[confirmationToast.mood].color, animationDuration: '6s' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Main Content Assembly */}
      <main className="relative z-10">
        <HeroSection
          activeMood={activeMood}
          onSelectMood={(mood) => handleConfirmMood(mood, 0.95)}
          onStartJourney={() => setIsFaceDetectionOpen(true)}
        />

        {/* Phase 3 & 6: Mood → Smart Shift Recommendation Engine & Spotify Stream */}
        <RecommendationSection
          mood={activeMood}
          confidence={activeConfidence}
          onOpenFaceDetection={() => setIsFaceDetectionOpen(true)}
          onLaunchBreathing={(tech) => setActiveBreathingTech(tech)}
          onLaunchMeditation={() => setIsMeditationOpen(true)}
        />

        {/* Phase 4: Mood Journal + Living Constellation Analytics */}
        <ConstellationHub
          activeMood={activeMood}
          onOpenFaceDetection={() => setIsFaceDetectionOpen(true)}
        />

        {/* Phase 5: Somatic & Mindful Wellness Actions Sanctuary */}
        <WellnessActionsHub />

        {/* Phase 6: Gamification Layer & Weekly Wellness Score */}
        <GamificationSection />

        <ConceptSection />
        <FeaturesSection />
        <PrivacySection />
      </main>

      {/* 6. Celestial Footer */}
      <Footer />

      {/* 7. Face Detection & Calibration Modal (Phase 2 Core) */}
      <FaceDetectionModal
        isOpen={isFaceDetectionOpen}
        onClose={() => setIsFaceDetectionOpen(false)}
        onConfirmMood={handleConfirmMood}
      />

      {/* 8. Full Screen Breathing Guide */}
      <AnimatePresence>
        {activeBreathingTech && (
          <BreathingGuide
            isOpen={Boolean(activeBreathingTech)}
            technique={activeBreathingTech}
            onClose={() => setActiveBreathingTech(null)}
          />
        )}
      </AnimatePresence>

      {/* 9. Starlight Meditation Timer */}
      <AnimatePresence>
        {isMeditationOpen && (
          <MeditationTimer
            isOpen={isMeditationOpen}
            onClose={() => setIsMeditationOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
