import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlowingCardProps {
  children: React.ReactNode;
  accentColor?: string;
  className?: string;
  glowOnHover?: boolean;
  delay?: number;
  interactive?: boolean;
  onClick?: () => void;
}

export const GlowingCard: React.FC<GlowingCardProps> = ({
  children,
  accentColor = '#FFC978',
  className,
  glowOnHover = true,
  delay = 0,
  interactive = false,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.35,
        delay,
        ease: [0.34, 1.56, 0.64, 1], // Overshoot pop
      }}
      whileHover={
        interactive
          ? {
              y: -4,
              scale: 1.015,
              transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] },
            }
          : undefined
      }
      onClick={onClick}
      className={twMerge(
        clsx(
          'relative rounded-2xl p-6 sm:p-7 overflow-hidden',
          'bg-gradient-to-br from-[#24214A]/70 via-[#1D1B3E]/85 to-[#161430]/95',
          'backdrop-blur-xl border border-[#B8B4D9]/15',
          'shadow-[0_12px_36px_-8px_rgba(10,8,28,0.75)]',
          glowOnHover && 'transition-all duration-300 hover:border-[#FFC978]/40 hover:shadow-[0_0_30px_-5px_rgba(255,201,120,0.25)]',
          interactive && 'cursor-pointer',
          className
        )
      )}
    >
      {/* Top Edge Luminous Light Flare */}
      <div
        className="absolute top-0 left-10 right-10 h-[1.5px] opacity-70 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)`,
        }}
      />

      {/* Subtle Corner Accents */}
      <div className="absolute top-2.5 left-2.5 w-1.5 h-1.5 border-t border-l border-[#FFC978]/30 rounded-tl-sm pointer-events-none" />
      <div className="absolute bottom-2.5 right-2.5 w-1.5 h-1.5 border-b border-r border-[#FFC978]/30 rounded-br-sm pointer-events-none" />

      {/* Internal ambient glow blob */}
      <div
        className="absolute -top-16 -right-16 w-36 h-36 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
