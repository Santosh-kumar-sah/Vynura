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

export interface RecentMoodTrend {
  entries: MoodEntry[];
  consecutiveLowCount: number;
  trajectory: 'improving' | 'declining' | 'stable';
  trajectoryLabel: string;
  trendSummary: string;
  isEscalated: boolean;
  averageValence: number;
}

/**
 * Estimates valence score from a MoodEntry.
 */
function getEntryValence(entry: MoodEntry): number {
  if (entry.metadata && typeof entry.metadata.valence === 'number') {
    return entry.metadata.valence;
  }
  switch (entry.mood_category) {
    case 'happy':
      return 0.8;
    case 'energetic':
      return 0.6;
    case 'calm':
      return 0.5;
    case 'neutral':
      return 0.0;
    case 'sad':
      return -0.7;
    default:
      return 0.0;
  }
}

/**
 * Retrieves recent mood logs and computes trajectory & escalation metrics.
 *
 * @param userId Optional user id if querying specific profile
 * @param limit Number of recent entries to consider (default: 5)
 */
export async function getRecentMoodTrend(userId?: string, limit: number = 5): Promise<RecentMoodTrend> {
  let entries: MoodEntry[] = [];

  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data) {
        entries = data as MoodEntry[];
      }
    } catch (e) {
      console.warn('Supabase getRecentMoodTrend failed, falling back to local memory:', e);
    }
  }

  if (!entries.length) {
    const all = await fetchMoodEntries();
    // Sort descending by date
    entries = [...all]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }

  if (!entries.length) {
    return {
      entries: [],
      consecutiveLowCount: 0,
      trajectory: 'stable',
      trajectoryLabel: 'Equilibrium Baseline',
      trendSummary: 'Fresh observation space ready for new resonance check-ins.',
      isEscalated: false,
      averageValence: 0,
    };
  }

  // Calculate consecutive low count (recent entries in descending order)
  let consecutiveLowCount = 0;
  for (const entry of entries) {
    const val = getEntryValence(entry);
    if (val < -0.15 || entry.mood_category === 'sad') {
      consecutiveLowCount += 1;
    } else {
      break;
    }
  }

  // Trajectory calculation (chronological order: oldest to newest)
  const chrono = [...entries].reverse();
  const valences = chrono.map(getEntryValence);
  const averageValence = valences.reduce((acc, v) => acc + v, 0) / valences.length;

  let trajectory: 'improving' | 'declining' | 'stable' = 'stable';
  let trajectoryLabel = 'Equilibrium Steady →';
  let trendSummary = 'Your emotional resonance is maintaining a steady baseline.';

  if (valences.length >= 2) {
    const delta = valences[valences.length - 1] - valences[0];
    if (delta >= 0.25) {
      trajectory = 'improving';
      trajectoryLabel = 'Resonance Uplifting ↗';
      trendSummary = 'Your emotional frequency has been steadily rising across recent sessions.';
    } else if (delta <= -0.25) {
      trajectory = 'declining';
      trajectoryLabel = 'Gentle Descent ↘';
      trendSummary = 'Recent observations reflect heavier resonance; gentle grounding is recommended.';
    }
  }

  const isEscalated = consecutiveLowCount >= 3;

  return {
    entries,
    consecutiveLowCount,
    trajectory,
    trajectoryLabel,
    trendSummary,
    isEscalated,
    averageValence,
  };
}

export type TimeOfDayBucket = 'morning' | 'afternoon' | 'evening' | 'night';
export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface DayOfWeekStat {
  day: DayOfWeek;
  dayIndex: number;
  count: number;
  averageValence: number;
  dominantMood: MoodType;
  regulateSupportRatio: number;
}

export interface TimeOfDayStat {
  period: TimeOfDayBucket;
  label: string;
  count: number;
  averageValence: number;
  dominantMood: MoodType;
  regulateSupportRatio: number;
}

export interface MoodCorrelationAnalysis {
  hasSufficientData: boolean;
  totalEntries: number;
  dayOfWeekBreakdown: DayOfWeekStat[];
  timeOfDayBreakdown: TimeOfDayStat[];
  topInsight: string;
  peakDay?: DayOfWeekStat;
  reflectiveDay?: DayOfWeekStat;
  peakTime?: TimeOfDayStat;
}

