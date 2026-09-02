import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, ArrowRight, HeartHandshake, Quote } from 'lucide-react';
import type { MoodType } from '../../types';
import type { RecommendationItem } from '../../types/recommendations';
import { MOOD_RECOMMENDATIONS } from '../../data/recommendationRules';
import { RecommendationCard } from './RecommendationCard';
import { ActionModal } from './ActionModal';
import { SpotifyPlayer } from '../music/SpotifyPlayer';
import { getMoodQuote, type MoodQuote } from '../../services/quotesService';
import { logRecommendationSession } from '../../utils/recommendationLogger';
import { MOODS } from '../sections/HeroSection';

interface RecommendationSectionProps {
  mood: MoodType;
  confidence?: number;
  onOpenFaceDetection?: () => void;
  onLaunchBreathing?: (technique: '478' | 'box' | 'calm') => void;
  onLaunchMeditation?: (category?: import('../../types/meditation').MeditationCategoryId) => void;
}

export const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  mood,
  confidence = 0.9,
  onOpenFaceDetection,
  onLaunchBreathing,
  onLaunchMeditation,
}) => {
  const [selectedActionItem, setSelectedActionItem] = useState<RecommendationItem | null>(null);
  const [dynamicQuote, setDynamicQuote] = useState<MoodQuote | null>(null);

  const moodGroup = MOOD_RECOMMENDATIONS[mood] || MOOD_RECOMMENDATIONS.neutral;
  const moodInfo = MOODS[mood] || MOODS.neutral;

  // Log session & load dynamic quote on mount or mood change
  useEffect(() => {
    const ids = moodGroup.recommendations.map((r) => r.id);
    logRecommendationSession(mood, confidence, ids);

    getMoodQuote(mood).then((q) => setDynamicQuote(q));
  }, [mood, confidence, moodGroup]);

  return (
    <section
      id="recommendations"
      className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden space-y-10"
    >
      {/* Dynamic Background Light Pool */}
      <motion.div
        key={mood}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.22, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none -z-10"
        style={{ backgroundColor: moodInfo.color }}
      />

      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          key={`header-${mood}`}
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: moodInfo.color }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>02 / SHIFT ENGINE · Tailored Emotional Prescription</span>
          </div>

          <div className="flex items-baseline gap-3 mb-2">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F2ED] tracking-tight">
              {moodGroup.headline}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5"
              style={{
                backgroundColor: `${moodInfo.color}15`,
                borderColor: `${moodInfo.color}45`,
                color: moodInfo.color,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: moodInfo.color }} />
              <span>Current Resonance: {moodInfo.label}</span>
              <span className="opacity-70 font-mono">({moodInfo.sublabel})</span>
            </span>

            <span className="text-xs text-[#B8B4D9] font-medium">
              {moodGroup.kanjiTheme}
            </span>
          </div>
        </motion.div>

        {/* Recalibrate CTA Button */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
        >
          <button
            onClick={onOpenFaceDetection}
            className="px-4 py-2 rounded-xl bg-[#24214A]/80 hover:bg-[#2D2A5C] text-[#FFC978] border border-[#FFC978]/30 hover:border-[#FFC978]/60 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-glow-sm"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Recalibrate Face Scan</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </motion.div>
      </div>

      {/* Dynamic Quotes Wisdom Banner */}
      {dynamicQuote && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#24214A]/70 via-[#1A1836]/90 to-[#121029]/80 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
          style={{
            borderColor: `${moodInfo.color}35`,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="p-2 rounded-xl border mt-0.5"
              style={{
                backgroundColor: `${moodInfo.color}20`,
                borderColor: `${moodInfo.color}50`,
                color: moodInfo.color,
              }}
            >
              <Quote className="w-4 h-4" />
            </div>
            <div>
              <p className="font-heading text-sm sm:text-base text-[#FFF2D6] italic leading-relaxed">
                "{dynamicQuote.quote}"
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-bold font-mono" style={{ color: moodInfo.color }}>
              — {dynamicQuote.author}
            </span>
            <span className="text-[10px] text-[#B8B4D9] block">Wisdom Stream</span>
          </div>
        </motion.div>
      )}

      {/* Staggered Recommendation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {moodGroup.recommendations.map((item, idx) => (
          <RecommendationCard
            key={`${mood}-${item.id}`}
            item={item}
            mood={mood}
            delay={idx * 0.08}
            onTriggerAction={(clickedItem) => setSelectedActionItem(clickedItem)}
          />
        ))}
      </div>

      {/* Spotify On-Brand Web Player Embed */}
      <SpotifyPlayer mood={mood} />

      {/* Subtext Reassurance */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.25 }}
        className="p-4 rounded-2xl bg-[#121029]/70 border border-[#B8B4D9]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B8B4D9]"
      >
        <div className="flex items-center gap-2 text-[#6FBFC4]">
          <HeartHandshake className="w-4 h-4" />
          <span>Recommendations and sonic soundscapes dynamically adapt with each look.</span>
        </div>
        <span className="font-heading italic text-[#FFC978]/90">
          "Each emotion is a passing weather; you are the sky."
        </span>
      </motion.div>

      {/* Action Preview Modal */}
      <AnimatePresence>
        {selectedActionItem && (
          <ActionModal
            item={selectedActionItem}
            mood={mood}
            isOpen={Boolean(selectedActionItem)}
            onClose={() => setSelectedActionItem(null)}
            onLaunchBreathing={onLaunchBreathing}
            onLaunchMeditation={onLaunchMeditation}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
