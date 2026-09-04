import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CloseButtonProps {
  to?: string;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
}

export const CloseButton: React.FC<CloseButtonProps> = ({
  to = '/',
  onClick,
  ariaLabel = 'Return to Home Sanctuary',
  className = '',
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(to);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      transition={{
        type: 'spring',
        stiffness: 450,
        damping: 22,
        mass: 0.7,
      }}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`fixed top-4 right-4 sm:top-6 sm:right-8 z-50 w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full bg-[#1A1836]/90 hover:bg-[#2D2A5C] border border-[#FFC978]/40 hover:border-[#FFC978]/80 text-[#F5F2ED] hover:text-[#FFC978] flex items-center justify-center shadow-glow-sm hover:shadow-glow-md backdrop-blur-xl transition-colors cursor-pointer select-none ${className}`}
      style={{
        marginTop: 'max(0px, env(safe-area-inset-top))',
        marginRight: 'max(0px, env(safe-area-inset-right))',
      }}
    >
      <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
      <span className="sr-only">{ariaLabel}</span>
    </motion.button>
  );
};
