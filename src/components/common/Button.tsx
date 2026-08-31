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
    sm: 'px-3.5 py-1.5 text-xs font-semibold rounded-lg gap-1.5',
    md: 'px-5 py-2.5 text-sm font-semibold rounded-xl gap-2',
    lg: 'px-7 py-3.5 text-base font-bold rounded-2xl gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#FFC978] via-[#FFD699] to-[#FFA843] text-[#1A1836] shadow-glow-md hover:shadow-glow-lg border border-[#FFF2D6]/40 font-bold',
    secondary:
      'bg-[#2D2A5C]/60 text-[#F5F2ED] border border-[#B8B4D9]/30 hover:border-[#FFC978]/60 hover:bg-[#2D2A5C]/90 backdrop-blur-md shadow-edge-lavender',
    ghost:
      'bg-transparent text-[#B8B4D9] hover:text-[#F5F2ED] hover:bg-[#2D2A5C]/40 border border-transparent',
    glow:
      'bg-[#1A1836]/80 text-[#FFC978] border border-[#FFC978]/50 shadow-glow-sm hover:shadow-glow-md hover:bg-[#2D2A5C]/80',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -1 }}
      whileTap={{ scale: 0.94, y: 1 }}
      transition={{
        type: 'spring',
        stiffness: 420,
        damping: 18,
        mass: 0.8,
      }}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center transition-colors cursor-pointer select-none outline-none relative overflow-hidden group',
          sizeStyles[size],
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="transition-transform duration-200 group-hover:-translate-x-0.5">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="transition-transform duration-200 group-hover:translate-x-0.5">{icon}</span>
      )}
    </motion.button>
  );
};
