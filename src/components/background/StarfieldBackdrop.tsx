import React, { useMemo } from 'react';

export const StarfieldBackdrop: React.FC = () => {
  // Generate deterministic stars for smooth server/client consistency
  const stars = useMemo(() => {
    const starList = [];
    // 80 micro stars
    for (let i = 0; i < 80; i++) {
      starList.push({
        id: i,
        top: `${(i * 13.7) % 100}%`,
        left: `${(i * 29.3) % 100}%`,
        size: (i % 3 === 0 ? 2 : 1.2) + ((i * 7) % 10) * 0.1,
        opacity: 0.2 + ((i * 17) % 60) * 0.01,
        twinkleDuration: 3 + (i % 5) * 1.5,
        twinkleDelay: (i % 7) * 0.8,
        color: i % 4 === 0 ? '#FFC978' : i % 5 === 0 ? '#6FBFC4' : '#F5F2ED',
      });
    }
    return starList;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Base Deep Night Sky Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#121029] via-[#1A1836] to-[#24214A]" />

      {/* Atmospheric Horizon Warmth / Shinkai Twilight Glow */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_100%_60%_at_50%_0%,rgba(45,42,92,0.6)_0%,transparent_70%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-96 opacity-25 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(255,201,120,0.15)_0%,rgba(111,191,196,0.1)_40%,transparent_80%)]" />

      {/* Subtle Film Grain Noise Texture */}
      <div className="absolute inset-0 bg-noise opacity-40 mix-blend-overlay" />

      {/* Twinkling Star Points */}
      <div className="absolute inset-0">
        {stars.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full"
            style={{
              top: s.top,
              left: s.left,
              width: `${s.size}px`,
              height: `${s.size}px`,
              backgroundColor: s.color,
              opacity: s.opacity,
              boxShadow: s.size > 1.8 ? `0 0 6px ${s.color}` : 'none',
              animation: `pulseSubtle ${s.twinkleDuration}s ease-in-out ${s.twinkleDelay}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
