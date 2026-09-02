import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SwirlLoadingStateProps {
  progressMessage?: string;
}

export const SwirlLoadingState: React.FC<SwirlLoadingStateProps> = ({
  progressMessage = 'Awakening Neural Vision Models...',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = 240;
    const height = 240;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const centerX = width / 2;
    const centerY = height / 2;

    const particleCount = 38;
    const particles: {
      angle: number;
      distance: number;
      speed: number;
      radius: number;
      color: string;
      alpha: number;
    }[] = [];

    const colors = ['#FFC978', '#FF9E7D', '#6FBFC4', '#FFF2D6'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        distance: 25 + Math.random() * 75,
        speed: 0.02 + Math.random() * 0.03,
        radius: 1.2 + Math.random() * 2.0,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.4 + Math.random() * 0.6,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Central soft glow
      const centerGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 55);
      centerGrad.addColorStop(0, 'rgba(255, 201, 120, 0.4)');
      centerGrad.addColorStop(0.5, 'rgba(111, 191, 196, 0.15)');
      centerGrad.addColorStop(1, 'rgba(26, 24, 54, 0)');
      ctx.fillStyle = centerGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 55, 0, Math.PI * 2);
      ctx.fill();

      // Swirling particles
      for (const p of particles) {
        p.angle += p.speed;
        // Inward-outward breathing vortex motion
        const currentDist = p.distance + Math.sin(time * 2 + p.angle * 3) * 8;
        const x = centerX + Math.cos(p.angle) * currentDist;
        const y = centerY + Math.sin(p.angle) * currentDist;

        // Particle trail glow
        ctx.beginPath();
        ctx.arc(x, y, p.radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}30`;
        ctx.fill();

        // Core bright dot
        ctx.beginPath();
        ctx.arc(x, y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Radiant central core star
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3.5 + Math.sin(time * 4) * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF2D6';
      ctx.shadowColor = '#FFC978';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-4 flex items-center justify-center">
        <canvas ref={canvasRef} className="rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-1.5"
      >
        <span className="text-[11px] font-mono font-bold text-[#FFC978] tracking-widest block uppercase">
          Neural Loader · Firefly Swirl
        </span>
        <h4 className="font-heading text-lg font-bold text-[#F5F2ED]">
          {progressMessage}
        </h4>
        <p className="text-xs text-[#B8B4D9] max-w-xs leading-relaxed">
          Loading tiny face detector and emotional expression tensors directly into browser memory...
        </p>
      </motion.div>
    </div>
  );
};
