import { SPARK_ACTIVITIES, getSparkById } from '../data/sparkActivities';
import type {
  SparkActivity,
  SparkLogEntry,
  SparkStreak,
  SparkCompletionResult,
} from '../types/sparks';
import { supabase } from '../lib/supabase';

const LOCAL_SPARK_LOG_KEY = 'vynura_spark_logs';
const LOCAL_SPARK_STREAK_KEY = 'vynura_spark_streak';

/**
 * Returns today's local date string in YYYY-MM-DD format.
 */
function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/**
 * Returns yesterday's local date string in YYYY-MM-DD format.
 */
function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Fetches spark logs from Supabase or local storage.
 */
export async function fetchSparkLogs(userId?: string): Promise<SparkLogEntry[]> {
  if (supabase) {
    try {
      let query = supabase
        .from('spark_log')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data as SparkLogEntry[];
      }
    } catch (e) {
      console.warn('Supabase fetchSparkLogs failed, fallback to local storage:', e);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_SPARK_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Fetches user spark streak record.
 */
export async function getSparkStreak(userId?: string): Promise<SparkStreak> {
  const defaultStreak: SparkStreak = {
    user_id: userId,
    current_streak: 0,
    longest_streak: 0,
    last_completed_date: null,
  };

  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('spark_streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!error && data) {
        return data as SparkStreak;
      }
    } catch (e) {
      console.warn('Supabase getSparkStreak failed, fallback to local:', e);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_SPARK_STREAK_KEY);
    return raw ? JSON.parse(raw) : defaultStreak;
  } catch {
    return defaultStreak;
  }
}

/**
 * Checks if a Spark was already shown/generated today.
 * If yes: returns null (do not show again today).
 * If no: picks a random activity NOT shown in the last 5 days, logs it, and returns it.
 */
export async function getTodaysSpark(userId?: string): Promise<SparkActivity | null> {
  const logs = await fetchSparkLogs(userId);
  const todayStr = getTodayDateString();

  // 1. Check if a spark log entry was already created today
  const existingTodayLog = logs.find((entry) => {
    const entryDate = new Date(entry.created_at);
    const logDateStr = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}-${String(entryDate.getDate()).padStart(2, '0')}`;
    return logDateStr === todayStr;
  });

  if (existingTodayLog) {
    // If today's spark is not yet completed, return it so user can complete it;
    // if already completed today, return null to avoid repeating
    if (!existingTodayLog.completed) {
      return getSparkById(existingTodayLog.activity_id) || null;
    }
    return null;
  }

  // 2. Identify activity IDs shown in the last 5 days
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  const recentActivityIds = new Set<string>();
  for (const entry of logs) {
    const entryTime = new Date(entry.created_at).getTime();
    if (entryTime >= fiveDaysAgo.getTime()) {
      recentActivityIds.add(entry.activity_id);
    }
  }

  // 3. Filter candidates not shown in the last 5 days
  let candidates = SPARK_ACTIVITIES.filter((act) => !recentActivityIds.has(act.id));
  if (candidates.length === 0) {
    // If all activities have been shown recently, open the full pool
    candidates = SPARK_ACTIVITIES;
  }

  // 4. Randomly pick one activity from the candidate pool
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];

  // 5. Persist the newly surfaced spark log entry
  const newLog: SparkLogEntry = {
    id: `spark_log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user_id: userId,
    activity_id: chosen.id,
    completed: false,
    completed_at: null,
    created_at: new Date().toISOString(),
  };

  try {
    const raw = localStorage.getItem(LOCAL_SPARK_LOG_KEY);
    const existingList: SparkLogEntry[] = raw ? JSON.parse(raw) : [];
    existingList.unshift(newLog);
    localStorage.setItem(LOCAL_SPARK_LOG_KEY, JSON.stringify(existingList.slice(0, 100)));
  } catch (e) {
    console.warn('Could not save spark log locally:', e);
  }

  if (supabase) {
    try {
      await supabase.from('spark_log').insert({
        id: newLog.id.startsWith('spark_log_') ? undefined : newLog.id,
        user_id: userId || null,
        activity_id: newLog.activity_id,
        completed: false,
      });
    } catch (e) {
      console.warn('Supabase spark log insert failed:', e);
    }
  }

  return chosen;
}

