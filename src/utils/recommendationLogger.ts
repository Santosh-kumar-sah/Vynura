import type { MoodType } from '../types';
import type { EngagementRecord, RecommendationActionType } from '../types/recommendations';

const STORAGE_KEY = 'vynura_recommendation_history';
const ENGAGEMENT_KEY = 'vynura_recommendation_engagements';

export interface RecommendationSessionLog {
  id: string;
  mood: MoodType;
  confidence: number;
  timestamp: number;
  recommendationIds: string[];
}

/**
 * Logs a new recommendation session when a mood is confirmed
 */
export function logRecommendationSession(
  mood: MoodType,
  confidence: number,
  recommendationIds: string[]
): RecommendationSessionLog {
  const session: RecommendationSessionLog = {
    id: `rec_sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    mood,
    confidence,
    timestamp: Date.now(),
    recommendationIds,
  };

  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    const history: RecommendationSessionLog[] = existingRaw ? JSON.parse(existingRaw) : [];
    history.unshift(session);
    // Keep last 50 sessions locally
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 50)));
  } catch (e) {
    console.warn('Could not persist recommendation session:', e);
  }

  return session;
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
