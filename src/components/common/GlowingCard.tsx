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
  className,
  delay = 0,
  interactive = false,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.35,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={
        interactive
          ? {
              y: -2,
              transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
            }
          : undefined
      }
      onClick={onClick}
      className={twMerge(
        clsx(
          'relative rounded-2xl p-6 sm:p-7 overflow-hidden',
          'bg-[#11131A] border border-white/[0.08]',
          'shadow-[0_16px_36px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]',
          'transition-all duration-200 hover:border-white/[0.16] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.1)]',
          interactive && 'cursor-pointer',
          className
        )
      )}
    >
      {/* 1px Subtly Graduated Top Rim Highlight */}
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
