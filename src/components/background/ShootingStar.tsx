import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Star {
  id: number;
  startX: number;
  startY: number;
  angle: number;
  length: number;
  duration: number;
  delay: number;
  color: string;
}

export const ShootingStar: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Signature intro shooting star right after initial mount
    const introStar: Star = {
      id: Date.now(),
      startX: window.innerWidth * 0.7,
      startY: window.innerHeight * 0.08,
      angle: 215, // angle in degrees
      length: 260,
      duration: 1.2,
      delay: 0.6,
      color: '#FFC978',
    };

    setStars([introStar]);

    // Secondary opening accent star
    const timer2 = setTimeout(() => {
      setStars((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          startX: window.innerWidth * 0.4,
          startY: window.innerHeight * 0.04,
          angle: 220,
          length: 190,
          duration: 0.9,
          delay: 0,
          color: '#6FBFC4',
        },
      ]);
    }, 1800);

    // Periodic organic shooting stars every 9-16 seconds
    const interval = setInterval(() => {
      const randomX = Math.random() * (window.innerWidth * 0.8) + window.innerWidth * 0.1;
      const randomY = Math.random() * (window.innerHeight * 0.35);
      const isAmber = Math.random() > 0.4;

      const newStar: Star = {
        id: Date.now(),
        startX: randomX,
        startY: randomY,
        angle: 205 + Math.random() * 25,
        length: 150 + Math.random() * 140,
        duration: 0.8 + Math.random() * 0.6,
        delay: 0,
        color: isAmber ? '#FFC978' : '#FFF2D6',
      };

      setStars((prev) => [...prev.slice(-3), newStar]);
    }, 11000);

    return () => {
      clearTimeout(timer2);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{
              x: star.startX,
              y: star.startY,
              opacity: 0,
              scale: 0.3,
            }}
            animate={{
              x: star.startX - Math.cos((star.angle * Math.PI) / 180) * 650,
              y: star.startY + Math.sin((star.angle * Math.PI) / 180) * 650,
              opacity: [0, 1, 1, 0],
              scale: [0.3, 1, 1, 0.4],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
            onAnimationComplete={() => {
              setStars((prev) => prev.filter((s) => s.id !== star.id));
            }}
            style={{
              position: 'absolute',
              transformOrigin: 'right center',
              rotate: `${star.angle - 180}deg`,
            }}
          >
            {/* Comet Head & Luminous Trail */}
            <div
              className="relative flex items-center"
              style={{ width: `${star.length}px`, height: '3px' }}
            >
              {/* Star Comet Tail */}
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, rgba(255, 201, 120, 0.2) 40%, ${star.color} 90%, #FFFFFF 100%)`,
                  filter: 'drop-shadow(0 0 6px rgba(255, 201, 120, 0.8))',
                }}
              />
              {/* Star Comet Brilliant Nucleus */}
              <div
                className="absolute right-0 w-2 h-2 rounded-full bg-white"
                style={{
                  boxShadow: `0 0 12px 3px ${star.color}, 0 0 24px 6px rgba(255, 255, 255, 0.9)`,
                }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
