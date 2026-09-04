import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RouteTransition } from '../components/common/RouteTransition';
import { CloseButton } from '../components/common/CloseButton';
import { ImmersiveMeditationModal } from '../components/wellness/meditation/ImmersiveMeditationModal';
import type { MeditationCategoryId } from '../types/meditation';

export const MeditationView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryParam = searchParams.get('category') as MeditationCategoryId | null;
  const durationParam = Number(searchParams.get('duration'));

  const initialCategory: MeditationCategoryId = categoryParam || 'starlight';
  const initialDuration = durationParam > 0 ? durationParam : 300;

  const handleClose = () => {
    navigate('/wellness');
  };

  return (
    <RouteTransition>
      {/* Floating On-Brand Circular Close Button returning to Wellness Room */}
      <CloseButton to="/wellness" ariaLabel="Return to Wellness Actions Sanctuary" />

      {/* Full-Screen Immersive Meditation Sanctuary Room */}
      <ImmersiveMeditationModal
        isOpen={true}
        onClose={handleClose}
        initialCategory={initialCategory}
        initialDuration={initialDuration}
      />
    </RouteTransition>
  );
};

export default MeditationView;
