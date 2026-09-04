import React from 'react';
import { motion } from 'framer-motion';

interface RouteTransitionProps {
  children: React.ReactNode;
  className?: string;
  isHome?: boolean;
}

const BRAND_EASE = [0.34, 1.56, 0.64, 1] as const;

const pushVariants = {
  initial: (isHome: boolean) => ({
    opacity: 0,
    scale: isHome ? 1.05 : 0.92,
    y: isHome ? -20 : 30,
  }),
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: BRAND_EASE,
    },
  },
  exit: (isHome: boolean) => ({
    opacity: 0,
    scale: isHome ? 0.95 : 1.05,
    y: isHome ? 20 : -30,
    transition: {
      duration: 0.22,
      ease: BRAND_EASE,
    },
  }),
};

export const RouteTransition: React.FC<RouteTransitionProps> = ({
  children,
  className = '',
  isHome = false,
}) => {
  return (
    <motion.div
      custom={isHome}
      variants={pushVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`relative w-full min-h-screen ${className}`}
    >
      {children}
    </motion.div>
  );
};
