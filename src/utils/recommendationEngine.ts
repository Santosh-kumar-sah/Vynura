import type { RawExpressions } from './expressionMapper';
import type { MoodType } from '../types';
import {
  analyzeValenceArousal,
} from './valenceArousal';
import {
  MODE_RECOMMENDATIONS,
  MODE_METADATA,
} from '../data/recommendationRules';
import type {
  IntensityTier,
  MoodTrendContext,
  RecommendationEngineOutput,
  RecommendationItem,
} from '../types/recommendations';

/**
 * Maps numeric confidence score to low/med/high intensity tiers:
 * - low:  < 0.6
 * - med:  0.6 <= confidence <= 0.85
 * - high: > 0.85
 */
export function determineIntensityTier(confidence: number): IntensityTier {
  if (confidence < 0.6) return 'low';
  if (confidence <= 0.85) return 'med';
  return 'high';
}

/**
 * Proxy raw expression map when only a manual mood category is provided.
 */
const MOOD_EXPRESSION_PROXIES: Record<MoodType, RawExpressions> = {
  happy: {
    happy: 0.9,
    surprised: 0.4,
    neutral: 0.1,
    sad: 0,
    angry: 0,
    fearful: 0,
    disgusted: 0,
  },
  energetic: {
    happy: 0.6,
    surprised: 0.8,
    neutral: 0.1,
    sad: 0,
    angry: 0.2,
    fearful: 0,
    disgusted: 0,
  },
  calm: {
    happy: 0.4,
    surprised: 0,
    neutral: 0.85,
    sad: 0,
    angry: 0,
    fearful: 0,
    disgusted: 0,
  },
  sad: {
    happy: 0,
    surprised: 0,
    neutral: 0.3,
    sad: 0.9,
    angry: 0.1,
    fearful: 0.2,
    disgusted: 0,
  },
  neutral: {
    happy: 0.2,
    surprised: 0.1,
    neutral: 0.95,
    sad: 0,
    angry: 0,
    fearful: 0,
    disgusted: 0,
  },
};

/**
 * Dedicated escalated sanctuary recommendations when a persistent heavy mood trend is detected.
 */
const ESCALATED_SANCTUARY_ACTIONS: RecommendationItem[] = [
  {
    id: 'escalated_somatic_cocoon',
    category: 'somatic',
    title: 'Zero-Pressure Somatic Nesting',
    subtitle: 'Nervous system soothing without demands',
    description:
      'Wrap yourself in a blanket, place a hand gently over your heart, and take 3 unhurried sighs. No fixing required.',
    tag: 'TENDER CARE',
    durationText: '4 MIN',
    accentColor: '#B8B4D9',
    action: {
      label: 'Begin 4-7-8 Soft Downshift',
      type: 'breathing',
      targetId: '478',
    },
  },
  {
    id: 'escalated_theta_cocoon',
    category: 'sonic',
    title: 'Celestial Cocoon Soundscape',
    subtitle: 'Warm ambient sanctuary frequencies',
    description:
      'Immerse in gentle rain and warm analog synth pads tuned to quiet down amygdala hyperactivity.',
    tag: 'SANCTUARY AUDIO',
    durationText: '15 MIN',
    accentColor: '#78A6FF',
    spotifyPlaylistId: '37i9dQZF1DWZqd5JICZI0u',
    audioPreviewUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3',
    action: {
      label: 'Listen in Sanctuary',
      type: 'soundscape',
    },
  },
  {
    id: 'escalated_gentle_witness',
    category: 'mindful',
    title: 'Self-Compassion Sanctuary',
    subtitle: 'Gentle permission to simply exist',
    description:
      'Whisper to yourself: "This is a moment of suffering. Suffering is part of being human. May I be kind to myself."',
    tag: 'COMPASSION',
    durationText: '3 MIN',
    accentColor: '#FF9EAA',
    action: {
      label: 'Open Starlight Sanctuary',
      type: 'meditation',
      targetId: 'starlight',
    },
  },
];

/**
 * Core Recommendation Engine
 * Evaluates raw facial expressions, confidence score, and historical trend
 * to produce a tailored, multi-tier shift prescription with trend-aware escalation.
 */
export function generateRecommendations(
  rawExpressions?: RawExpressions | null,
  confidenceScore: number = 0.9,
  moodFallback: MoodType = 'neutral',
  trend?: MoodTrendContext | null
): RecommendationEngineOutput {
  const expressions =
    rawExpressions || MOOD_EXPRESSION_PROXIES[moodFallback] || MOOD_EXPRESSION_PROXIES.neutral;

  // 1. Valence-Arousal Scoring & Mode Classification
  const { valence, arousal, mode } = analyzeValenceArousal(
    expressions,
    confidenceScore
  );

  // 2. Intensity Tier determination
  const tier = determineIntensityTier(confidenceScore);

  // 3. Matrix lookup from restructured rules
  const modeData = MODE_RECOMMENDATIONS[mode] || MODE_RECOMMENDATIONS.sustain;
  let actions: RecommendationItem[] = modeData[tier] || modeData.med;
  const metadata = MODE_METADATA[mode] || MODE_METADATA.sustain;

  let headline = metadata.headline;
  let subheadline = metadata.subheadline;
  let themeTag = metadata.themeTag;
  let accentColor = metadata.accentColor;

  // 4. Trend-Aware Escalation & Trajectory Modulation
  if (trend) {
    if (trend.isEscalated) {
      // Multiple consecutive low sessions: prioritize gentle sanctuary care
      headline = 'Gentle Sanctuary Escalation';
      subheadline =
        'We noticed persistent heavy resonance across your recent check-ins. We have adapted your space with soft, zero-pressure nourishment.';
      themeTag = 'SANCTUARY PROTOCOL · CONTINUOUS CARE';
      accentColor = '#FF9EAA';
      actions = ESCALATED_SANCTUARY_ACTIONS;
    } else if (trend.trajectory === 'improving') {
      subheadline = `Resonance brightening ↗ across recent checks. ${subheadline}`;
    } else if (trend.trajectory === 'declining') {
      subheadline = `Noticing a gentle downward trend ↘. ${subheadline}`;
    }
  }

  return {
    mode,
    tier,
    valence,
    arousal,
    headline,
    subheadline,
    themeTag,
    accentColor,
    actions,
    trend: trend || undefined,
  };
}

