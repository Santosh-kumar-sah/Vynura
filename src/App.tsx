import React from 'react';
import { StarfieldBackdrop } from './components/background/StarfieldBackdrop';
import { FireflyCanvas } from './components/background/FireflyCanvas';
import { ShootingStar } from './components/background/ShootingStar';
import { Navbar } from './components/common/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { ConceptSection } from './components/sections/ConceptSection';
import { FeaturesSection } from './components/sections/FeaturesSection';
import { PrivacySection } from './components/sections/PrivacySection';
import { Footer } from './components/sections/Footer';

export const App: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#1A1836] text-[#F5F2ED] selection:bg-[#FFC978]/30 selection:text-[#FFF2D6] overflow-x-hidden font-body">
      {/* 1. Starfield Layer (Stars, Twinkles & Ambient Horizon) */}
      <StarfieldBackdrop />

      {/* 2. Signature Firefly Particle System with Cursor Parallax */}
      <FireflyCanvas />

      {/* 3. Signature Load-In & Ambient Shooting Star Streaks */}
      <ShootingStar />

      {/* 4. Top Navigation Bar */}
      <Navbar />

      {/* 5. Main Content Assembly */}
      <main className="relative z-10">
        <HeroSection />
        <ConceptSection />
        <FeaturesSection />
        <PrivacySection />
      </main>

      {/* 6. Celestial Footer */}
      <Footer />
    </div>
  );
};

export default App;
