import React from 'react';
import { RouteTransition } from '../components/common/RouteTransition';
import { CloseButton } from '../components/common/CloseButton';
import { WellnessActionsHub } from '../components/wellness/WellnessActionsHub';

export const WellnessView: React.FC = () => {
  return (
    <RouteTransition>
      {/* Minimal Monochrome Close Button */}
      <CloseButton to="/" ariaLabel="Return to Overview" />

      <div className="relative min-h-screen pt-24 pb-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto z-10 space-y-12">
        {/* Clean Editorial Header */}
        <div className="border-b border-white/[0.06] pb-8">
          <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/50 mb-2">
            04 / AUTONOMIC SANCTUARY
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-2">
            Sensory Regulation Sanctuary.
          </h1>
          <p className="text-sm text-white/70 max-w-2xl leading-relaxed">
            Calibrated physiological resets pairing evidence-based vagal nerve breath pacing with distraction-free meditation soundscapes.
          </p>
        </div>

        {/* Wellness Actions Hub */}
        <WellnessActionsHub />
      </div>
    </RouteTransition>
  );
};
