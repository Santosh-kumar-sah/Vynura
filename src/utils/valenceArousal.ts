import type { RawExpressions } from './expressionMapper';
import { mapExpressionsToVynuraMood } from './expressionMapper';
import type { MoodType } from '../types';

export type RecommendationMode = 'amplify' | 'sustain' | 'regulate' | 'support';

export interface ValenceArousalScore {
  valence: number;
  arousal: number;
}

export interface ValenceArousalAnalysis {
  valence: number;
  arousal: number;
  mode: RecommendationMode;
}

export interface DualHarmonicBlend {
  isBlend: boolean;
  primaryMood: MoodType;
  secondaryMood?: MoodType;
  blendLabel: string;
  primaryScore: number;
  secondaryScore?: number;
}

/**
 * Clamps a number to a specific range (defaults to [-1, 1]).
 */
function clamp(val: number, min: number = -1, max: number = 1): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Computes valence and arousal scores from raw 7-expression face-api object.
 *
 * Formulas:
 * valence = (happy*1.0 + surprised*0.3) - (sad*1.0 + angry*0.8 + disgusted*0.6 + fearful*0.7)
 * arousal = (angry*1.0 + fearful*1.0 + surprised*1.0 + happy*0.5) - (sad*0.5 + neutral*1.0)
 *
 * Both scores are clamped to [-1, 1].
 */
export function computeValenceArousal(expressions: RawExpressions): ValenceArousalScore {
  const {
    happy = 0,
    surprised = 0,
    sad = 0,
    angry = 0,
    disgusted = 0,
    fearful = 0,
    neutral = 0,
  } = expressions;

  const rawValence =
    happy * 1.0 +
    surprised * 0.3 -
    (sad * 1.0 + angry * 0.8 + disgusted * 0.6 + fearful * 0.7);

  const rawArousal =
    angry * 1.0 +
    fearful * 1.0 +
    surprised * 1.0 +
    happy * 0.5 -
    (sad * 0.5 + neutral * 1.0);

  return {
    valence: clamp(rawValence, -1, 1),
    arousal: clamp(rawArousal, -1, 1),
  };
}

/**
 * Classifies recommendation mode based on valence, arousal, and confidence:
 * - high valence (>= 0) + high arousal (>= 0) -> 'amplify'
 * - high valence (>= 0) + low arousal (< 0)   -> 'sustain'
 * - low valence (< 0) + high arousal (>= 0)   -> 'regulate'
 * - low valence (< 0) + low arousal (< 0)    -> 'support'
 */
export function classifyMode(
  valence: number,
  arousal: number,
  _confidence?: number
): RecommendationMode {
  const isHighValence = valence >= 0;
  const isHighArousal = arousal >= 0;

  if (isHighValence && isHighArousal) {
    return 'amplify';
  }
  if (isHighValence && !isHighArousal) {
    return 'sustain';
  }
  if (!isHighValence && isHighArousal) {
    return 'regulate';
  }
  return 'support';
}

/**
 * End-to-end helper to compute valence, arousal, and classify mode.
 */
export function analyzeValenceArousal(
  expressions: RawExpressions,
  confidence: number = 0.9
): ValenceArousalAnalysis {
  const { valence, arousal } = computeValenceArousal(expressions);
  const mode = classifyMode(valence, arousal, confidence);

  return {
    valence,
    arousal,
    mode,
  };
}

/**
 * Unit-style sanity checks: 3 sample expression sets per mode.
 */
export function runValenceArousalSanityChecks(): boolean {
  // 1. Amplify Samples (High Valence, High Arousal)
  const amplifySamples: RawExpressions[] = [
    { happy: 0.9, surprised: 0.8, neutral: 0.1, sad: 0, angry: 0, fearful: 0, disgusted: 0 },
    { happy: 0.7, surprised: 0.5, neutral: 0.2, sad: 0, angry: 0, fearful: 0, disgusted: 0 },
    { happy: 0.6, surprised: 0.7, neutral: 0.3, sad: 0, angry: 0.1, fearful: 0, disgusted: 0 },
  ];

  // 2. Sustain Samples (High Valence, Low Arousal)
  const sustainSamples: RawExpressions[] = [
    { happy: 0.5, surprised: 0, neutral: 0.8, sad: 0, angry: 0, fearful: 0, disgusted: 0 },
    { happy: 0.7, surprised: 0.1, neutral: 0.7, sad: 0, angry: 0, fearful: 0, disgusted: 0 },
    { happy: 0.4, surprised: 0, neutral: 0.9, sad: 0.05, angry: 0, fearful: 0, disgusted: 0 },
  ];

  // 3. Regulate Samples (Low Valence, High Arousal)
  const regulateSamples: RawExpressions[] = [
    { angry: 0.8, fearful: 0.5, surprised: 0.3, sad: 0.2, neutral: 0.1, happy: 0, disgusted: 0.2 },
    { angry: 0.9, fearful: 0.2, surprised: 0.4, sad: 0.1, neutral: 0.2, happy: 0.1, disgusted: 0.3 },
    { fearful: 0.8, angry: 0.3, surprised: 0.6, sad: 0.2, neutral: 0.1, happy: 0, disgusted: 0.1 },
  ];

  // 4. Support Samples (Low Valence, Low Arousal)
  const supportSamples: RawExpressions[] = [
    { sad: 0.8, neutral: 0.8, happy: 0, surprised: 0, angry: 0, fearful: 0, disgusted: 0.1 },
    { sad: 0.7, neutral: 0.6, happy: 0.1, surprised: 0, angry: 0.1, fearful: 0.1, disgusted: 0.1 },
    { sad: 0.9, neutral: 0.5, happy: 0, surprised: 0, angry: 0, fearful: 0, disgusted: 0 },
  ];

  for (const sample of amplifySamples) {
    const res = analyzeValenceArousal(sample);
    console.assert(res.mode === 'amplify', `Expected amplify, got ${res.mode}`);
    if (res.mode !== 'amplify') return false;
  }

  for (const sample of sustainSamples) {
    const res = analyzeValenceArousal(sample);
    console.assert(res.mode === 'sustain', `Expected sustain, got ${res.mode}`);
    if (res.mode !== 'sustain') return false;
  }

  for (const sample of regulateSamples) {
    const res = analyzeValenceArousal(sample);
    console.assert(res.mode === 'regulate', `Expected regulate, got ${res.mode}`);
    if (res.mode !== 'regulate') return false;
  }

  for (const sample of supportSamples) {
    const res = analyzeValenceArousal(sample);
    console.assert(res.mode === 'support', `Expected support, got ${res.mode}`);
    if (res.mode !== 'support') return false;
  }

  return true;
}

