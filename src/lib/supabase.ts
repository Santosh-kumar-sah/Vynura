import { createClient } from '@supabase/supabase-js';
import type { MoodType } from '../types';

export interface MoodEntry {
  id: string;
  user_id?: string;
  mood_category: MoodType;
  confidence_score: number;
  journal_text?: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface PatternInsight {
  headline: string;
  subtext: string;
  dominantMood: MoodType;
  dominantPercentage: number;
  streakCount: number;
  equilibriumScore: number;
  recommendationNote: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const LOCAL_STORAGE_ENTRIES_KEY = 'vynura_mood_constellation_entries';

// Initial sample starlight constellation seed data
const DEFAULT_INITIAL_ENTRIES: MoodEntry[] = [
  {
    id: 'star-1',
    mood_category: 'calm',
    confidence_score: 0.94,
    journal_text: 'Still waters before the dawn. Felt deep grounding in the 4-7-8 breathing practice.',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'star-2',
    mood_category: 'happy',
    confidence_score: 0.88,
    journal_text: 'Radiant momentum. Felt spontaneous gratitude for sunset skies and tea with family.',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'star-3',
    mood_category: 'energetic',
    confidence_score: 0.92,
    journal_text: 'High electrical focus. Channeled the starlight surge into creative architecture.',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'star-4',
    mood_category: 'sad',
    confidence_score: 0.82,
    journal_text: 'Gentle rainy feelings. Embraced self-compassion and let the night sky hold space.',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'star-5',
    mood_category: 'calm',
    confidence_score: 0.96,
    journal_text: 'Deep ocean tranquility. Fireflies floating outside the window.',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'star-6',
    mood_category: 'neutral',
    confidence_score: 0.86,
    journal_text: 'Balanced equilibrium. Clear canvas ready for tomorrow.',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'star-7',
    mood_category: 'happy',
    confidence_score: 0.95,
    journal_text: 'A glowing realization. Shared warmth with people I care about.',
    created_at: new Date().toISOString(),
  },
];

/**
 * Fetch all mood entries (from Supabase if user logged in, or local star memory)
 */
export async function fetchMoodEntries(): Promise<MoodEntry[]> {
  if (supabase) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data, error } = await supabase
          .from('mood_entries')
          .select('*')
          .eq('user_id', userData.user.id)
          .order('created_at', { ascending: true });

        if (!error && data) {
          return data as MoodEntry[];
        }
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local memory:', e);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ENTRIES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    localStorage.setItem(LOCAL_STORAGE_ENTRIES_KEY, JSON.stringify(DEFAULT_INITIAL_ENTRIES));
    return DEFAULT_INITIAL_ENTRIES;
  } catch {
    return DEFAULT_INITIAL_ENTRIES;
  }
}

/**
 * Persist a new mood entry with optional journal reflection text
 */
export async function saveMoodEntry(entry: Omit<MoodEntry, 'id' | 'created_at'>): Promise<MoodEntry> {
  const newEntry: MoodEntry = {
    id: `star_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    ...entry,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data, error } = await supabase
          .from('mood_entries')
          .insert({
            user_id: userData.user.id,
            mood_category: entry.mood_category,
            confidence_score: entry.confidence_score,
            journal_text: entry.journal_text || null,
            metadata: entry.metadata || {},
          })
          .select()
          .single();

        if (!error && data) {
          return data as MoodEntry;
        }
      }
    } catch (e) {
      console.warn('Supabase insert failed, saving to local star memory:', e);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ENTRIES_KEY);
    const list: MoodEntry[] = raw ? JSON.parse(raw) : [...DEFAULT_INITIAL_ENTRIES];
    list.push(newEntry);
    localStorage.setItem(LOCAL_STORAGE_ENTRIES_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }

  return newEntry;
}

/**
 * Calculates consecutive logging streak in days
 */
export function calculateStreak(entries: MoodEntry[]): number {
  if (!entries.length) return 0;

  const dates = entries
    .map((e) => new Date(e.created_at).toDateString())
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (!dates.length) return 0;

  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (dates[0] !== today && dates[0] !== yesterday) {
    return 1;
  }

  streak = dates.length;
  return Math.max(streak, 1);
}

/**
 * Computes lightweight pattern insights without requiring heavy ML
 */
export function generatePatternInsights(entries: MoodEntry[]): PatternInsight {
  if (!entries.length) {
    return {
      headline: 'Awaiting Celestial Observations',
      subtext: 'Calibrate your facial resonance to begin forming personal constellation patterns.',
      dominantMood: 'calm',
      dominantPercentage: 100,
      streakCount: 0,
      equilibriumScore: 85,
      recommendationNote: 'Start with a single morning calibration to anchor your day.',
    };
  }

  const counts: Record<MoodType, number> = {
    happy: 0,
    calm: 0,
    sad: 0,
    energetic: 0,
    neutral: 0,
  };

  for (const entry of entries) {
    counts[entry.mood_category] = (counts[entry.mood_category] || 0) + 1;
  }

  let dominantMood: MoodType = 'calm';
  let maxCount = 0;

  for (const [mood, count] of Object.entries(counts) as [MoodType, number][]) {
    if (count > maxCount) {
      maxCount = count;
      dominantMood = mood;
    }
  }

  const dominantPercentage = Math.round((maxCount / entries.length) * 100);
  const streakCount = calculateStreak(entries);

  // Dynamic anime-style insight descriptions
  const headlineMap: Record<MoodType, string> = {
    calm: "You've resonated in Deep Serenity most frequently this week",
    happy: "Radiant Joy is your dominant emotional frequency this cycle",
    energetic: "High Starlight Energy surges across your recent logs",
    sad: "Gentle Introspective Rain has asked for tenderness recently",
    neutral: "A centered, harmonious Equilibrium anchors your emotional sky",
  };

  const noteMap: Record<MoodType, string> = {
    calm: 'Theta soundscapes and evening silence continue to nourish your nervous system.',
    happy: 'Savoring and gratitude journaling are compounding your high resonance.',
    energetic: 'Remember to interweave 4-4-4-4 box breathing to avoid battery drain.',
    sad: 'Your 4-7-8 downshifts are creating safe space for emotional processing.',
    neutral: 'Receptive zero-point states provide the clearest foundation for creative work.',
  };

  return {
    headline: headlineMap[dominantMood],
    subtext: `Analysis across ${entries.length} starlight entries reveals a ${dominantPercentage}% harmonic concentration in ${dominantMood.toUpperCase()}.`,
    dominantMood,
    dominantPercentage,
    streakCount,
    equilibriumScore: Math.min(75 + entries.length * 3, 98),
    recommendationNote: noteMap[dominantMood],
  };
}
