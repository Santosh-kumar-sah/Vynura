import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wind, 
  Moon, 
  ArrowRight
} from 'lucide-react';
import type { MeditationCategoryId } from '../../types/meditation';
import { MEDITATION_CATEGORIES_LIST } from '../../types/meditation';
import { BreathingGuide } from './BreathingGuide';
import { MeditationTimer } from './MeditationTimer';
import { GratitudePromptHub } from './GratitudePromptHub';
import { CATEGORY_ICONS } from './meditation/MeditationCategoryPicker';

interface WellnessActionsHubProps {
  onRefreshConstellation?: () => void;
}

export const WellnessActionsHub: React.FC<WellnessActionsHubProps> = ({
  onRefreshConstellation,
}) => {
  const navigate = useNavigate();
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
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
            Restoration Modules
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-normal tracking-tight text-white mb-2">
            Targeted nervous system regulation
          </h2>

          <p className="text-sm text-neutral-400 max-w-xl leading-relaxed">
            Evidence-based somatic and mindfulness practices calibrated to downshift sympathetic nervous system arousal.
          </p>
        </motion.div>
      </div>

      {/* 2 Primary Modality Action Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10 items-stretch">
        {/* Panel 1: Somatic Respiratory Regulator */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#121316] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Wind className="w-5 h-5 text-white/70 stroke-[1.5]" />
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 block font-medium">
                    Pulmonary Pacer
                  </span>
                  <span className="text-xs text-neutral-500 font-mono">Autonomic Downshift</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-white/[0.03] text-[11px] font-mono text-neutral-400 border border-white/[0.08]">
                4-7-8 · Box · 4-6 Wave
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-medium text-white mb-2">
              Somatic Respiratory Regulator
            </h3>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
              Paced visual respirations structured to stimulate vagal tone and down-regulate autonomic stress responses.
            </p>

            {/* Quick Technique Triggers */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <button
                onClick={() => handleLaunchBreathing('478')}
                className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.15] text-left transition-colors cursor-pointer group"
              >
                <div className="text-xs font-mono text-amber-400">4-7-8</div>
                <div className="text-[11px] text-neutral-400 group-hover:text-white transition-colors">Downshift</div>
              </button>
              <button
                onClick={() => handleLaunchBreathing('box')}
                className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.15] text-left transition-colors cursor-pointer group"
              >
                <div className="text-xs font-mono text-amber-400">4-4-4-4</div>
                <div className="text-[11px] text-neutral-400 group-hover:text-white transition-colors">Box Focus</div>
              </button>
              <button
                onClick={() => handleLaunchBreathing('calm')}
                className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.15] text-left transition-colors cursor-pointer group"
              >
                <div className="text-xs font-mono text-amber-400">4-6</div>
                <div className="text-[11px] text-neutral-400 group-hover:text-white transition-colors">Calm Wave</div>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              onClick={() => navigate('/wellness/breathing')}
              className="flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Launch Breath Chamber</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleLaunchBreathing('478')}
              className="py-2.5 px-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              Quick Overlay
            </button>
          </div>
        </div>

        {/* Panel 2: Guided Attentional Practice */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#121316] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-white/70 stroke-[1.5]" />
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 block font-medium">
                    Mindfulness Protocols
                  </span>
                  <span className="text-xs text-neutral-500 font-mono">8 Environments</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-white/[0.03] text-[11px] font-mono text-neutral-400 border border-white/[0.08]">
                1 to 20 Mins
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-medium text-white mb-2">
              Guided Attentional Practices
            </h3>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
              Procedurally generated soundscapes and synchronized visual cues calibrated to shift mental equilibrium.
            </p>

            {/* Quick 8-Realm Chips Grid (flat, monochrome) */}
            <div className="grid grid-cols-4 gap-1.5 mb-6">
              {MEDITATION_CATEGORIES_LIST.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleLaunchMeditation(cat.id)}
                  className="p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] text-left transition-colors cursor-pointer flex flex-col items-center sm:items-start group"
                  title={`${cat.name} — ${cat.subtitle}`}
                >
                  <div className="text-white/60 group-hover:text-amber-400 transition-colors mb-1">
                    {CATEGORY_ICONS[cat.id]}
                  </div>
                  <div className="text-[10px] font-medium text-neutral-200 group-hover:text-white truncate w-full text-center sm:text-left">
                    {cat.name}
                  </div>
                  <div className="text-[8px] font-mono text-neutral-500 truncate w-full text-center sm:text-left hidden sm:block">
                    {cat.subtitle.split(' ')[0]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              onClick={() => navigate('/wellness/meditate')}
              className="flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Enter Sanctuary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleLaunchMeditation('starlight')}
              className="py-2.5 px-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              Quick Overlay
            </button>
          </div>
        </div>
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
