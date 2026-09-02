import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, Wind, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../common/Button';

interface BreathingGuideProps {
  isOpen: boolean;
  onClose: () => void;
  technique?: '478' | 'box' | 'calm';
}

interface BreathingPhase {
  name: string;
  duration: number; // in seconds
  instruction: string;
  cue: string;
  targetScale: number; // 0.6 = contracted, 1.4 = expanded
}

const TECHNIQUES: Record<string, { label: string; tag: string; totalCycles: number; phases: BreathingPhase[] }> = {
  '478': {
    label: '4-7-8 Parasympathetic Downshift',
    tag: 'Rest Flow',
    totalCycles: 4,
    phases: [
      { name: 'Inhale', duration: 4, instruction: 'Breathe in firefly starlight through your nose...', cue: 'Inhale (4s)', targetScale: 1.35 },
      { name: 'Hold', duration: 7, instruction: 'Hold the breath gently. Feel your heart slow...', cue: 'Hold (7s)', targetScale: 1.35 },
      { name: 'Exhale', duration: 8, instruction: 'Release all tension with a soft, steady whoosh...', cue: 'Exhale (8s)', targetScale: 0.7 },
    ],
  },
  'box': {
    label: '4-4-4-4 Box Breathing Circuit',
    tag: 'Box Flow',
    totalCycles: 4,
    phases: [
      { name: 'Inhale', duration: 4, instruction: 'Inhale crisp night air evenly...', cue: 'Inhale (4s)', targetScale: 1.3 },
      { name: 'Hold', duration: 4, instruction: 'Hold with relaxed chest and shoulders...', cue: 'Hold (4s)', targetScale: 1.3 },
      { name: 'Exhale', duration: 4, instruction: 'Exhale completely, letting thoughts drift...', cue: 'Exhale (4s)', targetScale: 0.75 },
      { name: 'Pause', duration: 4, instruction: 'Rest in pure still equilibrium...', cue: 'Pause (4s)', targetScale: 0.75 },
    ],
  },
  'calm': {
    label: '4-6 Coherent Calming Wave',
    tag: 'Calm Wave',
    totalCycles: 5,
    phases: [
      { name: 'Inhale', duration: 4, instruction: 'Expand your belly with warm amber light...', cue: 'Inhale (4s)', targetScale: 1.25 },
      { name: 'Exhale', duration: 6, instruction: 'Slowly let go, sinking into tranquility...', cue: 'Exhale (6s)', targetScale: 0.75 },
    ],
  },
};

