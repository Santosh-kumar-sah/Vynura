import React from 'react';
import { Wind } from 'lucide-react';
import { RouteTransition } from '../components/common/RouteTransition';
import { CloseButton } from '../components/common/CloseButton';
import { WellnessActionsHub } from '../components/wellness/WellnessActionsHub';

export const WellnessView: React.FC = () => {
  return (
    <RouteTransition>
      {/* Floating On-Brand X Close Button */}
      <CloseButton to="/" ariaLabel="Return to Night Sky Hub" />

      <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 space-y-12">
        {/* Dedicated Room Header */}
        <div className="border-b border-[#B8B4D9]/15 pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C25AE0] mb-2">
            <Wind className="w-4 h-4" />
            <span>Room 04 / Somatic Sanctuaries & Meditation</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-[#F5F2ED] tracking-tight mb-3">
            Wellness Actions Sanctuary
          </h1>
          <p className="text-sm sm:text-base text-[#B8B4D9] max-w-2xl leading-relaxed">
            Directly reset your autonomic nervous system with the Firefly Particle Breathing Pacer and 8 bespoke Fullscreen Immersive Meditation Environments.
          </p>
        </div>

        {/* Wellness Actions Hub */}
        <WellnessActionsHub />
      </div>
    </RouteTransition>
  );
};
