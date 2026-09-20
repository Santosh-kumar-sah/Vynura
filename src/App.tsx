import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
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
      className="relative min-h-screen bg-[#090A0F] text-[#F8FAFC] selection:bg-amber-400/20 selection:text-amber-200 overflow-x-hidden font-sans transition-colors duration-500"
    >
      {/* Dynamic Ambient Radial Light Filter */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-700 z-0 opacity-15"
        style={{
          background: `radial-gradient(circle at 50% 10%, ${currentMoodData.color} 0%, transparent 60%)`,
        }}
      />

      {/* Ultra-subtle Micro-Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern opacity-20" />

      {/* Top Navigation Bar */}
      <Navbar onOpenFaceDetection={() => setIsFaceDetectionOpen(true)} />

      {/* Real-time Mood Shift Notification Toast */}
      <AnimatePresence>
        {confirmationToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#11131A] border border-white/[0.12] shadow-[0_12px_32px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)] flex items-center gap-3 text-xs text-white"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: MOODS[confirmationToast.mood].color }}
            />
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">
                {MOODS[confirmationToast.mood].label} Calibrated
              </span>
              <span className="text-[#64748B] text-[11px]">
                ({Math.round(confirmationToast.confidence * 100)}% match)
              </span>
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
              className="px-2.5 py-1 rounded-lg bg-white text-[#090A0F] font-semibold text-xs hover:bg-[#F1F5F9] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View Shift</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </motion.div>
        )}

        {/* Monthly Recap Floating Capsule */}
        {recapPromptAvailable && !isRecapModalOpen && recapData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 left-6 z-40 p-3.5 rounded-xl bg-[#11131A] border border-white/[0.1] shadow-[0_12px_32px_rgba(0,0,0,0.7)] flex items-center gap-3 text-xs text-white max-w-sm"
          >
            <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-0.5">
              <div className="font-medium text-white">
                {recapData.monthName} Highlights
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Monthly pattern summary ready.
              </p>
            </div>
            <button
              onClick={() => setIsRecapModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-white text-[#090A0F] font-semibold text-xs transition-colors shrink-0 cursor-pointer"
            >
              View
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
