import React, { useEffect, useRef } from 'react';

interface Firefly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  currentAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  driftAngle: number;
  driftSpeed: number;
  r: number;
  g: number;
  b: number;
  glowMultiplier: number;
}

export const FireflyCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    // Palette of warm Shinkai & Ghibli night tones
    const colorPalette = [
      { r: 255, g: 201, b: 120 }, // Warm Amber (#FFC978) - Main
      { r: 255, g: 201, b: 120 }, // Warm Amber (#FFC978) - Main weighted
      { r: 255, g: 158, b: 125 }, // Soft Coral (#FF9E7D)
      { r: 111, g: 191, b: 196 }, // Celestial Teal (#6FBFC4)
      { r: 255, g: 242, b: 214 }, // Moonlight Gold
    ];

    let fireflies: Firefly[] = [];

    // Mouse tracking for subtle organic parallax/repulsion
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 140,
      active: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Density calculation: ~45-55 on large screens, ~25 on mobile
      const count = Math.min(Math.max(Math.floor((width * height) / 24000), 28), 65);

      fireflies = [];
      for (let i = 0; i < count; i++) {
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        fireflies.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -0.15 - Math.random() * 0.3, // Gentle upward night drift
          radius: 1.2 + Math.random() * 2.2,
          baseAlpha: 0.25 + Math.random() * 0.55,
          currentAlpha: 0.3,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.025,
          driftAngle: Math.random() * Math.PI * 2,
          driftSpeed: 0.008 + Math.random() * 0.012,
          r: color.r,
          g: color.g,
          b: color.b,
          glowMultiplier: 2.5 + Math.random() * 2,
        });
      }
    };

    resize();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 16.66, 2.5);
      lastTime = time;

      // Smooth mouse coordinate lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < fireflies.length; i++) {
        const f = fireflies[i];

        // Pulse oscillation
        f.pulsePhase += f.pulseSpeed * dt;
        const pulse = (Math.sin(f.pulsePhase) + 1) / 2; // 0 to 1
        f.currentAlpha = f.baseAlpha * (0.35 + pulse * 0.65);

        // Sinusoidal floating drift
        f.driftAngle += f.driftSpeed * dt;
        const floatX = Math.cos(f.driftAngle) * 0.4;
        const floatY = Math.sin(f.driftAngle) * 0.3;

        f.x += (f.vx + floatX) * dt;
        f.y += (f.vy + floatY) * dt;

        // Interactive organic repulsion from cursor
        if (mouse.active) {
          const dx = f.x - mouse.x;
          const dy = f.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const maxDistSq = mouse.radius * mouse.radius;

          if (distSq < maxDistSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / mouse.radius) * 1.8;
            f.x += (dx / dist) * force * dt;
            f.y += (dy / dist) * force * dt;
            // Brighten slightly when interacting
            f.currentAlpha = Math.min(f.currentAlpha + 0.25, 0.95);
          }
        }

        // Screen wrap-around with graceful reset
        if (f.x < -20) f.x = width + 20;
        if (f.x > width + 20) f.x = -20;
        if (f.y < -20) f.y = height + 20;
        if (f.y > height + 20) f.y = -20;

        // Render soft glowing firefly
        const glowRadius = f.radius * f.glowMultiplier;
        const gradient = ctx.createRadialGradient(
          f.x,
          f.y,
          f.radius * 0.2,
          f.x,
          f.y,
          glowRadius * 2
        );

        gradient.addColorStop(0, `rgba(255, 255, 255, ${f.currentAlpha})`);
        gradient.addColorStop(0.2, `rgba(${f.r}, ${f.g}, ${f.b}, ${f.currentAlpha * 0.85})`);
        gradient.addColorStop(0.6, `rgba(${f.r}, ${f.g}, ${f.b}, ${f.currentAlpha * 0.25})`);
        gradient.addColorStop(1, `rgba(${f.r}, ${f.g}, ${f.b}, 0)`);

        ctx.beginPath();
        ctx.arc(f.x, f.y, glowRadius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Intense tiny luminous core
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${f.currentAlpha * 0.95})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-75 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
};
