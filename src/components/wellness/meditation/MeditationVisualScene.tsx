import React, { useEffect, useRef } from 'react';
import type { MeditationCategoryId } from '../../../types/meditation';
import { MEDITATION_CATEGORIES } from '../../../types/meditation';

interface MeditationVisualSceneProps {
  categoryId: MeditationCategoryId;
  isRunning: boolean;
  progress: number; // 0 to 1
  breathPhase: number; // 0 to 1 continuous breathing oscillation (e.g. sin wave)
  className?: string;
}

export const MeditationVisualScene: React.FC<MeditationVisualSceneProps> = ({
  categoryId,
  isRunning,
  progress,
  breathPhase,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const category = MEDITATION_CATEGORIES[categoryId];

  // Internal persistent simulation state
  const sceneStateRef = useRef<{
    particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      baseAlpha: number;
      phase: number;
      color?: string;
      radius?: number;
      angle?: number;
      speed?: number;
      originAngle?: number;
      dist?: number;
    }>;
    clouds: Array<{ x: number; y: number; scale: number; speed: number; opacity: number }>;
    organicTendrils: Array<{ baseAngle: number; length: number; speed: number; width: number; phase: number }>;
    time: number;
  }>({
    particles: [],
    clouds: [],
    organicTendrils: [],
    time: 0,
  });

  // Re-seed particle/visual systems when category changes
  useEffect(() => {
    const particles: typeof sceneStateRef.current.particles = [];
    const clouds: typeof sceneStateRef.current.clouds = [];
    const organicTendrils: typeof sceneStateRef.current.organicTendrils = [];

    if (categoryId === 'starlight') {
      // 1. Starlight: Stars for night sky behind the meditating monk
      for (let i = 0; i < 85; i++) {
        particles.push({
          x: Math.random(),
          y: Math.random(),
          vx: (Math.random() - 0.5) * 0.0001,
          vy: (Math.random() - 0.5) * 0.0001,
          size: 0.8 + Math.random() * 1.8,
          alpha: 0.2 + Math.random() * 0.8,
          baseAlpha: 0.2 + Math.random() * 0.8,
          phase: Math.random() * Math.PI * 2,
        });
      }
    } else if (categoryId === 'joy') {
      // 2. Joy: Warm sunrise clouds + soft upward floating golden particles
      for (let i = 0; i < 4; i++) {
        clouds.push({
          x: Math.random() * 1.2 - 0.1,
          y: 0.55 + i * 0.08,
          scale: 0.9 + Math.random() * 0.6,
          speed: 0.00006 + Math.random() * 0.00004,
          opacity: 0.18 + Math.random() * 0.15,
        });
      }
      for (let i = 0; i < 45; i++) {
        particles.push({
          x: Math.random(),
          y: Math.random(),
          vx: (Math.random() - 0.5) * 0.0003,
          vy: -0.0003 - Math.random() * 0.0006, // floating gently upward
          size: 1.5 + Math.random() * 3,
          alpha: 0.3 + Math.random() * 0.6,
          baseAlpha: 0.5,
          phase: Math.random() * Math.PI * 2,
          color: Math.random() > 0.4 ? '#FFD166' : '#FFA96B',
        });
      }
    } else if (categoryId === 'calm') {
      // 3. Calm: Mist layers across tranquil water
      for (let i = 0; i < 30; i++) {
        particles.push({
          x: Math.random(),
          y: 0.55 + Math.random() * 0.4,
          vx: 0.00015 + Math.random() * 0.00025,
          vy: (Math.random() - 0.5) * 0.00005,
          size: 3 + Math.random() * 6,
          alpha: 0.1 + Math.random() * 0.2,
          baseAlpha: 0.15,
          phase: Math.random() * Math.PI * 2,
          color: '#6FBFC4',
        });
      }
    } else if (categoryId === 'focus') {
      // 4. Focus: Minimalist single point - virtually zero ambient particles to eliminate distractions
      particles.length = 0;
    } else if (categoryId === 'sleep') {
      // 5. Sleep: Soft clouds passing across the moon
      for (let i = 0; i < 5; i++) {
        clouds.push({
          x: (i * 0.3) % 1.4 - 0.2,
          y: 0.28 + (i % 3) * 0.12,
          scale: 1.0 + Math.random() * 0.7,
          speed: 0.00007 + (i % 2) * 0.00004,
          opacity: 0.22 + Math.random() * 0.18,
        });
      }
      for (let i = 0; i < 25; i++) {
        particles.push({
          x: Math.random(),
          y: Math.random() * 0.65,
          vx: 0,
          vy: 0,
          size: 0.7 + Math.random() * 1.3,
          alpha: 0.15 + Math.random() * 0.35,
          baseAlpha: 0.25,
          phase: Math.random() * Math.PI * 2,
        });
      }
    } else if (categoryId === 'stress') {
      // 6. Stress Relief: Dense cluster of swirling particles at center that disperse outward over time
      for (let i = 0; i < 85; i++) {
        const originAngle = Math.random() * Math.PI * 2;
        const initialDist = 15 + Math.random() * 65;
        particles.push({
          x: 0.5,
          y: 0.5,
          originAngle,
          angle: originAngle,
          dist: initialDist,
          speed: (0.012 + Math.random() * 0.018) * (Math.random() > 0.5 ? 1 : -1),
          vx: (Math.random() - 0.5) * 0.0004,
          vy: (Math.random() - 0.5) * 0.0004,
          size: 2.5 + Math.random() * 4,
          alpha: 0.4 + Math.random() * 0.5,
          baseAlpha: 0.5,
          phase: Math.random() * Math.PI * 2,
        });
      }
    } else if (categoryId === 'gratitude') {
      // 7. Gratitude: Hundreds of tiny soft golden lights slowly floating upward
      for (let i = 0; i < 110; i++) {
        particles.push({
          x: Math.random(),
          y: Math.random(),
          vx: (Math.random() - 0.5) * 0.0003,
          vy: -0.0002 - Math.random() * 0.0005, // floating gently upward
          size: 1.2 + Math.random() * 2.8,
          alpha: 0.25 + Math.random() * 0.65,
          baseAlpha: 0.6,
          phase: Math.random() * Math.PI * 2,
          color: Math.random() > 0.4 ? '#FFB852' : '#FFD48F',
        });
      }
    } else if (categoryId === 'healing') {
      // 8. Healing: Organic flowing botanical shapes & gentle glowing motes around growing central light
      for (let i = 0; i < 8; i++) {
        organicTendrils.push({
          baseAngle: (i * Math.PI * 2) / 8,
          length: 90 + Math.random() * 45,
          speed: 0.006 + Math.random() * 0.004,
          width: 14 + Math.random() * 12,
          phase: i * 0.8,
        });
      }
      for (let i = 0; i < 35; i++) {
        particles.push({
          x: Math.random(),
          y: Math.random(),
          vx: (Math.random() - 0.5) * 0.0002,
          vy: -0.00015 - Math.random() * 0.0002,
          size: 2 + Math.random() * 4,
          alpha: 0.2 + Math.random() * 0.4,
          baseAlpha: 0.35,
          phase: Math.random() * Math.PI * 2,
          color: Math.random() > 0.5 ? '#B692FE' : '#6BD4B8',
        });
      }
    }

    sceneStateRef.current = {
      particles,
      clouds,
      organicTendrils,
      time: 0,
    };
  }, [categoryId]);

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isSubscribed = true;

    const render = () => {
      if (!isSubscribed) return;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const state = sceneStateRef.current;
      state.time += isRunning ? 0.016 : 0.006;
      const t = state.time;

      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const breathScale = 1 + Math.sin(breathPhase * Math.PI * 2) * 0.055;

      // =========================================================================
      // 1. AMBIENT STARLIGHT — Meditating Monk in Lotus Position
      // =========================================================================
      if (categoryId === 'starlight') {
        // Deep cosmic starfield
        for (const p of state.particles) {
          p.x = (p.x + p.vx + 1) % 1;
          p.y = (p.y + p.vy + 1) % 1;
          const twinkle = 0.5 + 0.5 * Math.sin(t * 1.5 + p.phase);
          const px = p.x * width;
          const py = p.y * height;

          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 242, 214, ${p.alpha * twinkle})`;
          ctx.fill();
        }

        // Celestial Halo behind Monk Head
        const monkCenterY = height * 0.53;
        const haloGrad = ctx.createRadialGradient(
          centerX,
          monkCenterY - 45,
          5,
          centerX,
          monkCenterY - 45,
          135 * breathScale
        );
        haloGrad.addColorStop(0, 'rgba(255, 201, 120, 0.45)');
        haloGrad.addColorStop(0.4, 'rgba(111, 191, 196, 0.18)');
        haloGrad.addColorStop(1, 'rgba(10, 8, 28, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(centerX, monkCenterY - 45, 135 * breathScale, 0, Math.PI * 2);
        ctx.fill();

        // Subtle celestial ring
        ctx.beginPath();
        ctx.arc(centerX, monkCenterY - 45, 75 * breathScale, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 201, 120, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // ONLY Category with the Meditating Monk
        drawMonkSilhouette(ctx, centerX, monkCenterY, breathScale, '#121029', '#FFC978');
      }

      // =========================================================================
      // 2. JOY — Beautiful Warm Sunrise (NO PERSON)
      // =========================================================================
      else if (categoryId === 'joy') {
        // Sun elevation moves gently upward based on progress (from horizon to warm dawn height)
        const horizonY = height * 0.72;
        const sunRiseOffset = Math.min(0.35, progress * 0.2 + 0.08) * height;
        const sunY = horizonY - sunRiseOffset;
        const sunRadius = Math.min(width, height) * 0.18 * breathScale;

        // Sky atmosphere gradient (warm golden, orange, subtle pink)
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#261226');
        skyGrad.addColorStop(0.4, '#3D1B36');
        skyGrad.addColorStop(0.7, '#6E2A3B');
        skyGrad.addColorStop(1, '#A04535');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Radiant sunlight corona
        const coronaGrad = ctx.createRadialGradient(
          centerX,
          sunY,
          sunRadius * 0.2,
          centerX,
          sunY,
          height * 0.7
        );
        coronaGrad.addColorStop(0, 'rgba(255, 226, 150, 0.55)');
        coronaGrad.addColorStop(0.3, 'rgba(255, 169, 107, 0.35)');
        coronaGrad.addColorStop(0.7, 'rgba(255, 120, 110, 0.15)');
        coronaGrad.addColorStop(1, 'rgba(38, 18, 38, 0)');
        ctx.fillStyle = coronaGrad;
        ctx.fillRect(0, 0, width, height);

        // Soft expanding sunburst light rays
        ctx.save();
        ctx.translate(centerX, sunY);
        const rayCount = 14;
        for (let i = 0; i < rayCount; i++) {
          const rayAngle = (i * Math.PI * 2) / rayCount + t * 0.025;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, height * 0.85, rayAngle - 0.07, rayAngle + 0.07);
          ctx.closePath();
          ctx.fillStyle = 'rgba(255, 230, 160, 0.04)';
          ctx.fill();
        }
        ctx.restore();

        // The Large Soft Sun Orb
        const sunOrbGrad = ctx.createRadialGradient(
          centerX,
          sunY,
          0,
          centerX,
          sunY,
          sunRadius
        );
        sunOrbGrad.addColorStop(0, '#FFF6DB');
        sunOrbGrad.addColorStop(0.4, '#FFD166');
        sunOrbGrad.addColorStop(0.85, 'rgba(255, 169, 107, 0.8)');
        sunOrbGrad.addColorStop(1, 'rgba(255, 169, 107, 0)');
        ctx.fillStyle = sunOrbGrad;
        ctx.beginPath();
        ctx.arc(centerX, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fill();

        // Slow soft clouds floating across sunrise horizon
        for (const c of state.clouds) {
          c.x = (c.x + c.speed) % 1.4;
          const cx = (c.x - 0.2) * width;
          const cy = c.y * height;
          drawWarmSunriseCloud(ctx, cx, cy, c.scale, c.opacity);
        }

        // Soft Mountain / Horizon line at bottom
        ctx.beginPath();
        ctx.moveTo(0, horizonY + 25);
        ctx.quadraticCurveTo(width * 0.3, horizonY - 15, width * 0.55, horizonY + 10);
        ctx.quadraticCurveTo(width * 0.8, horizonY + 35, width, horizonY + 5);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = '#180B19';
        ctx.fill();

        // Floating upward warm golden light particles
        for (const p of state.particles) {
          p.y += p.vy;
          p.x += p.vx + Math.sin(t * 1.5 + p.phase) * 0.0003;
          if (p.y < -0.05) p.y = 1.05;
          if (p.x < 0) p.x = 1;
          if (p.x > 1) p.x = 0;

          const px = p.x * width;
          const py = p.y * height;
          const pulse = 0.6 + 0.4 * Math.sin(t * 2 + p.phase);

          ctx.beginPath();
          ctx.arc(px, py, p.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 209, 102, ${p.alpha * pulse * 0.3})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color || '#FFD166';
          ctx.globalAlpha = p.alpha * pulse;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      // =========================================================================
      // 3. CALM — Minimal Peaceful Water (NO PERSON)
      // =========================================================================
      else if (categoryId === 'calm') {
        const horizonY = height * 0.48;

        // Dark-blue/teal sky gradient
        const calmSkyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
        calmSkyGrad.addColorStop(0, '#030C14');
        calmSkyGrad.addColorStop(0.7, '#071A24');
        calmSkyGrad.addColorStop(1, '#0C2A38');
        ctx.fillStyle = calmSkyGrad;
        ctx.fillRect(0, 0, width, horizonY);

        // Soft Moon in upper sky
        const moonX = centerX;
        const moonY = height * 0.22;
        const moonRadius = 32 * breathScale;

        const moonAura = ctx.createRadialGradient(moonX, moonY, 5, moonX, moonY, 140);
        moonAura.addColorStop(0, 'rgba(111, 191, 196, 0.45)');
        moonAura.addColorStop(0.5, 'rgba(74, 144, 226, 0.15)');
        moonAura.addColorStop(1, 'rgba(7, 26, 36, 0)');
        ctx.fillStyle = moonAura;
        ctx.beginPath();
        ctx.arc(moonX, moonY, 140, 0, Math.PI * 2);
        ctx.fill();

        // Moon disc
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(215, 245, 248, 0.9)';
        ctx.shadowColor = '#6FBFC4';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Calm dark-blue/teal Water Area
        const waterGrad = ctx.createLinearGradient(0, horizonY, 0, height);
        waterGrad.addColorStop(0, '#09212C');
        waterGrad.addColorStop(0.4, '#06161E');
        waterGrad.addColorStop(1, '#02090F');
        ctx.fillStyle = waterGrad;
        ctx.fillRect(0, horizonY, width, height - horizonY);

        // Soft Shimmering Moon Reflection on Water
        const reflGrad = ctx.createRadialGradient(
          moonX,
          horizonY + 30,
          10,
          moonX,
          height * 0.8,
          width * 0.28
        );
        reflGrad.addColorStop(0, 'rgba(111, 191, 196, 0.35)');
        reflGrad.addColorStop(0.6, 'rgba(74, 144, 226, 0.12)');
        reflGrad.addColorStop(1, 'rgba(6, 22, 30, 0)');
        ctx.fillStyle = reflGrad;
        ctx.fillRect(moonX - width * 0.3, horizonY, width * 0.6, height - horizonY);

        // Gentle horizontal water ripples
        const rippleCount = 18;
        for (let i = 0; i < rippleCount; i++) {
          const ry = horizonY + (i / rippleCount) * (height - horizonY) + Math.sin(t * 0.8 + i) * 3;
          const rippleWidth = 40 + i * 22 + Math.sin(t * 1.2 + i * 0.7) * 25;
          const rippleAlpha = 0.12 + (i / rippleCount) * 0.2 + Math.sin(t * 0.6 + i) * 0.05;

          ctx.beginPath();
          ctx.ellipse(
            moonX + Math.sin(t * 0.5 + i * 0.4) * (8 + i * 1.5),
            ry,
            rippleWidth * 0.5,
            1.2 + (i / rippleCount) * 1.5,
            0,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(168, 230, 235, ${rippleAlpha})`;
          ctx.fill();
        }

        // Drifting water mist particles along horizon
        for (const p of state.particles) {
          p.x = (p.x + p.vx + 1) % 1;
          const px = p.x * width;
          const py = p.y * height;
          ctx.beginPath();
          ctx.ellipse(px, py, p.size * 3.5, p.size * 1.2, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(111, 191, 196, ${p.alpha * 0.35})`;
          ctx.fill();
        }
      }

      // =========================================================================
      // 4. FOCUS — Abstract Single Glowing Point (NO PERSON)
      // =========================================================================
      else if (categoryId === 'focus') {
        // Deep still dark navy/black background with vast empty space
        // Concentric resonance circles around single point
        const rings = [35, 70, 115, 170, 235];
        rings.forEach((rBase, idx) => {
          const r = (rBase + Math.sin(t * 0.8 + idx * 0.5) * 4) * breathScale;
          ctx.beginPath();
          ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(138, 153, 255, ${0.35 - idx * 0.06})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        });

        // Ambient radial light pool around the point
        const orbGlow = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          95 * breathScale
        );
        orbGlow.addColorStop(0, 'rgba(163, 177, 255, 0.7)');
        orbGlow.addColorStop(0.3, 'rgba(138, 153, 255, 0.35)');
        orbGlow.addColorStop(0.7, 'rgba(94, 114, 235, 0.12)');
        orbGlow.addColorStop(1, 'rgba(13, 17, 39, 0)');
        ctx.fillStyle = orbGlow;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 95 * breathScale, 0, Math.PI * 2);
        ctx.fill();

        // The Single Luminous Core Point
        const coreRadius = 7 * breathScale;
        ctx.beginPath();
        ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#8A99FF';
        ctx.shadowBlur = 24;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // =========================================================================
      // 5. SLEEP — Moon & Clouds (NO PERSON)
      // =========================================================================
      else if (categoryId === 'sleep') {
        // Progressive darkening curve as session advances
        const sleepDimFactor = Math.max(0.32, 1 - progress * 0.68);

        // Night sky gradient (deep navy / twilight violet)
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, `rgba(11, 9, 23, ${sleepDimFactor})`);
        skyGrad.addColorStop(0.6, `rgba(18, 13, 34, ${sleepDimFactor})`);
        skyGrad.addColorStop(1, `rgba(4, 3, 10, ${sleepDimFactor})`);
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Few dim stars fading in and out
        for (const p of state.particles) {
          const twinkle = 0.4 + 0.6 * Math.sin(t * 0.6 + p.phase);
          ctx.beginPath();
          ctx.arc(p.x * width, p.y * height, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180, 165, 223, ${p.alpha * twinkle * sleepDimFactor})`;
          ctx.fill();
        }

        // Large Soft Moon
        const moonX = centerX;
        const moonY = centerY - 30;
        const moonRadius = Math.min(width, height) * 0.16 * breathScale;

        // Soft moon aura
        const moonGlow = ctx.createRadialGradient(
          moonX,
          moonY,
          moonRadius * 0.5,
          moonX,
          moonY,
          moonRadius * 2.8
        );
        moonGlow.addColorStop(0, `rgba(180, 165, 223, ${0.45 * sleepDimFactor})`);
        moonGlow.addColorStop(0.5, `rgba(136, 116, 194, ${0.18 * sleepDimFactor})`);
        moonGlow.addColorStop(1, 'rgba(11, 9, 23, 0)');
        ctx.fillStyle = moonGlow;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Moon disc
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(225, 218, 245, ${0.85 * sleepDimFactor})`;
        ctx.shadowColor = 'rgba(180, 165, 223, 0.5)';
        ctx.shadowBlur = 25 * sleepDimFactor;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Slow-moving nocturnal clouds passing in front of and around the moon
        for (const c of state.clouds) {
          c.x = (c.x + c.speed) % 1.5;
          const cx = (c.x - 0.25) * width;
          const cy = c.y * height;
          drawSleepCloud(ctx, cx, cy, c.scale, c.opacity * sleepDimFactor);
        }
      }

      // =========================================================================
      // 6. STRESS RELIEF — Dissolving Particles (NO PERSON)
      // =========================================================================
      else if (categoryId === 'stress') {
        const releaseProgress = Math.min(1, Math.max(0, progress));

        // Atmospheric shift from dense charcoal/tension to clean, serene spacious turquoise
        const tensionR = Math.round(255 - releaseProgress * 165);
        const tensionG = Math.round(120 + releaseProgress * 95);
        const tensionB = Math.round(120 + releaseProgress * 115);

        const atmoGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          5,
          centerX,
          centerY,
          height * 0.65
        );
        atmoGrad.addColorStop(0, `rgba(${tensionR}, ${tensionG}, ${tensionB}, ${0.35 - releaseProgress * 0.2})`);
        atmoGrad.addColorStop(1, 'rgba(14, 10, 22, 0)');
        ctx.fillStyle = atmoGrad;
        ctx.fillRect(0, 0, width, height);

        // Center serene equilibrium core that emerges as particles dissolve
        if (releaseProgress > 0.3) {
          const coreAlpha = (releaseProgress - 0.3) / 0.7;
          const calmCore = ctx.createRadialGradient(
            centerX,
            centerY,
            0,
            centerX,
            centerY,
            90 * breathScale
          );
          calmCore.addColorStop(0, `rgba(105, 210, 231, ${0.45 * coreAlpha})`);
          calmCore.addColorStop(1, 'rgba(105, 210, 231, 0)');
          ctx.fillStyle = calmCore;
          ctx.beginPath();
          ctx.arc(centerX, centerY, 90 * breathScale, 0, Math.PI * 2);
          ctx.fill();
        }

        // Swirling particles dissolving and moving outward into open space
        for (const p of state.particles) {
          if (p.angle !== undefined && p.dist !== undefined && p.speed !== undefined) {
            // Speed slows down as tension is released
            p.angle += p.speed * (1 - releaseProgress * 0.75);

            // Distance expands outward as progress increases (particles disperse)
            const currentDist = p.dist + releaseProgress * (width * 0.45);
            const px = centerX + Math.cos(p.angle) * currentDist;
            const py = centerY + Math.sin(p.angle) * (currentDist * 0.8);

            // Particles fade away as they disperse toward edges
            const particleAlpha = p.alpha * Math.max(0, 1 - releaseProgress * 0.85);

            if (particleAlpha > 0.01) {
              ctx.beginPath();
              ctx.arc(px, py, p.size * (1 + releaseProgress * 0.4), 0, Math.PI * 2);
              ctx.fillStyle = releaseProgress > 0.4 ? '#69D2E7' : '#FF8A8A';
              ctx.globalAlpha = particleAlpha;
              ctx.fill();
              ctx.globalAlpha = 1;
            }
          }
        }
      }

      // =========================================================================
      // 7. GRATITUDE — Warm Field of Floating Golden Lights (NO PERSON)
      // =========================================================================
      else if (categoryId === 'gratitude') {
        // Warm central golden glow expanding gently with breathing
        const heartGlowRadius = 140 * breathScale * (1 + progress * 0.2);
        const warmGlow = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          heartGlowRadius
        );
        warmGlow.addColorStop(0, 'rgba(255, 212, 143, 0.45)');
        warmGlow.addColorStop(0.4, 'rgba(255, 184, 82, 0.25)');
        warmGlow.addColorStop(0.8, 'rgba(224, 109, 83, 0.08)');
        warmGlow.addColorStop(1, 'rgba(36, 20, 13, 0)');
        ctx.fillStyle = warmGlow;
        ctx.beginPath();
        ctx.arc(centerX, centerY, heartGlowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Hundreds of tiny soft golden lights slowly floating upward
        for (const p of state.particles) {
          p.y += p.vy;
          p.x += p.vx + Math.sin(t * 1.5 + p.phase) * 0.0003;

          if (p.y < -0.05) {
            p.y = 1.05;
            p.x = Math.random();
          }

          const px = p.x * width;
          const py = p.y * height;
          const pulse = 0.4 + 0.6 * Math.sin(t * 2.2 + p.phase);

          // Soft light halo
          ctx.beginPath();
          ctx.arc(px, py, p.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 184, 82, ${p.alpha * pulse * 0.35})`;
          ctx.fill();

          // Bright light core
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color || '#FFD48F';
          ctx.globalAlpha = p.alpha * pulse;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      // =========================================================================
      // 8. HEALING / INNER PEACE — Growing Soft Light & Organic Shapes (NO PERSON)
      // =========================================================================
      else if (categoryId === 'healing') {
        // Central soft light source that slowly grows over session
        const lightGrowthFactor = 1 + progress * 0.65;
        const centralLightRadius = 110 * breathScale * lightGrowthFactor;

        const healingLightGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          centralLightRadius
        );
        healingLightGrad.addColorStop(0, 'rgba(235, 225, 255, 0.65)');
        healingLightGrad.addColorStop(0.35, 'rgba(182, 146, 254, 0.35)');
        healingLightGrad.addColorStop(0.7, 'rgba(107, 212, 184, 0.15)');
        healingLightGrad.addColorStop(1, 'rgba(20, 20, 43, 0)');
        ctx.fillStyle = healingLightGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, centralLightRadius, 0, Math.PI * 2);
        ctx.fill();

        // Translucent organic flowing tendrils moving like slow underwater botanical flora
        ctx.save();
        ctx.translate(centerX, centerY);
        for (const tendril of state.organicTendrils) {
          tendril.baseAngle += tendril.speed;
          const angle = tendril.baseAngle;
          const waveOsc = Math.sin(t * 1.2 + tendril.phase) * 15;
          const currentLen = (tendril.length + waveOsc) * breathScale;

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(
            Math.cos(angle + 0.3) * (currentLen * 0.5),
            Math.sin(angle + 0.3) * (currentLen * 0.5),
            Math.cos(angle) * currentLen,
            Math.sin(angle) * currentLen
          );
          ctx.quadraticCurveTo(
            Math.cos(angle - 0.3) * (currentLen * 0.5),
            Math.sin(angle - 0.3) * (currentLen * 0.5),
            0,
            0
          );
          ctx.closePath();

          const tendrilGrad = ctx.createLinearGradient(
            0,
            0,
            Math.cos(angle) * currentLen,
            Math.sin(angle) * currentLen
          );
          tendrilGrad.addColorStop(0, 'rgba(182, 146, 254, 0.35)');
          tendrilGrad.addColorStop(1, 'rgba(107, 212, 184, 0.05)');
          ctx.fillStyle = tendrilGrad;
          ctx.fill();
        }
        ctx.restore();

        // Gentle floating organic particles
        for (const p of state.particles) {
          p.x = (p.x + p.vx + 1) % 1;
          p.y = (p.y + p.vy + 1) % 1;
          const px = p.x * width;
          const py = p.y * height;
          const pulse = 0.5 + 0.5 * Math.sin(t + p.phase);

          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color || '#B692FE';
          ctx.globalAlpha = p.alpha * pulse;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isSubscribed = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [categoryId, isRunning, progress, breathPhase]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background Gradient Layer tailored to Category */}
      <div
        className="absolute inset-0 transition-colors duration-1000 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${category.colors.backgroundFrom} 0%, ${category.colors.backgroundVia} 55%, ${category.colors.backgroundTo} 100%)`,
        }}
      />
      <canvas ref={canvasRef} className="w-full h-full block relative z-10 pointer-events-none" />
    </div>
  );
};

