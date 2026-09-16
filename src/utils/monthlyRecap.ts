import { fetchMoodEntries, supabase, calculateStreak, type MoodEntry } from '../lib/supabase';
import type { MoodType } from '../types';
import type { MonthlyRecapData, RecapMoment } from '../types/recap';
import { generateWeatherReport } from './weatherReport';
import { MOODS } from '../components/sections/HeroSection';

const LOCAL_RECAP_KEY = 'vynura_last_recap_shown_month';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Generate a comprehensive highlight reel data structure for a given month
 */
export async function generateMonthlyRecap(
  _userId?: string,
  targetMonth?: number, // 0-11
  targetYear?: number
): Promise<MonthlyRecapData> {
  const now = new Date();
  const month = targetMonth !== undefined ? targetMonth : (now.getDate() < 5 ? (now.getMonth() === 0 ? 11 : now.getMonth() - 1) : now.getMonth());
  const year = targetYear !== undefined ? targetYear : (targetMonth === 11 && now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear());

  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthName = MONTH_NAMES[month];

  // Fetch all mood entries
  const allEntries = await fetchMoodEntries();

  // Filter entries for target month
  const monthEntries = allEntries.filter((entry) => {
    const d = new Date(entry.created_at);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  // Use month entries if available, otherwise use recent entries as fallback pool
  const workingPool: MoodEntry[] = monthEntries.length >= 3 ? monthEntries : allEntries;

  // Calculate mood counts
  const counts: Record<MoodType, number> = {
    happy: 0,
    calm: 0,
    energetic: 0,
    sad: 0,
    neutral: 0,
  };

  let freezeCapturesCount = 0;
  let totalPositiveMoments = 0;

  for (const entry of workingPool) {
    counts[entry.mood_category] = (counts[entry.mood_category] || 0) + 1;
    if (entry.metadata?.capture_type === 'freeze') {
      freezeCapturesCount += 1;
    }
    if (entry.mood_category === 'happy' || entry.mood_category === 'calm' || entry.mood_category === 'energetic') {
      totalPositiveMoments += 1;
    }
  }

  // Determine dominant positive/overall mood
  let dominantMood: MoodType = 'calm';
  let maxCount = -1;
  for (const [m, count] of Object.entries(counts) as [MoodType, number][]) {
    if (count > maxCount) {
      maxCount = count;
      dominantMood = m;
    }
  }

  const dominantMoodPercentage = workingPool.length > 0 
    ? Math.round((maxCount / workingPool.length) * 100)
    : 100;

  // Filter and sort positive moments / freeze captures for the highlight reel
  const positiveEntries = workingPool.filter(
    (e) => e.mood_category === 'happy' || e.mood_category === 'calm' || e.mood_category === 'energetic' || e.metadata?.capture_type === 'freeze'
  );

  // Sort: freeze captures first, then by confidence score descending
  const sortedHighlights = [...positiveEntries].sort((a, b) => {
    const aFreeze = a.metadata?.capture_type === 'freeze' ? 1 : 0;
    const bFreeze = b.metadata?.capture_type === 'freeze' ? 1 : 0;
    if (bFreeze !== aFreeze) return bFreeze - aFreeze;
    return b.confidence_score - a.confidence_score;
  });

  // Take top 5 moments
  const selectedEntries = (sortedHighlights.length > 0 ? sortedHighlights : workingPool).slice(0, 5);

  const highlights: RecapMoment[] = selectedEntries.map((entry) => {
    const d = new Date(entry.created_at);
    const dateFormatted = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    const isFreeze = entry.metadata?.capture_type === 'freeze';
    const moodMeta = MOODS[entry.mood_category] || MOODS.calm;

    return {
      id: entry.id,
      mood: entry.mood_category,
      label: moodMeta.label,
      date: entry.created_at,
      dateFormatted,
      journalText: entry.journal_text || (isFreeze ? 'Moment frozen in radiant awareness.' : undefined),
      isFreezeCapture: isFreeze,
      confidence: entry.confidence_score,
      blendLabel: typeof entry.metadata?.blendLabel === 'string' ? entry.metadata.blendLabel : undefined,
      sparkTitle: typeof entry.metadata?.sparkTitle === 'string' ? entry.metadata.sparkTitle : undefined,
    };
  });

  const streakDays = calculateStreak(allEntries);

  const poeticSummary = `In ${monthName}, your constellation was illuminated by ${dominantMoodPercentage}% ${MOODS[dominantMood]?.label || dominantMood}. You anchored ${totalPositiveMoments} moments of starlight and calm across the cosmos.`;

  const weatherReport = await generateWeatherReport(_userId, month, year);

  return {
    monthKey,
    monthName,
    year,
    totalPositiveMoments,
    totalEntries: workingPool.length,
    freezeCapturesCount,
    dominantMood,
    dominantMoodLabel: MOODS[dominantMood]?.label || dominantMood,
    dominantMoodPercentage,
    longestStreakDays: Math.max(streakDays, 3),
    highlights,
    poeticSummary,
    weatherReport,
  };
}

/**
 * Check if the user is eligible to see the monthly recap banner/modal
 */
export async function checkShouldShowMonthlyRecap(userId?: string): Promise<{
  shouldShow: boolean;
  monthKey: string;
}> {
  const now = new Date();
  const month = now.getDate() < 5 ? (now.getMonth() === 0 ? 11 : now.getMonth() - 1) : now.getMonth();
  const year = month === 11 && now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const currentMonthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

  // Check Supabase preferences first if logged in
  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('last_recap_shown_month')
        .eq('user_id', userId)
        .single();

      if (!error && data) {
        return {
          shouldShow: data.last_recap_shown_month !== currentMonthKey,
          monthKey: currentMonthKey,
        };
      }
    } catch {
      // ignore
    }
  }

  // Check localStorage
  try {
    const lastShown = localStorage.getItem(LOCAL_RECAP_KEY);
    return {
      shouldShow: lastShown !== currentMonthKey,
      monthKey: currentMonthKey,
    };
  } catch {
    return {
      shouldShow: true,
      monthKey: currentMonthKey,
    };
  }
}

/**
 * Mark monthly recap as seen by the user for this month
 */
export async function markMonthlyRecapSeen(monthKey: string, userId?: string): Promise<void> {
  try {
    localStorage.setItem(LOCAL_RECAP_KEY, monthKey);
  } catch {
    // ignore
  }

  if (supabase && userId) {
    try {
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          last_recap_shown_month: monthKey,
          updated_at: new Date().toISOString(),
        });
    } catch {
      // ignore
    }
  }
}
