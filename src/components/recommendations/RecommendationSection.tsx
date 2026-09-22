import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Compass,
  HeartHandshake,
  Quote,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  ThumbsUp,
  ThumbsDown,
  Check,
} from 'lucide-react';
import type { MoodType } from '../../types';
import type { RecommendationItem } from '../../types/recommendations';
import type { RawExpressions } from '../../utils/expressionMapper';
import { generateRecommendations } from '../../utils/recommendationEngine';
import { getBlendLabel } from '../../utils/valenceArousal';
import { RecommendationCard } from './RecommendationCard';
import { ActionModal } from './ActionModal';
import { SpotifyPlayer } from '../music/SpotifyPlayer';
import { getMoodQuote, type MoodQuote } from '../../services/quotesService';
import {
  logRecommendationSession,
  logRecommendationFeedback,
  logActionCompleted,
} from '../../utils/recommendationLogger';
import { getRecentMoodTrend, type RecentMoodTrend } from '../../lib/supabase';
import { getTodaysSpark } from '../../utils/sparkSelector';
import type { SparkActivity } from '../../types/sparks';
import { QuickSparkCard } from '../gamification/QuickSparkCard';
import { SupportBanner } from '../wellness/SupportBanner';
import { CaptureCard } from './CaptureCard';
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
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [userFeedback, setUserFeedback] = useState<boolean | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [todaysSpark, setTodaysSpark] = useState<SparkActivity | null>(null);

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

  // Fetch today's Quick Spark only when in amplify mode
  useEffect(() => {
    let isMounted = true;
    if (prescription.mode === 'amplify') {
      getTodaysSpark().then((spark) => {
        if (isMounted) setTodaysSpark(spark);
      });
    } else {
      setTodaysSpark(null);
    }
    return () => {
      isMounted = false;
    };
  }, [prescription.mode]);

  const moodInfo = MOODS[mood] || MOODS.neutral;
  const blendInfo = useMemo(
    () => (rawExpressions ? getBlendLabel(rawExpressions) : null),
    [rawExpressions]
  );

  // Log session & load dynamic quote on mount or mood/prescription change
  useEffect(() => {
    let isMounted = true;
    const ids = prescription.actions.map((r) => r.id);

    const shouldShowProminent =
      (prescription.mode === 'support' && confidence > 0.85) ||
      Boolean(prescription.trend?.consecutiveLowCount && prescription.trend.consecutiveLowCount >= 3) ||
      Boolean(prescription.trend?.isEscalated);

    logRecommendationSession({
      mood,
      confidence,
      valence: prescription.valence,
      arousal: prescription.arousal,
      mode: prescription.mode,
      tier: prescription.tier,
      trajectory: prescription.trend?.trajectory,
      isEscalated: prescription.trend?.isEscalated,
      supportBannerShown: shouldShowProminent,
      recommendationIds: ids,
    }).then((session) => {
      if (isMounted) {
        setActiveSessionId(session.id);
        setUserFeedback(null);
        setFeedbackSubmitted(false);
      }
    });

    getMoodQuote(mood).then((q) => {
      if (isMounted) setDynamicQuote(q);
    });

    return () => {
      isMounted = false;
    };
  }, [mood, confidence, prescription]);

  const handleFeedback = (helpful: boolean) => {
    setUserFeedback(helpful);
    setFeedbackSubmitted(true);
    if (activeSessionId) {
      logRecommendationFeedback(activeSessionId, helpful);
    }
  };

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/50 mb-2">
            02 / SHIFT ENGINE · TENSOR PRESCRIPTION
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-3">
            {prescription.headline}
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono text-white/80 bg-white/[0.04] border border-white/[0.08] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              <span>{blendInfo?.isBlend ? blendInfo.blendLabel : moodInfo.label}</span>
            </span>

            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono text-white/60 bg-white/[0.03] border border-white/[0.06]">
              Mode: {prescription.mode.toUpperCase()} · Tier: {prescription.tier.toUpperCase()}
            </span>

            {prescription.trend && (
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono text-white/60 bg-white/[0.03] border border-white/[0.06] flex items-center gap-1.5">
                {prescription.trend.trajectory === 'improving' && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                {prescription.trend.trajectory === 'declining' && <TrendingDown className="w-3 h-3 text-rose-400" />}
                {prescription.trend.trajectory === 'stable' && <Minus className="w-3 h-3 text-white/40" />}
                <span>Trajectory: {prescription.trend.trajectoryLabel}</span>
              </span>
            )}
          </div>
        </div>

        {/* Recalibrate CTA Button */}
        <div>
          <button
            onClick={onOpenFaceDetection}
            className="px-4 py-2 rounded-lg bg-white text-[#08090A] hover:bg-neutral-100 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer active:scale-[0.97]"
          >
            <Compass className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Recalibrate State</span>
          </button>
        </div>
      </div>

      {/* Verified India Mental Health & Crisis Support Banner */}
      <div id="support-helplines">
        <SupportBanner
          isProminent={
            (prescription.mode === 'support' && confidence > 0.85) ||
            Boolean(prescription.trend?.consecutiveLowCount && prescription.trend.consecutiveLowCount >= 3) ||
            Boolean(prescription.trend?.isEscalated)
          }
        />
      </div>

      {/* Dynamic Quotes Wisdom Banner */}
      {dynamicQuote && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#121316] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Quote className="w-4 h-4 text-white/45 shrink-0 mt-0.5 stroke-[1.5]" />
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed italic">
              "{dynamicQuote.quote}"
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-mono text-[#F59E0B] font-medium block">
              — {dynamicQuote.author}
            </span>
          </div>
        </div>
      )}

      {/* Capture-First Flow for High-Tier Good States (Amplify / Sustain at High Tier) */}
      {(prescription.mode === 'amplify' || prescription.mode === 'sustain') &&
      prescription.tier === 'high' ? (
        <CaptureCard
          mood={mood}
          confidence={confidence}
          prescription={prescription}
        />
      ) : (
        <>
          {/* Amplify Mode Special: Daily Quick Spark Micro-Activity Card */}
          {prescription.mode === 'amplify' && todaysSpark && (
            <QuickSparkCard
              activity={todaysSpark}
              onCompleted={(act) => {
                if (activeSessionId) {
                  logActionCompleted(activeSessionId, act.id);
                }
              }}
            />
          )}

          {/* Staggered Recommendation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {prescription.actions.map((item, idx) => (
              <RecommendationCard
                key={`${prescription.mode}-${prescription.tier}-${item.id}`}
                item={item}
                mood={mood}
                delay={idx * 0.08}
                onTriggerAction={(clickedItem) => {
                  if (activeSessionId) {
                    logActionCompleted(activeSessionId, clickedItem.id);
                  }
                  setSelectedActionItem(clickedItem);
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Interactive Recommendation Feedback Attunement */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25, delay: 0.1 }}
        className="p-5 rounded-xl bg-[#121316] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-amber-400 stroke-[1.5] shrink-0" />
          <div>
            <div className="text-xs font-medium text-white">
              Did this shift prescription feel aligned with your state?
            </div>
            <p className="text-[11px] text-neutral-400">
              Your response calibrates future somatic and cognitive recommendations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleFeedback(true)}
            disabled={feedbackSubmitted}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border ${
              userFeedback === true
                ? 'bg-amber-400/10 border-amber-400/40 text-amber-300'
                : 'bg-white/[0.04] border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            {userFeedback === true ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <ThumbsUp className="w-3.5 h-3.5 stroke-[1.5]" />
            )}
            <span>Accurate</span>
          </button>

          <button
            onClick={() => handleFeedback(false)}
            disabled={feedbackSubmitted}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border ${
              userFeedback === false
                ? 'bg-red-500/10 border-red-500/40 text-red-300'
                : 'bg-white/[0.04] border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <ThumbsDown className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Recalibrate</span>
          </button>
        </div>
      </motion.div>

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
