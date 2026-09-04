import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Play, Pause, RotateCcw, Sparkles, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RouteTransition } from '../components/common/RouteTransition';
import { CloseButton } from '../components/common/CloseButton';
import { Button } from '../components/common/Button';

interface BreathingPhase {
  name: string;
  duration: number; // in seconds
  instruction: string;
  cue: string;
  targetScale: number;
}

const TECHNIQUES: Record<string, { label: string; tag: string; totalCycles: number; phases: BreathingPhase[]; description: string; benefits: string }> = {
  '478': {
    label: '4-7-8 Parasympathetic Downshift',
    tag: 'Rest Flow',
    totalCycles: 4,
    description: 'Dr. Andrew Weil rhythmic tranquilizer for the nervous system. Naturally lowers heart rate and dampens acute fight-or-flight cortisol release.',
    benefits: 'Vagal nerve stimulation · Lowers systolic blood pressure · Induces deep sleep onset',
    phases: [
      { name: 'Inhale', duration: 4, instruction: 'Inhale firefly starlight softly through your nose...', cue: 'Inhale (4s)', targetScale: 1.35 },
      { name: 'Hold', duration: 7, instruction: 'Hold the breath gently. Feel your heart slow to a calm pace...', cue: 'Hold (7s)', targetScale: 1.35 },
      { name: 'Exhale', duration: 8, instruction: 'Release all tension with a soft, steady whoosh...', cue: 'Exhale (8s)', targetScale: 0.7 },
    ],
  },
  'box': {
    label: '4-4-4-4 Box Breathing Circuit',
    tag: 'Navy SEAL Focus',
    totalCycles: 4,
    description: 'Tactical autonomic regulation technique designed for intense cognitive clarity and psychological steadiness under pressure.',
    benefits: 'Balances sympathetic & parasympathetic tones · Enhances attentional bandwidth · Clears mental fog',
    phases: [
      { name: 'Inhale', duration: 4, instruction: 'Inhale crisp night air evenly through your nose...', cue: 'Inhale (4s)', targetScale: 1.3 },
      { name: 'Hold', duration: 4, instruction: 'Hold with relaxed chest, dropped shoulders, and peaceful mind...', cue: 'Hold (4s)', targetScale: 1.3 },
      { name: 'Exhale', duration: 4, instruction: 'Exhale completely, letting distracting thoughts drift into the night...', cue: 'Exhale (4s)', targetScale: 0.75 },
      { name: 'Pause', duration: 4, instruction: 'Rest in pure still equilibrium before the next breath...', cue: 'Pause (4s)', targetScale: 0.75 },
    ],
  },
  'calm': {
    label: '4-6 Coherent Calming Wave',
    tag: 'Coherence Flow',
    totalCycles: 5,
    description: 'Resonance frequency breathing tuned to ~0.1 Hz to harmonize heart rate variability (HRV) with respiration.',
    benefits: 'Maximizes respiratory sinus arrhythmia · Soothes emotional turbulence · Grounding stabilization',
    phases: [
      { name: 'Inhale', duration: 4, instruction: 'Expand your belly with warm golden amber starlight...', cue: 'Inhale (4s)', targetScale: 1.25 },
      { name: 'Exhale', duration: 6, instruction: 'Slowly let go, sinking deeper into quiet tranquility...', cue: 'Exhale (6s)', targetScale: 0.75 },
    ],
  },
};