const BLEND_PHRASE_TEMPLATES: Record<string, string> = {
  'happy-energetic': 'Happy with a spark of Energy',
  'happy-calm': 'Radiant Joy, wrapped in Peace',
  'happy-neutral': 'Gentle Warmth in Equilibrium',
  'happy-sad': 'Bittersweet, with glowing Hope',
  'energetic-happy': 'High Energy with Radiant Joy',
  'energetic-calm': 'Dynamic Focus in Serenity',
  'energetic-neutral': 'Alert Momentum in Steady Balance',
  'energetic-sad': 'Restless Surge asking for Release',
  'calm-happy': 'Deep Serenity with warm Contentment',
  'calm-energetic': 'Quiet Presence with subtle Momentum',
  'calm-neutral': 'Tranquil Stillness in Centered Balance',
  'calm-sad': 'Calm, tinged with Gentle Rain',
  'sad-calm': 'Soft Melancholy seeking Sanctuary',
  'sad-neutral': 'Quiet Introspection in Gray Skies',
  'sad-energetic': 'Tense Turbulence needing Grounding',
  'sad-happy': 'Tender Nostalgia with soft Light',
  'neutral-calm': 'Pure Equilibrium in Still Waters',
  'neutral-happy': 'Clear Canvas with gentle Warmth',
  'neutral-energetic': 'Focused Readiness waiting to Ignite',
  'neutral-sad': 'Quiet Emptiness asking for Care',
};

const SINGLE_MOOD_LABELS: Record<MoodType, string> = {
  happy: 'Radiant Joy',
  energetic: 'Starlight Surge',
  calm: 'Deep Serenity',
  sad: 'Gentle Rain',
  neutral: 'Clear Equilibrium',
};

/**
 * Identifies dual-harmonic emotional blend when the second-highest mood
 * score is within 15% of the primary score.
 */
export function getBlendLabel(rawExpressions?: RawExpressions | null): DualHarmonicBlend {
  if (!rawExpressions) {
    return {
      isBlend: false,
      primaryMood: 'neutral',
      blendLabel: SINGLE_MOOD_LABELS.neutral,
      primaryScore: 1,
    };
  }

  const mapped = mapExpressionsToVynuraMood(rawExpressions);
  const breakdown = mapped.breakdown;

  const sorted = (Object.entries(breakdown) as [MoodType, number][]).sort(
    ([, a], [, b]) => b - a
  );

  const [topMood, topScore] = sorted[0];
  const [secondMood, secondScore] = sorted[1];

  // If the second-highest score is within 15% of the top score
  const isWithin15Percent =
    topScore > 0.15 &&
    secondScore > 0.15 &&
    topScore - secondScore <= 0.15;

  if (isWithin15Percent && topMood !== secondMood) {
    const pairKey = `${topMood}-${secondMood}`;
    const blendLabel =
      BLEND_PHRASE_TEMPLATES[pairKey] ||
      `${SINGLE_MOOD_LABELS[topMood]} with a touch of ${SINGLE_MOOD_LABELS[secondMood]}`;

    return {
      isBlend: true,
      primaryMood: topMood,
      secondaryMood: secondMood,
      blendLabel,
      primaryScore: topScore,
      secondaryScore: secondScore,
    };
  }

  return {
    isBlend: false,
    primaryMood: topMood,
    blendLabel: SINGLE_MOOD_LABELS[topMood] || SINGLE_MOOD_LABELS.neutral,
    primaryScore: topScore,
  };
}

// Run sanity checks in dev mode
if (import.meta.env?.DEV) {
  try {
    runValenceArousalSanityChecks();
  } catch {
    // ignore in testing environments
  }
}