/**
 * Marks a spark activity as completed and updates streaks with compassionate break messaging.
 */
export async function completeSparkActivity(
  activityId: string,
  userId?: string
): Promise<SparkCompletionResult> {
  const todayStr = getTodayDateString();
  const yesterdayStr = getYesterdayDateString();
  const completedAt = new Date().toISOString();

  // 1. Update local spark logs
  try {
    const raw = localStorage.getItem(LOCAL_SPARK_LOG_KEY);
    if (raw) {
      const list: SparkLogEntry[] = JSON.parse(raw);
      const target = list.find((e) => e.activity_id === activityId && !e.completed);
      if (target) {
        target.completed = true;
        target.completed_at = completedAt;
        localStorage.setItem(LOCAL_SPARK_LOG_KEY, JSON.stringify(list));
      }
    }
  } catch (e) {
    console.warn('Could not update local spark log completion:', e);
  }

  // Update Supabase spark log if connected
  if (supabase) {
    try {
      await supabase
        .from('spark_log')
        .update({
          completed: true,
          completed_at: completedAt,
        })
        .eq('activity_id', activityId)
        .eq('completed', false);
    } catch (e) {
      console.warn('Supabase spark log update failed:', e);
    }
  }

  // 2. Fetch and update streak
  const streak = await getSparkStreak(userId);
  let newCurrent = streak.current_streak;
  let newLongest = streak.longest_streak;
  let message = 'Spark ignited!';
  let isNewLongest = false;

  if (streak.last_completed_date === todayStr) {
    // Already completed today: no-op for streak
    message = 'You already stoked your daily spark today! Celestial radiance preserved.';
  } else if (streak.last_completed_date === yesterdayStr) {
    // Consecutive day completion!
    newCurrent += 1;
    if (newCurrent > newLongest) {
      newLongest = newCurrent;
      isNewLongest = true;
      message = `New Longest Streak! Your starlight chain reached ${newCurrent} days! ✦`;
    } else {
      message = `Radiant momentum! Day ${newCurrent} spark ignited!`;
    }
  } else {
    // Gap > 1 day or first time
    const hadPreviousStreak = streak.current_streak > 0;
    newCurrent = 1;
    if (newLongest === 0) {
      newLongest = 1;
      isNewLongest = true;
    }

    if (hadPreviousStreak && streak.longest_streak > 1) {
      // Soft, compassionate messaging for broken streaks
      message = `Your spark dimmed, but your longest streak of ${streak.longest_streak} still shines in your sky.`;
    } else {
      message = 'Your first Starlight Spark is ignited!';
    }
  }

  const updatedStreak: SparkStreak = {
    user_id: userId,
    current_streak: newCurrent,
    longest_streak: newLongest,
    last_completed_date: todayStr,
    streak_broken: streak.last_completed_date !== null && streak.last_completed_date !== yesterdayStr && streak.last_completed_date !== todayStr,
  };

  // Save updated streak locally
  try {
    localStorage.setItem(LOCAL_SPARK_STREAK_KEY, JSON.stringify(updatedStreak));
  } catch (e) {
    console.warn('Could not save streak locally:', e);
  }

  // Save to Supabase if connected
  if (supabase && userId) {
    try {
      await supabase.from('spark_streaks').upsert({
        user_id: userId,
        current_streak: updatedStreak.current_streak,
        longest_streak: updatedStreak.longest_streak,
        last_completed_date: todayStr,
      });
    } catch (e) {
      console.warn('Supabase spark streak upsert failed:', e);
    }
  }

  return {
    streak: updatedStreak,
    message,
    isNewLongest,
  };
}
