import type { MoodType } from './index';

export type RecommendationActionType =
  | 'breathing'
  | 'journal'
  | 'meditation'
  | 'soundscape'
  | 'grounding'
  | 'reflection';

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
  kanji: string;
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
