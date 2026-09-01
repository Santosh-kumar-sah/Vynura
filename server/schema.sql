-- Vynura Supabase PostgreSQL Schema (Phase 4)
-- Database schema for mood entries, journal text, and biometric metadata

-- 1. Create table for mood entries
CREATE TABLE IF NOT EXISTS public.mood_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mood_category VARCHAR(32) NOT NULL CHECK (mood_category IN ('happy', 'calm', 'sad', 'energetic', 'neutral')),
    confidence_score NUMERIC(4,3) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    journal_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Create index for fast user chronological queries
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date 
ON public.mood_entries (user_id, created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies: Users can only read and write their own celestial data
CREATE POLICY "Users can read their own mood entries"
ON public.mood_entries
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mood entries"
ON public.mood_entries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood entries"
ON public.mood_entries
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood entries"
ON public.mood_entries
FOR DELETE
USING (auth.uid() = user_id);
