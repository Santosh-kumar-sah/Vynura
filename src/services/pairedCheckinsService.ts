import { supabase } from '../lib/supabase';
import type { MoodType } from '../types';
import { MOODS } from '../components/sections/HeroSection';

export interface PairConnection {
  id: string;
  user_a: string;
  user_b?: string | null;
  invite_code: string;
  status: 'pending' | 'active' | 'revoked';
  created_at: string;
}

export interface PairedDailyMood {
  partnerId: string;
  todayMoodCategory: MoodType | null;
  todayMoodLabel: string | null;
  todayMoodColor: string | null;
  hasCalibratedToday: boolean;
}

const LOCAL_PAIR_KEY = 'vynura_paired_connection';

function generateRandomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let res = 'STAR-';
  for (let i = 0; i < 4; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

/**
 * Returns currently authenticated user, or null if guest/not logged in.
 */
export async function getAuthenticatedUser(): Promise<{ id: string; email?: string } | null> {
  if (supabase) {
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user) return data.user;
    } catch {
      // ignore
    }
  }

  // Fallback to local session if present
  try {
    const rawDemo = localStorage.getItem('vynura_demo_user');
    if (rawDemo) {
      const parsed = JSON.parse(rawDemo);
      if (parsed?.id) return parsed;
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * Retrieves the current active or pending pair connection for a user.
 */
export async function getPairConnection(userId: string): Promise<PairConnection | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('pair_connections')
        .select('*')
        .or(`user_a.eq.${userId},user_b.eq.${userId}`)
        .neq('status', 'revoked')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return data as PairConnection;
      }
    } catch (e) {
      console.warn('Supabase getPairConnection failed, trying local fallback:', e);
    }
  }

  // Local fallback
  try {
    const raw = localStorage.getItem(LOCAL_PAIR_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PairConnection;
      if (parsed.status !== 'revoked' && (parsed.user_a === userId || parsed.user_b === userId)) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * Creates a new pending pair connection with an invite code.
 */
export async function createPairInvite(userId: string): Promise<PairConnection> {
  const invite_code = generateRandomCode();
  const newPair: PairConnection = {
    id: `pair_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    user_a: userId,
    user_b: null,
    invite_code,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('pair_connections')
        .insert({
          user_a: userId,
          invite_code,
          status: 'pending',
        })
        .select()
        .single();

      if (!error && data) {
        return data as PairConnection;
      }
    } catch (e) {
      console.warn('Supabase createPairInvite failed, using local storage:', e);
    }
  }

  try {
    localStorage.setItem(LOCAL_PAIR_KEY, JSON.stringify(newPair));
  } catch {
    // ignore
  }

  return newPair;
}

/**
 * Accepts a pending pair invitation code.
 */
export async function acceptPairInvite(
  inviteCode: string,
  userId: string
): Promise<{ success: boolean; error?: string; connection?: PairConnection }> {
  const codeFormatted = inviteCode.trim().toUpperCase();

  if (supabase) {
    try {
      // Find pending invite
      const { data: pending, error: findError } = await supabase
        .from('pair_connections')
        .select('*')
        .eq('invite_code', codeFormatted)
        .eq('status', 'pending')
        .maybeSingle();

      if (findError || !pending) {
        return { success: false, error: 'Invite code not found or already accepted.' };
      }

      if (pending.user_a === userId) {
        return { success: false, error: 'You cannot pair with yourself.' };
      }

      // Update to active
      const { data: updated, error: updateError } = await supabase
        .from('pair_connections')
        .update({
          user_b: userId,
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', pending.id)
        .select()
        .single();

      if (!updateError && updated) {
        return { success: true, connection: updated as PairConnection };
      }
    } catch (e) {
      console.warn('Supabase acceptPairInvite failed:', e);
    }
  }

  // Local fallback check
  try {
    const raw = localStorage.getItem(LOCAL_PAIR_KEY);
    if (raw) {
      const local = JSON.parse(raw) as PairConnection;
      if (local.invite_code === codeFormatted && local.status === 'pending') {
        if (local.user_a === userId) {
          return { success: false, error: 'You cannot pair with yourself.' };
        }
        local.user_b = userId;
        local.status = 'active';
        localStorage.setItem(LOCAL_PAIR_KEY, JSON.stringify(local));
        return { success: true, connection: local };
      }
    }
  } catch {
    // ignore
  }

  return { success: false, error: 'Invalid or expired invite code.' };
}

/**
 * Immediately revokes pairing, cutting off all mutual visibility.
 */
export async function revokePairConnection(pairId: string, userId: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('pair_connections')
        .update({ status: 'revoked', updated_at: new Date().toISOString() })
        .eq('id', pairId);

      if (!error) {
        return true;
      }
    } catch (e) {
      console.warn('Supabase revoke failed:', e);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_PAIR_KEY);
    if (raw) {
      const local = JSON.parse(raw) as PairConnection;
      if (local.id === pairId && (local.user_a === userId || local.user_b === userId)) {
        local.status = 'revoked';
        localStorage.setItem(LOCAL_PAIR_KEY, JSON.stringify(local));
      }
    }
  } catch {
    // ignore
  }

  return true;
}

/**
 * Fetches the partner's mood category for TODAY only.
 * STRICT PRIVACY: Requests ONLY mood_category. Never fetches journal_text,
 * confidence_score, or metadata.
 */
export async function getPartnerTodayMood(
  pair: PairConnection,
  currentUserId: string
): Promise<PairedDailyMood | null> {
  if (pair.status !== 'active') return null;

  const partnerId = pair.user_a === currentUserId ? pair.user_b : pair.user_a;
  if (!partnerId) return null;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  let latestTodayMood: MoodType | null = null;

  if (supabase) {
    try {
      // STRICT PRIVACY QUERY: Only select mood_category & created_at
      const { data, error } = await supabase
        .from('mood_entries')
        .select('mood_category, created_at')
        .eq('user_id', partnerId)
        .gte('created_at', todayStart.toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        latestTodayMood = data.mood_category as MoodType;
      }
    } catch (e) {
      console.warn('Could not query partner today mood:', e);
    }
  }

  // Fallback for local demo testing
  if (!latestTodayMood) {
    try {
      const partnerMoodKey = `vynura_partner_mood_${partnerId}`;
      const savedPartnerMood = localStorage.getItem(partnerMoodKey);
      if (savedPartnerMood) {
        const parsed = JSON.parse(savedPartnerMood);
        if (new Date(parsed.timestamp).getTime() >= todayStart.getTime()) {
          latestTodayMood = parsed.mood as MoodType;
        }
      }
    } catch {
      // ignore
    }
  }

  const moodConfig = latestTodayMood ? MOODS[latestTodayMood] : null;

  return {
    partnerId,
    todayMoodCategory: latestTodayMood,
    todayMoodLabel: moodConfig ? moodConfig.label : null,
    todayMoodColor: moodConfig ? moodConfig.color : null,
    hasCalibratedToday: Boolean(latestTodayMood),
  };
}
