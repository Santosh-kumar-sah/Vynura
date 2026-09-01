import type { MoodType } from '../types';

export interface RawExpressions {
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
}

export interface MappedMoodResult {
  mood: MoodType;
  confidence: number;
  breakdown: Record<MoodType, number>;
  dominantRawExpression: keyof RawExpressions;
  rawConfidence: number;
}

/**
 * Expression to Vynura Mood Mapping Logic
 * 
 * face-api.js returns raw expression scores across 7 categories:
 * - neutral, happy, sad, angry, fearful, disgusted, surprised
 * 
 * We map these into Vynura's 5 harmonic states:
 * 1. 'happy' (Joy & Radiance):
 *    - Driven primarily by happy score.
 * 2. 'energetic' (Starlight Surge / High Arousal):
 *    - Driven by surprised + happy synergy, or high arousal expressions (angry / intense surprised).
 * 3. 'sad' (Gentle Rain / Introspective Lows):
 *    - Driven by sad, fearful, and disgusted scores.
 * 4. 'calm' (Deep Serenity):
 *    - Driven by steady neutral expressions with low negative emotional arousal, plus subtle relaxed contentment.
 * 5. 'neutral' (Clear Equilibrium):
 *    - Baseline balance state where no strong polarity is active.
 */
export function mapExpressionsToVynuraMood(expressions: RawExpressions): MappedMoodResult {
  const { neutral, happy, sad, angry, fearful, disgusted, surprised } = expressions;

  // Find the single dominant raw expression
  let dominantRawExpression: keyof RawExpressions = 'neutral';
  let highestScore = -1;

  for (const [key, value] of Object.entries(expressions) as [keyof RawExpressions, number][]) {
    if (value > highestScore) {
      highestScore = value;
      dominantRawExpression = key;
    }
  }

  // Calculate composite weights for each Vynura mood category
  // Happy: Direct happiness + slight surprise multiplier
  const happyScore = happy * 0.9 + (surprised > 0.3 && happy > 0.2 ? surprised * 0.4 : 0);

  // Energetic: Surprised + Happy combo, or pure Surprise, or High-Arousal (Angry)
  const energeticScore = (surprised * 0.75) + (angry * 0.6) + (happy > 0.4 && surprised > 0.3 ? 0.3 : 0);

  // Sad: Sadness + Fear + Disgust
  const sadScore = (sad * 0.85) + (fearful * 0.5) + (disgusted * 0.4);

  // Calm: High neutral with low emotional volatility, or subtle soft happiness
  const emotionalVolatility = Math.max(angry, fearful, disgusted, surprised);
  const calmScore = (neutral * 0.75) * (1 - Math.min(emotionalVolatility * 0.6, 0.7)) + (happy > 0.1 && happy < 0.4 ? 0.25 : 0);

  // Neutral: Standard baseline equilibrium
  const neutralScore = neutral * 0.8;

  const breakdown: Record<MoodType, number> = {
    happy: Math.min(Math.max(happyScore, 0), 1),
    energetic: Math.min(Math.max(energeticScore, 0), 1),
    sad: Math.min(Math.max(sadScore, 0), 1),
    calm: Math.min(Math.max(calmScore, 0), 1),
    neutral: Math.min(Math.max(neutralScore, 0), 1),
  };

  // Determine winning category
  let winningMood: MoodType = 'neutral';
  let maxScore = -1;

  // Priority mapping based on distinct emotional signals
  if (breakdown.happy > 0.45 && breakdown.happy >= breakdown.energetic) {
    winningMood = 'happy';
    maxScore = breakdown.happy;
  } else if (breakdown.energetic > 0.5 || (surprised > 0.6) || (angry > 0.55)) {
    winningMood = 'energetic';
    maxScore = breakdown.energetic;
  } else if (breakdown.sad > 0.35 || (sad > 0.4) || (fearful > 0.45)) {
    winningMood = 'sad';
    maxScore = breakdown.sad;
  } else if (breakdown.calm > 0.4) {
    winningMood = 'calm';
    maxScore = breakdown.calm;
  } else {
    // Determine by absolute highest
    for (const [moodKey, score] of Object.entries(breakdown) as [MoodType, number][]) {
      if (score > maxScore) {
        maxScore = score;
        winningMood = moodKey;
      }
    }
  }

  // Calculate normalized confidence between 0 and 1
  const confidence = Math.min(Math.max(maxScore, 0.4), 0.99);

  return {
    mood: winningMood,
    confidence,
    breakdown,
    dominantRawExpression,
    rawConfidence: highestScore,
  };
}

/**
 * Analyzes video frame brightness to warn user if lighting is insufficient
 */
export function analyzeLighting(videoElement: HTMLVideoElement): {
  isGood: boolean;
  brightness: number;
  warning?: string;
} {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 48;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return { isGood: true, brightness: 120 };

    ctx.drawImage(videoElement, 0, 0, 64, 48);
    const imgData = ctx.getImageData(0, 0, 64, 48);
    const data = imgData.data;

    let totalBrightness = 0;
    const pixelCount = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      // Relative luminance formula: 0.299 R + 0.587 G + 0.114 B
      const b = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      totalBrightness += b;
    }

    const avgBrightness = totalBrightness / pixelCount;

    if (avgBrightness < 35) {
      return {
        isGood: false,
        brightness: avgBrightness,
        warning: 'Lighting is very dim. Move toward a soft light source for best accuracy.',
      };
    } else if (avgBrightness > 225) {
      return {
        isGood: false,
        brightness: avgBrightness,
        warning: 'High glare detected. Angle slightly away from harsh direct light.',
      };
    }

    return {
      isGood: true,
      brightness: avgBrightness,
    };
  } catch {
    return { isGood: true, brightness: 120 };
  }
}
