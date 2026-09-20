import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RouteTransition } from '../components/common/RouteTransition';
import { CloseButton } from '../components/common/CloseButton';

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
    tag: 'Vagal Tone',
    totalCycles: 4,
    description: 'Clinically validated pacing to stimulate vagal nerve transmission, lowering resting heart rate and cortisol levels.',
    benefits: 'Vagal nerve stimulation · Heart rate dampening · Sleep latency reduction',
    phases: [
      { name: 'Inhale', duration: 4, instruction: 'Inhale smoothly through the nose expanding the diaphragm...', cue: 'Inhale (4s)', targetScale: 1.35 },
      { name: 'Hold', duration: 7, instruction: 'Hold with relaxed shoulders and steady posture...', cue: 'Hold (7s)', targetScale: 1.35 },
      { name: 'Exhale', duration: 8, instruction: 'Even, controlled exhalation through the mouth...', cue: 'Exhale (8s)', targetScale: 0.7 },
    ],
  },
  'box': {
    label: '4-4-4-4 Box Breathing Circuit',
    tag: 'Focus',
    totalCycles: 4,
    description: 'Autonomic regulation technique used to optimize attentional control and executive function under cognitive load.',
    benefits: 'Autonomic equilibrium · Attentional focus · Stress modulation',
    phases: [
      { name: 'Inhale', duration: 4, instruction: 'Controlled nasal inhalation filling lungs evenly...', cue: 'Inhale (4s)', targetScale: 1.3 },
      { name: 'Hold', duration: 4, instruction: 'Hold retention without tension in neck or chest...', cue: 'Hold (4s)', targetScale: 1.3 },
      { name: 'Exhale', duration: 4, instruction: 'Slow, steady exhalation emptying lungs fully...', cue: 'Exhale (4s)', targetScale: 0.75 },
      { name: 'Pause', duration: 4, instruction: 'Rest in pause prior to next breath cycle...', cue: 'Pause (4s)', targetScale: 0.75 },
    ],
  },
  'calm': {
    label: '4-6 Coherent Calming Wave',
    tag: 'Coherence',
    totalCycles: 5,
    description: 'Resonance frequency pacing tuned to 0.1 Hz to maximize heart rate variability (HRV) and cardiac coherence.',
    benefits: 'HRV maximization · Cardiac coherence · Parasympathetic baseline',
    phases: [
      { name: 'Inhale', duration: 4, instruction: 'Continuous 4-second diaphragmatic inhalation...', cue: 'Inhale (4s)', targetScale: 1.25 },
      { name: 'Exhale', duration: 6, instruction: 'Extended 6-second rhythmic exhalation...', cue: 'Exhale (6s)', targetScale: 0.75 },
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

  // Initialize particle lung system
  useEffect(() => {
    const pCount = 75;
    const colors = ['#F59E0B', '#FCD34D', '#FFFFFF', '#D4D4D8', '#FEF3C7'];
    const pts = [];
    for (let i = 0; i < pCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const baseDist = 45 + Math.random() * 105;
      pts.push({
        angle,
        dist: baseDist,
        baseDist,
        speed: 0.004 + Math.random() * 0.012,
        size: 1.5 + Math.random() * 2,
        alpha: 0.3 + Math.random() * 0.5,
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
      const idleBreath = 1 + Math.sin(Date.now() / 2400) * 0.06;
      const targetLungScale = isActive ? activePhase.targetScale : idleBreath;
      currentLungScale += (targetLungScale - currentLungScale) * 0.035;

      ctx.clearRect(0, 0, width, height);

      // Central ambient pulse aura
      const grad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        80 * currentLungScale
      );
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
      grad.addColorStop(0.45, 'rgba(245, 158, 11, 0.08)');
      grad.addColorStop(1, 'rgba(18, 19, 22, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 80 * currentLungScale, 0, Math.PI * 2);
      ctx.fill();

      // Swarming particles pulsating in and out
      for (const p of particlesRef.current) {
        p.angle += p.speed;
        const currentDist = p.baseDist * currentLungScale;
        const x = centerX + Math.cos(p.angle) * currentDist;
        const y = centerY + Math.sin(p.angle) * currentDist;

        // Soft outer particle glow
        ctx.beginPath();
        ctx.arc(x, y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}25`;
        ctx.fill();

        // Core spark
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Center node
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3.5 * currentLungScale, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 12;
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
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#F59E0B', '#FCD34D', '#FFFFFF'],
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
      <CloseButton to="/wellness" ariaLabel="Return to Wellness Actions" />

      <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 space-y-8">
        {/* Header */}
        <div className="border-b border-white/[0.08] pb-6">
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
            Respiratory Protocol
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-normal tracking-tight text-white mb-2">
                Somatic Respiratory Regulator
              </h1>
              <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
                Paced visual respirations structured to stimulate vagal tone and down-regulate autonomic stress responses.
              </p>
            </div>
          </div>
        </div>

        {/* Technique Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(Object.keys(TECHNIQUES) as ('478' | 'box' | 'calm')[]).map((key) => {
            const tech = TECHNIQUES[key];
            const isSelected = selectedTech === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectTech(key)}
                className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-white/[0.06] text-white border-white/30'
                    : 'bg-white/[0.02] text-neutral-400 border-white/[0.08] hover:border-white/[0.15] hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-white">{tech.label.split(' ')[0]}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-amber-400">
                    {tech.tag}
                  </span>
                </div>
                <div className="text-xs font-medium text-neutral-200">
                  {tech.label.substring(tech.label.indexOf(' ') + 1)}
                </div>
                <div className="text-[11px] text-neutral-500 mt-1.5 line-clamp-2">
                  {tech.benefits}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Pacer Card */}
        <div className="rounded-2xl bg-[#121316] border border-white/[0.08] p-6 sm:p-10 relative overflow-hidden text-center">
          {/* Subheader with Cycle Badge */}
          <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.06]">
            <div className="text-left">
              <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-medium">
                Active Protocol
              </div>
              <div className="text-base sm:text-lg font-medium text-white">
                {activeTechniqueData.label}
              </div>
            </div>

            <div className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-neutral-300">
              Cycle {currentCycle} of {activeTechniqueData.totalCycles}
            </div>
          </div>

          {/* Central Particle Swarm Pacer Display */}
          <div className="relative mx-auto w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] flex items-center justify-center mb-8">
            <canvas ref={canvasRef} className="rounded-full pointer-events-none" />

            {/* Center Text HUD Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none space-y-1.5">
              <motion.div
                key={activePhase.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-xs sm:text-sm font-mono font-medium uppercase tracking-wider text-amber-400"
              >
                {activePhase.cue}
              </motion.div>

              <div className="font-heading text-5xl sm:text-6xl font-normal text-white">
                {isActive ? timeLeftInPhase : activePhase.duration}
                <span className="text-base sm:text-lg text-neutral-500 font-mono ml-1">s</span>
              </div>

              <div className="text-xs text-neutral-400 font-normal max-w-[240px] leading-relaxed">
                {isActive ? activePhase.instruction : 'Select Begin to initiate paced breathing'}
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
                className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] mb-6 text-xs text-neutral-200 flex items-center justify-center gap-2 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[1.5]" />
                <span>Protocol complete. Vagal activation calibrated.</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsActive(!isActive)}
              className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {isActive ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isActive ? 'Pause' : isCompleted ? 'Restart' : 'Begin Protocol'}</span>
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-neutral-300 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Reset</span>
            </button>
          </div>

          {/* Physiological Insight Footer */}
          <div className="mt-8 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 font-mono gap-2">
            <span>Synchronized pulmonary expansion</span>
            <span>Heart Rate Variability (HRV) resonance</span>
          </div>
        </div>
      </div>
    </RouteTransition>
  );
};

export default BreathingView;
