import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Sparkles,
  Maximize2,
  Minimize2,
  ChevronDown
} from 'lucide-react';
import type { MeditationCategoryId } from '../../../types/meditation';
import { MEDITATION_CATEGORIES, MEDITATION_CATEGORIES_LIST } from '../../../types/meditation';
import { meditationSoundEngine } from '../../../services/meditationSoundscape';
import { MeditationVisualScene } from './MeditationVisualScene';
import { CATEGORY_ICONS } from './MeditationCategoryPicker';

interface ImmersiveMeditationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: MeditationCategoryId;
  initialDuration?: number;
}

const DURATION_OPTIONS = [
  { label: '1m', seconds: 60, tag: 'Quick' },
  { label: '3m', seconds: 180, tag: 'Reset' },
  { label: '5m', seconds: 300, tag: 'Ground' },
  { label: '10m', seconds: 600, tag: 'Deep' },
  { label: '15m', seconds: 900, tag: 'Immersion' },
  { label: '20m', seconds: 1200, tag: 'Sanctuary' },
];

export const ImmersiveMeditationModal: React.FC<ImmersiveMeditationModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'starlight',
  initialDuration = 300,
}) => {
  // Session State
  const [selectedCategory, setSelectedCategory] = useState<MeditationCategoryId>(initialCategory);
  const [selectedDuration, setSelectedDuration] = useState<number>(initialDuration);
  const [timeLeft, setTimeLeft] = useState<number>(initialDuration);
  const [isRunning, setIsRunning] = useState<boolean>(true); // Starts immediately on enter
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showRealmPicker, setShowRealmPicker] = useState<boolean>(false);

  // Breathing oscillation (0 to 1) for continuous visual synchronization
  const [breathPhase, setBreathPhase] = useState<number>(0);
  const breathAnimRef = useRef<number | null>(null);

  // Auto-hide controls timer
  const controlsTimeoutRef = useRef<number | null>(null);
  const initialHeaderTimeoutRef = useRef<number | null>(null);
  const [headerFaded, setHeaderFaded] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const category = MEDITATION_CATEGORIES[selectedCategory];

  // Sync initialCategory prop changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Lock body/html scroll when fullscreen meditation is active
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalDocOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Auto-request browser fullscreen on user entry if possible
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        // Silently continue if browser policy requires manual gesture
      });
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalDocOverflow;
    };
  }, [isOpen]);

  // Reset timer & start when category or duration changes
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(selectedDuration);
      setIsRunning(true);
      setIsCompleted(false);
      setHeaderFaded(false);

      // Auto fade header description after 4s
      if (initialHeaderTimeoutRef.current) clearTimeout(initialHeaderTimeoutRef.current);
      initialHeaderTimeoutRef.current = window.setTimeout(() => {
        setHeaderFaded(true);
      }, 4200);
    }
  }, [isOpen, selectedCategory, selectedDuration]);

  // Breathing cycle animation loop
  useEffect(() => {
    if (!isOpen) return;

    let startTime = performance.now();
    const cycleDuration = (category.breathingPaceSeconds || 8) * 1000;

    const loop = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const phase = (elapsed % cycleDuration) / cycleDuration;
      setBreathPhase(phase);
      breathAnimRef.current = requestAnimationFrame(loop);
    };

    breathAnimRef.current = requestAnimationFrame(loop);

    return () => {
      if (breathAnimRef.current) cancelAnimationFrame(breathAnimRef.current);
    };
  }, [isOpen, category.breathingPaceSeconds]);

  // Procedural Web Audio soundscape playback
  useEffect(() => {
    if (isOpen && isRunning && !isCompleted && ambientSound) {
      meditationSoundEngine.play(category.soundscapeType);
    } else {
      meditationSoundEngine.stop();
    }

    return () => {
      meditationSoundEngine.stop();
    };
  }, [isOpen, isRunning, isCompleted, ambientSound, category.soundscapeType]);

  // Countdown timer interval
  useEffect(() => {
    if (!isOpen || !isRunning || isCompleted || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsCompleted(true);
          meditationSoundEngine.stop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isRunning, isCompleted, timeLeft]);

  // Auto-hide controls upon user inactivity
  const handleUserActivity = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    if (isRunning && !isCompleted && !showRealmPicker) {
      controlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3600);
    }
  }, [isRunning, isCompleted, showRealmPicker]);

  useEffect(() => {
    if (isRunning && !isCompleted && !showRealmPicker) {
      handleUserActivity();
    } else {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
    }

    return () => {
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isRunning, isCompleted, showRealmPicker, handleUserActivity]);

  // Browser Fullscreen API toggle
  const toggleBrowserFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        }).catch(() => {});
      }
    }
  };

  // Exit & clean up meditation
  const handleExitMeditation = () => {
    meditationSoundEngine.stop();
    setIsRunning(false);
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    onClose();
  };

  const handleReset = () => {
    setTimeLeft(selectedDuration);
    setIsRunning(true);
    setIsCompleted(false);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = selectedDuration > 0 ? (selectedDuration - timeLeft) / selectedDuration : 0;
  const progressPercentage = progress * 100;

  const isInhale = breathPhase < 0.5;
  const breathCueText = isInhale ? '✦ Breathe in gently...' : '✦ Release and let go...';

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleUserActivity}
      onTouchStart={handleUserActivity}
      onClick={handleUserActivity}
      className="fixed inset-0 w-screen h-screen z-[99999] bg-[#03020A] text-[#F5F2ED] select-none overflow-hidden m-0 p-0 flex flex-col justify-between"
      style={{
        width: '100vw',
        height: '100vh',
        minHeight: '100dvh',
      }}
    >
      {/* 1. Fullscreen Dedicated Category Visual Scene */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <MeditationVisualScene
          categoryId={selectedCategory}
          isRunning={isRunning}
          progress={progress}
          breathPhase={breathPhase}
        />
      </div>

      {/* 2. Top Header HUD with Subtle Controls & Auto-Fade Info */}
      <AnimatePresence>
        {(showControls || !headerFaded) && !isCompleted && (
          <motion.header
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-30 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-b from-[#03020A]/90 via-[#03020A]/40 to-transparent pointer-events-auto"
            style={{
              paddingTop: 'max(1rem, env(safe-area-inset-top))',
            }}
          >
            {/* Category Selector Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowRealmPicker(!showRealmPicker);
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#121029]/80 hover:bg-[#1C1838] border transition-all cursor-pointer shadow-lg backdrop-blur-xl group"
                style={{
                  borderColor: `${category.colors.primary}40`,
                }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center border"
                  style={{
                    backgroundColor: `${category.colors.primary}20`,
                    borderColor: `${category.colors.primary}50`,
                    color: category.colors.primary,
                  }}
                >
                  {CATEGORY_ICONS[category.id]}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B8B4D9]">
                    Realm
                  </div>
                  <div className="font-heading text-xs font-bold text-[#F5F2ED]">
                    {category.name}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#B8B4D9] group-hover:text-[#F5F2ED] transition-transform ml-1" />
              </button>

              {/* Fast Realm Switcher Dropdown */}
              <AnimatePresence>
                {showRealmPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#0D0B21]/95 border border-[#B8B4D9]/20 p-2 shadow-2xl backdrop-blur-2xl z-50 grid grid-cols-2 gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {MEDITATION_CATEGORIES_LIST.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setShowRealmPicker(false);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                          selectedCategory === cat.id
                            ? 'bg-[#2D2A5C] border-[#FFC978] text-[#F5F2ED]'
                            : 'bg-[#15122E]/60 border-transparent hover:bg-[#1E1B3D] text-[#B8B4D9]'
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                          style={{ color: cat.colors.primary }}
                        >
                          {CATEGORY_ICONS[cat.id]}
                        </div>
                        <div className="truncate">
                          <div className="text-[11px] font-bold text-[#F5F2ED] truncate">
                            {cat.name}
                          </div>
                          <div className="text-[9px] font-mono text-[#B8B4D9] opacity-70 truncate">
                            {cat.subtitle}
                          </div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Center Emotion / Tagline (fades out after few seconds) */}
            <AnimatePresence>
              {!headerFaded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="hidden md:flex flex-col items-center text-center max-w-md mx-4"
                >
                  <span
                    className="text-[10px] font-mono font-bold uppercase tracking-widest"
                    style={{ color: category.colors.primary }}
                  >
                    {category.emotion}
                  </span>
                  <p className="text-xs text-[#FFF2D6]/80 italic font-heading mt-0.5 truncate">
                    "{category.tagline}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right Action Icons (Audio, Fullscreen, Close) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAmbientSound(!ambientSound)}
                className="p-2.5 rounded-xl bg-[#121029]/80 border border-[#B8B4D9]/20 text-[#B8B4D9] hover:text-[#F5F2ED] hover:border-[#FFC978]/40 transition-all cursor-pointer shadow-md backdrop-blur-xl"
                title="Toggle Ambient Soundscape"
              >
                {ambientSound ? (
                  <Volume2 className="w-4 h-4" style={{ color: category.colors.primary }} />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={toggleBrowserFullscreen}
                className="p-2.5 rounded-xl bg-[#121029]/80 border border-[#B8B4D9]/20 text-[#B8B4D9] hover:text-[#F5F2ED] hover:border-[#FFC978]/40 transition-all cursor-pointer shadow-md backdrop-blur-xl hidden sm:block"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={handleExitMeditation}
                className="p-2.5 rounded-xl bg-[#121029]/80 border border-[#B8B4D9]/20 text-[#B8B4D9] hover:text-[#F5F2ED] hover:bg-rose-500/20 hover:border-rose-500/50 transition-all cursor-pointer shadow-md backdrop-blur-xl"
                aria-label="Exit Meditation"
                title="Exit Sanctuary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* 3. Center Subtle Timer & Gentle Breathing Indicator */}
      {!isCompleted && (
        <div className="relative z-20 flex-1 flex flex-col items-center justify-end pb-12 sm:pb-16 pointer-events-none">
          <AnimatePresence>
            {showControls ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col items-center pointer-events-auto"
              >
                {/* Floating Minimalist Timer Pill */}
                <div
                  className="px-7 py-2.5 rounded-full backdrop-blur-2xl border flex items-center gap-3 shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
                  style={{
                    backgroundColor: 'rgba(9, 7, 24, 0.82)',
                    borderColor: `${category.colors.primary}50`,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: category.colors.primary }}
                  />
                  <span className="font-heading text-3xl sm:text-4xl font-bold text-[#F5F2ED] tracking-wider drop-shadow-md">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-[10px] font-mono text-[#B8B4D9] uppercase tracking-widest border-l border-[#B8B4D9]/20 pl-3">
                    {isRunning ? '✦ In Presence' : 'Paused'}
                  </span>
                </div>

                {/* Micro Progress Bar */}
                <div className="w-52 h-1 bg-[#1A1836]/90 rounded-full mt-3 overflow-hidden border border-[#B8B4D9]/10">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${progressPercentage}%`,
                      backgroundColor: category.colors.primary,
                      boxShadow: `0 0 12px ${category.colors.primary}`,
                    }}
                  />
                </div>
              </motion.div>
            ) : (
              // Subtle ghost breathing cue when controls are auto-hidden
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.65 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9 }}
                className="text-xs sm:text-sm font-heading italic text-[#F5F2ED]/75 tracking-widest mb-4"
              >
                {breathCueText}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 4. Bottom Controls Bar (Pause/Resume, Reset, Duration Chips) */}
      <AnimatePresence>
        {showControls && !isCompleted && (
          <motion.footer
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-30 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-t from-[#03020A]/95 via-[#03020A]/50 to-transparent pointer-events-auto"
            style={{
              paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
            }}
          >
            {/* Quick Duration Preset Chips */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#121029]/80 border border-[#B8B4D9]/15 backdrop-blur-xl">
              {DURATION_OPTIONS.map((opt) => {
                const isSelected = selectedDuration === opt.seconds;
                return (
                  <button
                    key={opt.seconds}
                    onClick={() => {
                      setSelectedDuration(opt.seconds);
                      setTimeLeft(opt.seconds);
                      setIsRunning(true);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'text-[#0A081C] shadow-sm'
                        : 'text-[#B8B4D9] hover:text-[#F5F2ED]'
                    }`}
                    style={{
                      backgroundColor: isSelected ? category.colors.primary : 'transparent',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Main Action Buttons: Pause/Resume + Reset + End */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="px-7 py-3 rounded-2xl font-heading text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-glow-md backdrop-blur-xl"
                style={{
                  background: isRunning
                    ? 'rgba(36, 33, 74, 0.85)'
                    : `linear-gradient(135deg, ${category.colors.primary} 0%, ${category.colors.secondary} 100%)`,
                  color: isRunning ? '#F5F2ED' : '#0A081C',
                  border: isRunning ? `1px solid ${category.colors.primary}50` : 'none',
                }}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Resume</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="p-3 rounded-2xl bg-[#121029]/80 border border-[#B8B4D9]/20 text-[#B8B4D9] hover:text-[#F5F2ED] hover:border-[#FFC978]/40 transition-colors cursor-pointer shadow-md backdrop-blur-xl"
                title="Reset Duration"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleExitMeditation}
                className="px-4 py-3 rounded-2xl bg-[#121029]/80 border border-[#B8B4D9]/20 text-xs font-semibold text-[#B8B4D9] hover:text-rose-400 hover:border-rose-500/40 transition-colors cursor-pointer shadow-md backdrop-blur-xl"
              >
                End Session
              </button>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>

      {/* 5. Fullscreen Gentle Completion Screen */}
      {isCompleted && (
        <div className="relative z-30 inset-0 w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#03020A]/85 backdrop-blur-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-lg space-y-6"
          >
            {/* Icon */}
            <div
              className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center border shadow-glow-md"
              style={{
                backgroundColor: `${category.colors.primary}20`,
                borderColor: `${category.colors.primary}60`,
                color: category.colors.primary,
              }}
            >
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-4 h-4" style={{ color: category.colors.primary }} />
                <span
                  className="text-xs font-mono font-bold uppercase tracking-widest"
                  style={{ color: category.colors.primary }}
                >
                  {category.name} Complete
                </span>
                <Sparkles className="w-4 h-4" style={{ color: category.colors.primary }} />
              </div>

              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#F5F2ED] tracking-tight mb-3">
                {category.completionMessage}
              </h2>

              <p className="font-heading text-sm sm:text-base text-[#FFF2D6] italic leading-relaxed max-w-md mx-auto">
                "{category.completionSubtitle}"
              </p>
            </div>

            {/* Session Stats */}
            <div className="p-4 rounded-2xl bg-[#121029]/80 border border-[#B8B4D9]/15 grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-[10px] font-mono text-[#B8B4D9] uppercase tracking-wider">
                  Session Duration
                </div>
                <div className="font-heading text-lg font-bold text-[#F5F2ED] mt-0.5">
                  {Math.floor(selectedDuration / 60)} Minutes
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-[#B8B4D9] uppercase tracking-wider">
                  Resonance Mode
                </div>
                <div className="font-heading text-lg font-bold" style={{ color: category.colors.primary }}>
                  {category.subtitle}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setTimeLeft(selectedDuration);
                  setIsRunning(true);
                  setIsCompleted(false);
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-heading text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-glow-sm"
                style={{
                  background: `linear-gradient(135deg, ${category.colors.primary} 0%, ${category.colors.secondary} 100%)`,
                  color: '#0A081C',
                }}
              >
                <span>Meditate Again</span>
              </button>

              <button
                onClick={handleExitMeditation}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#1A1836] hover:bg-[#24214A] border border-[#B8B4D9]/20 text-xs font-semibold text-[#B8B4D9] hover:text-[#F5F2ED] transition-colors cursor-pointer"
              >
                Return to Sanctuary
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
