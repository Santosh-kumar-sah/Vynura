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
 * Core Recommendation Engine
 * Evaluates raw facial expressions & confidence score to produce a tailored,
 * multi-tier shift prescription without generic static lookup.
 */
export function generateRecommendations(
  rawExpressions?: RawExpressions | null,
  confidenceScore: number = 0.9,
  moodFallback: MoodType = 'neutral'
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
  const actions: RecommendationItem[] = modeData[tier] || modeData.med;
  const metadata = MODE_METADATA[mode] || MODE_METADATA.sustain;

  return {
    mode,
    tier,
    valence,
    arousal,
    headline: metadata.headline,
    subheadline: metadata.subheadline,
    themeTag: metadata.themeTag,
    accentColor: metadata.accentColor,
    actions,
  };
}
