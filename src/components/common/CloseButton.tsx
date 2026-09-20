import React from 'react';
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
  ariaLabel = 'Close view',
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
    <button
      onClick={handleClick}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`fixed top-4 right-4 sm:top-5 sm:right-6 z-50 w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer select-none active:scale-[0.97] ${className}`}
    >
      <X className="w-4 h-4 stroke-[1.75]" />
      <span className="sr-only">{ariaLabel}</span>
    </button>
  );
};
