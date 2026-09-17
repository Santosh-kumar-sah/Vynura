import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { StarfieldBackdrop } from './components/background/StarfieldBackdrop';
import { FireflyCanvas } from './components/background/FireflyCanvas';
import { ShootingStar } from './components/background/ShootingStar';
import { Navbar } from './components/common/Navbar';
import { HomeView } from './views/HomeView';
import { MoodView } from './views/MoodView';
import { JournalView } from './views/JournalView';
import { ConstellationView } from './views/ConstellationView';
import { WellnessView } from './views/WellnessView';
import { BreathingView } from './views/BreathingView';
import { MeditationView } from './views/MeditationView';
import { FaceDetectionModal } from './components/vision/FaceDetectionModal';
import { MonthlyRecapModal } from './components/gamification/MonthlyRecapModal';
import { checkShouldShowMonthlyRecap, generateMonthlyRecap } from './utils/monthlyRecap';
import { checkAndScheduleEveningNudge } from './utils/notificationManager';
import type { MonthlyRecapData } from './types/recap';
import { MOODS } from './components/sections/HeroSection';
import type { MoodType } from './types';
import type { RawExpressions } from './utils/expressionMapper';

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFaceDetectionOpen, setIsFaceDetectionOpen] = useState(false);
  const [activeMood, setActiveMood] = useState<MoodType>('happy');
  const [activeConfidence, setActiveConfidence] = useState<number>(0.94);
  const [activeRawExpressions, setActiveRawExpressions] = useState<RawExpressions | null>(null);
  const [confirmationToast, setConfirmationToast] = useState<{
    mood: MoodType;
    confidence: number;
  } | null>(null);
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);
  const [recapData, setRecapData] = useState<MonthlyRecapData | null>(null);
  const [recapPromptAvailable, setRecapPromptAvailable] = useState<boolean>(false);

  // Check if new monthly recap is available & schedule evening nudge on mount
  React.useEffect(() => {
    let isMounted = true;
    checkShouldShowMonthlyRecap().then(async ({ shouldShow }) => {
      if (isMounted && shouldShow) {
        const data = await generateMonthlyRecap();
        if (isMounted && data.totalPositiveMoments > 0) {
          setRecapData(data);
          setRecapPromptAvailable(true);
        }
      }
    });

    // Check & schedule passive evening re-engagement nudge
    checkAndScheduleEveningNudge();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleConfirmMood = (
    mood: MoodType,
    confidence: number,
    rawExpressions?: RawExpressions | null
  ) => {
    setActiveMood(mood);
    setActiveConfidence(confidence);
    setActiveRawExpressions(rawExpressions || null);
    setConfirmationToast({ mood, confidence });

    // Smoothly shift sky accent tint
    const moodColor = MOODS[mood].color;
    document.documentElement.style.setProperty('--accent-glow', moodColor);

    // If currently on HomeView, navigate to MoodView so the user sees their recommendations
    if (location.pathname === '/') {
      navigate('/mood');
    }

    // Scroll to recommendations
    setTimeout(() => {
      const recElem = document.getElementById('recommendations');
      if (recElem) {
        recElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 450);

    // Auto-dismiss confirmation banner after 5s
    setTimeout(() => {
      setConfirmationToast(null);
    }, 5000);
  };

  const currentMoodData = MOODS[activeMood];

  return (
    <div
      className="relative min-h-screen bg-[#1A1836] text-[#F5F2ED] selection:bg-[#FFC978]/30 selection:text-[#FFF2D6] overflow-x-hidden font-body transition-colors duration-700"
    >
      {/* Dynamic Sky Atmospheric Tint Filter */}
      <div
        className="fixed inset-0 pointer-events-none transition-colors duration-700 z-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse at 50% 15%, ${currentMoodData.color} 0%, transparent 70%)`,
        }}
      />

      {/* 1. Starfield Layer (Persistent Stars, Twinkles & Ambient Horizon) */}
      <StarfieldBackdrop />

      {/* 2. Signature Firefly Particle System with Cursor Parallax (Persists smoothly across routes) */}
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
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#1A1836]/95 border shadow-[0_15px_40px_rgba(10,8,28,0.9)] backdrop-blur-xl flex flex-col sm:flex-row items-center gap-3 text-sm text-[#F5F2ED]"
            style={{
              borderColor: MOODS[confirmationToast.mood].color,
              boxShadow: `0 0 25px -4px ${MOODS[confirmationToast.mood].color}50`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center border shrink-0"
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
                    Calibrated: {MOODS[confirmationToast.mood].label}
                  </span>
                  <span className="text-[10px] text-[#B8B4D9]">
                    ({Math.round(confirmationToast.confidence * 100)}% Match)
                  </span>
                </div>
                <p className="text-[11px] text-[#B8B4D9]">
                  Suggestions updated for your emotional frequency.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (location.pathname !== '/mood') {
                  navigate('/mood');
                }
                setTimeout(() => {
                  const recElem = document.getElementById('recommendations');
                  recElem?.scrollIntoView({ behavior: 'smooth' });
                }, 300);
                setConfirmationToast(null);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-glow-sm"
              style={{
                backgroundColor: MOODS[confirmationToast.mood].color,
                color: '#1A1836',
              }}
            >
              <span>View Shift Suggestions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <Sparkles
              className="w-4 h-4 animate-spin hidden sm:block"
              style={{ color: MOODS[confirmationToast.mood].color, animationDuration: '6s' }}
            />
          </motion.div>
        )}

        {/* Monthly Recap Available Floating Notification */}
        {recapPromptAvailable && !isRecapModalOpen && recapData && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-6 z-40 p-4 rounded-2xl bg-[#1A1836]/95 border border-[#FFC978]/40 shadow-[0_10px_35px_rgba(10,8,28,0.9)] backdrop-blur-xl flex items-center gap-3 text-xs text-[#F5F2ED] max-w-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-[#FFC978]/20 border border-[#FFC978]/50 flex items-center justify-center text-[#FFC978] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="font-semibold text-[#FFC978]">
                {recapData.monthName} Brightest Nights
              </div>
              <p className="text-[11px] text-[#B8B4D9]">
                Your monthly constellation highlights are ready.
              </p>
            </div>
            <button
              onClick={() => setIsRecapModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#FFC978] hover:bg-[#FFD88A] text-[#1A1836] font-bold text-xs transition-all shrink-0 cursor-pointer shadow-glow-sm"
            >
              View Reel ✨
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Animated Route Switcher (Camera Push-in/Push-out between rooms) */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <HomeView
                activeMood={activeMood}
                onSelectMood={(mood) => handleConfirmMood(mood, 0.95)}
              />
            }
          />
          <Route
            path="/mood"
            element={
              <MoodView
                activeMood={activeMood}
                confidence={activeConfidence}
                rawExpressions={activeRawExpressions}
                onConfirmMood={handleConfirmMood}
              />
            }
          />
          <Route
            path="/journal"
            element={<JournalView activeMood={activeMood} />}
          />
          <Route
            path="/constellation"
            element={
              <ConstellationView
                activeMood={activeMood}
                onConfirmMood={handleConfirmMood}
              />
            }
          />
          <Route
            path="/wellness"
            element={<WellnessView />}
          />
          <Route
            path="/wellness/breathing"
            element={<BreathingView />}
          />
          <Route
            path="/wellness/meditate"
            element={<MeditationView />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      {/* 6. Face Detection & Calibration Modal (Direct Global Trigger) */}
      <FaceDetectionModal
        isOpen={isFaceDetectionOpen}
        onClose={() => setIsFaceDetectionOpen(false)}
        onConfirmMood={handleConfirmMood}
      />

      {/* 7. Monthly Brightest Nights Highlight Reel Modal */}
      {recapData && (
        <MonthlyRecapModal
          isOpen={isRecapModalOpen}
          onClose={() => {
            setIsRecapModalOpen(false);
            setRecapPromptAvailable(false);
          }}
          recapData={recapData}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