const DAY_NAMES: DayOfWeek[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * Computes pattern correlation across day-of-week and time-of-day buckets.
 * Analyzes whether certain weekdays or circadian windows skew toward regulation/support or amplification.
 *
 * @param userId Optional user id
 */
export async function getMoodCorrelations(userId?: string): Promise<MoodCorrelationAnalysis> {
  let entries: MoodEntry[] = [];

  const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000).toISOString();

  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', ninetyDaysAgo)
        .order('created_at', { ascending: false });

      if (!error && data) {
        entries = data as MoodEntry[];
      }
    } catch (e) {
      console.warn('Supabase getMoodCorrelations failed, using local memory:', e);
    }
  }

  if (!entries.length) {
    const all = await fetchMoodEntries();
    entries = all.filter((e) => new Date(e.created_at) >= new Date(Date.now() - 90 * 86400000));
  }

  // Graceful fallback if fewer than 14 total entries exist
  if (entries.length < 14) {
    return {
      hasSufficientData: false,
      totalEntries: entries.length,
      dayOfWeekBreakdown: [],
      timeOfDayBreakdown: [],
      topInsight: 'Keep calibrating, patterns will appear soon as your constellation grows.',
    };
  }

  // 1. Day of Week Breakdown
  const dayBuckets: { valences: number[]; moods: MoodType[]; regCount: number }[] = Array.from(
    { length: 7 },
    () => ({ valences: [], moods: [], regCount: 0 })
  );

  // 2. Time of Day Breakdown
  const timeBuckets: Record<
    TimeOfDayBucket,
    { label: string; valences: number[]; moods: MoodType[]; regCount: number }
  > = {
    morning: { label: 'Morning (5am - 12pm)', valences: [], moods: [], regCount: 0 },
    afternoon: { label: 'Afternoon (12pm - 5pm)', valences: [], moods: [], regCount: 0 },
    evening: { label: 'Evening (5pm - 9pm)', valences: [], moods: [], regCount: 0 },
    night: { label: 'Night (9pm - 5am)', valences: [], moods: [], regCount: 0 },
  };

  for (const entry of entries) {
    const date = new Date(entry.created_at);
    const dayIdx = date.getDay();
    const hour = date.getHours();
    const val = getEntryValence(entry);
    const isRegOrSup = val < -0.1 || entry.mood_category === 'sad';

    // Accumulate day
    dayBuckets[dayIdx].valences.push(val);
    dayBuckets[dayIdx].moods.push(entry.mood_category);
    if (isRegOrSup) dayBuckets[dayIdx].regCount += 1;

    // Accumulate time of day
    let timeKey: TimeOfDayBucket;
    if (hour >= 5 && hour < 12) {
      timeKey = 'morning';
    } else if (hour >= 12 && hour < 17) {
      timeKey = 'afternoon';
    } else if (hour >= 17 && hour < 21) {
      timeKey = 'evening';
    } else {
      timeKey = 'night';
    }

    timeBuckets[timeKey].valences.push(val);
    timeBuckets[timeKey].moods.push(entry.mood_category);
    if (isRegOrSup) timeBuckets[timeKey].regCount += 1;
  }

  // Helper to determine dominant mood in a list
  const getDominant = (moodList: MoodType[]): MoodType => {
    if (!moodList.length) return 'neutral';
    const counts: Partial<Record<MoodType, number>> = {};
    for (const m of moodList) counts[m] = (counts[m] || 0) + 1;
    let top: MoodType = 'neutral';
    let max = -1;
    for (const [m, c] of Object.entries(counts) as [MoodType, number][]) {
      if (c > max) {
        max = c;
        top = m;
      }
    }
    return top;
  };

  const dayOfWeekBreakdown: DayOfWeekStat[] = dayBuckets.map((b, idx) => {
    const count = b.valences.length;
    const avgVal = count > 0 ? b.valences.reduce((a, v) => a + v, 0) / count : 0;
    return {
      day: DAY_NAMES[idx],
      dayIndex: idx,
      count,
      averageValence: avgVal,
      dominantMood: getDominant(b.moods),
      regulateSupportRatio: count > 0 ? b.regCount / count : 0,
    };
  });

  const timeOfDayBreakdown: TimeOfDayStat[] = (
    ['morning', 'afternoon', 'evening', 'night'] as TimeOfDayBucket[]
  ).map((period) => {
    const b = timeBuckets[period];
    const count = b.valences.length;
    const avgVal = count > 0 ? b.valences.reduce((a, v) => a + v, 0) / count : 0;
    return {
      period,
      label: b.label,
      count,
      averageValence: avgVal,
      dominantMood: getDominant(b.moods),
      regulateSupportRatio: count > 0 ? b.regCount / count : 0,
    };
  });

  // 3. Find strong skews & generate topInsight using ~8 template patterns (gentle, non-clinical)
  const populatedDays = dayOfWeekBreakdown.filter((d) => d.count >= 2);
  const populatedTimes = timeOfDayBreakdown.filter((t) => t.count >= 2);

  let topInsight = 'Your emotional frequency maintains a steady, harmonious equilibrium throughout the week.';

  const morningStat = timeOfDayBreakdown.find((t) => t.period === 'morning');
  const eveningStat = timeOfDayBreakdown.find((t) => t.period === 'evening');
  const nightStat = timeOfDayBreakdown.find((t) => t.period === 'night');
  const afternoonStat = timeOfDayBreakdown.find((t) => t.period === 'afternoon');

  // Check weekday vs weekend
  const weekdayAvg =
    populatedDays.filter((d) => d.dayIndex >= 1 && d.dayIndex <= 5).reduce((a, d) => a + d.averageValence, 0) /
    Math.max(1, populatedDays.filter((d) => d.dayIndex >= 1 && d.dayIndex <= 5).length);
  const weekendAvg =
    populatedDays.filter((d) => d.dayIndex === 0 || d.dayIndex === 6).reduce((a, d) => a + d.averageValence, 0) /
    Math.max(1, populatedDays.filter((d) => d.dayIndex === 0 || d.dayIndex === 6).length);

  // Find day with highest regulate/support
  const sortedByRegulate = [...populatedDays].sort((a, b) => b.regulateSupportRatio - a.regulateSupportRatio);
  const highestRegDay = sortedByRegulate[0];

  // Find day with highest positive valence
  const sortedByValence = [...populatedDays].sort((a, b) => b.averageValence - a.averageValence);
  const highestPosDay = sortedByValence[0];

  // Template pattern selection
  if (morningStat && eveningStat && morningStat.count >= 2 && eveningStat.count >= 2 && morningStat.averageValence - eveningStat.averageValence > 0.22) {
    topInsight = 'Your mornings tend to run calmer and more grounded than your evenings.';
  } else if (eveningStat && morningStat && eveningStat.count >= 2 && morningStat.count >= 2 && eveningStat.averageValence - morningStat.averageValence > 0.22) {
    topInsight = 'Evenings carry a radiant surge of creative momentum and joy across your cycle.';
  } else if (highestRegDay && highestRegDay.regulateSupportRatio >= 0.4 && highestRegDay.count >= 3) {
    topInsight = `${highestRegDay.day}s show more Gentle Rain moments and reflective space than other days.`;
  } else if (highestPosDay && highestPosDay.averageValence >= 0.5 && highestPosDay.count >= 3) {
    topInsight = `${highestPosDay.day}s consistently radiate high Starlight Energy and spontaneous warmth.`;
  } else if (nightStat && nightStat.count >= 3 && (nightStat.dominantMood === 'sad' || nightStat.dominantMood === 'calm')) {
    topInsight = 'Late nights invite softer introspective contemplation under the quiet sky.';
  } else if (afternoonStat && afternoonStat.count >= 3 && afternoonStat.dominantMood === 'neutral') {
    topInsight = 'Midweek afternoons are when your equilibrium and clear focus reach their peak.';
  } else if (weekendAvg - weekdayAvg > 0.2 && populatedDays.length >= 4) {
    topInsight = 'Your weekends resonate with a lighter, uplifting frequency compared to weekday rhythms.';
  } else if (morningStat && morningStat.count >= 3 && morningStat.dominantMood === 'calm') {
    topInsight = 'Mornings frequently awaken in clear equilibrium and quiet presence.';
  }

  return {
    hasSufficientData: true,
    totalEntries: entries.length,
    dayOfWeekBreakdown,
    timeOfDayBreakdown,
    topInsight,
    peakDay: highestPosDay,
    reflectiveDay: highestRegDay,
    peakTime: populatedTimes.sort((a, b) => b.averageValence - a.averageValence)[0],
  };
}


