export type MoodType = 'happy' | 'calm' | 'sad' | 'energetic' | 'neutral';

export interface MoodConfig {
  id: MoodType;
  label: string;
  sublabel: string;
  kanji?: string; // backwards compatibility alias for English theme label
  color: string;
  gradient: string;
  quote: string;
  shiftAction: string;
  soundscape: string;
}

export interface FeatureCardItem {
  id: string;
  title: string;
  categoryTag: string;
  subtitle: string;
  description: string;
  accentColor: string;
  tag: string;
  iconName: string;
  highlightText: string;
}
