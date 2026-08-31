export type MoodType = 'happy' | 'calm' | 'sad' | 'energetic' | 'neutral';

export interface MoodConfig {
  id: MoodType;
  label: string;
  kanji: string;
  color: string;
  gradient: string;
  quote: string;
  shiftAction: string;
  soundscape: string;
}

export interface FeatureCardItem {
  id: string;
  title: string;
  japaneseTitle: string;
  subtitle: string;
  description: string;
  accentColor: string;
  tag: string;
  iconName: string;
  highlightText: string;
}
