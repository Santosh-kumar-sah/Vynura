import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartHandshake, 
  Wind, 
  Moon, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import type { MeditationCategoryId } from '../../types/meditation';
import { MEDITATION_CATEGORIES_LIST } from '../../types/meditation';
import { BreathingGuide } from './BreathingGuide';
import { MeditationTimer } from './MeditationTimer';
import { GratitudePromptHub } from './GratitudePromptHub';
import { GlowingCard } from '../common/GlowingCard';
import { CATEGORY_ICONS } from './meditation/MeditationCategoryPicker';

interface WellnessActionsHubProps {
  onRefreshConstellation?: () => void;
}

export const WellnessActionsHub: React.FC<WellnessActionsHubProps> = ({
  onRefreshConstellation,
}) => {
  const [activeBreathingModal, setActiveBreathingModal] = useState<boolean>(false);
  const [breathingTech, setBreathingTech] = useState<'478' | 'box' | 'calm'>('478');
  const [activeMeditationModal, setActiveMeditationModal] = useState<boolean>(false);
  const [selectedMeditationCategory, setSelectedMeditationCategory] = useState<MeditationCategoryId>('starlight');

  const handleLaunchBreathing = (tech: '478' | 'box' | 'calm') => {
    setBreathingTech(tech);
    setActiveBreathingModal(true);
  };

  const handleLaunchMeditation = (category: MeditationCategoryId) => {
    setSelectedMeditationCategory(category);
    setActiveMeditationModal(true);
  };

  return (
    <section
      id="wellness"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C25AE0] mb-2">
            <HeartHandshake className="w-4 h-4" />
            <span>04 / SANCTUARY · Somatic & Mindful Hub</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#F5F2ED] tracking-tight mb-2">
            Wellness Actions Hub
          </h2>

          <p className="text-sm sm:text-base text-[#B8B4D9] max-w-xl leading-relaxed">
            Targeted somatic and mindful interventions designed to harmonize your parasympathetic nervous system with 8 distinct immersive meditation realms.
          </p>
        </motion.div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121029]/80 border border-[#C25AE0]/30 text-xs font-semibold text-[#C25AE0]">
          <ShieldCheck className="w-4 h-4" />
          <span>Evidence-Based Somatic Rhythms</span>
        </div>
      </div>

      {/* 2 Primary Modality Action Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10 items-stretch">
        {/* Panel 1: Firefly Breathing Lung Guide */}
        <GlowingCard
          accentColor="#6FBFC4"
          interactive
          className="p-6 sm:p-8 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6FBFC4]/15 border border-[#6FBFC4]/40 flex items-center justify-center text-[#6FBFC4]">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#6FBFC4] font-bold">
                    Somatic Lung Pacer
                  </span>
                  <span className="text-xs text-[#FFC978] font-mono block">Firefly Pulse</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#2D2A5C] text-[11px] font-mono text-[#6FBFC4] border border-[#6FBFC4]/30">
                4-7-8 · Box · 4-6 Wave
              </span>
            </div>

            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F5F2ED] mb-2">
              Firefly Particle Breathing Pacer
            </h3>

            <p className="text-xs sm:text-sm text-[#B8B4D9] leading-relaxed mb-6">
              Watch firefly particles organically expand and contract with your lungs. Guides deep parasympathetic down-regulation to relieve acute anxiety and heart-rate volatility.
            </p>

            {/* Quick Technique Triggers */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <button
                onClick={() => handleLaunchBreathing('478')}
                className="p-2 rounded-xl bg-[#1A1836]/70 hover:bg-[#2D2A5C] border border-[#6FBFC4]/30 text-left text-xs font-semibold text-[#F5F2ED] transition-colors cursor-pointer"
              >
                <div className="text-[11px] text-[#6FBFC4]">4-7-8</div>
                <div className="text-[10px] text-[#B8B4D9]">Downshift</div>
              </button>
              <button
                onClick={() => handleLaunchBreathing('box')}
                className="p-2 rounded-xl bg-[#1A1836]/70 hover:bg-[#2D2A5C] border border-[#C25AE0]/30 text-left text-xs font-semibold text-[#F5F2ED] transition-colors cursor-pointer"
              >
                <div className="text-[11px] text-[#C25AE0]">4-4-4-4</div>
                <div className="text-[10px] text-[#B8B4D9]">Box Focus</div>
              </button>
              <button
                onClick={() => handleLaunchBreathing('calm')}
                className="p-2 rounded-xl bg-[#1A1836]/70 hover:bg-[#2D2A5C] border border-[#FF9E7D]/30 text-left text-xs font-semibold text-[#F5F2ED] transition-colors cursor-pointer"
              >
                <div className="text-[11px] text-[#FF9E7D]">4-6</div>
                <div className="text-[10px] text-[#B8B4D9]">Calm Wave</div>
              </button>
            </div>
          </div>

          <button
            onClick={() => handleLaunchBreathing('478')}
            className="w-full py-3 px-4 rounded-xl bg-[#6FBFC4] hover:bg-[#6FBFC4]/90 text-[#1A1836] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-glow-sm"
          >
            <span>Launch Full-Screen Breath Guide</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </GlowingCard>

        {/* Panel 2: Immersive Meditation Sanctuary */}
        <GlowingCard
          accentColor="#FFC978"
          interactive
          className="p-6 sm:p-8 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFC978]/15 border border-[#FFC978]/40 flex items-center justify-center text-[#FFC978]">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFC978] font-bold">
                    8 Distinct Realms
                  </span>
                  <span className="text-xs text-[#FFC978] font-mono block">Immersive Visuals</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#2D2A5C] text-[11px] font-mono text-[#FFC978] border border-[#FFC978]/30">
                1 to 20 Mins
              </span>
            </div>

            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F5F2ED] mb-2">
              Category-Based Immersive Meditation
            </h3>

            <p className="text-xs sm:text-sm text-[#B8B4D9] leading-relaxed mb-4">
              Step into purpose-built meditative environments featuring distinct procedural animations, synthesized ambient soundscapes, and auto-hiding distraction-free controls.
            </p>

            {/* Quick 8-Realm Chips Grid */}
            <div className="grid grid-cols-4 gap-1.5 mb-6">
              {MEDITATION_CATEGORIES_LIST.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleLaunchMeditation(cat.id)}
                  className="p-2 rounded-xl bg-[#1A1836]/80 hover:bg-[#2D2A5C] border text-left transition-all cursor-pointer flex flex-col items-center sm:items-start group"
                  style={{
                    borderColor: `${cat.colors.primary}30`,
                  }}
                  title={`${cat.name} — ${cat.subtitle}`}
                >
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center mb-1 group-hover:scale-110 transition-transform"
                    style={{ color: cat.colors.primary }}
                  >
                    {CATEGORY_ICONS[cat.id]}
                  </div>
                  <div className="text-[10px] font-bold text-[#F5F2ED] truncate w-full text-center sm:text-left">
                    {cat.name}
                  </div>
                  <div className="text-[8px] font-mono text-[#B8B4D9] truncate w-full text-center sm:text-left hidden sm:block">
                    {cat.subtitle.split(' ')[0]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleLaunchMeditation('starlight')}
            className="w-full py-3 px-4 rounded-xl bg-[#FFC978] hover:bg-[#FFC978]/90 text-[#1A1836] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-glow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Enter Immersive Meditation Sanctuary</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </GlowingCard>
      </div>

      {/* Rotating Gratitude & Reflection Prompts Deck */}
      <GratitudePromptHub onSaved={onRefreshConstellation} />

      {/* Full Screen Breathing Guide Modal */}
      <AnimatePresence>
        {activeBreathingModal && (
          <BreathingGuide
            isOpen={activeBreathingModal}
            technique={breathingTech}
            onClose={() => setActiveBreathingModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Category-Based Immersive Meditation Sanctuary Modal */}
      <AnimatePresence>
        {activeMeditationModal && (
          <MeditationTimer
            isOpen={activeMeditationModal}
            initialCategory={selectedMeditationCategory}
            onClose={() => setActiveMeditationModal(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
