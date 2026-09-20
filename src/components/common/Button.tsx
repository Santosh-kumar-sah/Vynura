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
    lg: 'px-6 py-3 text-sm sm:text-base font-semibold rounded-xl gap-2.5 tracking-tight',
  };

  const variantStyles = {
    primary:
      'bg-white text-[#090A0F] font-semibold border border-white/90 shadow-[0_1px_2px_rgba(0,0,0,0.5),0_4px_16px_rgba(255,255,255,0.1)] hover:bg-[#F1F5F9] transition-all duration-200',
    secondary:
      'bg-[#141722] text-[#F8FAFC] border border-white/10 hover:border-white/20 hover:bg-[#1C202E] shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-200',
    ghost:
      'bg-transparent text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.05] border border-transparent transition-all duration-200',
    glow:
      'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-200',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98, y: 1 }}
      transition={{
        duration: 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center cursor-pointer select-none outline-none relative overflow-hidden group',
          sizeStyles[size],
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">{icon}</span>
      )}
    </motion.button>
  );
};
