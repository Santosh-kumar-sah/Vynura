import type { MoodType } from './index';

export interface RecapMoment {
  id: string;
  mood: MoodType;
  label: string;
  date: string;
  dateFormatted: string;
  journalText?: string;
  isFreezeCapture: boolean;
  confidence: number;
  blendLabel?: string;
  sparkTitle?: string;
}

export interface MonthlyRecapData {
  monthKey: string;
  monthName: string;
  year: number;
  totalPositiveMoments: number;
  totalEntries: number;
  freezeCapturesCount: number;
  dominantMood: MoodType;
  dominantMoodLabel: string;
  dominantMoodPercentage: number;
  longestStreakDays: number;
  highlights: RecapMoment[];
  poeticSummary: string;
}
