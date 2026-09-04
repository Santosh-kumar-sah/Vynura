import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/sections/HeroSection';
import { ConceptSection } from '../components/sections/ConceptSection';
import { FeaturesSection } from '../components/sections/FeaturesSection';
import { PrivacySection } from '../components/sections/PrivacySection';
import { Footer } from '../components/sections/Footer';
import { RouteTransition } from '../components/common/RouteTransition';
import type { MoodType } from '../types';

interface HomeViewProps {
  activeMood: MoodType;
  onSelectMood: (mood: MoodType) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  activeMood,
  onSelectMood,
}) => {
  const navigate = useNavigate();

  return (
    <RouteTransition isHome>
      <main className="relative z-10">
        <HeroSection
          activeMood={activeMood}
          onSelectMood={onSelectMood}
          onStartJourney={() => navigate('/mood')}
        />
        <ConceptSection />
        <FeaturesSection />
        <PrivacySection />
      </main>
      <Footer />
    </RouteTransition>
  );
};
