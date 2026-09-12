-- ==============================================================================
-- Vynura Recommendation Engine & Feedback Schema Migration
-- Migration: 20260912_recommendation_system.sql
-- ==============================================================================

-- 1. Enhance existing mood_entries table with Valence-Arousal & Engine Prescriptions
ALTER TABLE IF EXISTS public.mood_entries
  ADD COLUMN IF NOT EXISTS valence_score NUMERIC(4, 3),
  ADD COLUMN IF NOT EXISTS arousal_score NUMERIC(4, 3),
  ADD COLUMN IF NOT EXISTS recommendation_mode TEXT CHECK (recommendation_mode IN ('amplify', 'sustain', 'regulate', 'support')),
  ADD COLUMN IF NOT EXISTS recommendation_tier TEXT CHECK (recommendation_tier IN ('low', 'med', 'high')),
  ADD COLUMN IF NOT EXISTS recommendation_helpful BOOLEAN,
  ADD COLUMN IF NOT EXISTS feedback_notes TEXT,
  ADD COLUMN IF NOT EXISTS actions_recommended JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS actions_completed JSONB DEFAULT '[]'::jsonb;

-- 2. Dedicated Table for Granular Shift Session & Feedback Tracking
CREATE TABLE IF NOT EXISTS public.recommendation_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mood_category TEXT NOT NULL,
  confidence_score NUMERIC(4, 3) NOT NULL,
  valence_score NUMERIC(4, 3) NOT NULL,
  arousal_score NUMERIC(4, 3) NOT NULL,
  recommendation_mode TEXT NOT NULL CHECK (recommendation_mode IN ('amplify', 'sustain', 'regulate', 'support')),
  recommendation_tier TEXT NOT NULL CHECK (recommendation_tier IN ('low', 'med', 'high')),
  trajectory TEXT CHECK (trajectory IN ('improving', 'declining', 'stable')),
  is_escalated BOOLEAN DEFAULT FALSE,
  actions_recommended JSONB NOT NULL DEFAULT '[]'::jsonb,
  actions_completed JSONB NOT NULL DEFAULT '[]'::jsonb,
  helpful BOOLEAN,
  feedback_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Indexes for fast trajectory lookup & user queries
CREATE INDEX IF NOT EXISTS idx_recommendation_sessions_user_created
  ON public.recommendation_sessions(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_mood_entries_user_created
  ON public.mood_entries(user_id, created_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.recommendation_sessions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
CREATE POLICY "Users can query their own recommendation sessions"
  ON public.recommendation_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recommendation sessions"
  ON public.recommendation_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recommendation sessions"
  ON public.recommendation_sessions
  FOR UPDATE
  USING (auth.uid() = user_id);
