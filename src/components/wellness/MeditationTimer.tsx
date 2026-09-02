import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Moon, 
  CheckCircle2, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../common/Button';

interface MeditationTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DURATION_OPTIONS = [
  { label: '1 Min', seconds: 60, tag: 'Quick' },
  { label: '3 Mins', seconds: 180, tag: 'Focus' },
  { label: '5 Mins', seconds: 300, tag: 'Restore' },
  { label: '10 Mins', seconds: 600, tag: 'Deep' },
  { label: '15 Mins', seconds: 900, tag: 'Immersion' },
];

export const MeditationTimer: React.FC<MeditationTimerProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedDuration, setSelectedDuration] = useState(180);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [ambientSound, setAmbientSound] = useState(true);

  // Timer countdown
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsFinished(true);
          confetti({
            particleCount: 50,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#FFC978', '#6FBFC4', '#FF9E7D', '#FFF2D6'],
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleSelectDuration = (seconds: number) => {
    setSelectedDuration(seconds);
    setTimeLeft(seconds);
    setIsRunning(false);
    setIsFinished(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration);
    setIsFinished(false);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((selectedDuration - timeLeft) / selectedDuration) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#090818]/90 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#24214A] via-[#1A1836] to-[#121029] border border-[#FFC978]/35 p-6 sm:p-8 shadow-[0_25px_80px_rgba(10,8,28,0.95)] overflow-hidden my-auto text-center"
      >
        {/* Top Rim Glow */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#FFC978] to-transparent" />

        {/* Close Button */}
        <button
          onClick={() => {
            handleReset();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#B8B4D9] hover:text-[#F5F2ED] hover:bg-[#2D2A5C]/60 transition-colors cursor-pointer z-20"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-[#B8B4D9]/15">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#FFC978]/15 border border-[#FFC978]/40 flex items-center justify-center text-[#FFC978] shadow-glow-sm">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FFC978]">
                  Night Sanctuary Meditation
                </span>
                <span className="text-xs text-[#FFC978]/80 font-mono">Stillness</span>
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#F5F2ED]">
                Ambient Starlight Timer
              </h3>
            </div>
          </div>

          <button
            onClick={() => setAmbientSound(!ambientSound)}
            className="p-2 rounded-xl bg-[#121029]/80 border border-[#B8B4D9]/20 text-[#B8B4D9] hover:text-[#FFC978] transition-colors cursor-pointer"
            title="Toggle Ambient Audio"
          >
            {ambientSound ? <Volume2 className="w-4 h-4 text-[#6FBFC4]" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Duration Picker Chips */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {DURATION_OPTIONS.map((opt) => {
            const isSelected = selectedDuration === opt.seconds;
            return (
              <button
                key={opt.seconds}
                onClick={() => handleSelectDuration(opt.seconds)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#2D2A5C] text-[#F5F2ED] border-[#FFC978] shadow-glow-sm'
                    : 'bg-[#1A1836]/60 text-[#B8B4D9] border-[#B8B4D9]/15 hover:border-[#B8B4D9]/35'
                }`}
              >
                <div>{opt.label}</div>
                <div className="text-[10px] font-mono opacity-70">{opt.tag}</div>
              </button>
            );
          })}
        </div>

        {/* Ambient Starlight Orb Centerpiece */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center mb-8">
          {/* Progress Circular SVG */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="84"
              fill="none"
              stroke="#1A1836"
              strokeWidth="6"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="84"
              fill="none"
              stroke="#FFC978"
              strokeWidth="6"
              strokeDasharray={527}
              strokeDashoffset={527 - (527 * progressPercentage) / 100}
              strokeLinecap="round"
              className="transition-all duration-500"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 201, 120, 0.6))',
              }}
            />
          </svg>

          {/* Center Glowing Starlight Orb */}
          <motion.div
            animate={{
              scale: isRunning ? [1, 1.06, 1] : 1,
              opacity: isRunning ? [0.7, 0.95, 0.7] : 0.85,
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#2D2A5C]/80 via-[#1F1C42] to-[#121029] border border-[#FFC978]/40 flex flex-col items-center justify-center shadow-glow-md"
          >
            <span className="font-heading text-3xl sm:text-4xl font-bold text-[#F5F2ED] tracking-wider">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] font-mono text-[#B8B4D9] uppercase tracking-widest mt-1">
              {isRunning ? '✦ Deep Awareness' : isFinished ? '✦ Complete' : 'Ready'}
            </span>
          </motion.div>
        </div>

        {/* Gentle Completion Message Banner */}
        <AnimatePresence>
          {isFinished && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3.5 rounded-2xl bg-[#FFC978]/15 border border-[#FFC978]/40 mb-6 text-xs text-[#FFF2D6] font-heading flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#FFC978]" />
              <span>"Your mind has returned to the still waters of the night sky." ✦</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            size="lg"
            variant="primary"
            className="px-8"
            icon={isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'Pause Silence' : isFinished ? 'Restart Session' : 'Begin Meditation'}
          </Button>

          <Button
            size="lg"
            variant="secondary"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>

        <div className="mt-5 pt-3 border-t border-[#B8B4D9]/15 flex items-center justify-between text-[11px] text-[#B8B4D9]">
          <span className="flex items-center gap-1 text-[#FFC978]">
            <Sparkles className="w-3.5 h-3.5" /> Ambient night sky visual continues gently during session
          </span>
          <span className="font-mono text-[#FFC978]">Deep Rest</span>
        </div>
      </motion.div>
    </div>
  );
};
