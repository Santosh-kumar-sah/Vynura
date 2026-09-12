import type { MoodType } from './index';
import type { RecommendationMode } from '../utils/valenceArousal';

export type RecommendationActionType =
  | 'breathing'
  | 'journal'
  | 'meditation'
  | 'soundscape'
  | 'grounding'
  | 'reflection';

export type IntensityTier = 'low' | 'med' | 'high';

export type MoodTrajectory = 'improving' | 'declining' | 'stable';

export interface MoodTrendContext {
  consecutiveLowCount: number;
  trajectory: MoodTrajectory;
  trajectoryLabel: string;
  trendSummary?: string;
  isEscalated: boolean;
}

export interface RecommendationAction {
  label: string;
  type: RecommendationActionType;
  targetId?: string;
  externalUrl?: string;
}

export interface RecommendationItem {
  id: string;
  category: 'somatic' | 'sonic' | 'cognitive' | 'mindful';
  title: string;
  subtitle: string;
  description: string;
  kanji?: string;
  tag: string;
  durationText: string;
  accentColor: string;
  action: RecommendationAction;
  quote?: {
    text: string;
    author: string;
  };
  audioPreviewUrl?: string;
  spotifyPlaylistId?: string;
}

export interface ModeMetadata {
  mode: RecommendationMode;
  headline: string;
  subheadline: string;
  themeTag: string;
  accentColor: string;
}

export interface RecommendationEngineOutput {
  mode: RecommendationMode;
  tier: IntensityTier;
  valence: number;
  arousal: number;
  headline: string;
  subheadline: string;
  themeTag: string;
  accentColor: string;
  actions: RecommendationItem[];
  trend?: MoodTrendContext;
}

export interface MoodRecommendationGroup {
  mood: MoodType;
  headline: string;
  subheadline: string;
  kanjiTheme: string;
  recommendations: RecommendationItem[];
}

export interface EngagementRecord {
  id: string;
  recommendationId: string;
  mood: MoodType;
  actionType: RecommendationActionType;
  timestamp: number;
  engaged: boolean;
}
