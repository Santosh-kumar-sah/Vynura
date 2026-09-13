export type SparkCategory = 'creative' | 'movement' | 'sensory' | 'social';

export interface SparkActivity {
  id: string;
  title: string;
  category: SparkCategory;
  durationSeconds: number; // <= 120 seconds
  instructions: string;
  iconName: string; // Lucide icon identifier
  accentColor?: string;
  promptExample?: string;
}

export interface SparkLogEntry {
  id: string;
  user_id?: string;
  activity_id: string;
  completed: boolean;
  completed_at?: string | null;
  created_at: string;
}

export interface SparkStreak {
  user_id?: string;
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
  streak_broken?: boolean;
}

export interface SparkCompletionResult {
  streak: SparkStreak;
  message: string;
  isNewLongest: boolean;
}