export const BreathingGuide: React.FC<BreathingGuideProps> = ({
  isOpen,
  onClose,
  technique: initialTechnique = '478',
}) => {
  const [selectedTech, setSelectedTech] = useState<'478' | 'box' | 'calm'>(initialTechnique);
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [timeLeftInPhase, setTimeLeftInPhase] = useState(4);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Lock body scroll when breathing modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const activeTechniqueData = TECHNIQUES[selectedTech];
  const activePhase = activeTechniqueData.phases[currentPhaseIdx];

  // Particle simulation ref state
  const particlesRef = useRef<{
    angle: number;
    dist: number;
    baseDist: number;
    speed: number;
    size: number;
    alpha: number;
    color: string;
  }[]>([]);

  // Initialize firefly particle lung system
  useEffect(() => {
    const pCount = 75;
    const colors = ['#FFC978', '#6FBFC4', '#FF9E7D', '#FFF2D6', '#C25AE0'];
    const pts = [];
    for (let i = 0; i < pCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const baseDist = 35 + Math.random() * 85;
      pts.push({
        angle,
        dist: baseDist,
        baseDist,
        speed: 0.01 + Math.random() * 0.02,
        size: 1.5 + Math.random() * 2.2,
        alpha: 0.4 + Math.random() * 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    particlesRef.current = pts;
  }, []);

  // Canvas particle swarm render loop synced to breath scale
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 340;
    const height = 340;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const centerX = width / 2;
    const centerY = height / 2;

    let currentLungScale = 1;
    let targetLungScale = activePhase.targetScale;

    const render = () => {
      targetLungScale = isActive ? activePhase.targetScale : 1;
      // Smooth interpolation toward target scale
      currentLungScale += (targetLungScale - currentLungScale) * 0.035;

      ctx.clearRect(0, 0, width, height);

      // Central ambient glow
      const grad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        70 * currentLungScale
      );
      grad.addColorStop(0, 'rgba(255, 201, 120, 0.45)');
      grad.addColorStop(0.5, 'rgba(111, 191, 196, 0.2)');
      grad.addColorStop(1, 'rgba(26, 24, 54, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 70 * currentLungScale, 0, Math.PI * 2);
      ctx.fill();

      // Swarming firefly particles pulsating in and out
      for (const p of particlesRef.current) {
        p.angle += p.speed;
        const currentDist = p.baseDist * currentLungScale;
        const x = centerX + Math.cos(p.angle) * currentDist;
        const y = centerY + Math.sin(p.angle) * currentDist;

        // Particle soft aura
        ctx.beginPath();
        ctx.arc(x, y, p.size * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}30`;
        ctx.fill();

        // Particle bright core
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Radiant center starlight node
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4 * currentLungScale, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFC978';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isOpen, isActive, activePhase]);

  // Breathing rhythm timer loop
  useEffect(() => {
    if (!isActive || isCompleted) return;

    const timer = setInterval(() => {
      setTimeLeftInPhase((prev) => {
        if (prev <= 1) {
          // Next phase
          const nextIdx = (currentPhaseIdx + 1) % activeTechniqueData.phases.length;
          setCurrentPhaseIdx(nextIdx);

          // If looped back to phase 0, increment cycle
          if (nextIdx === 0) {
            if (currentCycle >= activeTechniqueData.totalCycles) {
              // Completed all cycles
              setIsCompleted(true);
              setIsActive(false);
              confetti({
                particleCount: 50,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#FFC978', '#6FBFC4', '#FF9E7D', '#FFF2D6'],
              });
              return 0;
            }
            setCurrentCycle((c) => c + 1);
          }

          return activeTechniqueData.phases[nextIdx].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, isCompleted, currentPhaseIdx, currentCycle, activeTechniqueData]);

  const handleReset = useCallback(() => {
    setIsActive(false);
    setCurrentPhaseIdx(0);
    setTimeLeftInPhase(activeTechniqueData.phases[0].duration);
    setCurrentCycle(1);
    setIsCompleted(false);
  }, [activeTechniqueData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-[#090818]/95 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-[#24214A] via-[#1A1836] to-[#121029] border border-[#6FBFC4]/40 p-5 sm:p-7 shadow-[0_25px_80px_rgba(10,8,28,0.95)] overflow-hidden my-auto text-center"
      >
        {/* Top Rim Glow */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#6FBFC4] to-transparent" />

        {/* Header with Properly Aligned Cycle Badge and Close Button */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#B8B4D9]/15">
          <div className="flex items-center gap-3 text-left min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#6FBFC4]/15 border border-[#6FBFC4]/40 flex items-center justify-center text-[#6FBFC4] shadow-glow-sm shrink-0">
              <Wind className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#6FBFC4]">
                  Somatic Particle Pacer
                </span>
                <span className="text-xs text-[#FFC978] font-mono font-semibold">
                  {activeTechniqueData.tag}
                </span>
              </div>
              <h3 className="font-heading text-base sm:text-xl font-bold text-[#F5F2ED] truncate">
                {activeTechniqueData.label}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 rounded-full bg-[#121029]/80 border border-[#FFC978]/30 text-xs font-mono text-[#FFC978] whitespace-nowrap">
              Cycle {currentCycle} / {activeTechniqueData.totalCycles}
            </div>
            <button
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="p-2 rounded-xl text-[#B8B4D9] hover:text-[#F5F2ED] hover:bg-[#2D2A5C]/60 border border-[#B8B4D9]/15 hover:border-[#B8B4D9]/35 transition-colors cursor-pointer"
              aria-label="Close"
              title="Close Breathing Guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Technique Selector Pills */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {(Object.keys(TECHNIQUES) as ('478' | 'box' | 'calm')[]).map((key) => {
            const tech = TECHNIQUES[key];
            const isSelected = selectedTech === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedTech(key);
                  setIsActive(false);
                  setCurrentPhaseIdx(0);
                  setTimeLeftInPhase(TECHNIQUES[key].phases[0].duration);
                  setCurrentCycle(1);
                  setIsCompleted(false);
                }}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#2D2A5C] text-[#F5F2ED] border-[#6FBFC4] shadow-glow-sm'
                    : 'bg-[#1A1836]/60 text-[#B8B4D9] border-[#B8B4D9]/15 hover:border-[#B8B4D9]/30'
                }`}
              >
                <div>{key === '478' ? '4-7-8 Downshift' : key === 'box' ? 'Box Breathing' : '4-6 Calm'}</div>
                <div className="text-[10px] font-mono opacity-70">{tech.tag}</div>
              </button>
            );
          })}
        </div>

        {/* Central Particle Swarm Pacer Display */}
        <div className="relative mx-auto w-[300px] h-[300px] flex items-center justify-center mb-6">
          <canvas ref={canvasRef} className="rounded-full pointer-events-none" />

          {/* Center Text HUD Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none space-y-1">
            <motion.div
              key={activePhase.name}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFC978]"
            >
              {activePhase.cue}
            </motion.div>

            <div className="font-heading text-4xl sm:text-5xl font-bold text-[#F5F2ED] drop-shadow-md">
              {isActive ? timeLeftInPhase : activePhase.duration}
              <span className="text-sm text-[#B8B4D9] font-normal ml-1">s</span>
            </div>

            <div className="text-[11px] text-[#6FBFC4] font-medium max-w-[190px] leading-tight">
              {isActive ? activePhase.instruction : 'Press Begin to start breathing guidance'}
            </div>
          </div>
        </div>

        {/* Completion Banner */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3.5 rounded-2xl bg-[#6FBFC4]/20 border border-[#6FBFC4]/50 mb-6 text-xs text-[#F5F2ED] flex items-center justify-center gap-2 font-semibold"
            >
              <CheckCircle2 className="w-5 h-5 text-[#6FBFC4]" />
              <span>Breath Circuit Complete. Parasympathetic Tone Restored ✦</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-3">
          <Button
            size="lg"
            variant="primary"
            className="px-8"
            icon={isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? 'Pause Pacer' : isCompleted ? 'Restart Circuit' : 'Begin Starlight Breath'}
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
          <span className="flex items-center gap-1 text-[#6FBFC4]">
            <Sparkles className="w-3.5 h-3.5" /> Firefly particles pulse organically with your lungs
          </span>
          <span className="font-mono text-[#FFC978]">Vagus Nerve Reset</span>
        </div>
      </motion.div>
    </div>
  );
};
