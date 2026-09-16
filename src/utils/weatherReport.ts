import { fetchMoodEntries, getMoodCorrelations, type MoodEntry } from '../lib/supabase';
import type { MoodType } from '../types';
import { MOODS } from '../components/sections/HeroSection';

export interface MonthlyWeatherReport {
  monthName: string;
  year: number;
  dominantMood: MoodType;
  dominantMoodLabel: string;
  dominantMoodColor: string;
  weatherAtmosphere: string;
  weatherIconName: string;
  trajectory: 'improving' | 'declining' | 'stable';
  trajectoryLabel: string;
  trajectoryTrendSummary: string;
  topCorrelationInsight: string;
  nextMonthFocus: string;
  suggestedPractice: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

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

const ATMOSPHERE_MAP: Record<MoodType, { title: string; icon: string }> = {
  happy: { title: 'Golden Starlight & Radiant Skies', icon: 'Sun' },
  calm: { title: 'Tranquil Blue Waters & Clear Horizons', icon: 'Sparkles' },
  energetic: { title: 'Dynamic Aurora & Charged Starlight', icon: 'Zap' },
  sad: { title: 'Gentle Rain & Soft Gray Clouds', icon: 'CloudRain' },
  neutral: { title: 'Still Evening Equilibrium', icon: 'Moon' },
};

/**
 * Generates an atmospheric "Emotional Weather Report" for the month.
 * Combines dominant mood, monthly trajectory, circadian/weekday correlation,
 * and a tailored next-month micro-focus.
 */
export async function generateWeatherReport(
  userId?: string,
  targetMonth?: number,
  targetYear?: number
): Promise<MonthlyWeatherReport> {
  const now = new Date();
  const month = targetMonth !== undefined ? targetMonth : (now.getDate() < 5 ? (now.getMonth() === 0 ? 11 : now.getMonth() - 1) : now.getMonth());
  const year = targetYear !== undefined ? targetYear : (targetMonth === 11 && now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear());

  const monthName = MONTH_NAMES[month];

  // Fetch entries and correlations in parallel
  const [allEntries, correlations] = await Promise.all([
    fetchMoodEntries(),
    getMoodCorrelations(userId),
  ]);

  // Filter entries scoped to the target month
  const monthEntries = allEntries.filter((entry) => {
    const d = new Date(entry.created_at);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const workingPool: MoodEntry[] = monthEntries.length >= 3 ? monthEntries : allEntries;

  // 1. Dominant Mood of the Month
  const counts: Record<MoodType, number> = {
    happy: 0,
    calm: 0,
    energetic: 0,
    sad: 0,
    neutral: 0,
  };

  for (const entry of workingPool) {
    counts[entry.mood_category] = (counts[entry.mood_category] || 0) + 1;
  }

  let dominantMood: MoodType = 'calm';
  let maxCount = -1;
  for (const [m, count] of Object.entries(counts) as [MoodType, number][]) {
    if (count > maxCount) {
      maxCount = count;
      dominantMood = m;
    }
  }

  const moodMeta = MOODS[dominantMood] || MOODS.calm;
  const atmosphere = ATMOSPHERE_MAP[dominantMood] || ATMOSPHERE_MAP.calm;

  // 2. Trajectory scoped to month
  const chrono = [...workingPool].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  const valences = chrono.map(getEntryValence);

  let trajectory: 'improving' | 'declining' | 'stable' = 'stable';
  let trajectoryLabel = 'Harmonious Equilibrium →';
  let trajectoryTrendSummary = 'Your emotional climate maintained a steady, centered baseline throughout the month.';

  if (valences.length >= 2) {
    const delta = valences[valences.length - 1] - valences[0];
    if (delta >= 0.25) {
      trajectory = 'improving';
      trajectoryLabel = 'Resonance Rising ↗';
      trajectoryTrendSummary = 'Your emotional frequency expanded into brighter, higher starlight resonance across the month.';
    } else if (delta <= -0.25) {
      trajectory = 'declining';
      trajectoryLabel = 'Gentle Descent ↘';
      trajectoryTrendSummary = 'The climate shifted toward softer introspective depth, inviting grounding self-care.';
    }
  }

  // 3. Next month focus tied to correlations & weakest pattern
  let nextMonthFocus = 'This month, continue anchoring daily micro-moments of mindful presence under the night sky.';
  let suggestedPractice = 'Daily 2-Minute Starlight Calibration';

  if (correlations.hasSufficientData) {
    if (correlations.reflectiveDay && correlations.reflectiveDay.regulateSupportRatio >= 0.35) {
      nextMonthFocus = `This month, try a gentle evening wind-down or theta soundscape on ${correlations.reflectiveDay.day}s.`;
      suggestedPractice = 'Evening 4-7-8 Deep Sleep Breathing';
    } else {
      const eveningStat = correlations.timeOfDayBreakdown.find((t) => t.period === 'evening');
      const nightStat = correlations.timeOfDayBreakdown.find((t) => t.period === 'night');
      if (eveningStat && eveningStat.regulateSupportRatio > 0.3) {
        nextMonthFocus = 'This month, weave a 3-minute breath shift into your early evening transition.';
        suggestedPractice = 'Twilight Box Breathing (4-4-4-4)';
      } else if (nightStat && nightStat.regulateSupportRatio > 0.3) {
        nextMonthFocus = 'This month, create a soft quiet-space ritual before midnight to ease into restful stillness.';
        suggestedPractice = 'Theta Wave Binaural Soundscape';
      } else {
        nextMonthFocus = 'This month, channel your peak resonance into creative sparks and shared moments with loved ones.';
        suggestedPractice = 'Quick Spark Micro-Activities';
      }
    }
  }

  return {
    monthName,
    year,
    dominantMood,
    dominantMoodLabel: moodMeta.label,
    dominantMoodColor: moodMeta.color,
    weatherAtmosphere: atmosphere.title,
    weatherIconName: atmosphere.icon,
    trajectory,
    trajectoryLabel,
    trajectoryTrendSummary,
    topCorrelationInsight: correlations.topInsight,
    nextMonthFocus,
    suggestedPractice,
  };
}
