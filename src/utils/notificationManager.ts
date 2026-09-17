import { fetchMoodEntries, supabase } from '../lib/supabase';

const NOTIF_PREF_KEY = 'vynura_notifications_enabled';
const NOTIF_LAST_SHOWN_KEY = 'vynura_last_nudge_date';

let scheduledTimeoutId: ReturnType<typeof setTimeout> | null = null;

/**
 * Checks if browser supports the Web Notification API
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Gets current notification permission status ('granted', 'denied', 'default')
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

/**
 * Fetches user preference for notifications from Supabase or localStorage
 */
export async function getNotificationPreference(userId?: string): Promise<boolean> {
  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('notifications_enabled')
        .eq('user_id', userId)
        .single();

      if (!error && data) {
        return Boolean(data.notifications_enabled);
      }
    } catch {
      // ignore
    }
  }

  try {
    const raw = localStorage.getItem(NOTIF_PREF_KEY);
    return raw === 'true';
  } catch {
    return false;
  }
}

/**
 * Updates notification preference. If enabling, explicitly prompts for browser permission.
 */
export async function setNotificationPreference(
  enabled: boolean,
  userId?: string
): Promise<{ success: boolean; permission: NotificationPermission }> {
  if (!isNotificationSupported()) {
    return { success: false, permission: 'denied' };
  }

  let currentPermission = Notification.permission;

  if (enabled && currentPermission === 'default') {
    try {
      currentPermission = await Notification.requestPermission();
    } catch (e) {
      console.warn('Error requesting notification permission:', e);
    }
  }

  const actuallyEnabled = enabled && currentPermission === 'granted';

  try {
    localStorage.setItem(NOTIF_PREF_KEY, String(actuallyEnabled));
  } catch {
    // ignore
  }

  if (supabase && userId) {
    try {
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          notifications_enabled: actuallyEnabled,
          updated_at: new Date().toISOString(),
        });
    } catch {
      // ignore
    }
  }

  if (actuallyEnabled) {
    checkAndScheduleEveningNudge(userId);
  } else if (scheduledTimeoutId) {
    clearTimeout(scheduledTimeoutId);
    scheduledTimeoutId = null;
  }

  return { success: actuallyEnabled, permission: currentPermission };
}

/**
 * Dispatches a soft, gentle starlight reminder
 */
export function sendStarlightNudge(): void {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return;

  const todayStr = new Date().toDateString();
  try {
    localStorage.setItem(NOTIF_LAST_SHOWN_KEY, todayStr);
  } catch {
    // ignore
  }

  try {
    new Notification("Your sky's missing tonight's star ✨", {
      body: "A quiet moment awaits whenever you're ready to inscribe today's constellation reflection.",
      badge: '/favicon.ico',
      icon: '/favicon.ico',
      tag: 'vynura-evening-star-reminder',
    });
  } catch (e) {
    console.warn('Notification trigger error:', e);
  }
}

/**
 * Evaluates whether the user has calibrated today.
 * If past 8 PM and no star was inscribed, triggers or schedules a client-side reminder.
 */
export async function checkAndScheduleEveningNudge(
  userId?: string
): Promise<{ scheduled: boolean; reason?: string }> {
  if (!isNotificationSupported()) {
    return { scheduled: false, reason: 'Notifications not supported' };
  }

  const isEnabled = await getNotificationPreference(userId);
  if (!isEnabled || Notification.permission !== 'granted') {
    return { scheduled: false, reason: 'Notifications not enabled' };
  }

  // Check if user has already logged a mood entry today
  const entries = await fetchMoodEntries();
  const todayDateString = new Date().toDateString();
  const hasCalibratedToday = entries.some(
    (e) => new Date(e.created_at).toDateString() === todayDateString
  );

  if (hasCalibratedToday) {
    return { scheduled: false, reason: 'User already calibrated today' };
  }

  // Check if already nudged today
  const lastNudgedDate = localStorage.getItem(NOTIF_LAST_SHOWN_KEY);
  if (lastNudgedDate === todayDateString) {
    return { scheduled: false, reason: 'Already reminded today' };
  }

  const now = new Date();
  const currentHour = now.getHours();

  // If already past 8 PM (20:00)
  if (currentHour >= 20) {
    sendStarlightNudge();
    return { scheduled: true, reason: 'Nudge sent for evening past 8 PM' };
  }

  // Otherwise, schedule client-side timer for 8:00 PM today during active session
  const target8PM = new Date();
  target8PM.setHours(20, 0, 0, 0);
  const msUntil8PM = target8PM.getTime() - now.getTime();

  if (msUntil8PM > 0) {
    if (scheduledTimeoutId) clearTimeout(scheduledTimeoutId);
    scheduledTimeoutId = setTimeout(() => {
      checkAndScheduleEveningNudge(userId);
    }, msUntil8PM);

    return { scheduled: true, reason: `Scheduled in ${Math.round(msUntil8PM / 60000)} minutes` };
  }

  return { scheduled: false };
}