export const BreathingView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const techQuery = searchParams.get('tech');
  const initialTech: '478' | 'box' | 'calm' = (techQuery === 'box' || techQuery === 'calm' || techQuery === '478') ? techQuery : '478';

  const [selectedTech, setSelectedTech] = useState<'478' | 'box' | 'calm'>(initialTech);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState<number>(0);
  const [timeLeftInPhase, setTimeLeftInPhase] = useState<number>(4);
  const [currentCycle, setCurrentCycle] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const activeTechniqueData = TECHNIQUES[selectedTech];
  const activePhase = activeTechniqueData.phases[currentPhaseIdx];

  const handleReset = useCallback(() => {
    setIsActive(false);
    setCurrentPhaseIdx(0);
    setTimeLeftInPhase(activeTechniqueData.phases[0].duration);
    setCurrentCycle(1);
    setIsCompleted(false);
  }, [activeTechniqueData]);

  // Sync when search param changes
  useEffect(() => {
    if (techQuery && (techQuery === '478' || techQuery === 'box' || techQuery === 'calm')) {
      setSelectedTech(techQuery);
      handleReset();
    }
  }, [techQuery, handleReset]);

  // Particle simulation state
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
    const pCount = 95;
    const colors = ['#FFC978', '#6FBFC4', '#FF9E7D', '#FFF2D6', '#C25AE0'];
    const pts = [];
    for (let i = 0; i < pCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const baseDist = 40 + Math.random() * 110;
      pts.push({
        angle,
        dist: baseDist,
        baseDist,
        speed: 0.008 + Math.random() * 0.018,
        size: 1.8 + Math.random() * 2.5,
        alpha: 0.4 + Math.random() * 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    particlesRef.current = pts;
  }, []);

  // Canvas particle swarm render loop synced to breath scale
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 380;
    const height = 380;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const centerX = width / 2;
    const centerY = height / 2;

    let currentLungScale = 1;

    const render = () => {
      const targetLungScale = isActive ? activePhase.targetScale : 1;
      currentLungScale += (targetLungScale - currentLungScale) * 0.035;

      ctx.clearRect(0, 0, width, height);

      // Central ambient pulse aura
      const grad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        85 * currentLungScale
      );
      grad.addColorStop(0, 'rgba(255, 201, 120, 0.45)');
      grad.addColorStop(0.4, 'rgba(111, 191, 196, 0.25)');
      grad.addColorStop(1, 'rgba(26, 24, 54, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 85 * currentLungScale, 0, Math.PI * 2);
      ctx.fill();

      // Swarming firefly particles pulsating in and out
      for (const p of particlesRef.current) {
        p.angle += p.speed;
        const currentDist = p.baseDist * currentLungScale;
        const x = centerX + Math.cos(p.angle) * currentDist;
        const y = centerY + Math.sin(p.angle) * currentDist;

        // Soft outer particle glow
        ctx.beginPath();
        ctx.arc(x, y, p.size * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}35`;
        ctx.fill();

        // Core bright spark
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Radiant center starlight node
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5 * currentLungScale, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFC978';
      ctx.shadowBlur = 18;
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
  }, [isActive, activePhase]);

  // Breathing rhythm timer loop
  useEffect(() => {
    if (!isActive || isCompleted) return;

    const timer = setInterval(() => {
      setTimeLeftInPhase((prev) => {
        if (prev <= 1) {
          const nextIdx = (currentPhaseIdx + 1) % activeTechniqueData.phases.length;
          setCurrentPhaseIdx(nextIdx);

          if (nextIdx === 0) {
            if (currentCycle >= activeTechniqueData.totalCycles) {
              setIsCompleted(true);
              setIsActive(false);
              confetti({
                particleCount: 70,
                spread: 90,
                origin: { y: 0.6 },
                colors: ['#FFC978', '#6FBFC4', '#FF9E7D', '#FFF2D6', '#C25AE0'],
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

  const handleSelectTech = (tech: '478' | 'box' | 'calm') => {
    setSelectedTech(tech);
    setSearchParams({ tech });
    setIsActive(false);
    setCurrentPhaseIdx(0);
    setTimeLeftInPhase(TECHNIQUES[tech].phases[0].duration);
    setCurrentCycle(1);
    setIsCompleted(false);
  };

  return (
    <RouteTransition>
      {/* Floating On-Brand Circular Close Button returning to Wellness Room */}
      <CloseButton to="/wellness" ariaLabel="Return to Wellness Actions Sanctuary" />

      <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 space-y-8">
        {/* Header */}
        <div className="border-b border-[#B8B4D9]/15 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#6FBFC4] mb-2">
            <Wind className="w-4 h-4" />
            <span>Room 04-A / Somatic Lung Pacer</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl sm:text-5xl font-bold text-[#F5F2ED] tracking-tight mb-2">
                Firefly Particle Lung Pacer
              </h1>
              <p className="text-sm sm:text-base text-[#B8B4D9] max-w-2xl leading-relaxed">
                Harmonize your breath with expanding and contracting firefly constellations. Clinically proven to shift heart-rate variability and down-regulate sympathetic activation.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#121029]/80 border border-[#6FBFC4]/30 text-xs font-semibold text-[#6FBFC4] shrink-0 self-start md:self-auto">
              <ShieldCheck className="w-4 h-4" />
              <span>Evidence-Based Vagal Pacing</span>
            </div>
          </div>
        </div>

        {/* Technique Selector Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(Object.keys(TECHNIQUES) as ('478' | 'box' | 'calm')[]).map((key) => {
            const tech = TECHNIQUES[key];
            const isSelected = selectedTech === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectTech(key)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#2D2A5C] text-[#F5F2ED] border-[#6FBFC4] shadow-glow-sm'
                    : 'bg-[#1A1836]/60 text-[#B8B4D9] border-[#B8B4D9]/15 hover:border-[#B8B4D9]/30 hover:bg-[#1A1836]/90'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#F5F2ED]">{tech.label.split(' ')[0]}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#121029]/80 border border-[#B8B4D9]/20 text-[#FFC978]">
                    {tech.tag}
                  </span>
                </div>
                <div className="text-xs font-heading font-semibold text-[#FFF2D6]">
                  {tech.label.substring(tech.label.indexOf(' ') + 1)}
                </div>
                <div className="text-[11px] text-[#B8B4D9] mt-1.5 line-clamp-2">
                  {tech.benefits}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Pacer Card */}
        <div className="rounded-3xl bg-gradient-to-b from-[#24214A] via-[#1A1836] to-[#121029] border border-[#6FBFC4]/40 p-6 sm:p-10 shadow-[0_25px_80px_rgba(10,8,28,0.95)] relative overflow-hidden text-center">
          {/* Top Rim Glow */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#6FBFC4] to-transparent" />

          {/* Subheader with Cycle Badge */}
          <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-[#B8B4D9]/15">
            <div className="text-left">
              <div className="text-xs font-mono text-[#6FBFC4] uppercase tracking-wider font-semibold">
                Active Protocol
              </div>
              <div className="font-heading text-lg sm:text-xl font-bold text-[#F5F2ED]">
                {activeTechniqueData.label}
              </div>
            </div>

            <div className="px-4 py-2 rounded-full bg-[#121029]/80 border border-[#FFC978]/30 text-xs font-mono text-[#FFC978] whitespace-nowrap shadow-inner">
              Cycle {currentCycle} / {activeTechniqueData.totalCycles}
            </div>
          </div>

          {/* Central Particle Swarm Pacer Display */}
          <div className="relative mx-auto w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] flex items-center justify-center mb-8">
            <canvas ref={canvasRef} className="rounded-full pointer-events-none" />

            {/* Center Text HUD Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none space-y-1.5">
              <motion.div
                key={activePhase.name}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-[#FFC978]"
              >
                {activePhase.cue}
              </motion.div>

              <div className="font-heading text-5xl sm:text-6xl font-bold text-[#F5F2ED] drop-shadow-lg">
                {isActive ? timeLeftInPhase : activePhase.duration}
                <span className="text-base sm:text-lg text-[#B8B4D9] font-normal ml-1">s</span>
              </div>

              <div className="text-xs sm:text-sm text-[#6FBFC4] font-medium max-w-[220px] leading-relaxed">
                {isActive ? activePhase.instruction : 'Press Begin to calibrate breath rhythm'}
              </div>
            </div>
          </div>

          {/* Completion Banner */}
          <AnimatePresence>
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-2xl bg-[#6FBFC4]/20 border border-[#6FBFC4]/50 mb-6 text-sm text-[#F5F2ED] flex items-center justify-center gap-2.5 font-semibold shadow-glow-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-[#6FBFC4]" />
                <span>Full Breath Circuit Complete. Autonomic Balance Calibrated ✦</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="primary"
              className="px-10 py-3.5 text-sm"
              icon={isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              onClick={() => setIsActive(!isActive)}
            >
              {isActive ? 'Pause Pacer' : isCompleted ? 'Restart Circuit' : 'Begin Starlight Breath'}
            </Button>

            <Button
              size="lg"
              variant="secondary"
              icon={<RotateCcw className="w-5 h-5" />}
              onClick={handleReset}
            >
              Reset Circuit
            </Button>
          </div>

          {/* Physiological Insight Footer */}
          <div className="mt-8 pt-4 border-t border-[#B8B4D9]/15 flex flex-col sm:flex-row items-center justify-between text-xs text-[#B8B4D9] gap-2">
            <span className="flex items-center gap-1.5 text-[#6FBFC4]">
              <Sparkles className="w-4 h-4" /> Firefly particles organically breathe with your lungs
            </span>
            <span className="flex items-center gap-1.5 text-[#FFC978] font-mono">
              <Heart className="w-3.5 h-3.5 fill-current" /> Heart Rate Variability (HRV) Synchronization
            </span>
          </div>
        </div>
      </div>
    </RouteTransition>
  );
};

export default BreathingView;
