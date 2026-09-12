import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Compass,
  ArrowRight,
  HeartHandshake,
  Quote,
  Activity,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  LifeBuoy,
} from 'lucide-react';
import type { MoodType } from '../../types';
import type { RecommendationItem } from '../../types/recommendations';
import type { RawExpressions } from '../../utils/expressionMapper';
import { generateRecommendations } from '../../utils/recommendationEngine';
import { RecommendationCard } from './RecommendationCard';
import { ActionModal } from './ActionModal';
import { SpotifyPlayer } from '../music/SpotifyPlayer';
import { getMoodQuote, type MoodQuote } from '../../services/quotesService';
import { logRecommendationSession } from '../../utils/recommendationLogger';
import { getRecentMoodTrend, type RecentMoodTrend } from '../../lib/supabase';
import { MOODS } from '../sections/HeroSection';

interface RecommendationSectionProps {
  mood: MoodType;
  confidence?: number;
  rawExpressions?: RawExpressions | null;
  onOpenFaceDetection?: () => void;
  onLaunchBreathing?: (technique: '478' | 'box' | 'calm') => void;
  onLaunchMeditation?: (category?: import('../../types/meditation').MeditationCategoryId) => void;
}

export const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  mood,
  confidence = 0.9,
  rawExpressions,
  onOpenFaceDetection,
  onLaunchBreathing,
  onLaunchMeditation,
}) => {
  const [selectedActionItem, setSelectedActionItem] = useState<RecommendationItem | null>(null);
  const [dynamicQuote, setDynamicQuote] = useState<MoodQuote | null>(null);
  const [trendData, setTrendData] = useState<RecentMoodTrend | null>(null);

  // Fetch recent mood trend on mount and whenever mood updates
  useEffect(() => {
    let isMounted = true;
    getRecentMoodTrend().then((trend) => {
      if (isMounted) setTrendData(trend);
    });
    return () => {
      isMounted = false;
    };
  }, [mood]);

  // Compute multi-tier recommendations via the Valence-Arousal & Trend Engine
  const prescription = useMemo(() => {
    return generateRecommendations(rawExpressions, confidence, mood, trendData);
  }, [rawExpressions, confidence, mood, trendData]);

  const moodInfo = MOODS[mood] || MOODS.neutral;

  // Log session & load dynamic quote on mount or mood/prescription change
  useEffect(() => {
    const ids = prescription.actions.map((r) => r.id);
    logRecommendationSession(mood, confidence, ids);

    getMoodQuote(mood).then((q) => setDynamicQuote(q));
  }, [mood, confidence, prescription]);

  return (
    <section
      id="recommendations"
      className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden space-y-10"
    >
      {/* Dynamic Background Light Pool */}
      <motion.div
        key={`${mood}-${prescription.mode}`}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.22, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none -z-10"
        style={{ backgroundColor: prescription.accentColor || moodInfo.color }}
      />

      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          key={`header-${mood}-${prescription.mode}-${prescription.tier}`}
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: prescription.accentColor || moodInfo.color }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>02 / SHIFT ENGINE · Valence-Arousal Prescription</span>
          </div>

          <div className="flex items-baseline gap-3 mb-2">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F2ED] tracking-tight">
              {prescription.headline}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5"
              style={{
                backgroundColor: `${moodInfo.color}15`,
                borderColor: `${moodInfo.color}45`,
                color: moodInfo.color,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: moodInfo.color }} />
              <span>Resonance: {moodInfo.label}</span>
              <span className="opacity-70 font-mono">({moodInfo.sublabel})</span>
            </span>

            {/* Mode & Tier Badge */}
            <span
              className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border flex items-center gap-1"
              style={{
                backgroundColor: `${prescription.accentColor}18`,
                borderColor: `${prescription.accentColor}40`,
                color: prescription.accentColor,
              }}
            >
              <Activity className="w-3 h-3" />
              <span>Mode: {prescription.mode.toUpperCase()}</span>
              <span className="opacity-60">•</span>
              <span>Tier: {prescription.tier.toUpperCase()}</span>
            </span>

            {/* Trajectory Indicator Badge */}
            {prescription.trend && (
              <span
                className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border flex items-center gap-1.5"
                style={{
                  backgroundColor:
                    prescription.trend.trajectory === 'improving'
                      ? 'rgba(111, 191, 196, 0.15)'
                      : prescription.trend.trajectory === 'declining'
                      ? 'rgba(255, 158, 170, 0.15)'
                      : 'rgba(184, 180, 217, 0.15)',
                  borderColor:
                    prescription.trend.trajectory === 'improving'
                      ? 'rgba(111, 191, 196, 0.4)'
                      : prescription.trend.trajectory === 'declining'
                      ? 'rgba(255, 158, 170, 0.4)'
                      : 'rgba(184, 180, 217, 0.3)',
                  color:
                    prescription.trend.trajectory === 'improving'
                      ? '#6FBFC4'
                      : prescription.trend.trajectory === 'declining'
                      ? '#FF9EAA'
                      : '#B8B4D9',
                }}
                title={prescription.trend.trendSummary}
              >
                {prescription.trend.trajectory === 'improving' && (
                  <TrendingUp className="w-3 h-3 text-[#6FBFC4]" />
                )}
                {prescription.trend.trajectory === 'declining' && (
                  <TrendingDown className="w-3 h-3 text-[#FF9EAA]" />
                )}
                {prescription.trend.trajectory === 'stable' && (
                  <Minus className="w-3 h-3 text-[#B8B4D9]" />
                )}
                <span>Trajectory: {prescription.trend.trajectoryLabel}</span>
              </span>
            )}

            <span className="text-xs text-[#B8B4D9] font-medium hidden sm:inline-block">
              {prescription.subheadline}
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

      {/* Trend-Aware Gentle Escalation Care Banner */}
      {prescription.trend?.isEscalated && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#2E1A29]/90 via-[#1F1834]/95 to-[#121029]/90 border border-[#FF9EAA]/40 shadow-[0_10px_35px_rgba(255,158,170,0.15)] backdrop-blur-xl space-y-3"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-[#FF9EAA]">
              <LifeBuoy className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                Continuous Care Sanctuary · Gentle Support Active
              </span>
            </div>
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#FF9EAA]/15 text-[#FF9EAA] border border-[#FF9EAA]/30">
              {prescription.trend.consecutiveLowCount}+ consecutive heavy check-ins detected
            </span>
          </div>

          <p className="text-sm text-[#F5F2ED] leading-relaxed">
            Your nervous system has carried a lot of heavy weather recently. In this space, there is no need to perform, achieve, or fix anything. We have prepared restorative, low-effort nurturing paths below.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#B8B4D9]">
            <span className="font-semibold text-[#FFC978]">Need human support?</span>
            <span>988 Suicide & Crisis Lifeline: <strong className="text-[#F5F2ED]">Call or Text 988</strong></span>
            <span>•</span>
            <span>Crisis Text Line: <strong className="text-[#F5F2ED]">Text HOME to 741741</strong></span>
          </div>
        </motion.div>
      )}

      {/* Dynamic Quotes Wisdom Banner */}
      {dynamicQuote && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#24214A]/70 via-[#1A1836]/90 to-[#121029]/80 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
          style={{
            borderColor: `${prescription.accentColor || moodInfo.color}35`,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="p-2 rounded-xl border mt-0.5"
              style={{
                backgroundColor: `${prescription.accentColor || moodInfo.color}20`,
                borderColor: `${prescription.accentColor || moodInfo.color}50`,
                color: prescription.accentColor || moodInfo.color,
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
            <span className="text-xs font-bold font-mono" style={{ color: prescription.accentColor || moodInfo.color }}>
              — {dynamicQuote.author}
            </span>
            <span className="text-[10px] text-[#B8B4D9] block">Wisdom Stream</span>
          </div>
        </motion.div>
      )}

      {/* Staggered Recommendation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {prescription.actions.map((item, idx) => (
          <RecommendationCard
            key={`${prescription.mode}-${prescription.tier}-${item.id}`}
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
          <span>Recommendations dynamically adapt to valence-arousal frequency and intensity tiers.</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#B8B4D9]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FFC978]" />
          <span>Valence: {prescription.valence.toFixed(2)} | Arousal: {prescription.arousal.toFixed(2)}</span>
        </div>
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
