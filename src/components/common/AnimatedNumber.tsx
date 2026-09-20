import React, { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 800,
  format = (n) => Math.round(n).toString(),
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;
    const diff = value - startValue;

    if (diff === 0) return;

    let animId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Ease-out cubic curve for natural, rapid-then-settling motion
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + diff * easeOut;

      setDisplayValue(current);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    animId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animId);
  }, [value, duration]);

  return <span className={className}>{format(displayValue)}</span>;
};