// =========================================================================
// CUSTOM ARTISTIC HELPERS (ONLY STARLIGHT USES THE MEDITATING MONK)
// =========================================================================

/** Lotus Monk Silhouette with clean vector curves (ONLY used for Ambient Starlight) */
function drawMonkSilhouette(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  fillColor: string,
  edgeGlowColor: string
) {
  ctx.save();
  ctx.translate(cx, cy + 20);
  ctx.scale(scale * 1.15, scale * 1.15);

  ctx.shadowColor = edgeGlowColor;
  ctx.shadowBlur = 18;

  ctx.fillStyle = fillColor;

  // Head
  ctx.beginPath();
  ctx.arc(0, -68, 16, 0, Math.PI * 2);
  ctx.fill();

  // Neck and Shoulders
  ctx.beginPath();
  ctx.moveTo(-7, -52);
  ctx.lineTo(7, -52);
  ctx.lineTo(26, -38);
  ctx.quadraticCurveTo(34, -20, 28, 0);
  ctx.lineTo(52, 28);
  ctx.quadraticCurveTo(30, 40, 0, 40);
  ctx.quadraticCurveTo(-30, 40, -52, 28);
  ctx.lineTo(-28, 0);
  ctx.quadraticCurveTo(-34, -20, -26, -38);
  ctx.closePath();
  ctx.fill();

  // Lap / hands in Dhyana Mudra
  ctx.beginPath();
  ctx.ellipse(0, 18, 18, 9, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#1A1836';
  ctx.fill();

  // Subtle edge highlight
  ctx.strokeStyle = 'rgba(255, 201, 120, 0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

/** Soft Warm Cloud for Joy Sunrise Scene */
function drawWarmSunriseCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  opacity: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale * 0.75);
  ctx.fillStyle = `rgba(255, 185, 140, ${opacity})`;

  ctx.beginPath();
  ctx.arc(0, 0, 38, 0, Math.PI * 2);
  ctx.arc(36, -12, 46, 0, Math.PI * 2);
  ctx.arc(80, 2, 36, 0, Math.PI * 2);
  ctx.arc(44, 18, 40, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/** Soft Nocturnal Cloud for Sleep Scene */
function drawSleepCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  opacity: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale * 0.7);
  ctx.fillStyle = `rgba(180, 165, 223, ${opacity})`;

  ctx.beginPath();
  ctx.arc(0, 0, 42, 0, Math.PI * 2);
  ctx.arc(40, -10, 50, 0, Math.PI * 2);
  ctx.arc(88, 4, 38, 0, Math.PI * 2);
  ctx.arc(48, 18, 42, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
