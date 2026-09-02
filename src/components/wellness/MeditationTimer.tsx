import React from 'react';
import type { MeditationCategoryId } from '../../types/meditation';
import { ImmersiveMeditationModal } from './meditation/ImmersiveMeditationModal';

export interface MeditationTimerProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: MeditationCategoryId;
  initialDuration?: number;
}

export const MeditationTimer: React.FC<MeditationTimerProps> = ({
  isOpen,
  onClose,
  initialCategory = 'starlight',
  initialDuration = 300,
}) => {
  return (
    <ImmersiveMeditationModal
      isOpen={isOpen}
      onClose={onClose}
      initialCategory={initialCategory}
      initialDuration={initialDuration}
    />
  );
};
