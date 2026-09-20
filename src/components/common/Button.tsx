import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'right',
  className,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5 tracking-tight',
    md: 'px-4 py-2 text-xs sm:text-sm font-medium rounded-xl gap-2 tracking-tight',
    lg: 'px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-xl gap-2.5 tracking-tight',
  };

  const variantStyles = {
    primary:
      'bg-white text-[#0B0A10] font-semibold border border-white/90 shadow-[0_1px_2px_rgba(0,0,0,0.5),0_4px_16px_rgba(255,255,255,0.08)] hover:bg-[#F4F4F5] transition-all duration-150',
    secondary:
      'bg-[#131219] text-white/90 border border-white/10 hover:border-white/20 hover:text-white hover:bg-[#1A1922] shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-150',
    ghost:
      'bg-transparent text-white/70 hover:text-white hover:bg-white/[0.04] border border-transparent transition-all duration-150',
    glow:
      'bg-[#F59E0B] text-[#0B0A10] font-semibold border border-amber-400 hover:bg-[#D97706] shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all duration-150',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{
        duration: 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center cursor-pointer select-none outline-none relative overflow-hidden group focus-visible:ring-2 focus-visible:ring-white/30',
          sizeStyles[size],
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="shrink-0 transition-transform duration-150 group-hover:-translate-x-0.5">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5">{icon}</span>
      )}
    </motion.button>
  );
};
