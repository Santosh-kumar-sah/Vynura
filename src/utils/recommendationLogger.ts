import type { MoodType } from '../types';
import type {
  EngagementRecord,
  IntensityTier,
  MoodTrajectory,
  RecommendationActionType,
} from '../types/recommendations';
import type { RecommendationMode } from './valenceArousal';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'vynura_recommendation_history';
const ENGAGEMENT_KEY = 'vynura_recommendation_engagements';

export interface RecommendationSessionLog {
  id: string;
  mood: MoodType;
  confidence: number;
  valence: number;
  arousal: number;
  mode: RecommendationMode;
  tier: IntensityTier;
  trajectory?: MoodTrajectory;
  isEscalated?: boolean;
  supportBannerShown?: boolean;
  recommendationIds: string[];
  completedActions: string[];
  helpful?: boolean;
  feedbackNotes?: string;
  timestamp: number;
}

export interface LogSessionParams {
  mood: MoodType;
  confidence: number;
  valence: number;
  arousal: number;
  mode: RecommendationMode;
  tier: IntensityTier;
  trajectory?: MoodTrajectory;
  isEscalated?: boolean;
  supportBannerShown?: boolean;
  recommendationIds: string[];
}

/**
 * Logs a new recommendation session with full biometric & telemetry attributes.
 */
export async function logRecommendationSession(
  params: LogSessionParams
): Promise<RecommendationSessionLog> {
  const session: RecommendationSessionLog = {
    id: `rec_sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    mood: params.mood,
    confidence: params.confidence,
    valence: params.valence,
    arousal: params.arousal,
    mode: params.mode,
    tier: params.tier,
    trajectory: params.trajectory,
    isEscalated: params.isEscalated,
    supportBannerShown: params.supportBannerShown,
    recommendationIds: params.recommendationIds,
    completedActions: [],
    timestamp: Date.now(),
  };

  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    const history: RecommendationSessionLog[] = existingRaw ? JSON.parse(existingRaw) : [];
    history.unshift(session);
    // Retain last 50 sessions locally
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 50)));
  } catch (e) {
    console.warn('Could not persist recommendation session locally:', e);
  }

  // Attempt Supabase sync if client is authenticated
  if (supabase) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        await supabase.from('recommendation_sessions').insert({
          id: session.id,
          user_id: userData.user.id,
          mood_category: session.mood,
          confidence_score: session.confidence,
          valence_score: session.valence,
          arousal_score: session.arousal,
          recommendation_mode: session.mode,
          recommendation_tier: session.tier,
          trajectory: session.trajectory || null,
          is_escalated: Boolean(session.isEscalated),
          actions_recommended: session.recommendationIds,
          actions_completed: [],
        });
      }
    } catch (e) {
      console.warn('Supabase session log failed:', e);
    }
  }

  return session;
}

/**
 * Records user feedback (helpful 👍 / not helpful 👎) for a session.
 */
export async function logRecommendationFeedback(
  sessionId: string,
  helpful: boolean,
  notes?: string
): Promise<void> {
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    if (existingRaw) {
      const history: RecommendationSessionLog[] = JSON.parse(existingRaw);
      const target = history.find((s) => s.id === sessionId);
      if (target) {
        target.helpful = helpful;
        if (notes) target.feedbackNotes = notes;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      }
    }
  } catch (e) {
    console.warn('Could not update local feedback:', e);
  }

  if (supabase) {
    try {
      await supabase
        .from('recommendation_sessions')
        .update({
          helpful,
          feedback_notes: notes || null,
        })
        .eq('id', sessionId);
    } catch (e) {
      console.warn('Supabase feedback update failed:', e);
    }
  }
}

/**
 * Marks a specific action item as completed in the active session.
 */
export async function logActionCompleted(
  sessionId: string,
  actionId: string
): Promise<void> {
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    if (existingRaw) {
      const history: RecommendationSessionLog[] = JSON.parse(existingRaw);
      const target = history.find((s) => s.id === sessionId);
      if (target && !target.completedActions.includes(actionId)) {
        target.completedActions.push(actionId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      }
    }
  } catch (e) {
    console.warn('Could not update completed action:', e);
  }

  if (supabase) {
    try {
      const { data } = await supabase
        .from('recommendation_sessions')
        .select('actions_completed')
        .eq('id', sessionId)
        .single();

      const existing: string[] = (data?.actions_completed as string[]) || [];
      if (!existing.includes(actionId)) {
        await supabase
          .from('recommendation_sessions')
          .update({
            actions_completed: [...existing, actionId],
          })
          .eq('id', sessionId);
      }
    } catch (e) {
      console.warn('Supabase action completion log failed:', e);
    }
  }
}

/**
 * Logs a user click/engagement on a specific recommendation
 */
export function logRecommendationEngagement(
  recommendationId: string,
  mood: MoodType,
  actionType: RecommendationActionType
): EngagementRecord {
  const record: EngagementRecord = {
    id: `eng_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    recommendationId,
    mood,
    actionType,
    timestamp: Date.now(),
    engaged: true,
  };

  try {
    const existingRaw = localStorage.getItem(ENGAGEMENT_KEY);
    const records: EngagementRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
    records.unshift(record);
    localStorage.setItem(ENGAGEMENT_KEY, JSON.stringify(records.slice(0, 100)));
  } catch (e) {
    console.warn('Could not persist engagement record:', e);
  }

  return record;
}

/**
 * Returns all past recommendation sessions
 */
export function getRecommendationSessions(): RecommendationSessionLog[] {
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    return existingRaw ? JSON.parse(existingRaw) : [];
  } catch {
    return [];
  }
}

/**
 * Returns all past engagement records
 */
export function getEngagementHistory(): EngagementRecord[] {
  try {
    const existingRaw = localStorage.getItem(ENGAGEMENT_KEY);
    return existingRaw ? JSON.parse(existingRaw) : [];
  } catch {
    return [];
  }
}

